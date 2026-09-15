'use client';

import { demoDrivers, demoVehicles, demoReports, demoSales, formatCurrency } from '@/lib/demo-data';

export default function AdminDashboard() {
  const activeDrivers = demoDrivers.filter(d => d.status === 'ACTIVE').length;
  const pendingApps = 2;
  const redVehicles = demoVehicles.filter(v => v.severityStatus === 'RED').length;
  const yellowVehicles = demoVehicles.filter(v => v.severityStatus === 'YELLOW').length;
  const greenVehicles = demoVehicles.filter(v => v.severityStatus === 'GREEN').length;
  const newReports = demoReports.filter(r => r.status === 'NEW').length;
  const pendingSales = demoSales.filter(s => s.confirmationStatus === 'PENDING').length;
  const totalRevenue = demoSales.filter(s => s.weekLabel === '2026-W38').reduce((sum, s) => sum + s.amount, 0);
  const totalOwed = demoDrivers.filter(d => d.balance > 0).reduce((sum, d) => sum + d.balance, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back, BYT Admin — here&apos;s your fleet overview</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', padding: '0.4rem 0.75rem', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            Week 38, 2026
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid animate-in">
        <div className="stat-card gold">
          <div className="stat-icon gold">👥</div>
          <div className="stat-number">{activeDrivers}</div>
          <div className="stat-title">Active Drivers</div>
          <div className="stat-change up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            +2 this month
          </div>
        </div>

        <div className="stat-card cyan">
          <div className="stat-icon cyan">🚗</div>
          <div className="stat-number">{demoVehicles.length}</div>
          <div className="stat-title">Total Vehicles</div>
          <div className="stat-change" style={{ color: 'var(--color-text-secondary)' }}>
            {greenVehicles} healthy
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon green">💰</div>
          <div className="stat-number">{formatCurrency(totalRevenue)}</div>
          <div className="stat-title">This Week&apos;s Sales</div>
          <div className="stat-change up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            +8.2%
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon purple">📋</div>
          <div className="stat-number">{pendingApps}</div>
          <div className="stat-title">Pending Applications</div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid-3" style={{ marginTop: 'var(--space-lg)' }}>
        {/* Fleet Health */}
        <div className="card animate-in animate-delay-1">
          <div className="card-header">
            <h3>Fleet Health</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-red)', boxShadow: '0 0 8px var(--color-red-glow)', animation: 'pulse-red 2s ease-in-out infinite' }} />
                  <span className="text-sm">Emergency</span>
                </div>
                <span className="font-bold text-red">{redVehicles}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-yellow)' }} />
                  <span className="text-sm">Needs Attention</span>
                </div>
                <span className="font-bold" style={{ color: 'var(--color-yellow)' }}>{yellowVehicles}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-green)' }} />
                  <span className="text-sm">Healthy</span>
                </div>
                <span className="font-bold text-green">{greenVehicles}</span>
              </div>

              {/* Visual bar */}
              <div style={{ display: 'flex', height: 8, borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: 'var(--space-sm)' }}>
                <div style={{ width: `${(redVehicles / demoVehicles.length) * 100}%`, background: 'var(--color-red)' }} />
                <div style={{ width: `${(yellowVehicles / demoVehicles.length) * 100}%`, background: 'var(--color-yellow)' }} />
                <div style={{ width: `${(greenVehicles / demoVehicles.length) * 100}%`, background: 'var(--color-green)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card animate-in animate-delay-2">
          <div className="card-header">
            <h3>Attention Required</h3>
            <span className="badge badge-red">{newReports + pendingSales}</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', background: 'var(--color-red-bg)' }}>
              <span style={{ fontSize: '1.2rem', marginTop: 2 }}>🔴</span>
              <div>
                <div className="text-sm font-semibold">Brake pads worn out</div>
                <div className="text-xs text-muted">Yaa Serwaa • GR-3456-20</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', background: 'var(--color-yellow-bg)' }}>
              <span style={{ fontSize: '1.2rem', marginTop: 2 }}>🟡</span>
              <div>
                <div className="text-sm font-semibold">Tire tread low</div>
                <div className="text-xs text-muted">Kwame Asante • GR-1234-22</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', background: 'var(--color-pending-bg)' }}>
              <span style={{ fontSize: '1.2rem', marginTop: 2 }}>💰</span>
              <div>
                <div className="text-sm font-semibold">{pendingSales} sales pending confirmation</div>
                <div className="text-xs text-muted">Week 38 submissions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="card animate-in animate-delay-3">
          <div className="card-header">
            <h3>Balance Overview</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ textAlign: 'center', padding: 'var(--space-md) 0' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Owed to BYT</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--byt-gold)', marginTop: 4 }}>{formatCurrency(totalOwed)}</div>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
                {demoDrivers.filter(d => d.balance > 0).slice(0, 3).map(d => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.85rem' }}>
                    <span className="text-muted">{d.name}</span>
                    <span className="text-red font-semibold">{formatCurrency(d.balance)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="card-header">
          <h3>Recent Reports</h3>
          <a href="/admin/reports" className="btn btn-ghost btn-sm">View All →</a>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {demoReports.slice(0, 4).map(report => (
                <tr key={report.id}>
                  <td>
                    <span className={`badge ${report.type === 'ISSUE' ? 'badge-red' : 'badge-cyan'}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="font-semibold">{report.driverName}</td>
                  <td><code className="font-mono text-xs" style={{ color: 'var(--color-text-secondary)' }}>{report.vehiclePlate || '—'}</code></td>
                  <td className="text-sm truncate" style={{ maxWidth: 240 }}>{report.description}</td>
                  <td>
                    {report.suggestedSeverity ? (
                      <span className={`badge badge-${report.suggestedSeverity === 'RED' ? 'red' : report.suggestedSeverity === 'YELLOW' ? 'yellow' : 'green'}`}>
                        {report.suggestedSeverity}
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <span className={`badge ${report.status === 'NEW' ? 'badge-purple' : report.status === 'ACKNOWLEDGED' ? 'badge-cyan' : 'badge-green'}`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
