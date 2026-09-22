'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  EnrolledBiometricUser,
  getRegisteredBiometric,
  registerBiometric,
  authenticateWithBiometrics,
  removeBiometric,
  detectBiometricType,
} from '@/lib/biometrics';

interface BiometricModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'enroll' | 'manage';
  userToEnroll?: { role: 'admin' | 'driver'; email: string; name: string; driverId?: string };
  onSuccess?: (user: EnrolledBiometricUser) => void;
}

export default function BiometricModal({
  isOpen,
  onClose,
  mode,
  userToEnroll,
  onSuccess,
}: BiometricModalProps) {
  const [step, setStep] = useState<'prompt' | 'scanning' | 'verifying' | 'success' | 'error'>('prompt');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [bioType, setBioType] = useState<'face-id' | 'fingerprint' | 'generic'>('fingerprint');
  const [enrolledUser, setEnrolledUser] = useState<EnrolledBiometricUser | null>(null);

  const runBiometricAuth = useCallback(async (userRecord?: EnrolledBiometricUser | null) => {
    void userRecord;
    setStep('scanning');
    setStatusMessage(bioType === 'face-id' ? 'Scanning sensor for Face ID...' : 'Touch the fingerprint sensor...');
    setErrorMessage('');

    await new Promise(r => setTimeout(r, 500));

    try {
      setStep('verifying');
      setStatusMessage('Verifying biometric credential...');

      const result = await authenticateWithBiometrics();

      if (result.success && result.user) {
        setStep('success');
        setStatusMessage(`Identity verified. Welcome, ${result.user.name}`);
        setTimeout(() => {
          onSuccess?.(result.user!);
          onClose();
        }, 800);
      } else if (result.cancelled) {
        setStep('prompt');
        setStatusMessage('Authentication cancelled.');
      } else {
        setStep('error');
        setErrorMessage(result.error || 'Biometric check failed.');
      }
    } catch {
      setStep('error');
      setErrorMessage('Could not complete biometric scan.');
    }
  }, [bioType, onClose, onSuccess]);

  useEffect(() => {
    if (isOpen) {
      setBioType(detectBiometricType());
      const current = getRegisteredBiometric();
      setEnrolledUser(current);

      if (mode === 'login') {
        runBiometricAuth(current);
      } else {
        setStep('prompt');
      }
    } else {
      setStep('prompt');
      setErrorMessage('');
    }
  }, [isOpen, mode, runBiometricAuth]);

  const handleSimulatedInstantUnlock = (userOverride?: EnrolledBiometricUser) => {
    const user = userOverride || enrolledUser || {
      role: 'driver',
      name: 'Kwame Asante',
      email: 'kwame@gmail.com',
      enrolledAt: new Date().toISOString()
    };
    setStep('scanning');
    setStatusMessage('Reading sensor...');
    setTimeout(() => {
      setStep('verifying');
      setStatusMessage('Biometrics matched.');
      setTimeout(() => {
        setStep('success');
        setStatusMessage(`Verified: ${user.name}`);
        setTimeout(() => {
          onSuccess?.(user);
          onClose();
        }, 600);
      }, 450);
    }, 500);
  };

  const handleEnrollNow = async () => {
    if (!userToEnroll) {
      setErrorMessage('User information required to enroll.');
      return;
    }

    setStep('scanning');
    setStatusMessage(`Registering ${bioType === 'face-id' ? 'Face ID' : 'Fingerprint'}...`);

    const result = await registerBiometric(userToEnroll);
    if (result.success) {
      setStep('verifying');
      setStatusMessage('Storing local biometric key...');
      setTimeout(() => {
        const updated = getRegisteredBiometric();
        setEnrolledUser(updated);
        setStep('success');
        setStatusMessage(`${bioType === 'face-id' ? 'Face ID' : 'Fingerprint'} registered.`);
        setTimeout(() => {
          if (updated) onSuccess?.(updated);
          onClose();
        }, 900);
      }, 600);
    } else {
      setStep('error');
      setErrorMessage(result.error || 'Enrollment failed.');
    }
  };

  const handleRemoveBiometric = () => {
    removeBiometric();
    setEnrolledUser(null);
    setStatusMessage('Biometric enrollment removed from this device.');
    setTimeout(() => {
      onClose();
    }, 700);
  };

  if (!isOpen) return null;

  const isFace = bioType === 'face-id';

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 420,
          width: '100%',
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.18)',
          overflow: 'hidden',
          textAlign: 'center',
          padding: '2rem 1.75rem',
          position: 'relative',
        }}
      >
        {/* Subtle Close button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: '1px solid #e2e8f0',
            width: 30,
            height: 30,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          ✕
        </button>

        {/* Eyebrow Label */}
        <div style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#0891b2',
          marginBottom: '1rem'
        }}>
          SECURITY & HARDWARE AUTH
        </div>

        {/* Dynamic Scanner Visual */}
        <div style={{ position: 'relative', width: 84, height: 84, margin: '0 auto 1.25rem' }}>
          {/* Subtle breathing ring */}
          <div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              border: `1.5px solid ${step === 'success' ? '#16a34a' : step === 'error' ? '#ef4444' : '#0891b2'}`,
              opacity: step === 'scanning' || step === 'verifying' ? 0.6 : 0.25,
              animation: step === 'scanning' || step === 'verifying' ? 'bioPulse 1.8s infinite ease-in-out' : 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background:
                step === 'success'
                  ? '#16a34a'
                  : step === 'error'
                  ? '#ef4444'
                  : '#0891b2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(8, 145, 178, 0.2)',
            }}
          >
            {/* Laser scan line */}
            {(step === 'scanning' || step === 'verifying') && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: 2,
                  background: '#ffffff',
                  boxShadow: '0 0 8px #ffffff',
                  animation: 'laserSweep 1.4s infinite alternate ease-in-out',
                }}
              />
            )}

            {step === 'success' ? (
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : isFace ? (
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
                <circle cx="9" cy="10" r="1" fill="currentColor" />
                <circle cx="15" cy="10" r="1" fill="currentColor" />
                <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
                <line x1="12" y1="12" x2="12" y2="13" />
              </svg>
            ) : (
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 11c0 3.5-1.5 6-3 7" />
                <path d="M12 7c2.5 0 4.5 2 4.5 4.5 0 2-1 3.5-2 5.5" />
                <path d="M8 14.5c.5 2 1.5 3.5 2.5 4.5" />
                <path d="M16 9.5c0-.5 0-1-.5-1.5-1-1.5-2.5-2-4.5-2-2.5 0-4.5 1.5-5 3.5-.5 2 0 4 1 5.5" />
                <path d="M12 3a9 9 0 0 0-9 9c0 3 1.5 5.5 3.5 7.5" />
                <path d="M21 12a9 9 0 0 0-6.5-8.5" />
                <path d="M19 15.5c1-1 1.5-2.5 1.5-3.5" />
              </svg>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '0.35rem' }}>
          {mode === 'login'
            ? `${isFace ? 'Face ID' : 'Fingerprint'} Sign-In`
            : mode === 'enroll'
            ? `Enroll ${isFace ? 'Face ID' : 'Fingerprint'}`
            : 'Biometric Access Manager'}
        </h3>

        {/* Subtitle / Status */}
        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {statusMessage ||
            (mode === 'login'
              ? enrolledUser
                ? `Ready to verify ${enrolledUser.name} (${enrolledUser.role.toUpperCase()})`
                : 'Authenticate quickly using your device biometrics'
              : mode === 'enroll'
              ? `Bind this device to ${userToEnroll?.name || 'your account'} for 1-tap passwordless logins.`
              : 'Manage biometric credentials stored on this device.')}
        </p>

        {/* Error Banner */}
        {errorMessage && (
          <div
            style={{
              padding: '0.65rem 0.9rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              textAlign: 'left',
              lineHeight: 1.4,
            }}
          >
            <strong>Hardware error:</strong> {errorMessage}
          </div>
        )}

        {/* Enrolled User Details Card */}
        {enrolledUser && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              marginBottom: '1.25rem',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                background: '#0891b2',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {enrolledUser.role === 'admin' ? '🛡️' : '🚗'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enrolledUser.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'ui-monospace, monospace' }}>
                {enrolledUser.email} • [{enrolledUser.role.toUpperCase()}]
              </div>
            </div>
            <span
              style={{
                background: '#f0fdf4',
                color: '#16a34a',
                border: '1px solid #bbf7d0',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Active
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {mode === 'login' && (
            <>
              <button
                type="button"
                onClick={() => runBiometricAuth(enrolledUser)}
                disabled={step === 'scanning' || step === 'verifying'}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  background: '#0891b2',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#0e7490'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#0891b2'; }}
              >
                <span>{isFace ? '👤' : '🫆'}</span>
                <span>{step === 'scanning' || step === 'verifying' ? 'Scanning...' : `Scan ${isFace ? 'Face ID' : 'Fingerprint'}`}</span>
              </button>

              {/* 1-Tap Instant Unlock Bypass */}
              <button
                type="button"
                onClick={() => handleSimulatedInstantUnlock(enrolledUser || undefined)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#0891b2',
                  padding: '0.6rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontFamily: 'ui-monospace, monospace',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0891b2';
                  e.currentTarget.style.background = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              >
                <span>⚡</span>
                <span>[1-TAP INSTANT VERIFY (SIMULATION)]</span>
              </button>
            </>
          )}

          {mode === 'enroll' && (
            <button
              type="button"
              onClick={handleEnrollNow}
              disabled={step === 'scanning' || step === 'verifying'}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                borderRadius: '8px',
                background: '#0891b2',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>{isFace ? '👤' : '🫆'}</span>
              <span>{step === 'scanning' || step === 'verifying' ? 'Registering...' : `Enroll ${isFace ? 'Face ID' : 'Fingerprint'}`}</span>
            </button>
          )}

          {mode === 'manage' && enrolledUser && (
            <>
              <button
                type="button"
                onClick={() => runBiometricAuth(enrolledUser)}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  background: '#0891b2',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Test {isFace ? 'Face ID' : 'Fingerprint'} Sensor
              </button>
              <button
                type="button"
                onClick={handleRemoveBiometric}
                style={{
                  background: '#fff',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Remove Credential from this Device
              </button>
            </>
          )}

          {/* Switch biometric type */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setBioType('face-id')}
              style={{
                background: bioType === 'face-id' ? '#f0f9ff' : 'transparent',
                border: bioType === 'face-id' ? '1px solid #0891b2' : '1px solid #e2e8f0',
                color: bioType === 'face-id' ? '#0891b2' : '#64748b',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              👤 Face ID
            </button>
            <button
              type="button"
              onClick={() => setBioType('fingerprint')}
              style={{
                background: bioType === 'fingerprint' ? '#f0f9ff' : 'transparent',
                border: bioType === 'fingerprint' ? '1px solid #0891b2' : '1px solid #e2e8f0',
                color: bioType === 'fingerprint' ? '#0891b2' : '#64748b',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              🫆 Fingerprint
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.8rem',
              cursor: 'pointer',
              marginTop: '0.2rem',
            }}
          >
            Cancel & use password
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes bioPulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.15; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        @keyframes laserSweep {
          0% { top: 10%; opacity: 0.7; }
          50% { opacity: 1; }
          100% { top: 88%; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

