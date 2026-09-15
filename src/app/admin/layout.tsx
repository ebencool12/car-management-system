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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <div className="mobile-header" style={{ display: 'none' }} id="admin-mobile-header">
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="logo-sm">BYT</div>
        <div style={{ width: 40 }} />
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 45 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo">BYT</div>
          <div>
            <h1>BYT Fleet</h1>
            <div className="motto">Your Fleet. Your Control.</div>
          </div>
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
                onClick={() => setSidebarOpen(false)}
              >
                <span style={{ fontSize: '1.1rem', width: 24, textAlign: 'center' }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="nav-item" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            <span style={{ fontSize: '1rem' }}>🚪</span>
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {children}
      </main>

      <style jsx global>{`
        @media (max-width: 1024px) {
          #admin-mobile-header {
            display: flex !important;
          }
          .main-content {
            padding-top: calc(var(--header-height) + var(--space-lg)) !important;
          }
        }
      `}</style>
    </>
  );
}
