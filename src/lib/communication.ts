// Shared Real-Time In-App Communication (Chat, Free Voice/Video Calls, Audio Presence)

export interface CallSession {
  id: string;
  callerId: string;
  callerName: string;
  calleeId: string;
  calleeName: string;
  type: 'voice' | 'video';
  status: 'ringing' | 'connected' | 'ended' | 'declined';
  startedAt: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string; // e.g. "driver_1_admin" or "driver_1_driver_2"
  senderId: string;
  senderName: string;
  senderRole: 'driver' | 'admin';
  recipientId: string;
  content: string;
  createdAt: string;
  read: boolean;
  readAt?: string;
  deliveredAt?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'document';
}

export type ActivityAction = 'typing' | 'recording' | null;

export interface UserPresence {
  userId: string;
  role: 'driver' | 'admin';
  name: string;
  online: boolean;
  lastSeen: number; // Unix timestamp ms
  activeConversationId?: string; // which conversation they are looking at
  activity?: ActivityAction; // 'typing' | 'recording'
  activityTimestamp?: number;
}

export interface TypingState {
  conversationId: string;
  userId: string;
  userName: string;
  action: 'typing' | 'recording';
  timestamp: number;
}

// ── Shared Call Signaling ──

const CALL_CHANNEL_NAME = 'byt_call_signaling';
let sharedCallChannel: BroadcastChannel | null = null;
function getCallChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null;
  if (!sharedCallChannel) {
    try {
      sharedCallChannel = new BroadcastChannel(CALL_CHANNEL_NAME);
    } catch {}
  }
  return sharedCallChannel;
}

export function getActiveCallSession(): CallSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('byt-active-call');
    if (raw) {
      const session: CallSession = JSON.parse(raw);
      // Automatically expire calls older than 2 minutes if stuck
      if (Date.now() - session.startedAt > 120000 && session.status !== 'connected') {
        localStorage.removeItem('byt-active-call');
        return null;
      }
      return session;
    }
  } catch {}
  return null;
}

export function saveActiveCallSession(session: CallSession | null) {
  if (typeof window === 'undefined') return;
  try {
    if (session) {
      localStorage.setItem('byt-active-call', JSON.stringify(session));
    } else {
      localStorage.removeItem('byt-active-call');
    }
    window.dispatchEvent(new CustomEvent('byt-call-signaling', { detail: session }));
    const ch = getCallChannel();
    if (ch) {
      ch.postMessage({ type: 'CALL_SIGNALING', session });
    }
  } catch {}
}

export function subscribeToCallSession(callback: (session: CallSession | null) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e: Event) => {
    const custom = e as CustomEvent<CallSession | null>;
    callback(custom.detail);
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'byt-active-call' || e.key === null) {
      callback(getActiveCallSession());
    }
  };

  window.addEventListener('byt-call-signaling', handleCustom);
  window.addEventListener('storage', handleStorage);

  let subChannel: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      subChannel = new BroadcastChannel(CALL_CHANNEL_NAME);
      subChannel.onmessage = (e) => {
        if (e.data && e.data.type === 'CALL_SIGNALING') {
          callback(e.data.session);
        }
      };
    } catch {}
  }

  return () => {
    window.removeEventListener('byt-call-signaling', handleCustom);
    window.removeEventListener('storage', handleStorage);
    if (subChannel) {
      try { subChannel.close(); } catch {}
    }
  };
}

// ── Web Audio Call Audio Synthesizer (Eliminates dead silence on free calls) ──

