/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import { demoChatUsers, getInitials, getStoredDrivers, demoDrivers, Driver } from '@/lib/demo-data';
import {
  saveActiveCallSession,
  getActiveCallSession,
  subscribeToCallSession,
  callAudio,
  getStoredChatMessages,
  saveStoredChatMessages,
  subscribeToChatMessages,
  markConversationAsRead,
  ChatMessage,
  UserPresence,
  broadcastUserPresence,
  subscribeToPresence,
  formatLastSeen,
} from '@/lib/communication';

export interface FileAttachment {
  name: string;
  size: string;
  url: string;
  type: 'image' | 'document';
}

interface AudioMsg {
  id: string;
  type: 'audio';
  blob: Blob;
  url: string;
  senderId: string;
  createdAt: string;
}

export default function DriverChatPage() {
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const u = localStorage.getItem('byt-user');
        const allDrivers = getStoredDrivers();
        if (u) {
          const parsed = JSON.parse(u);
          if (parsed.id) {
            const found = allDrivers.find(d => String(d.id) === String(parsed.id));
            if (found) return found;
          }
          if (parsed.name) {
            const found = allDrivers.find(d => d.name.toLowerCase() === parsed.name.toLowerCase());
            if (found) return found;
          }
        }
      } catch {}
      const allDrivers = getStoredDrivers();
      const d = allDrivers.find(drv => String(drv.id) === '1' || drv.name.toLowerCase().includes('kwame')) || allDrivers[0];
      if (d) return d;
    }
    return demoDrivers[0];
  });
  const [selectedUser, setSelectedUser] = useState<string | null>('admin');
  const [message, setMessage] = useState('');
  const [storedMessages, setStoredMessages] = useState<ChatMessage[]>(() => {
    return getStoredChatMessages();
  });
  const [audioMessages, setAudioMessages] = useState<AudioMsg[]>([]);
  const [presences, setPresences] = useState<Record<string, UserPresence>>({});
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem('byt-user');
      const allDrivers = getStoredDrivers();
      let matched: Driver | undefined;
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.id) {
          matched = allDrivers.find(d => String(d.id) === String(parsed.id));
        } else if (parsed.name) {
          matched = allDrivers.find(d => d.name.toLowerCase() === parsed.name.toLowerCase());
        }
      }
      if (!matched) {
        matched = allDrivers.find(drv => String(drv.id) === '1' || drv.name.toLowerCase().includes('kwame')) || allDrivers[0];
      }
      if (matched) setCurrentDriver(matched);
    } catch {}

    setStoredMessages(getStoredChatMessages());

    const unsubscribeChat = subscribeToChatMessages(() => {
      setStoredMessages(getStoredChatMessages());
    });
    const unsubscribePresence = subscribeToPresence((p) => {
      setPresences(p);
    });
    return () => {
      unsubscribeChat();
      unsubscribePresence();
    };
  }, []);

  const currentUserId = currentDriver ? String(currentDriver.id) : '1';
  const currentUserName = currentDriver ? currentDriver.name : 'Kwame Asante';

  // File Attachment State
  const [pendingFile, setPendingFile] = useState<FileAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // In-App Calling State (Voice & Video)
  const [activeCall, setActiveCall] = useState<{
    type: 'voice' | 'video';
    calleeName: string;
    status: 'requesting' | 'ringing' | 'connected' | 'declined' | 'ended' | 'error';
    errorMsg?: string;
  } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ringAudioRef = useRef<{ stop: () => void } | null>(null);

  // Audio Recording State (Voice Notes with Pause & Resume)
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCancellingRef = useRef(false);

  // In-App Software Audio Ring Tone Generator (Web Audio API)
  const startRingtone = () => {
    stopRingtone();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let stopped = false;

      const playRingBurst = () => {
        if (stopped || ctx.state === 'closed') return;
        try {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(440, ctx.currentTime);
          osc2.frequency.setValueAtTime(480, ctx.currentTime);

          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(ctx.currentTime);
          osc2.start(ctx.currentTime);
          osc1.stop(ctx.currentTime + 1.8);
          osc2.stop(ctx.currentTime + 1.8);
        } catch {}
      };

      playRingBurst();
      const interval = setInterval(playRingBurst, 3000);
      ringAudioRef.current = {
        stop: () => {
          stopped = true;
          clearInterval(interval);
          try { ctx.close(); } catch {}
        }
      };
    } catch {}
  };

  const stopRingtone = () => {
    if (ringAudioRef.current) {
      ringAudioRef.current.stop();
      ringAudioRef.current = null;
    }
  };

  const playConnectedChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      setTimeout(() => { try { ctx.close(); } catch {} }, 400);
    } catch {}
  };

  const chatUsersList = [
    { id: 'admin', name: 'Emma (Admin Dispatch)', online: true, lastMessage: 'Operations desk online • 020-871-3722', lastMessageTime: 'Just now', unread: 0 },
    ...demoChatUsers,
  ];

  const selectedChat = chatUsersList.find(u => u.id === selectedUser) || chatUsersList[0];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversationId = selectedUser === 'admin'
    ? `driver_${currentUserId}_admin`
    : `driver_${currentUserId}_driver_${selectedUser}`;

  // Broadcast Driver Presence Heartbeat
  useEffect(() => {
    broadcastUserPresence(currentUserId, 'driver', currentUserName, activeConversationId, undefined);
    const interval = setInterval(() => {
      broadcastUserPresence(currentUserId, 'driver', currentUserName, activeConversationId, undefined);
    }, 8000);
    return () => clearInterval(interval);
  }, [currentUserId, currentUserName, activeConversationId]);

  // Typing Emitter for Driver
  const handleDriverInputChange = (val: string) => {
    setMessage(val);
    if (val.trim()) {
      broadcastUserPresence(currentUserId, 'driver', currentUserName, activeConversationId, 'typing');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        broadcastUserPresence(currentUserId, 'driver', currentUserName, activeConversationId, null);
      }, 2500);
    } else {
      broadcastUserPresence(currentUserId, 'driver', currentUserName, activeConversationId, null);
    }
  };

  // Filter messages for the currently selected chat partner
  const displayedMessages = storedMessages.filter(m => {
    const myId = String(currentUserId);
    const sId = String(m.senderId || '');
    const rId = String(m.recipientId || '');
    const cId = String(m.conversationId || '');

    if (selectedUser === 'admin') {
      // 1. Direct conversation match
      if (cId === `driver_${myId}_admin` || cId === `admin_driver_${myId}`) {
        return true;
      }
      // 2. Sent by admin to this driver or general broadcast
      if (sId === 'admin' && (rId === myId || rId === 'driver' || rId === 'all')) {
        return true;
      }
      // 3. Sent by this driver to admin
      if (rId === 'admin' && (sId === myId || sId === 'driver' || m.senderName === currentUserName)) {
        return true;
      }
      return false;
    } else {
      const partnerId = String(selectedUser);
      if (
        cId === `driver_${myId}_driver_${partnerId}` ||
        cId === `driver_${partnerId}_driver_${myId}`
      ) return true;
      if (sId === myId && rId === partnerId) return true;
      if (sId === partnerId && rId === myId) return true;
      return false;
    }
  });

  // Mark incoming messages from current chat partner as read
  useEffect(() => {
    if (selectedUser === 'admin') {
      const myId = String(currentUserId);
      const hasUnread = storedMessages.some(
        m => m.senderId === 'admin' && (String(m.recipientId) === myId || m.recipientId === 'driver' || m.recipientId === 'all') && !m.read
      );
      if (hasUnread) {
        markConversationAsRead(`driver_${myId}_admin`, myId);
      }
    } else if (selectedUser) {
      const myId = String(currentUserId);
      const partnerId = String(selectedUser);
      const hasUnread = storedMessages.some(
        m => String(m.senderId) === partnerId && String(m.recipientId) === myId && !m.read
      );
      if (hasUnread) {
        markConversationAsRead(activeConversationId, myId);
      }
    }
  }, [selectedUser, currentUserId, storedMessages, activeConversationId]);

  // Target partner presence
  const partnerPresence = selectedUser ? presences[String(selectedUser)] : null;
  const isPartnerTyping = partnerPresence?.activity === 'typing' && partnerPresence?.activeConversationId === activeConversationId;
  const isPartnerRecording = partnerPresence?.activity === 'recording' && partnerPresence?.activeConversationId === activeConversationId;
  const isPartnerOnline = partnerPresence?.online ?? (selectedChat?.online ?? false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages, audioMessages, isPartnerTyping, isPartnerRecording]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !pendingFile) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    broadcastUserPresence(currentUserId, 'driver', currentUserName, activeConversationId, null);

    const newContent = message.trim();
    const targetRecipient = selectedUser || 'admin';
    const conversationId = targetRecipient === 'admin'
      ? `driver_${currentUserId}_admin`
      : `driver_${currentUserId}_driver_${targetRecipient}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      senderId: String(currentUserId),
      senderName: currentUserName,
      senderRole: 'driver',
      recipientId: targetRecipient,
      content: newContent,
      createdAt: new Date().toISOString(),
      read: false,
      mediaUrl: pendingFile?.url,
      mediaType: pendingFile ? (pendingFile.type === 'image' ? 'image' : 'document') : undefined,
    };

    const currentAll = getStoredChatMessages();
    const updated = [...currentAll, newMsg];
    saveStoredChatMessages(updated);
    setStoredMessages(updated);

    setMessage('');
    setPendingFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = () => {
      setPendingFile({
        name: file.name,
        size: formattedSize,
        url: reader.result as string,
        type: isImage ? 'image' : 'document'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Listen for remote callee answer / decline
  useEffect(() => {
    const unsub = subscribeToCallSession((newSession) => {
      if (!newSession) {
        if (activeCall && (activeCall.status === 'ringing' || activeCall.status === 'requesting')) {
          stopRingtone();
          setActiveCall(null);
        }
        return;
      }
      const myId = String(currentUserId);
      // If I am the caller and callee answered on their device
      if (String(newSession.callerId) === myId && newSession.status === 'connected') {
        if (activeCall?.status === 'ringing') {
          stopRingtone();
          playConnectedChime();
          callAudio.startConnectedPresence();
          setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
          if (callTimerRef.current) clearInterval(callTimerRef.current);
          callTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
          }, 1000);
        }
      }
      // If call was declined or ended
      if (String(newSession.callerId) === myId && (newSession.status === 'declined' || newSession.status === 'ended')) {
        stopRingtone();
        callAudio.end();
        setActiveCall(prev => prev ? { ...prev, status: newSession.status } : null);
        setTimeout(() => {
          endCall();
        }, 1200);
      }
    });
    return () => unsub();
  }, [currentUserId, activeCall?.status]);

  // In-App Software Calls with Ringing & Shared Signaling
  const startInAppCall = async (type: 'voice' | 'video') => {
    const targetRecipient = selectedUser || 'admin';
    const myId = String(currentUserId);

    // Prevent calling oneself
    if (String(targetRecipient) === myId) {
      alert('You cannot call yourself. Please select another contact or Dispatch Admin.');
      return;
    }

    setActiveCall({
      type,
      calleeName: selectedChat?.name || 'Contact',
      status: 'requesting',
    });
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);

    try {
      const constraints = type === 'video'
        ? { video: { facingMode: 'user' }, audio: true }
        : { audio: true };

      // Request device permission for mic or camera+mic
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Status: Ringing, waiting for the other person to answer
      setActiveCall(prev => prev ? { ...prev, status: 'ringing' } : null);
      startRingtone();

      // Post to global signaling so callee gets incoming call ring modal
      saveActiveCallSession({
        id: `call-${Date.now()}`,
        callerId: myId,
        callerName: currentUserName,
        calleeId: targetRecipient,
        calleeName: selectedChat?.name || 'Contact',
        type,
        status: 'ringing',
        startedAt: Date.now(),
      });

      if (ringingTimerRef.current) clearTimeout(ringingTimerRef.current);
      // Timeout after 40 seconds if no answer from callee
      ringingTimerRef.current = setTimeout(() => {
        handleDeclineCall();
      }, 40000);

    } catch (err: unknown) {
      stopRingtone();
      const msg = err instanceof Error ? err.message : 'Hardware access error';
      setActiveCall({
        type,
        calleeName: selectedChat?.name || 'Contact',
        status: 'error',
        errorMsg: msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('permission')
          ? 'Device permission denied. Please allow microphone/camera permissions in your browser or device settings.'
          : 'Could not access audio or video hardware on this device.'
      });
    }
  };

  const handleAnswerCall = () => {
    stopRingtone();
    if (ringingTimerRef.current) {
      clearTimeout(ringingTimerRef.current);
      ringingTimerRef.current = null;
    }
    playConnectedChime();
    callAudio.startConnectedPresence();

    saveActiveCallSession({
      id: `call-${Date.now()}`,
      callerId: currentUserId,
      callerName: 'Kwame Asante',
      calleeId: selectedUser || 'admin',
      calleeName: selectedChat?.name || 'Contact',
      type: activeCall?.type || 'voice',
      status: 'connected',
      startedAt: Date.now(),
    });

    setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }

    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const handleDeclineCall = () => {
    stopRingtone();
    callAudio.end();
    saveActiveCallSession(null);
    if (ringingTimerRef.current) {
      clearTimeout(ringingTimerRef.current);
      ringingTimerRef.current = null;
    }
    setActiveCall(prev => prev ? { ...prev, status: 'declined' } : null);
    setTimeout(() => {
      endCall();
    }, 1600);
  };

  const endCall = () => {
    stopRingtone();
    callAudio.end();
    saveActiveCallSession(null);
    if (ringingTimerRef.current) {
      clearTimeout(ringingTimerRef.current);
      ringingTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setActiveCall(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      const newMuted = !isMuted;
      audioTracks.forEach(t => { t.enabled = !newMuted; });
      setIsMuted(newMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      const newOff = !isVideoOff;
      videoTracks.forEach(t => { t.enabled = !newOff; });
      setIsVideoOff(newOff);
    }
  };

  // Audio Recording with Pause & Resume
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordingChunksRef.current = [];
      isCancellingRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordingChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        if (!isCancellingRef.current && recordingChunksRef.current.length > 0) {
          const blob = new Blob(recordingChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            const targetRecipient = selectedUser || 'admin';
            const conversationId = targetRecipient === 'admin'
              ? `driver_${currentUserId}_admin`
              : `driver_${currentUserId}_driver_${targetRecipient}`;
            const audioMsg: ChatMessage = {
              id: `audio-${Date.now()}`,
              conversationId,
              senderId: currentUserId,
              senderName: currentUserName,
              senderRole: 'driver',
              recipientId: targetRecipient,
              content: '🎙️ Voice note',
              createdAt: new Date().toISOString(),
              read: false,
              mediaUrl: base64Audio,
              mediaType: 'audio',
            };
            const currentAll = getStoredChatMessages();
            const updated = [...currentAll, audioMsg];
            saveStoredChatMessages(updated);
            setStoredMessages(updated);
          };
          reader.readAsDataURL(blob);
        }
        stream.getTracks().forEach(t => t.stop());
        recordingChunksRef.current = [];
        isCancellingRef.current = false;
      };

      recorder.start(200); // Small timeslice so chunks are saved smoothly during pause
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setIsPaused(false);
      setRecordingDuration(0);

      broadcastUserPresence(currentUserId, 'driver', currentUserName, activeConversationId, 'recording');

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch {
      alert('Could not access microphone. Please check device permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      broadcastUserPresence(currentUserId, 'driver', currentUserName, activeConversationId, 'recording');
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    isCancellingRef.current = false;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    broadcastUserPresence(currentUserId, 'driver', currentUserName, activeConversationId, null);
  };

  const cancelRecording = () => {
    isCancellingRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    setRecordingDuration(0);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    broadcastUserPresence(currentUserId, 'driver', currentUserName, activeConversationId, null);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ margin: 'calc(-1 * var(--space-lg))', marginTop: 0 }}>
      {!selectedUser ? (
        /* Driver Directory */
        <div style={{ padding: 'var(--space-lg)' }}>
          <h2 style={{ marginBottom: 'var(--space-lg)' }}>Messages</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {chatUsersList.map(user => (
              <div
                key={user.id}
                className="chat-list-item"
                onClick={() => setSelectedUser(user.id)}
                style={{ background: '#ffffff' }}
              >
                <div className="chat-avatar" style={{ overflow: 'hidden' }}>
                  {user.id === 'admin' ? (
                    <img src="/byt-logo-square.png" alt="BYT" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    getInitials(user.name)
                  )}
                  {presences[user.id] ? (
                    presences[user.id].online ? <span className="online-dot" /> : <span className="offline-dot" />
                  ) : (
                    user.online ? <span className="online-dot" /> : <span className="offline-dot" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-semibold text-sm">{user.name}</span>
                    {user.lastMessageTime && <span className="text-xs text-muted">{user.lastMessageTime}</span>}
                  </div>
                  {presences[user.id]?.activity === 'typing' ? (
                    <div className="text-xs" style={{ color: '#0891b2', fontWeight: 700, fontStyle: 'italic' }}>
                      ✍️ typing...
                    </div>
                  ) : presences[user.id]?.activity === 'recording' ? (
                    <div className="text-xs" style={{ color: '#ef4444', fontWeight: 700, fontStyle: 'italic' }}>
                      🎙️ recording audio...
                    </div>
                  ) : user.lastMessage ? (
                    <div className="text-xs text-muted truncate" style={{ marginTop: '2px' }}>{user.lastMessage}</div>
                  ) : null}
                </div>
                {user.unread && user.unread > 0 ? (
                  <span className="nav-badge">{user.unread}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Chat View */
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 20px)' }}>
          {/* Chat Header */}
          <div style={{
            padding: 'var(--space-md) var(--space-lg)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            background: '#ffffff',
          }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setSelectedUser(null)} style={{ padding: '0.3rem' }}>
              ← 
            </button>
            <div className="chat-avatar" style={{ width: 36, height: 36, fontSize: '0.75rem', overflow: 'hidden' }}>
              {selectedChat?.id === 'admin' ? (
                <img src="/byt-logo-square.png" alt="BYT" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                selectedChat ? getInitials(selectedChat.name) : ''
              )}
              {isPartnerOnline ? <span className="online-dot" style={{ width: 8, height: 8 }} /> : <span className="offline-dot" style={{ width: 8, height: 8 }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div className="font-semibold text-sm">{selectedChat?.name}</div>
              <div className="text-xs" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isPartnerTyping ? (
                  <span style={{ color: '#0891b2', fontWeight: 700 }}>✍️ Typing a message...</span>
                ) : isPartnerRecording ? (
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>🎙️ Recording audio note...</span>
                ) : isPartnerOnline ? (
                  <span style={{ color: 'var(--color-green)' }}>Online now • Free Call Ready</span>
                ) : (
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {partnerPresence ? formatLastSeen(partnerPresence.lastSeen) : 'Offline'}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                title="Start In-App Voice Call"
                onClick={() => startInAppCall('voice')}
                style={{ fontSize: '1.1rem', color: 'var(--byt-sea)' }}
              >
                📞
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                title="Start In-App Video Call"
                onClick={() => startInAppCall('video')}
                style={{ fontSize: '1.1rem', color: 'var(--byt-sea)' }}
              >
                📹
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages-body" style={{ flex: 1 }}>
            {displayedMessages.length === 0 ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>💬</div>
                <div>No messages yet with {selectedChat?.name}.</div>
                <div className="text-xs">Type a real-time message below to start chatting.</div>
              </div>
            ) : (
              displayedMessages.map(msg => {
                const isMe = msg.senderId !== 'admin' && (String(msg.senderId) === String(currentUserId) || msg.senderName === currentUserName);
                return (
                  <div key={msg.id} className={`message-bubble ${isMe ? 'sent' : 'received'}`}>
                    {/* File / Media Attachment Render */}
                    {msg.mediaUrl && (
                      <div style={{ marginBottom: msg.content && msg.content !== '🎙️ Voice note' ? '8px' : 0 }}>
                        {msg.mediaType === 'image' ? (
                          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', maxWidth: '280px', background: '#000' }}>
                            <img
                              src={msg.mediaUrl}
                              alt="Attachment"
                              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '220px', objectFit: 'cover' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 8px', background: 'rgba(0,0,0,0.7)' }}>
                              <a href={msg.mediaUrl} download="attachment" style={{ color: '#22d3ee', textDecoration: 'none', fontWeight: 600, fontSize: '0.72rem' }}>⬇ Save</a>
                            </div>
                          </div>
                        ) : msg.mediaType === 'audio' || msg.mediaUrl.startsWith('data:audio') ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                            <span>🎙️</span>
                            <audio controls src={msg.mediaUrl} style={{ height: 32, maxWidth: 220 }} />
                          </div>
                        ) : (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 12px',
                            background: isMe ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-input)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            maxWidth: '280px'
                          }}>
                            <span style={{ fontSize: '1.5rem' }}>📄</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600 }} className="truncate">Document Attachment</div>
                            </div>
                            <a
                              href={msg.mediaUrl}
                              download="document"
                              style={{
                                fontSize: '0.72rem',
                                color: isMe ? '#fff' : 'var(--byt-sea)',
                                fontWeight: 700,
                                textDecoration: 'none',
                                padding: '3px 8px',
                                background: isMe ? 'rgba(255,255,255,0.25)' : 'rgba(8,145,178,0.12)',
                                borderRadius: '4px'
                              }}
                            >
                              ⬇
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {msg.content && msg.content !== '🎙️ Voice note' && <div>{msg.content}</div>}

                    <div className="message-time" style={{ display: 'flex', alignItems: 'center', justifyContent: isMe ? 'flex-end' : 'flex-start', gap: '4px' }}>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {/* Driver Sent Message Read Receipts */}
                      {isMe && (
                        <span
                          title={msg.read ? `Read ${msg.readAt ? new Date(msg.readAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}` : 'Sent / Delivered'}
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: msg.read ? '#22d3ee' : 'rgba(255,255,255,0.65)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            letterSpacing: '-2px',
                          }}
                        >
                          {msg.read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Dynamic live typing & recording bubbles from partner */}
            {isPartnerTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: '#f1f5f9',
                borderRadius: '16px 16px 16px 2px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: '0.85rem' }}>✍️</span>
                <span style={{ fontSize: '0.8rem', color: '#0891b2', fontWeight: 600 }}>{selectedChat?.name} is typing...</span>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#0891b2', animation: 'ping 1s infinite' }} />
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#0891b2', animation: 'ping 1s infinite 0.2s' }} />
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#0891b2', animation: 'ping 1s infinite 0.4s' }} />
                </div>
              </div>
            )}

            {isPartnerRecording && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'rgba(239, 68, 68, 0.08)',
                borderRadius: '16px 16px 16px 2px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: '0.85rem' }}>🎙️</span>
                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}>{selectedChat?.name} is recording audio...</span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse-red 1s infinite' }} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Recording Indicator with Pause / Resume */}
          {isRecording && (
            <div style={{
              padding: '10px 16px',
              background: isPaused ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              borderTop: `1px solid ${isPaused ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: isPaused ? '#f59e0b' : '#ef4444',
                  animation: isPaused ? 'none' : 'pulse-red 1s infinite'
                }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isPaused ? '#b45309' : '#ef4444' }}>
                  {isPaused ? '⏸ Paused' : '🎙️ Recording'} ({formatDuration(recordingDuration)})
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isPaused ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={resumeRecording}
                    style={{
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      borderColor: 'var(--byt-sea)',
                      color: 'var(--byt-sea-dark)',
                      fontWeight: 600
                    }}
                    title="Resume Recording"
                  >
                    <span>▶</span>
                    <span>Resume</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={pauseRecording}
                    style={{
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      borderColor: '#f59e0b',
                      color: '#b45309',
                      fontWeight: 600
                    }}
                    title="Pause Recording"
                  >
                    <span>⏸</span>
                    <span>Pause</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={cancelRecording}
                  style={{ fontSize: '0.75rem', color: '#64748b' }}
                  title="Discard voice message"
                >
                  🗑️ Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={stopRecording}
                  style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>⏹</span>
                  <span>Send Voice</span>
                </button>
              </div>
            </div>
          )}

          {/* Pending File Attachment Preview */}
          {pendingFile && (
            <div style={{
              padding: '8px 16px',
              background: '#f1f5f9',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span style={{ fontSize: '1.2rem' }}>{pendingFile.type === 'image' ? '🖼️' : '📄'}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }} className="truncate">
                    {pendingFile.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    {pendingFile.size} • Ready to send
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setPendingFile(null)}
                style={{ fontSize: '0.75rem', color: '#ef4444' }}
                title="Remove attachment"
              >
                ✕ Remove
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form className="chat-input-bar" onSubmit={handleSend}>
            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <button
              type="button"
              className="btn btn-ghost btn-icon"
              title="Attach Document or File"
              onClick={() => fileInputRef.current?.click()}
            >
              📎
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              title="Attach Photo or Image"
              onClick={() => imageInputRef.current?.click()}
            >
              📷
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              title={isRecording ? 'Stop recording' : 'Record voice message'}
              onClick={isRecording ? stopRecording : startRecording}
              style={{ color: isRecording ? '#ef4444' : undefined }}
            >
              {isRecording ? '⏹' : '🎙️'}
            </button>
            <input
              type="text"
              placeholder={pendingFile ? 'Add a message or caption...' : 'Type a message...'}
              value={message}
              onChange={e => handleDriverInputChange(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary btn-icon"
              disabled={!message.trim() && !pendingFile}
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* IN-APP VOICE & VIDEO CALL OVERLAY */}
      {activeCall && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'linear-gradient(180deg, #09121d 0%, #04080e 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 20px',
          color: '#ffffff'
        }}>
          {/* Top Status Header */}
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(8, 145, 178, 0.2)', border: '1px solid rgba(8, 145, 178, 0.4)', padding: '5px 14px', borderRadius: '20px', fontSize: '0.78rem', color: '#22d3ee', marginBottom: '10px' }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: activeCall.status === 'connected' ? '#10b981' : activeCall.status === 'error' ? '#ef4444' : activeCall.status === 'ringing' ? '#38bdf8' : '#f59e0b',
                animation: activeCall.status === 'ringing' ? 'pulse-ring 1s infinite' : 'none'
              }} />
              <span>
                {activeCall.status === 'requesting' ? 'Requesting Device Microphone/Camera...' :
                 activeCall.status === 'ringing' ? 'Ringing • Waiting for other person to answer...' :
                 activeCall.status === 'declined' ? 'Call Declined / User Busy' :
                 activeCall.status === 'connected' ? `Connected (Encrypted In-App VoIP) • ${formatDuration(callDuration)}` : 'Permission Notice'}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>{activeCall.calleeName}</h2>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              {activeCall.type === 'video' ? '📹 In-App Encrypted Video Call' : '📞 In-App Encrypted Voice Call'}
            </div>
          </div>

          {/* Center Call Visuals */}
          <div style={{ flex: 1, width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '20px 0' }}>
            {activeCall.status === 'error' ? (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 'var(--radius-xl)', padding: '30px 24px', textAlign: 'center', maxWidth: '420px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔒</div>
                <h3 style={{ color: '#ef4444', margin: '0 0 8px' }}>Device Permission Required</h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 20px' }}>
                  {activeCall.errorMsg || 'Please allow microphone/camera access in your browser prompt to make calls inside the application.'}
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={() => startInAppCall(activeCall.type)} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                    Grant Permission & Retry
                  </button>
                  <button onClick={endCall} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                    Close
                  </button>
                </div>
              </div>
            ) : activeCall.status === 'ringing' ? (
              /* Ringing Screen - Waiting for answer */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px', width: '100%' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    position: 'absolute', width: 170, height: 170, borderRadius: '50%',
                    border: '2px dashed rgba(34, 211, 238, 0.4)',
                    animation: 'spin 12s linear infinite'
                  }} />
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--byt-sea), var(--byt-sea-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.8rem', fontWeight: 800, color: '#fff',
                    boxShadow: '0 0 50px rgba(8, 145, 178, 0.5)',
                    border: '3px solid var(--byt-sea-light)',
                    animation: 'pulse-ring 1.5s infinite'
                  }}>
                    {activeCall.calleeName.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Calling {activeCall.calleeName}...</div>
                  <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '4px' }}>🔔 Ringing device • Waiting for recipient to answer</div>
                </div>

                {/* Caller Outgoing Action - Cancel Call */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={handleDeclineCall}
                    className="btn btn-danger btn-lg"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '30px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(239, 68, 68, 0.45)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <span>✕</span>
                    <span>Cancel Call</span>
                  </button>
                </div>
              </div>
            ) : activeCall.status === 'declined' ? (
              <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '16px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📵</div>
                <h3 style={{ color: '#ef4444', margin: '0 0 6px' }}>Call Declined</h3>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>{activeCall.calleeName} is currently unavailable or declined the call.</p>
              </div>
            ) : activeCall.type === 'video' ? (
              /* Connected Video Call Screen */
              <div style={{ width: '100%', height: '100%', maxHeight: '480px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative', background: '#000', border: '1px solid rgba(8, 145, 178, 0.4)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                />
                {isVideoOff && (
                  <div style={{ position: 'absolute', inset: 0, background: '#09121d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--byt-sea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
                      {activeCall.calleeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#94a3b8' }}>Camera is Turned Off</div>
                  </div>
                )}
                {/* Overlay details */}
                <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  Live Encrypted Feed • HD 720p
                </div>
              </div>
            ) : (
              /* Connected Voice Call Screen */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--byt-sea), var(--byt-sea-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem', fontWeight: 800, color: '#fff',
                    boxShadow: '0 0 40px rgba(8, 145, 178, 0.4)',
                    border: '3px solid var(--byt-sea-light)'
                  }}>
                    {activeCall.calleeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  {isMuted && (
                    <span style={{ position: 'absolute', bottom: 4, right: 4, background: '#ef4444', color: '#fff', padding: '4px', borderRadius: '50%', fontSize: '0.8rem', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      🔇
                    </span>
                  )}
                </div>

                {/* Animated Audio Waves */}
                {activeCall.status === 'connected' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px' }}>
                    {[16, 28, 40, 22, 34, 18, 30].map((h, i) => (
                      <span
                        key={i}
                        style={{
                          width: '4px',
                          height: `${h}px`,
                          background: isMuted ? '#64748b' : 'var(--byt-sea-light)',
                          borderRadius: '2px',
                          animation: isMuted ? 'none' : `wave ${0.6 + i * 0.1}s ease-in-out infinite alternate`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Call Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
            {/* Mute Mic (visible during call) */}
            {activeCall.status === 'connected' && (
              <button
                onClick={toggleMute}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '30px',
                  background: isMuted ? '#ef4444' : 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                <span>{isMuted ? '🔇' : '🎙️'}</span>
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
            )}

            {/* Video Camera Toggle (for video calls) */}
            {activeCall.type === 'video' && activeCall.status === 'connected' && (
              <button
                onClick={toggleVideo}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '30px',
                  background: isVideoOff ? '#ef4444' : 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
              >
                <span>{isVideoOff ? '🚫' : '📹'}</span>
                <span>{isVideoOff ? 'Camera Off' : 'Camera On'}</span>
              </button>
            )}

            {/* Prominent Red HANG UP Button */}
            <button
              onClick={endCall}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 30px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.65)',
                transition: 'transform 0.15s ease',
                letterSpacing: '0.3px'
              }}
              title="Hang Up"
            >
              <span style={{ fontSize: '1.25rem' }}>☎️</span>
              <span>Hang Up</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-red {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); box-shadow: 0 0 25px rgba(8, 145, 178, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(34, 211, 238, 0.7); }
        }
        @keyframes wave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
}
