/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { section: 'MANAGEMENT' },
  { label: 'Drivers', href: '/admin/drivers', icon: '👥', badge: 2 },
  { label: 'Fleet', href: '/admin/fleet', icon: '🚗' },
  { label: 'Applications', href: '/admin/applications', icon: '📋', badge: 2 },
  { section: 'OPERATIONS' },
  { label: 'Reports', href: '/admin/reports', icon: '📝', badge: 3 },
  { label: 'Parts Exchange', href: '/admin/parts', icon: '🔧' },
  { label: 'Sales & Balances', href: '/admin/sales', icon: '💰' },
  { section: 'MONITORING' },
  { label: 'GPS Map', href: '/admin/gps', icon: '📍' },
  { label: 'Financials', href: '/admin/financials', icon: '📈' },
];

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'REPORT' | 'MESSAGE' | 'SALES' | 'APP';
  unread: boolean;
  link: string;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  // Logo Customization State
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('byt-custom-logo');
      } catch {}
    }
    return null;
  });
  const [logoInputUrl, setLogoInputUrl] = useState('');
  const [logoText, setLogoText] = useState('BYT');

  // Notifications State & Live Toast
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: '🚨 Emergency Vehicle Report',
      desc: 'Kwame Asante reported low tire pressure on Toyota Corolla (GR-1234-22)',
      time: 'Just now',
      type: 'REPORT',
      unread: true,
      link: '/admin/reports'
    },
    {
      id: 'n2',
      title: '💬 Driver Message',
      desc: 'Ama Mensah: "Good morning admin, heading to Kokomlemle for morning shift."',
      time: '12m ago',
      type: 'MESSAGE',
      unread: true,
      link: '/admin/drivers'
    },
    {
      id: 'n3',
      title: '💰 Weekly Sales Submitted',
      desc: 'Kwame Asante submitted GHS 520.00 via MTN MoMo',
      time: '45m ago',
      type: 'SALES',
      unread: false,
      link: '/admin/sales'
    },
  ]);

  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('byt-role');
      localStorage.removeItem('byt-user');
    } catch {}
    router.push('/');
  };

  const handleSaveLogo = (logoValue: string) => {
    setCustomLogo(logoValue);
    try {
      localStorage.setItem('byt-custom-logo', logoValue);
    } catch {}
    setShowLogoModal(false);
  };

  const handleResetLogo = () => {
    setCustomLogo(null);
    try {
      localStorage.removeItem('byt-custom-logo');
    } catch {}
    setShowLogoModal(false);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleSaveLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredNav = quickSearch.trim()
    ? navItems.filter((item): item is { label: string; href: string; icon: string; badge?: number } =>
        'label' in item && typeof item.label === 'string' && item.label.toLowerCase().includes(quickSearch.toLowerCase())
      )
    : navItems;

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* FLOATING LIVE TOAST NOTIFICATION FOR DRIVER MESSAGES/REPORTS */}
      {activeToast && (
        <div
          style={{
            position: 'fixed',
            top: 72,
            right: 24,
            zIndex: 9999,
            background: 'rgba(10, 22, 40, 0.95)',
            backdropFilter: 'blur(20px)',
            border: activeToast.type === 'REPORT' ? '1px solid #ef4444' : '1px solid var(--byt-gold)',
            boxShadow: '0 16px 36px rgba(0,0,0,0.6), 0 0 25px rgba(212, 168, 67, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-md)',
            maxWidth: 360,
            animation: 'fadeInUp 0.3s ease-out',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: activeToast.type === 'REPORT' ? '#ef4444' : 'var(--byt-gold)' }}>
              {activeToast.title}
            </span>
            <button
              type="button"
              onClick={() => setActiveToast(null)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✕
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text)', lineHeight: 1.4 }}>
            {activeToast.desc}
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '4px' }}>
            <Link
              href={activeToast.link}
              onClick={() => setActiveToast(null)}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.72rem', padding: '3px 10px' }}
            >
              View Now →
            </Link>
          </div>
        </div>
      )}

      {/* Top Header / App Bar */}
      <header className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          {/* Main Open/Close Toggle Button */}
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
                setMobileDrawerOpen(prev => !prev);
              } else {
                toggleSidebar();
              }
            }}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            title={sidebarOpen ? 'Click to close sidebar' : 'Click to open sidebar'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Logo with interactive click to change */}
          <button
            type="button"
            onClick={() => setShowLogoModal(true)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: 0
            }}
            title="Click to customize brand logo"
          >
            {customLogo && (customLogo.startsWith('data:') || customLogo.startsWith('http')) ? (
              <img
                src={customLogo}
                alt="Brand Logo"
                style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
              />
            ) : (
              <span className="logo-text-gold">{customLogo || 'BYT'}</span>
            )}
            <span className="topbar-title">Fleet Command</span>
          </button>
        </div>

        {/* Center/Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          {/* Active Fleet Indicator */}
          <div className="status-badge-active">
            <span className="pulse-dot" />
            <span className="status-text">Fleet Active • 8 Online</span>
          </div>

          {/* Interactive Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              onClick={() => setShowNotifications(prev => !prev)}
              style={{
                position: 'relative',
                background: showNotifications ? 'var(--color-bg-card-hover)' : 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Fleet Notifications"
            >
              <span style={{ fontSize: '1.05rem' }}>🔔</span>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'var(--color-red)',
                  color: 'white',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: 340,
                  background: 'rgba(10, 22, 40, 0.96)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.6), 0 0 20px rgba(212, 168, 67, 0.15)',
                  zIndex: 100,
                  padding: 'var(--space-md)',
                  animation: 'fadeInUp 0.2s ease-out'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-xs)' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Driver Messages & Reports</span>
                  <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{unreadCount} Unread</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <Link
                      key={n.id}
                      href={n.link}
                      onClick={() => {
                        setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x));
                        setShowNotifications(false);
                      }}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        background: n.unread ? 'rgba(212, 168, 67, 0.08)' : 'transparent',
                        border: n.unread ? '1px solid rgba(212, 168, 67, 0.2)' : '1px solid transparent',
                        fontSize: '0.78rem',
                        textDecoration: 'none',
                        display: 'block'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--color-text)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{n.title}</span>
                        <span className="text-muted" style={{ fontSize: '0.68rem' }}>{n.time}</span>
                      </div>
                      <div className="text-muted" style={{ marginTop: '2px', lineHeight: 1.4 }}>{n.desc}</div>
                    </Link>
                  ))}
                </div>
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '6px' }}>
                  <Link
                    href="/admin/reports"
                    onClick={() => setShowNotifications(false)}
                    style={{ fontSize: '0.75rem', color: 'var(--byt-gold)' }}
                  >
                    All Reports →
                  </Link>
                  <Link
                    href="/admin/drivers"
                    onClick={() => setShowNotifications(false)}
                    style={{ fontSize: '0.75rem', color: 'var(--byt-gold)' }}
                  >
                    Driver Chats →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            padding: '3px 10px 3px 6px',
            borderRadius: 'var(--radius-full)'
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--byt-gold), var(--byt-gold-dark))',
              color: '#0a1628',
              fontWeight: 800,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              BA
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>BYT Admin</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--byt-gold)' }}>Fleet Owner</div>
            </div>
          </div>

          {/* Reliable Sign Out with full redirect to / */}
          <button
            type="button"
            onClick={handleSignOut}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            title="Sign out and return to login page"
          >
            🚪 Sign Out
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'desktop-open' : 'desktop-closed'} ${mobileDrawerOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            {customLogo && (customLogo.startsWith('data:') || customLogo.startsWith('http')) ? (
              <img
                src={customLogo}
                alt="Logo"
                style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
              />
            ) : (
              <div className="logo">{customLogo || 'BYT'}</div>
            )}
            <div>
              <h1 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>BYT Fleet</span>
                <button
                  type="button"
                  onClick={() => setShowLogoModal(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--byt-gold)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
                  title="Change brand logo"
                >
                  ✏️
                </button>
              </h1>
              <div className="motto">Your Fleet. Your Control.</div>
            </div>
          </div>

          {/* Close button inside sidebar header */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
                setMobileDrawerOpen(false);
              } else {
                toggleSidebar();
              }
            }}
            title="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Quick Menu Filter */}
        <div style={{ padding: '8px 12px 2px' }}>
          <input
            type="text"
            placeholder="🔍 Quick filter menu..."
            value={quickSearch}
            onChange={e => setQuickSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px',
              fontSize: '0.75rem',
              background: 'var(--color-bg-input)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)'
            }}
          />
        </div>

        <nav className="sidebar-nav">
          {filteredNav.map((item, i) => {
            if ('section' in item) {
              return <div key={i} className="nav-section-label">{item.section}</div>;
            }

            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href!);

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={isActive ? 'active' : ''}
                onClick={() => setMobileDrawerOpen(false)}
              >
                <span style={{ fontSize: '1.1rem', width: 24, textAlign: 'center' }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            onClick={handleSignOut}
            className="nav-item"
            style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '1rem' }}>🚪</span>
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={toggleSidebar}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.72rem', color: 'var(--byt-gold)' }}
          >
            ◀ Close
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>

      {/* CHANGE LOGO MODAL */}
      {showLogoModal && (
        <div className="modal-overlay" onClick={() => setShowLogoModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Brand Logo Settings</h3>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowLogoModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Current Logo Preview:</div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 24px',
                  background: 'var(--color-bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}>
                  {customLogo && (customLogo.startsWith('data:') || customLogo.startsWith('http')) ? (
                    <img src={customLogo} alt="Preview" style={{ height: 48, objectFit: 'contain' }} />
                  ) : (
                    <span className="logo-text-gold" style={{ fontSize: '1.5rem', fontWeight: 900 }}>
                      {customLogo || 'BYT'}
                    </span>
                  )}
                </div>
              </div>

              {/* Option 1: File Upload */}
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Upload Logo Image from Computer</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileUpload}
                  className="form-input"
                  style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                />
                <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                  Supports PNG, JPG, or SVG (transparent background recommended).
                </div>
              </div>

              {/* Option 2: Image URL */}
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Or Paste Logo Image URL</label>
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://example.com/logo.png"
                    value={logoInputUrl}
                    onChange={e => setLogoInputUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (logoInputUrl.trim()) {
                        handleSaveLogo(logoInputUrl.trim());
                      }
                    }}
                  >
                    Save URL
                  </button>
                </div>
              </div>

              {/* Option 3: Custom Text Logo */}
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Or Set Brand Initials / Text</label>
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <input
                    type="text"
                    maxLength={10}
                    className="form-input"
                    placeholder="e.g. BYT or ACCRA"
                    value={logoText}
                    onChange={e => setLogoText(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      if (logoText.trim()) {
                        handleSaveLogo(logoText.trim().toUpperCase());
                      }
                    }}
                  >
                    Set Text
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleResetLogo}
                style={{ color: 'var(--color-red)' }}
              >
                Reset to Default Logo
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowLogoModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* TOPBAR */
        .admin-topbar {
          position: sticky;
          top: 0;
          height: 60px;
          background: rgba(10, 22, 40, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-border);
          padding: 0 var(--space-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 40;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .admin-shell.sidebar-open .admin-topbar {
          margin-left: var(--sidebar-width);
        }

        .admin-shell.sidebar-closed .admin-topbar {
          margin-left: 0;
        }

        .sidebar-toggle-btn {
          width: 38px;
          height: 38px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--byt-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-toggle-btn:hover {
          background: var(--color-bg-card-hover);
          border-color: var(--byt-gold);
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(212, 168, 67, 0.3);
        }

        .logo-text-gold {
          font-weight: 900;
          font-size: 1.05rem;
          background: linear-gradient(135deg, var(--byt-gold), var(--byt-gold-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.05em;
        }

        .topbar-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-text-secondary);
        }

        .status-badge-active {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          color: #10b981;
          font-weight: 600;
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          display: inline-block;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
          animation: pulse-green 2s infinite ease-in-out;
        }

        /* SIDEBAR DESKTOP BEHAVIOR */
        .sidebar {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar.desktop-open {
          transform: translateX(0);
        }

        .sidebar.desktop-closed {
          transform: translateX(-100%);
        }

        .sidebar-brand {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-close-btn {
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          font-size: 1.1rem;
          padding: 6px;
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: color 0.2s ease, background 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-close-btn:hover {
          color: var(--color-text);
          background: var(--color-bg-card);
        }

        .sidebar-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* MAIN CONTENT MARGIN TRANSITION */
        .admin-shell.sidebar-open .main-content {
          margin-left: var(--sidebar-width);
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .admin-shell.sidebar-closed .main-content {
          margin-left: 0;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* MOBILE OVERLAY */
        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          z-index: 95;
        }

        @media (max-width: 1024px) {
          .admin-topbar {
            margin-left: 0 !important;
            padding: 0 var(--space-md);
          }

          .sidebar {
            z-index: 100 !important;
            transform: translateX(-100%) !important;
          }

          .sidebar.mobile-open {
            transform: translateX(0) !important;
          }

          .main-content {
            margin-left: 0 !important;
            padding: var(--space-md) !important;
          }
        }
      `}</style>
    </div>
  );
}
