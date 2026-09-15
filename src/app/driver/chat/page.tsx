'use client';

import { useState } from 'react';
import { demoChatUsers, demoChatMessages, getInitials } from '@/lib/demo-data';

export default function DriverChatPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>('2');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(demoChatMessages);
  const currentUserId = '1'; // Kwame Asante

  const selectedChat = demoChatUsers.find(u => u.id === selectedUser);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      content: message,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
    }]);
    setMessage('');
  };

  return (
    <div style={{ margin: 'calc(-1 * var(--space-lg))', marginTop: 0 }}>
      {!selectedUser ? (
        /* Driver Directory */
        <div style={{ padding: 'var(--space-lg)' }}>
          <h2 style={{ marginBottom: 'var(--space-lg)' }}>Messages</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {demoChatUsers.map(user => (
              <div
                key={user.id}
                className="chat-list-item"
                onClick={() => setSelectedUser(user.id)}
                style={{ background: 'var(--color-bg-card)' }}
              >
                <div className="chat-avatar">
                  {getInitials(user.name)}
                  {user.online ? <span className="online-dot" /> : <span className="offline-dot" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-semibold text-sm">{user.name}</span>
                    {user.lastMessageTime && <span className="text-xs text-muted">{user.lastMessageTime}</span>}
                  </div>
                  {user.lastMessage && (
                    <div className="text-xs text-muted truncate" style={{ marginTop: '2px' }}>{user.lastMessage}</div>
                  )}
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
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--header-height) - var(--bottom-nav-height))' }}>
          {/* Chat Header */}
          <div style={{
            padding: 'var(--space-md) var(--space-lg)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            background: 'var(--color-bg-card)',
          }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setSelectedUser(null)} style={{ padding: '0.3rem' }}>
              ← 
            </button>
            <div className="chat-avatar" style={{ width: 36, height: 36, fontSize: '0.75rem' }}>
              {selectedChat ? getInitials(selectedChat.name) : ''}
              {selectedChat?.online ? <span className="online-dot" style={{ width: 8, height: 8 }} /> : <span className="offline-dot" style={{ width: 8, height: 8 }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div className="font-semibold text-sm">{selectedChat?.name}</div>
              <div className="text-xs" style={{ color: selectedChat?.online ? 'var(--color-green)' : 'var(--color-text-muted)' }}>
                {selectedChat?.online ? 'Online' : 'Offline'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn btn-ghost btn-icon" title="Voice Call">📞</button>
              <button className="btn btn-ghost btn-icon" title="Video Call">📹</button>
              <button className="btn btn-ghost btn-icon" title="Share Contact">👤</button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages-body" style={{ flex: 1 }}>
            {messages.map(msg => (
              <div key={msg.id} className={`message-bubble ${msg.senderId === currentUserId ? 'sent' : 'received'}`}>
                <div>{msg.content}</div>
                <div className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form className="chat-input-bar" onSubmit={handleSend}>
            <button type="button" className="btn btn-ghost btn-icon" title="Attach image">📷</button>
            <button type="button" className="btn btn-ghost btn-icon" title="Send audio">🎙️</button>
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-icon" disabled={!message.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
