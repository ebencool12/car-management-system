'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/demo-data';

export default function DriverHome() {
  const driver = { name: 'Kwame Asante', balance: 150.50 };
  const vehicle = { plateNumber: 'GR-1234-22', make: 'Toyota', model: 'Corolla', year: 2019, severityStatus: 'GREEN' };

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
          Hello, <span className="text-gradient">{driver.name}</span> 👋
        </h1>
        <p className="text-sm text-muted">Here&apos;s your overview for today</p>
      </div>

      {/* Vehicle Card */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="text-xs text-muted" style={{ marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Vehicle</div>
              <div className="font-mono font-bold" style={{ fontSize: '1.3rem' }}>{vehicle.plateNumber}</div>
              <div className="text-sm text-muted">{vehicle.make} {vehicle.model} • {vehicle.year}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                background: vehicle.severityStatus === 'GREEN' ? 'var(--color-green)' : vehicle.severityStatus === 'YELLOW' ? 'var(--color-yellow)' : 'var(--color-red)',
              }} />
              <span className={`badge badge-${vehicle.severityStatus === 'GREEN' ? 'green' : vehicle.severityStatus === 'YELLOW' ? 'yellow' : 'red'}`}>
                {vehicle.severityStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="card animate-in animate-delay-1" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <div className="text-xs text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-sm)' }}>Your Balance</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: driver.balance > 0 ? 'var(--color-red)' : driver.balance < 0 ? 'var(--byt-gold)' : 'var(--color-green)' }}>
            {formatCurrency(driver.balance)}
          </div>
          <div className="text-sm" style={{ marginTop: '4px', color: driver.balance > 0 ? 'var(--color-red)' : 'var(--color-green)' }}>
            {driver.balance > 0 ? 'You owe BYT' : driver.balance < 0 ? 'BYT owes you' : 'Settled'}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid-2 animate-in animate-delay-2">
        <Link href="/driver/reports" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center' }}>
            <div className="card-body" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📝</div>
              <div className="font-semibold text-sm">Submit Report</div>
              <div className="text-xs text-muted" style={{ marginTop: '2px' }}>Vehicle issue or absence</div>
            </div>
          </div>
        </Link>

        <Link href="/driver/sales" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center' }}>
            <div className="card-body" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>💰</div>
              <div className="font-semibold text-sm">Submit Sales</div>
              <div className="text-xs text-muted" style={{ marginTop: '2px' }}>Weekly sales payment</div>
            </div>
          </div>
        </Link>

        <Link href="/driver/parts" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center' }}>
            <div className="card-body" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🔧</div>
              <div className="font-semibold text-sm">Log Part</div>
              <div className="text-xs text-muted" style={{ marginTop: '2px' }}>Record parts exchange</div>
            </div>
          </div>
        </Link>

        <Link href="/driver/chat" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center' }}>
            <div className="card-body" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>💬</div>
              <div className="font-semibold text-sm">Chat</div>
              <div className="text-xs text-muted" style={{ marginTop: '2px' }}>Message other drivers</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