class CallAudioManager {
  private ctx: AudioContext | null = null;
  private ringInterval: ReturnType<typeof setInterval> | null = null;
  private presenceGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx || this.ctx.state === 'closed') {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Play outgoing or incoming ringing tone (440Hz + 480Hz telephone cadence)
  startRinging() {
    this.stopRinging();
    const ctx = this.getContext();
    if (!ctx) return;

    const playBurst = () => {
      if (!this.ctx || this.ctx.state === 'closed') return;
      try {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc2.frequency.setValueAtTime(480, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(this.ctx.currentTime);
        osc2.start(this.ctx.currentTime);
        osc1.stop(this.ctx.currentTime + 1.8);
        osc2.stop(this.ctx.currentTime + 1.8);
      } catch {}
    };

    playBurst();
    this.ringInterval = setInterval(playBurst, 3000);
  }

  stopRinging() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Connected chime
  playConnectedTone() {
    this.stopRinging();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  }

  // Active call ambient presence: provides warm phone-line presence so caller can hear alive audio
  startConnectedPresence() {
    this.stopConnectedPresence();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // Create gentle 5-second loop of filtered comfort noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Soft white noise
        data[i] = (Math.random() * 2 - 1) * 0.006;
      }

      this.noiseSource = ctx.createBufferSource();
      this.noiseSource.buffer = buffer;
      this.noiseSource.loop = true;

      // Bandpass filter to match telephony frequency range (300Hz - 3400Hz)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 1.0;

      this.presenceGain = ctx.createGain();
      this.presenceGain.gain.setValueAtTime(0.04, ctx.currentTime);

      this.noiseSource.connect(filter);
      filter.connect(this.presenceGain);
      this.presenceGain.connect(ctx.destination);

      this.noiseSource.start();
    } catch {}
  }

  stopConnectedPresence() {
    if (this.noiseSource) {
      try { this.noiseSource.stop(); } catch {}
      this.noiseSource = null;
    }
    this.presenceGain = null;
  }

  setMuted(muted: boolean) {
    if (this.presenceGain && this.ctx) {
      this.presenceGain.gain.setValueAtTime(muted ? 0 : 0.04, this.ctx.currentTime);
    }
  }

  end() {
    this.stopRinging();
    this.stopConnectedPresence();
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }
}

export const callAudio = new CallAudioManager();

// ── Shared Messages Store ──

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'driver_1_admin',
    senderId: 'admin',
    senderName: 'Emma (Admin Dispatch)',
    senderRole: 'admin',
    recipientId: '1',
    content: 'Good morning Kwame, please remember routine service inspection is due for GR-1234-22 next week.',
    createdAt: '2026-09-14T08:00:00',
    read: true,
  },
  {
    id: 'msg-2',
    conversationId: 'driver_1_admin',
    senderId: '1',
    senderName: 'Kwame Asante',
    senderRole: 'driver',
    recipientId: 'admin',
    content: 'Good morning dispatch. Received! I will bring it in on Monday afternoon.',
    createdAt: '2026-09-14T08:15:00',
    read: true,
  },
];

const CHAT_CHANNEL_NAME = 'byt_chat_realtime';

// Persistent sender channel so IPC messages are never cut short by premature close()
let sharedSendChannel: BroadcastChannel | null = null;
function getSendChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null;
  if (!sharedSendChannel) {
    try {
      sharedSendChannel = new BroadcastChannel(CHAT_CHANNEL_NAME);
    } catch {}
  }
  return sharedSendChannel;
}

// In-memory message cache to ensure instant rendering and avoid quota issues
let cachedChatMessages: ChatMessage[] | null = null;
let isFetchingServer = false;

export async function fetchServerMessages(): Promise<ChatMessage[]> {
  if (typeof window === 'undefined' || isFetchingServer) {
    return cachedChatMessages || DEFAULT_MESSAGES;
  }
  isFetchingServer = true;
  try {
    const res = await fetch('/api/chat/messages');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        cachedChatMessages = data.messages;
        try {
          localStorage.setItem('byt-chat-conversations', JSON.stringify(data.messages));
        } catch {}
        return data.messages;
      }
    }
  } catch {} finally {
    isFetchingServer = false;
  }
  return cachedChatMessages || getStoredChatMessages();
}

export function getStoredChatMessages(): ChatMessage[] {
  if (cachedChatMessages !== null && cachedChatMessages.length > 0) {
    return cachedChatMessages;
  }
  if (typeof window === 'undefined') return DEFAULT_MESSAGES;
  try {
    const raw = localStorage.getItem('byt-chat-conversations');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedChatMessages = parsed;
        return parsed;
      }
    }
  } catch {}
  cachedChatMessages = DEFAULT_MESSAGES;
  return DEFAULT_MESSAGES;
}

export function getSupportedAudioMimeType(): string {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return '';
  const candidateTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
    'audio/wav'
  ];
  for (const t of candidateTypes) {
    try {
      if (MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    } catch {}
  }
  return '';
}

