'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // On desktop: whether sidebar is open (true) or closed (false)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Top Header / App Bar */}
      <header className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          {/* Main Open/Close Toggle Button */}
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => {
              if (window.innerWidth <= 1024) {
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


          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="logo-text-gold">BYT</span>
            <span className="topbar-title">Fleet Command</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div className="status-badge-active">
            <span className="pulse-dot" />
            <span className="status-text">Fleet Active</span>
          </div>

          <Link href="/" className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            🚪 Sign Out
          </Link>
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
            <div className="logo">BYT</div>
            <div>
              <h1>BYT Fleet</h1>
              <div className="motto">Your Fleet. Your Control.</div>
            </div>
          </div>

          {/* Close button inside sidebar header */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => {
              if (window.innerWidth <= 1024) {
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

        <nav className="sidebar-nav">
          {navItems.map((item, i) => {
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
          <Link href="/" className="nav-item" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', padding: 0 }}>
            <span style={{ fontSize: '1rem' }}>🚪</span>
            <span>Sign Out</span>
          </Link>

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

      <style jsx global>{`
        /* TOPBAR */
        .admin-topbar {
          position: sticky;
          top: 0;
          height: 56px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(16px);
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
          transform: scale(1.04);
        }

        .sidebar-toggle-text-btn {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          font-size: 0.78rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-toggle-text-btn:hover {
          background: var(--color-bg-card);
          color: var(--color-text);
          border-color: var(--byt-gold);
        }

        .logo-text-gold {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--byt-gold);
          letter-spacing: 0.05em;
        }

        .topbar-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .status-badge-active {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          padding: 3px 10px;
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
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        }

        /* SIDEBAR DESKTOP BEHAVIOR */
        .sidebar {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
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

          .sidebar-toggle-text-btn {
            display: none;
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
