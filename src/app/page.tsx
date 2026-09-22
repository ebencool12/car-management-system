/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import BiometricModal from '@/components/BiometricModal';
import {
  getRegisteredBiometric,
  registerBiometric,
  EnrolledBiometricUser,
  detectBiometricType,
} from '@/lib/biometrics';

const noopSubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'admin' | 'driver'>('admin');
  const [email, setEmail] = useState('admin@byt.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Biometric authentication state
  const [enrolledBio, setEnrolledBio] = useState<EnrolledBiometricUser | null>(null);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometricModalMode, setBiometricModalMode] = useState<'login' | 'enroll' | 'manage'>('login');
  const [enableBioCheckbox, setEnableBioCheckbox] = useState(true);
  const [bioType, setBioType] = useState<'face-id' | 'fingerprint' | 'generic'>('fingerprint');

  // Mounted state for SSR hydration safety
  const mounted = useIsClient();

  useEffect(() => {
    const bio = getRegisteredBiometric();
    setEnrolledBio(bio);
    setBioType(detectBiometricType());
  }, []);

  // Custom logo from localStorage with fallback to official BYT logomark
  const [customLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('byt-custom-logo');
        if (saved && (saved.startsWith('/') || saved.startsWith('http') || saved.startsWith('data:'))) {
          return saved;
        }
      } catch {}
    }
    return '/byt-logomark.svg';
  });

  const selectRole = (newRole: 'admin' | 'driver') => {
    setRole(newRole);
    setError('');
    if (newRole === 'admin') {
      setEmail('admin@byt.com');
      setPassword('admin123');
    } else {
      setEmail('kwame@gmail.com');
      setPassword('driver123');
    }
  };

  const handleBiometricSuccess = (user: EnrolledBiometricUser) => {
    if (user.role === 'admin') {
      localStorage.setItem('byt-role', 'admin');
      localStorage.setItem('byt-user', JSON.stringify({ name: user.name || 'Emma', phone: '0208713722', email: user.email, role: 'admin' }));
      router.push('/admin');
    } else {
      localStorage.setItem('byt-role', 'driver');
      localStorage.setItem('byt-user', JSON.stringify({ id: user.driverId || '1', name: user.name, email: user.email, role: 'driver' }));
      router.push('/driver');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(async () => {
      if (role === 'admin' && email === 'admin@byt.com' && password === 'admin123') {
        localStorage.setItem('byt-role', 'admin');
        localStorage.setItem('byt-user', JSON.stringify({ name: 'Emma', phone: '0208713722', email: 'admin@byt.com', role: 'admin' }));

        if (enableBioCheckbox) {
          await registerBiometric({
            role: 'admin',
            email: 'admin@byt.com',
            name: 'Emma',
          });
        }
        router.push('/admin');
      } else if (role === 'driver') {
        localStorage.setItem('byt-role', 'driver');
        localStorage.setItem('byt-user', JSON.stringify({ id: '1', name: 'Kwame Asante', email, role: 'driver' }));

        if (enableBioCheckbox) {
          await registerBiometric({
            role: 'driver',
            email,
            name: 'Kwame Asante',
            driverId: '1',
          });
        }
        router.push('/driver');
      } else {
        setError('Invalid credentials. Please verify your email and password.');
      }
      setLoading(false);
    }, 600);
  };

  const isFace = bioType === 'face-id';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem',
        background: '#f8fafc',
        fontFamily: 'var(--font-sans)',
        color: '#0f172a',
        position: 'relative',
      }}
    >
      {/* Background Architectural Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* BRAND IDENTITY - Calm & Confident */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
            suppressHydrationWarning
          >
            {mounted ? (
              <img
                src={customLogo || '/byt-logomark.svg'}
                alt="BYT Fleet Management Logomark"
                style={{
                  height: 62,
                  maxWidth: 220,
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'drop-shadow(0 4px 12px rgba(23, 234, 217, 0.25))',
                }}
              />
            ) : (
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0891b2, #1e3a8a)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '0.05em',
                  boxShadow: '0 2px 8px rgba(8, 145, 178, 0.2)',
                }}
              >
                BYT
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#64748b',
              marginBottom: '0.35rem',
            }}
          >
            Fleet Operating System
          </div>

          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            Sign in to your account
          </h1>
        </div>

        {/* PRIMARY CARD CONTAINER - Crisp Border Elevation */}
        <div
          className="login-card-container"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2.25rem 2rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 20px -4px rgba(15, 23, 42, 0.04)',
          }}
        >
          {/* SEGMENTED ROLE TOGGLE */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '3px',
              marginBottom: '1.75rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => selectRole('admin')}
              style={{
                padding: '0.6rem',
                border: 'none',
                borderRadius: '8px',
                background: role === 'admin' ? '#ffffff' : 'transparent',
                color: role === 'admin' ? '#0f172a' : '#64748b',
                fontWeight: role === 'admin' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 120ms ease-in-out',
                boxShadow: role === 'admin' ? '0 1px 2px rgba(15, 23, 42, 0.08)' : 'none',
              }}
            >
              Administrator
            </button>
            <button
              type="button"
              onClick={() => selectRole('driver')}
              style={{
                padding: '0.6rem',
                border: 'none',
                borderRadius: '8px',
                background: role === 'driver' ? '#ffffff' : 'transparent',
                color: role === 'driver' ? '#0f172a' : '#64748b',
                fontWeight: role === 'driver' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 120ms ease-in-out',
                boxShadow: role === 'driver' ? '0 1px 2px rgba(15, 23, 42, 0.08)' : 'none',
              }}
            >
              Driver Partner
            </button>
          </div>

          {/* 1-TAP BIOMETRIC QUICK ACTION (Calm, Confident, Streamlined) */}
          <div style={{ marginBottom: '1.75rem' }}>
            {enrolledBio ? (
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.9rem 1rem',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'background 100ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
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
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {enrolledBio.biometricType === 'face-id' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                        <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                        <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
                        <circle cx="9" cy="10" r="1" fill="currentColor" />
                        <circle cx="15" cy="10" r="1" fill="currentColor" />
                        <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 11c0 3.5-1.5 6-3 7" />
                        <path d="M12 7c2.5 0 4.5 2 4.5 4.5 0 2-1 3.5-2 5.5" />
                        <path d="M8 14.5c.5 2 1.5 3.5 2.5 4.5" />
                        <path d="M16 9.5c0-.5 0-1-.5-1.5-1-1.5-2.5-2-4.5-2-2.5 0-4.5 1.5-5 3.5" />
                      </svg>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {enrolledBio.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {enrolledBio.biometricType === 'face-id' ? 'Face ID' : 'Touch ID'} • Device Verified
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBiometricModalMode('login');
                    setShowBiometricModal(true);
                  }}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 100ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Unlock
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setBiometricModalMode('login');
                  setShowBiometricModal(true);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 100ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0891b2';
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                {isFace ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                    <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                    <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
                    <circle cx="9" cy="10" r="1" fill="currentColor" />
                    <circle cx="15" cy="10" r="1" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 11c0 3.5-1.5 6-3 7" />
                    <path d="M12 7c2.5 0 4.5 2 4.5 4.5 0 2-1 3.5-2 5.5" />
                    <path d="M8 14.5c.5 2 1.5 3.5 2.5 4.5" />
                  </svg>
                )}
                <span>Sign in with {isFace ? 'Face ID' : 'Touch ID'}</span>
              </button>
            )}
          </div>

          {/* SECTION DIVIDER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span
              style={{
                padding: '0 12px',
                fontSize: '0.68rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#94a3b8',
              }}
            >
              or email and password
            </span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          {/* CREDENTIALS FORM */}
          <form onSubmit={handleLogin}>
            {/* EMAIL INPUT */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#64748b',
                  marginBottom: '0.45rem',
                }}
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder={role === 'admin' ? 'admin@byt.com' : 'driver@gmail.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  outline: 'none',
                  transition: 'border-color 150ms ease, box-shadow 150ms ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#0891b2';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(8, 145, 178, 0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.45rem',
                }}
              >
                <label
                  htmlFor="login-password"
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#64748b',
                    margin: 0,
                  }}
                >
                  Password
                </label>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'border-color 150ms ease, box-shadow 150ms ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0891b2';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(8, 145, 178, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* BIOMETRIC REMEMBER CHECKBOX */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1.5rem',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => setEnableBioCheckbox(!enableBioCheckbox)}
            >
              <input
                type="checkbox"
                checked={enableBioCheckbox}
                onChange={(e) => setEnableBioCheckbox(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: '#0891b2', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                Remember device with {isFace ? 'Face ID' : 'Touch ID'}
              </span>
            </div>

            {/* ERROR BANNER */}
            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  color: '#dc2626',
                  fontSize: '0.8rem',
                  marginBottom: '1.25rem',
                  lineHeight: 1.4,
                }}
              >
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON WITH SKELETON TRANSITION */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? '#0e7490' : '#0891b2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 100ms ease, transform 100ms ease',
                boxShadow: '0 1px 2px rgba(8, 145, 178, 0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#0e7490';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#0891b2';
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#ffffff',
                      animation: 'spinLoader 0.7s linear infinite',
                    }}
                  />
                  Authenticating...
                </span>
              ) : (
                `Sign in as ${role === 'admin' ? 'Administrator' : 'Driver'}`
              )}
            </button>
          </form>

          {/* FORGOT PASSWORD LINK */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {/* FOOTER LINK */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <a
            href="/apply"
            style={{
              fontSize: '0.82rem',
              color: '#64748b',
              textDecoration: 'none',
              transition: 'color 100ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0891b2')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            Apply to join as a driver partner →
          </a>
        </div>
      </div>

      {/* BIOMETRIC AUTHENTICATION & ENROLLMENT MODAL */}
      <BiometricModal
        isOpen={showBiometricModal}
        onClose={() => {
          setShowBiometricModal(false);
          setEnrolledBio(getRegisteredBiometric());
        }}
        mode={biometricModalMode}
        userToEnroll={{
          role,
          email,
          name: role === 'admin' ? 'Emma' : 'Kwame Asante',
          driverId: role === 'driver' ? '1' : undefined,
        }}
        onSuccess={(user) => {
          setEnrolledBio(user);
          handleBiometricSuccess(user);
        }}
      />

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowForgotModal(false)}
          style={{
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="modal"
            style={{
              maxWidth: 420,
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Reset Password
              </h3>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => setShowForgotModal(false)}
                style={{ padding: '4px', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              For enterprise security, password resets are handled through the BYT fleet dispatch desk.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  padding: '12px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>📞</span>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dispatch Desk (Emma)</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>020-871-3722</div>
                </div>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>✉️</span>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct Support</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>admin@byt.com</div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{
                width: '100%',
                background: '#0f172a',
                color: '#ffffff',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 600,
              }}
              onClick={() => setShowForgotModal(false)}
            >
              Return to login
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
