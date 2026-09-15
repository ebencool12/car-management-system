'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const navItems = [
  { label: 'Home', href: '/driver', icon: '🏠' },
  { label: 'Reports', href: '/driver/reports', icon: '📝' },
  { label: 'Sales', href: '/driver/sales', icon: '💰' },
  { label: 'Parts', href: '/driver/parts', icon: '🔧' },
  { label: 'Chat', href: '/driver/chat', icon: '💬' },
];

export default function DriverLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="driver-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div className="logo-sm">BYT</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>BYT Fleet</div>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Driver Portal</div>
          </div>
        </div>
        <Link href="/" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Sign Out
        </Link>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-lg)', maxWidth: 640, margin: '0 auto' }}>
        {children}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {navItems.map(item => {
          const isActive = item.href === '/driver'
            ? pathname === '/driver'
            : pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href} className={isActive ? 'active' : ''}>
              <span className="nav-icon" style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
