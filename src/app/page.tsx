'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'admin' | 'driver'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">BYT</div>
          <h1>BYT Fleet Management</h1>
          <p className="motto">Your Fleet. Your Control. Your Trust.</p>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 'var(--space-xl)' }}>
            {/* Role Toggle */}
            <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px', marginBottom: 'var(--space-xl)' }}>
              <button
                type="button"
                onClick={() => setRole('admin')}
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
                onClick={() => setRole('driver')}
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
                <label className="form-label" htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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

        {/* Demo credentials hint */}
        <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <p>Demo: admin@byt.com / admin123</p>
          <p style={{ marginTop: '4px' }}>Driver: any email / any password</p>
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
