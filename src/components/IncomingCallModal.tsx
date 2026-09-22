'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CallSession,
  getActiveCallSession,
  saveActiveCallSession,
  subscribeToCallSession,
  callAudio,
} from '@/lib/communication';

export default function IncomingCallModal({
  currentUserId,
  currentUserName: _currentUserName,
}: {
  currentUserId: string;
  currentUserName?: string;
}) {
  const [session, setSession] = useState<CallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const myId = String(currentUserId || '');

  const applyCallState = useCallback((current: CallSession | null) => {
    if (!current) {
      callAudio.end();
      setSession(null);
      return;
    }

    const callerId = String(current.callerId || '');
    const calleeId = String(current.calleeId || '');

    // Prevent self-calling loop
    if (callerId === calleeId) {
      callAudio.end();
      setSession(null);
      saveActiveCallSession(null);
      return;
    }

    const isCallee = calleeId === myId;
    const isCaller = callerId === myId;

    // Only respond if this user is either callee or caller
    if (isCallee || isCaller) {
      setSession(current);

      // Play ringing sound for both callee (incoming ring) and caller (outgoing ringback)
      if (current.status === 'ringing') {
        callAudio.startRinging();
      }

      // Call connected
      if (current.status === 'connected') {
        callAudio.stopRinging();
        callAudio.startConnectedPresence();
        if (!durationTimerRef.current) {
          durationTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
          }, 1000);
        }
      }

      // Call ended or declined
      if (current.status === 'ended' || current.status === 'declined') {
        callAudio.end();
        if (durationTimerRef.current) {
          clearInterval(durationTimerRef.current);
          durationTimerRef.current = null;
        }
        setTimeout(() => {
          setSession(null);
          setCallDuration(0);
          saveActiveCallSession(null);
        }, 1200);
      }
    } else {
      callAudio.end();
      setSession(null);
    }
  }, [myId]);

  useEffect(() => {
    // Initial check
    const initialSession = getActiveCallSession();
    if (initialSession) {
      applyCallState(initialSession);
    }

    // Subscribe via BroadcastChannel, storage events, and custom events
    const unsubscribe = subscribeToCallSession((newSession) => {
      applyCallState(newSession);
    });

    // Fallback periodic poller (800ms) for high reliability across iframes/windows
    const poller = setInterval(() => {
      applyCallState(getActiveCallSession());
    }, 800);

    return () => {
      unsubscribe();
      clearInterval(poller);
      callAudio.end();
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [applyCallState]);

  const handleAnswer = () => {
    if (!session) return;
    callAudio.stopRinging();
    callAudio.playConnectedTone();
    callAudio.startConnectedPresence();
    const updated: CallSession = {
      ...session,
      status: 'connected',
    };
    saveActiveCallSession(updated);
    setSession(updated);
  };

  const handleDecline = () => {
    if (!session) return;
    callAudio.end();
    const updated: CallSession = {
      ...session,
      status: 'declined',
    };
    saveActiveCallSession(updated);
    setTimeout(() => {
      saveActiveCallSession(null);
      setSession(null);
    }, 1000);
  };

  const handleCancelOutgoing = () => {
    if (!session) return;
    callAudio.end();
    const updated: CallSession = {
      ...session,
      status: 'ended',
    };
    saveActiveCallSession(updated);
    setTimeout(() => {
      saveActiveCallSession(null);
      setSession(null);
    }, 500);
  };

  const handleEndCall = () => {
    if (!session) return;
    callAudio.end();
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    const updated: CallSession = {
      ...session,
      status: 'ended',
    };
    saveActiveCallSession(updated);
    setTimeout(() => {
      saveActiveCallSession(null);
      setSession(null);
      setCallDuration(0);
    }, 800);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    callAudio.setMuted(nextMuted);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // If no active call for this user, render nothing
  if (!session) return null;

  const isCallee = String(session.calleeId) === myId;
  const isCaller = String(session.callerId) === myId;

  // 1. INCOMING RINGING CALL MODAL (Callee view ONLY - Answer & Decline)
  if (isCallee && session.status === 'ringing') {
    return (
      <div
        className="modal-overlay animate-in"
        style={{
          background: 'rgba(5, 12, 24, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="modal-content animate-in"
          style={{
            maxWidth: 380,
            width: '90%',
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-xl)',
            background: 'linear-gradient(180deg, #102035, #08111e)',
            border: '2px solid var(--byt-gold)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.6)',
            borderRadius: 'var(--radius-xl)',
            color: '#fff',
          }}
        >
          {/* Animated pulse avatar */}
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--byt-gold), var(--byt-gold-dark))',
              color: '#0a1628',
              fontSize: '2rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-md)',
              boxShadow: '0 0 0 12px rgba(212, 168, 67, 0.2)',
              animation: 'pulse 1.6s infinite',
            }}
          >
            {session.type === 'video' ? '📹' : '📞'}
          </div>

          <span
            className="eyebrow"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '0.72rem',
              color: 'var(--byt-gold)',
              fontWeight: 700,
            }}
          >
            Incoming Free In-App {session.type === 'video' ? 'Video' : 'Voice'} Call
          </span>

          <h2 style={{ fontSize: '1.4rem', margin: '6px 0 2px', color: '#fff' }}>
            {session.callerName}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 'var(--space-xl)' }}>
            Ringing... Free BYT Internal Network
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-danger btn-lg"
              onClick={handleDecline}
              style={{
                flex: 1,
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontWeight: 700,
              }}
            >
              <span>✕</span>
              <span>Decline</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleAnswer}
              style={{
                flex: 1,
                borderRadius: 'var(--radius-full)',
                background: '#10b981',
                borderColor: '#10b981',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              }}
            >
              <span>📞</span>
              <span>Answer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. OUTGOING CALLING VIEW (Caller view ONLY - "Calling...", Cancel button, NO Answer button)
  if (isCaller && session.status === 'ringing') {
    return (
      <div
        className="modal-overlay animate-in"
        style={{
          background: 'rgba(5, 12, 24, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="modal-content animate-in"
          style={{
            maxWidth: 380,
            width: '90%',
            textAlign: 'center',
            padding: 'var(--space-2xl) var(--space-xl)',
            background: 'linear-gradient(180deg, #0f1e34, #08111e)',
            border: '2px solid rgba(14, 165, 233, 0.6)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.6)',
            borderRadius: 'var(--radius-xl)',
            color: '#fff',
          }}
        >
          {/* Animated pulse avatar */}
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-md)',
              boxShadow: '0 0 0 12px rgba(14, 165, 233, 0.2)',
              animation: 'pulse 1.4s infinite',
            }}
          >
            {session.type === 'video' ? '📹' : '📞'}
          </div>

          <span
            className="eyebrow"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '0.72rem',
              color: '#38bdf8',
              fontWeight: 700,
            }}
          >
            Outgoing Free In-App {session.type === 'video' ? 'Video' : 'Voice'} Call
          </span>

          <h2 style={{ fontSize: '1.4rem', margin: '6px 0 2px', color: '#fff' }}>
            Calling {session.calleeName}...
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 'var(--space-xl)' }}>
            🔔 Ringing recipient&apos;s device • Waiting for answer
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-danger btn-lg"
              onClick={handleCancelOutgoing}
              style={{
                minWidth: 180,
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
                background: '#ef4444',
                borderColor: '#ef4444',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
              }}
            >
              <span>✕</span>
              <span>Cancel Call</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. ACTIVE CONNECTED CALL FLOATING DOCK (Visible on both caller and callee side)
  if (session.status === 'connected') {
    const otherPartyName = isCaller ? session.calleeName : session.callerName;

    return (
      <div
        className="animate-in"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 99998,
          background: 'linear-gradient(145deg, #0d1e35, #08111e)',
          border: '1px solid var(--byt-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 18px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.5)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          minWidth: 280,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#10b981',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            flexShrink: 0,
          }}
        >
          {session.type === 'video' ? '🎥' : '🎙️'}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
            {otherPartyName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>Connected ({formatDuration(callDuration)})</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={toggleMute}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              background: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)',
              color: isMuted ? '#ef4444' : '#fff',
              fontSize: '0.78rem',
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🎙️'}
          </button>

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleEndCall}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.78rem',
            }}
          >
            End
          </button>
        </div>
      </div>
    );
  }

  // 4. DECLINED OR ENDED NOTICE
  if (session.status === 'declined' || session.status === 'ended') {
    const otherPartyName = isCaller ? session.calleeName : session.callerName;

    return (
      <div
        className="animate-in"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 99998,
          background: 'rgba(239, 68, 68, 0.95)',
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '10px 16px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}
      >
        Call with {otherPartyName} {session.status}.
      </div>
    );
  }

  return null;
}