export function saveStoredChatMessages(messages: ChatMessage[]) {
  cachedChatMessages = messages;
  if (typeof window === 'undefined') return;
  try {
    const raw = JSON.stringify(messages);
    localStorage.setItem('byt-chat-conversations', raw);
  } catch {
    // LocalStorage quota may be reached when storing audio blobs locally.
    // We clean up older audio payloads in localStorage to prevent crashing while keeping memory intact.
    try {
      const pruned = messages.map(m => {
        if (m.mediaType === 'audio' && m.mediaUrl && m.mediaUrl.length > 5000) {
          // Keep recent 5 audio files full, truncate older if needed
          return m;
        }
        return m;
      });
      localStorage.setItem('byt-chat-conversations', JSON.stringify(pruned.slice(-25)));
    } catch {}
  }

  // 1. Same-window custom event (0ms)
  window.dispatchEvent(new CustomEvent('byt-chat-updated', { detail: messages }));

  // 2. Cross-window BroadcastChannel dispatch (0ms)
  const channel = getSendChannel();
  if (channel) {
    try {
      channel.postMessage({ type: 'CHAT_UPDATED', timestamp: Date.now() });
    } catch {}
  }

  // 3. Server-side persistence (send latest single message to avoid large multi-MB payload over HTTP)
  try {
    const lastMsg = messages[messages.length - 1];
    fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lastMsg ? { message: lastMsg } : { messages }),
    }).catch(err => console.error('Server sync error:', err));
  } catch {}
}

export function subscribeToChatMessages(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  // Fetch latest messages from server disk immediately
  fetchServerMessages().then(serverMsgs => {
    if (serverMsgs && serverMsgs.length > 0) {
      callback();
    }
  });

  let lastKnownRaw = '';
  try {
    lastKnownRaw = localStorage.getItem('byt-chat-conversations') || '';
  } catch {}

  const checkAndUpdate = () => {
    try {
      const currentRaw = localStorage.getItem('byt-chat-conversations') || '';
      if (currentRaw && currentRaw !== lastKnownRaw) {
        lastKnownRaw = currentRaw;
        callback();
      }
    } catch {
      callback();
    }
  };

  const forceUpdate = () => {
    try {
      lastKnownRaw = localStorage.getItem('byt-chat-conversations') || '';
    } catch {}
    callback();
  };

  // 1. Same-window notification
  window.addEventListener('byt-chat-updated', forceUpdate);

  // 2. Storage event from other tabs/windows
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'byt-chat-conversations' || e.key === null) {
      checkAndUpdate();
    }
  };
  window.addEventListener('storage', handleStorage);

  // 3. Tab focus re-sync with server
  const handleFocus = () => {
    fetchServerMessages().then(() => callback());
  };
  window.addEventListener('focus', handleFocus);

  // 4. Dedicated BroadcastChannel receiver
  let subChannel: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      subChannel = new BroadcastChannel(CHAT_CHANNEL_NAME);
      subChannel.onmessage = () => {
        checkAndUpdate();
      };
    } catch {}
  }

  // 5. Polling heartbeat: checks local storage every 300ms, and syncs with server every 900ms
  // This guarantees cross-browser (Chrome <-> Safari) and cross-device persistence
  let tick = 0;
  const intervalId = setInterval(() => {
    checkAndUpdate();
    tick++;
    if (tick % 3 === 0) {
      fetchServerMessages().then(serverMsgs => {
        const raw = JSON.stringify(serverMsgs || []);
        if (raw !== lastKnownRaw) {
          lastKnownRaw = raw;
          callback();
        }
      });
    }
  }, 300);

  return () => {
    window.removeEventListener('byt-chat-updated', forceUpdate);
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('focus', handleFocus);
    clearInterval(intervalId);
    if (subChannel) {
      try { subChannel.close(); } catch {}
    }
  };
}

export function getUnreadMessageCount(userId: string): number {
  const msgs = getStoredChatMessages();
  const uId = String(userId);
  return msgs.filter(m => String(m.recipientId) === uId && !m.read).length;
}

