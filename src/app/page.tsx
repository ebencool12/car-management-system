/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'admin' | 'driver'>('admin');
  const [email, setEmail] = useState('admin@byt.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mouse position tracking for faint army green glowing ambient halo
  const [mousePos, setMousePos] = useState({ x: 600, y: 350 });

  // Custom logo from localStorage
  const [customLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('byt-custom-logo');
      } catch {}
    }
    return null;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo login — in production this would call NextAuth
    setTimeout(() => {
      if (role === 'admin' && email === 'admin@byt.com' && password === 'admin123') {
        localStorage.setItem('byt-role', 'admin');
        localStorage.setItem('byt-user', JSON.stringify({ name: 'BYT Admin', email: 'admin@byt.com', role: 'admin' }));
        router.push('/admin');
      } else if (role === 'driver') {
        localStorage.setItem('byt-role', 'driver');
        localStorage.setItem('byt-user', JSON.stringify({ id: '1', name: 'Kwame Asante', email, role: 'driver' }));
        router.push('/driver');
      } else {
        setError('Invalid credentials. Try admin@byt.com / admin123');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div
      className="login-page"
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* WIDE GLOWING FAINT ARMY GREEN MOUSE-FOLLOWING HALO */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `radial-gradient(850px circle at ${mousePos.x}px ${mousePos.y}px, rgba(75, 95, 38, 0.32) 0%, rgba(65, 84, 30, 0.18) 35%, rgba(45, 60, 20, 0.08) 60%, transparent 80%)`,
          transition: 'background 0.05s ease-out'
        }}
      />

      {/* Floating secondary ambient particles */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `radial-gradient(1100px circle at ${mousePos.x * 0.9}px ${mousePos.y * 0.9}px, rgba(54, 75, 25, 0.15) 0%, transparent 70%)`
        }}
      />

      <div className="login-card" style={{ position: 'relative', zIndex: 1 }}>
        <div className="login-logo">
          {customLogo ? (
            customLogo.startsWith('data:') || customLogo.startsWith('http') ? (
              <img
                src={customLogo}
                alt="BYT Brand Logo"
                style={{
                  width: 72,
                  height: 72,
                  objectFit: 'contain',
                  margin: '0 auto var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 15px rgba(212, 168, 67, 0.4)'
                }}
              />
            ) : (
              <div className="logo-icon">{customLogo}</div>
            )
          ) : (
            <div className="logo-icon">BYT</div>
          )}
          <h1>BYT Fleet Management</h1>
          <p className="motto">Your Fleet. Your Control. Your Trust.</p>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 'var(--space-xl)' }}>
            {/* Role Toggle */}
            <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px', marginBottom: 'var(--space-xl)' }}>
              <button
                type="button"
                onClick={() => selectRole('admin')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: role === 'admin' ? 'linear-gradient(135deg, var(--byt-gold), var(--byt-gold-dark))' : 'transparent',
                  color: role === 'admin' ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => selectRole('driver')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: role === 'driver' ? 'linear-gradient(135deg, var(--byt-gold), var(--byt-gold-dark))' : 'transparent',
                  color: role === 'driver' ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                Driver
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label" htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  placeholder={role === 'admin' ? 'admin@byt.com' : 'driver@gmail.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                  <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (role === 'admin') {
                        setEmail('admin@byt.com');
                        setPassword('admin123');
                      } else {
                        setEmail('kwame@gmail.com');
                        setPassword('driver123');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--byt-gold)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    ⚡ Auto-fill {role === 'admin' ? 'Admin' : 'Driver'} Password
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: '2.5rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      padding: 0
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ color: 'var(--color-red)', fontSize: '0.8rem', marginBottom: 'var(--space-md)', padding: '0.5rem 0.75rem', background: 'var(--color-red-bg)', borderRadius: 'var(--radius-sm)' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  `Sign in as ${role === 'admin' ? 'Admin' : 'Driver'}`
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Forgot password?</a>
            </div>
          </div>
        </div>

        {/* Apply link */}
        <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
          <a href="/apply" style={{ fontSize: '0.85rem', color: 'var(--byt-gold)' }}>
            Want to drive for BYT? Apply here →
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
