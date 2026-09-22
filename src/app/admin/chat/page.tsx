'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Driver,
  getStoredDrivers,
  demoDrivers,
  formatCurrency,
} from '@/lib/demo-data';
import {
  ChatMessage,
  getStoredChatMessages,
  saveStoredChatMessages,
  subscribeToChatMessages,
  markConversationAsRead,
  saveActiveCallSession,
  callAudio,
  UserPresence,
  broadcastUserPresence,
  subscribeToPresence,
  formatLastSeen,
} from '@/lib/communication';

export default function AdminChatPage() {
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = getStoredDrivers().filter(d => d.status === 'ACTIVE');
      if (stored.length > 0) return stored;
    }
    return demoDrivers.filter(d => d.status === 'ACTIVE');
  });
  const [selectedDriverId, setSelectedDriverId] = useState<string>('1'); // Default Kwame Asante
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return getStoredChatMessages();
  });
  const [inputMessage, setInputMessage] = useState('');
  const [search, setSearch] = useState('');
  const [presences, setPresences] = useState<Record<string, UserPresence>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio Recording State for Admin Dispatch
  const [isAdminRecording, setIsAdminRecording] = useState(false);
  const [isAdminPaused, setIsAdminPaused] = useState(false);
  const [adminRecordDuration, setAdminRecordDuration] = useState(0);
  const adminMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const adminRecordingChunksRef = useRef<Blob[]>([]);
  const adminRecordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCancellingAdminRecRef = useRef(false);

  // Outgoing call state initiated from admin
  const [callingState, setCallingState] = useState<'idle' | 'calling' | 'connected'>('idle');

  const loadData = () => {
    const allDrivers = getStoredDrivers().filter(d => d.status === 'ACTIVE');
    if (allDrivers.length > 0) {
      setDrivers(allDrivers);
    }
    setMessages(getStoredChatMessages());
  };

  useEffect(() => {
    loadData();
    // Pre-select driver from URL search params if provided (e.g. /admin/chat?driverId=2)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramDriverId = params.get('driverId') || params.get('driver');
      if (paramDriverId) {
        setSelectedDriverId(String(paramDriverId));
      }
    }
    const unsubscribeChat = subscribeToChatMessages(() => {
      setMessages(getStoredChatMessages());
    });
    const unsubscribePresence = subscribeToPresence((p) => {
      setPresences(p);
    });
    return () => {
      unsubscribeChat();
      unsubscribePresence();
    };
  }, []);

  const selectedDriver = drivers.find(d => String(d.id) === String(selectedDriverId)) || drivers[0];
  const activeDriverId = selectedDriver ? String(selectedDriver.id) : '1';
  const activeDriverName = selectedDriver ? selectedDriver.name.toLowerCase() : '';
  const conversationId = `driver_${activeDriverId}_admin`;

  // Get active driver presence
  const driverPresence = presences[activeDriverId];
  const isDriverOnline = driverPresence?.online ?? (selectedDriver?.operationalStatus !== 'OFFLINE');
  const isDriverTyping = driverPresence?.activity === 'typing' && driverPresence?.activeConversationId === conversationId;
  const isDriverRecording = driverPresence?.activity === 'recording' && driverPresence?.activeConversationId === conversationId;

  // Broadcast Admin presence and heartbeat
  useEffect(() => {
    broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, undefined);
    const interval = setInterval(() => {
      broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, undefined);
    }, 8000);
    return () => clearInterval(interval);
  }, [conversationId]);

  // Typing emitter for Admin
  const handleInputChange = (val: string) => {
    setInputMessage(val);
    if (val.trim()) {
      broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, 'typing');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, null);
      }, 2500);
    } else {
      broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, null);
    }
  };

  // Filter messages for current driver conversation
  const currentMessages = messages.filter(m => {
    if (!selectedDriver) return false;
    const sId = String(m.senderId || '');
    const rId = String(m.recipientId || '');
    const cId = String(m.conversationId || '');

    // 1. Direct conversation ID match
    if (cId === `driver_${activeDriverId}_admin` || cId === `admin_driver_${activeDriverId}`) {
      return true;
    }

    // 2. Sent by admin to this driver (or broad dispatch)
    if (sId === 'admin' && (rId === activeDriverId || rId === 'driver' || rId === 'all')) {
      return true;
    }

    // 3. Sent by this driver to admin
    if (rId === 'admin' && (sId === activeDriverId || (activeDriverName && m.senderName?.toLowerCase().includes(activeDriverName)))) {
      return true;
    }

    return false;
  });

  // Mark incoming messages for current driver as read
  useEffect(() => {
    if (selectedDriver) {
      const hasUnread = messages.some(
        m => (String(m.senderId) === activeDriverId || m.conversationId === conversationId) &&
             m.recipientId === 'admin' &&
             !m.read
      );
      if (hasUnread) {
        markConversationAsRead(conversationId, 'admin');
      }
    }
  }, [selectedDriverId, activeDriverId, conversationId, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isDriverTyping, isDriverRecording]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedDriver) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, null);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      senderId: 'admin',
      senderName: 'Emma (Admin Dispatch)',
      senderRole: 'admin',
      recipientId: activeDriverId,
      content: inputMessage.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    const currentAll = getStoredChatMessages();
    const updated = [...currentAll, newMsg];
    saveStoredChatMessages(updated);
    setMessages(updated);
    setInputMessage('');
  };

  // Admin Audio Recording Functions
  const startAdminRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      adminRecordingChunksRef.current = [];
      isCancellingAdminRecRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) adminRecordingChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        if (!isCancellingAdminRecRef.current && adminRecordingChunksRef.current.length > 0) {
          const blob = new Blob(adminRecordingChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            const audioMsg: ChatMessage = {
              id: `audio-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              conversationId,
              senderId: 'admin',
              senderName: 'Emma (Admin Dispatch)',
              senderRole: 'admin',
              recipientId: activeDriverId,
              content: '🎙️ Voice note',
              createdAt: new Date().toISOString(),
              read: false,
              mediaUrl: base64Audio,
              mediaType: 'audio',
            };
            const currentAll = getStoredChatMessages();
            const updated = [...currentAll, audioMsg];
            saveStoredChatMessages(updated);
            setMessages(updated);
          };
          reader.readAsDataURL(blob);
        }
        stream.getTracks().forEach(t => t.stop());
        adminRecordingChunksRef.current = [];
        isCancellingAdminRecRef.current = false;
        broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, null);
      };

      recorder.start(200);
      adminMediaRecorderRef.current = recorder;
      setIsAdminRecording(true);
      setIsAdminPaused(false);
      setAdminRecordDuration(0);

      broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, 'recording');

      if (adminRecordingTimerRef.current) clearInterval(adminRecordingTimerRef.current);
      adminRecordingTimerRef.current = setInterval(() => {
        setAdminRecordDuration(prev => prev + 1);
      }, 1000);
    } catch {
      alert('Could not access microphone on this device. Please grant microphone permission.');
    }
  };

  const pauseAdminRecording = () => {
    if (adminMediaRecorderRef.current && adminMediaRecorderRef.current.state === 'recording') {
      adminMediaRecorderRef.current.pause();
      setIsAdminPaused(true);
      if (adminRecordingTimerRef.current) {
        clearInterval(adminRecordingTimerRef.current);
        adminRecordingTimerRef.current = null;
      }
    }
  };

  const resumeAdminRecording = () => {
    if (adminMediaRecorderRef.current && adminMediaRecorderRef.current.state === 'paused') {
      adminMediaRecorderRef.current.resume();
      setIsAdminPaused(false);
      broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, 'recording');
      adminRecordingTimerRef.current = setInterval(() => {
        setAdminRecordDuration(prev => prev + 1);
      }, 1000);
    }
  };

  const stopAdminRecording = () => {
    isCancellingAdminRecRef.current = false;
    if (adminMediaRecorderRef.current && adminMediaRecorderRef.current.state !== 'inactive') {
      adminMediaRecorderRef.current.stop();
    }
    setIsAdminRecording(false);
    setIsAdminPaused(false);
    if (adminRecordingTimerRef.current) {
      clearInterval(adminRecordingTimerRef.current);
      adminRecordingTimerRef.current = null;
    }
    broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, null);
  };

  const cancelAdminRecording = () => {
    isCancellingAdminRecRef.current = true;
    if (adminMediaRecorderRef.current && adminMediaRecorderRef.current.state !== 'inactive') {
      adminMediaRecorderRef.current.stop();
    }
    setIsAdminRecording(false);
    setIsAdminPaused(false);
    setAdminRecordDuration(0);
    if (adminRecordingTimerRef.current) {
      clearInterval(adminRecordingTimerRef.current);
      adminRecordingTimerRef.current = null;
    }
    broadcastUserPresence('admin', 'admin', 'Emma (Admin Dispatch)', conversationId, null);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    if (!selectedDriver) return;
    if (activeDriverId === 'admin') {
      alert('Cannot call dispatch admin. Please select a valid fleet driver.');
      return;
    }

    saveActiveCallSession({
      id: `call-${Date.now()}`,
      callerId: 'admin',
      callerName: 'Emma (Admin Dispatch)',
      calleeId: String(activeDriverId),
      calleeName: selectedDriver.name,
      type,
      status: 'ringing',
      startedAt: Date.now(),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDriver) return;

    const isImage = file.type.startsWith('image');
    const isAudio = file.type.startsWith('audio');
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fileMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        conversationId,
        senderId: 'admin',
        senderName: 'Emma (Admin Dispatch)',
        senderRole: 'admin',
        recipientId: activeDriverId,
        content: `Sent ${isImage ? 'an image' : isAudio ? 'an audio note' : 'a document'}: ${file.name}`,
        createdAt: new Date().toISOString(),
        read: false,
        mediaUrl: dataUrl,
        mediaType: isImage ? 'image' : isAudio ? 'audio' : 'document',
      };
      const currentAll = getStoredChatMessages();
      const updated = [...currentAll, fileMsg];
      saveStoredChatMessages(updated);
      setMessages(updated);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const filteredDrivers = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.phone && d.phone.includes(search))
  );

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header" style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)', fontWeight: 700 }}>
            Fleet Communications Hub
          </span>
          <h1 style={{ marginTop: '2px' }}>Dispatch Chat & Free In-App Calling</h1>
          <p className="subtitle">Real-time messaging, file exchange, read receipts & instant voice/video calls • Dispatch Admin: <strong>Emma (0208713722)</strong></p>
        </div>
        <img
          src="/byt-logomark.svg"
          alt="BYT Fleet Logomark"
          style={{ height: 42, maxWidth: 130, objectFit: 'contain' }}
        />
      </div>

      {/* Chat Container */}
      <div className="card" style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: 0 }}>
        {/* Left: Driver Contacts Directory */}
        <div style={{ width: 300, borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-input)' }}>
          <div style={{ padding: 'var(--space-sm)' }}>
            <div className="search-box" style={{ width: '100%' }}>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search drivers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '6px 8px 6px 30px' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredDrivers.map(d => {
              const isSelected = String(d.id) === String(selectedDriverId);
              const unread = messages.filter(m => String(m.senderId) === String(d.id) && m.recipientId === 'admin' && !m.read).length;
              const dPres = presences[String(d.id)];
              const isOnline = dPres ? dPres.online : d.operationalStatus !== 'OFFLINE';
              const isTyping = dPres?.activity === 'typing';
              const isRecording = dPres?.activity === 'recording';

              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDriverId(String(d.id))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--color-bg-surface)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--byt-gold)' : '3px solid transparent',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    {d.profilePicture ? (
                      <img src={d.profilePicture} alt={d.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div className="chat-avatar" style={{ width: 40, height: 40, fontSize: '0.85rem' }}>
                        {d.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: isOnline ? '#10b981' : '#94a3b8',
                        border: '2px solid var(--color-bg-card)',
                      }}
                      title={isOnline ? 'Online' : 'Offline'}
                    />
                  </div>

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="font-semibold text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {d.name}
                      </span>
                      {unread > 0 && (
                        <span style={{ background: '#ef4444', color: 'white', fontSize: '0.78rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>
                          {unread}
                        </span>
                      )}
                    </div>
                    {isTyping ? (
                      <div style={{ fontSize: '0.72rem', color: '#0891b2', fontWeight: 700, fontStyle: 'italic' }}>
                        ✍️ typing...
                      </div>
                    ) : isRecording ? (
                      <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, fontStyle: 'italic' }}>
                        🎙️ recording audio...
                      </div>
                    ) : (
                      <div className="text-xs text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isOnline ? 'Online now' : (dPres ? formatLastSeen(dPres.lastSeen) : (d.operationalStatus || 'Active'))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat & Calling Window */}
        {selectedDriver ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-bg-surface)' }}>
            {/* Topbar */}
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {selectedDriver.profilePicture ? (
                  <img src={selectedDriver.profilePicture} alt={selectedDriver.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div className="chat-avatar" style={{ width: 42, height: 42, fontSize: '0.9rem' }}>
                    {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {selectedDriver.name}
                  </div>
                  <div className="text-xs" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: isDriverOnline ? '#10b981' : '#94a3b8',
                      display: 'inline-block'
                    }} />
                    {isDriverTyping ? (
                      <span style={{ color: '#0891b2', fontWeight: 700 }}>✍️ Typing a message...</span>
                    ) : isDriverRecording ? (
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>🎙️ Recording audio note...</span>
                    ) : isDriverOnline ? (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Online now • Free Call Ready</span>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {driverPresence ? formatLastSeen(driverPresence.lastSeen) : 'Offline'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* In-App Free Call Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleStartCall('voice')}
                  title="Free in-app voice call to this driver"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>📞</span>
                  <span>Voice Call</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleStartCall('video')}
                  title="Free in-app video call to this driver"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>📹</span>
                  <span>Video Call</span>
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div style={{ flex: 1, padding: 'var(--space-md)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentMessages.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '6px' }}>💬</div>
                  <div>No previous messages with {selectedDriver.name}.</div>
                  <div className="text-xs">Type a message below to start dispatching.</div>
                </div>
              ) : (
                currentMessages.map(msg => {
                  const isMe = msg.senderId === 'admin';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        background: isMe ? 'var(--byt-gold)' : 'var(--color-bg-input)',
                        color: isMe ? '#0a1628' : 'var(--color-text-primary)',
                        padding: '8px 14px',
                        borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        border: isMe ? 'none' : '1px solid var(--color-border)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      }}
                    >
                      {msg.mediaUrl && (
                        <div style={{ marginBottom: '6px', borderRadius: 8, overflow: 'hidden' }}>
                          {msg.mediaType === 'audio' || msg.mediaUrl.startsWith('data:audio') ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', background: isMe ? 'rgba(0,0,0,0.1)' : 'var(--color-bg-surface)', borderRadius: '8px' }}>
                              <span>🎙️</span>
                              <audio controls src={msg.mediaUrl} style={{ height: 32, maxWidth: 220 }} />
                            </div>
                          ) : msg.mediaType === 'image' || msg.mediaUrl.startsWith('data:image') ? (
                            <img src={msg.mediaUrl} alt="Attached" style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain' }} />
                          ) : (
                            <a href={msg.mediaUrl} download="attachment" style={{ fontSize: '0.8rem', color: isMe ? '#000' : 'var(--byt-sea)', textDecoration: 'underline' }}>
                              📄 Download Document
                            </a>
                          )}
                        </div>
                      )}
                      <div style={{ fontSize: '0.88rem', fontWeight: isMe ? 500 : 400 }}>{msg.content}</div>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '5px',
                          marginTop: '4px',
                          color: isMe ? 'rgba(10, 22, 40, 0.85)' : '#475569',
                        }}
                      >
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {/* Read Receipts for Admin's sent messages */}
                        {isMe && (
                          <span
                            title={msg.read ? `Read ${msg.readAt ? new Date(msg.readAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}` : 'Sent / Delivered'}
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              color: msg.read ? '#0284c7' : 'rgba(10, 22, 40, 0.6)',
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

              {/* Dynamic live typing & recording bubbles from driver */}
              {isDriverTyping && (
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
                  <span style={{ fontSize: '0.8rem', color: '#0891b2', fontWeight: 600 }}>{selectedDriver.name} is typing...</span>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#0891b2', animation: 'ping 1s infinite' }} />
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#0891b2', animation: 'ping 1s infinite 0.2s' }} />
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#0891b2', animation: 'ping 1s infinite 0.4s' }} />
                  </div>
                </div>
              )}

              {isDriverRecording && (
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
                  <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}>{selectedDriver.name} is recording audio...</span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse-red 1s infinite' }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Admin Audio Recording Bar (Active Recording Mode) */}
            {isAdminRecording && (
              <div style={{
                padding: '10px 16px',
                background: isAdminPaused ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                borderTop: `1px solid ${isAdminPaused ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: isAdminPaused ? '#f59e0b' : '#ef4444',
                    animation: isAdminPaused ? 'none' : 'pulse-red 1s infinite'
                  }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isAdminPaused ? '#b45309' : '#ef4444' }}>
                    {isAdminPaused ? '⏸ Recording Paused' : '🎙️ Recording Dispatch Audio'} ({formatDuration(adminRecordDuration)})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isAdminPaused ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={resumeAdminRecording}
                      style={{ fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      ▶ Resume
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={pauseAdminRecording}
                      style={{ fontSize: '0.75rem', fontWeight: 600, borderColor: '#f59e0b', color: '#b45309' }}
                    >
                      ⏸ Pause
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={cancelAdminRecording}
                    style={{ fontSize: '0.75rem', color: '#64748b' }}
                  >
                    🗑️ Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={stopAdminRecording}
                    style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>⏹</span>
                    <span>Send Audio Note</span>
                  </button>
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} style={{ padding: 'var(--space-sm) var(--space-md)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '8px', alignItems: 'center', background: '#ffffff' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => fileInputRef.current?.click()}
                title="Send Photo or Document"
                style={{ fontSize: '1.2rem', padding: '6px' }}
              >
                📎
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={isAdminRecording ? stopAdminRecording : startAdminRecording}
                title={isAdminRecording ? 'Stop & Send Recording' : 'Record Dispatch Voice Note'}
                style={{ fontSize: '1.2rem', padding: '6px', color: isAdminRecording ? '#ef4444' : undefined }}
              >
                {isAdminRecording ? '⏹' : '🎙️'}
              </button>

              <input
                className="form-input"
                placeholder={`Message ${selectedDriver.name}...`}
                value={inputMessage}
                onChange={e => handleInputChange(e.target.value)}
                style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
              />

              <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px' }}>
                Send
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}

