'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import BiometricModal from '@/components/BiometricModal';
import IncomingCallModal from '@/components/IncomingCallModal';
import { getRegisteredBiometric, EnrolledBiometricUser } from '@/lib/biometrics';
import { getUnreadMessageCount, subscribeToChatMessages } from '@/lib/communication';

const navItems = [
  { label: 'Home', href: '/driver', icon: '🏠' },
  { label: 'Map', href: '/driver/map', icon: '📍' },
  { label: 'Reports', href: '/driver/reports', icon: '📝' },
  { label: 'Sales', href: '/driver/sales', icon: '💰' },
  { label: 'Parts', href: '/driver/parts', icon: '🔧' },
  { label: 'Chat', href: '/driver/chat', icon: '💬' },
];

export default function DriverLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [immersive, setImmersive] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [enrolledBio, setEnrolledBio] = useState<EnrolledBiometricUser | null>(null);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [driverUser, setDriverUser] = useState<{ id: string; name: string }>({ id: '1', name: 'Kwame Asante' });

  useEffect(() => {
    setEnrolledBio(getRegisteredBiometric());

    let currentDriverId = '1';
    let currentDriverName = 'Kwame Asante';
    try {
      const u = localStorage.getItem('byt-user');
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.id) currentDriverId = String(parsed.id);
        if (parsed.name) currentDriverName = parsed.name;
      }
    } catch {}
    setDriverUser({ id: currentDriverId, name: currentDriverName });

    const updateUnread = () => setUnreadChatCount(getUnreadMessageCount(currentDriverId));
    updateUnread();
    const unsubscribe = subscribeToChatMessages(updateUnread);
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('byt-role');
      localStorage.removeItem('byt-user');
    } catch {}
    router.push('/');
  };

  // Escape key exits optional immersive mode
  useEffect(() => {
    if (!immersive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImmersive(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [immersive]);

  return (
    <div className={`driver-layout ${immersive ? 'chat-immersive' : ''}`}>
      {/* Floating Exit Button when optional immersive mode is active */}
      {immersive && (
        <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 9999 }}>
          <button
            type="button"
            onClick={() => setImmersive(false)}
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '24px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span>✕</span>
            <span>Exit Focus Mode (Esc)</span>
          </button>
        </div>
      )}

      {/* Mobile Header */}
      <div className="mobile-header" style={{
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <img
            src="/byt-logo.png"
            alt="BYT Fleet"
            style={{ height: 32, maxWidth: 120, objectFit: 'contain' }}
          />
          <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border)', paddingLeft: '8px', fontWeight: 600 }}>Driver Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Biometrics Management Button */}
          <button
            type="button"
            onClick={() => setShowBiometricModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: enrolledBio ? 'var(--byt-sea-dark)' : 'var(--color-text)',
              background: enrolledBio ? 'rgba(8, 145, 178, 0.1)' : 'var(--color-bg-input)',
              border: enrolledBio ? '1px solid var(--byt-sea)' : '1px solid var(--color-border)',
              padding: '5px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
            title={enrolledBio ? "Biometric login active on this device" : "Enable Face ID / Fingerprint on this device"}
          >
            <span>{enrolledBio?.biometricType === 'face-id' ? '👤' : '🫆'}</span>
            <span style={{ fontSize: '0.72rem' }}>{enrolledBio ? 'Touch/Face' : 'Biometrics'}</span>
          </button>

          {/* Optional Focus / Fullscreen Mode Toggle */}
          <button
            type="button"
            onClick={() => setImmersive(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: immersive ? 'var(--byt-gold)' : 'var(--color-text)',
              background: 'var(--color-bg-input)',
              border: '1px solid var(--color-border)',
              padding: '5px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
            title={immersive ? "Exit Focus Mode" : "Optional Fullscreen Focus Mode"}
          >
            <span>{immersive ? '🗗' : '⛶'}</span>
            <span>{immersive ? 'Exit' : 'Focus'}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#dc2626',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.28)',
              padding: '5px 9px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Logout of Driver Portal and return to login"
          >
            <span style={{ fontSize: '0.82rem' }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: immersive ? '0' : 'var(--space-lg)', maxWidth: immersive ? '100%' : 640, margin: '0 auto' }}>
        {children}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav" style={{
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}>
        {navItems.map(item => {
          const isActive = item.href === '/driver'
            ? pathname === '/driver'
            : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className={isActive ? 'active' : ''} style={{ position: 'relative' }}>
              <span className="nav-icon" style={{ fontSize: '1.25rem', position: 'relative' }}>
                {item.icon}
                {item.href === '/driver/chat' && unreadChatCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -10,
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      width: 17,
                      height: 17,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--color-bg-surface)',
                    }}
                  >
                    {unreadChatCount}
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Global In-App Free Call Receiver */}
      <IncomingCallModal currentUserId={driverUser.id} currentUserName={driverUser.name} />

      {/* Biometric Management Modal */}
      <BiometricModal
        isOpen={showBiometricModal}
        onClose={() => {
          setShowBiometricModal(false);
          setEnrolledBio(getRegisteredBiometric());
        }}
        mode={enrolledBio ? 'manage' : 'enroll'}
        userToEnroll={{
          role: 'driver',
          email: `${driverUser.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          name: driverUser.name,
          driverId: driverUser.id,
        }}
        onSuccess={(user) => {
          setEnrolledBio(user);
        }}
      />
    </div>
  );
}