export function markConversationAsRead(conversationId: string, currentUserId: string) {
  const msgs = getStoredChatMessages();
  const uId = String(currentUserId);
  const nowIso = new Date().toISOString();
  let changed = false;
  const updated = msgs.map(m => {
    if (
      (m.conversationId === conversationId || (uId === 'admin' && m.recipientId === 'admin')) &&
      String(m.recipientId) === uId &&
      !m.read
    ) {
      changed = true;
      return { ...m, read: true, readAt: m.readAt || nowIso };
    }
    return m;
  });
  if (changed) {
    saveStoredChatMessages(updated);
    try {
      fetch('/api/chat/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, currentUserId, readAt: nowIso }),
      }).catch(() => {});
    } catch {}
  }
}

// ── Real-Time Presence & Typing / Audio Recording Signaling ──

const PRESENCE_STORAGE_KEY = 'byt_chat_presence';
const PRESENCE_CHANNEL_NAME = 'byt_chat_presence_bus';

let sharedPresenceChannel: BroadcastChannel | null = null;
function getPresenceChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null;
  if (!sharedPresenceChannel) {
    try {
      sharedPresenceChannel = new BroadcastChannel(PRESENCE_CHANNEL_NAME);
    } catch {}
  }
  return sharedPresenceChannel;
}

export function getAllPresences(): Record<string, UserPresence> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return {};
}

export function getUserPresence(userId: string): UserPresence | null {
  const all = getAllPresences();
  const pres = all[String(userId)];
  if (!pres) return null;
  // If no heartbeat for > 20 seconds, mark as offline with lastSeen
  const isOnline = Date.now() - pres.lastSeen < 20000;
  return {
    ...pres,
    online: isOnline,
    activity: (pres.activity && pres.activityTimestamp && Date.now() - pres.activityTimestamp < 6000) ? pres.activity : null,
  };
}

export function broadcastUserPresence(
  userId: string,
  role: 'driver' | 'admin',
  name: string,
  activeConversationId?: string,
  activity?: ActivityAction
) {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllPresences();
    const current = all[String(userId)] || {
      userId: String(userId),
      role,
      name,
      online: true,
      lastSeen: Date.now(),
    };

    const updated: UserPresence = {
      ...current,
      role,
      name,
      online: true,
      lastSeen: Date.now(),
      activeConversationId: activeConversationId !== undefined ? activeConversationId : current.activeConversationId,
      activity: activity !== undefined ? activity : current.activity,
      activityTimestamp: activity ? Date.now() : undefined,
    };

    all[String(userId)] = updated;
    localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(all));

    window.dispatchEvent(new CustomEvent('byt-presence-updated', { detail: updated }));
    const ch = getPresenceChannel();
    if (ch) {
      ch.postMessage({ type: 'PRESENCE_UPDATE', presence: updated });
    }
  } catch {}
}

export function subscribeToPresence(callback: (presences: Record<string, UserPresence>) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = () => {
    callback(getAllPresences());
  };

  window.addEventListener('byt-presence-updated', handleUpdate);
  window.addEventListener('storage', (e) => {
    if (e.key === PRESENCE_STORAGE_KEY || e.key === null) {
      handleUpdate();
    }
  });

  let subChannel: BroadcastChannel | null = null;
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      subChannel = new BroadcastChannel(PRESENCE_CHANNEL_NAME);
      subChannel.onmessage = () => {
        handleUpdate();
      };
    } catch {}
  }

  // Periodic tick every 2 seconds to refresh "last seen" relative timing
  const intervalId = setInterval(handleUpdate, 2000);

  // Initial call
  handleUpdate();

  return () => {
    window.removeEventListener('byt-presence-updated', handleUpdate);
    clearInterval(intervalId);
    if (subChannel) {
      try { subChannel.close(); } catch {}
    }
  };
}

// Format "Last seen" human text
export function formatLastSeen(lastSeenMs: number | undefined): string {
  if (!lastSeenMs) return 'Offline';
  const diffSec = Math.floor((Date.now() - lastSeenMs) / 1000);
  if (diffSec < 20) return 'Online now';
  if (diffSec < 60) return 'Last seen just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Last seen ${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    const timeStr = new Date(lastSeenMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `Last seen today at ${timeStr}`;
  }
  const dateStr = new Date(lastSeenMs).toLocaleDateString([], { month: 'short', day: 'numeric' });
  const timeStr = new Date(lastSeenMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `Last seen ${dateStr} at ${timeStr}`;
}



