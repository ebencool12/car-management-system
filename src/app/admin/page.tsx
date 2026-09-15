'use client';

import { useState } from 'react';
import Link from 'next/link';
import { demoDrivers, demoVehicles, demoReports, demoSales, formatCurrency } from '@/lib/demo-data';

export default function AdminDashboard() {
  const [selectedGpsVehicle, setSelectedGpsVehicle] = useState(demoVehicles[0]);
  const [reportFilter, setReportFilter] = useState<'ALL' | 'EMERGENCY' | 'UNRESOLVED'>('ALL');
  const [reports, setReports] = useState(demoReports);

  const activeDrivers = demoDrivers.filter(d => d.status === 'ACTIVE').length;
  const pendingApps = 2;
  const redVehicles = demoVehicles.filter(v => v.severityStatus === 'RED').length;
  const yellowVehicles = demoVehicles.filter(v => v.severityStatus === 'YELLOW').length;
  const greenVehicles = demoVehicles.filter(v => v.severityStatus === 'GREEN').length;
  const totalRevenue = demoSales.filter(s => s.weekLabel === '2026-W38').reduce((sum, s) => sum + s.amount, 0);
  const totalOwed = demoDrivers.filter(d => d.balance > 0).reduce((sum, d) => sum + d.balance, 0);

  const filteredReports = reports.filter(r => {
    if (reportFilter === 'EMERGENCY') return r.suggestedSeverity === 'RED';
    if (reportFilter === 'UNRESOLVED') return r.status !== 'RESOLVED';
    return true;
  });

  const handleAcknowledge = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'ACKNOWLEDGED' as const } : r));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      {/* Top Banner & Greetings */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(17, 29, 53, 0.9) 0%, rgba(10, 22, 40, 0.95) 100%)',
        border: '1px solid rgba(212, 168, 67, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-lg)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.2rem' }}>🇬🇭</span>
            <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>BYT HQ • ACCRA, GHANA</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
            Fleet Executive Command Center
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem', maxWidth: 600 }}>
            Real-time monitoring across your <strong>{demoVehicles.length} vehicles</strong>, <strong>{activeDrivers} active drivers</strong>, and weekly sales revenue.
          </p>
        </div>

        {/* Quick Actions Hub */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Link href="/admin/fleet" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            🚗 + Add Vehicle
          </Link>
          <Link href="/admin/sales" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            💳 Verify Sales
          </Link>
          <Link href="/admin/applications" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            📋 Applications ({pendingApps})
          </Link>
          <Link href="/admin/gps" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
            📍 Live GPS Radar
          </Link>
        </div>
      </div>

      {/* Interactive Stats Grid */}
      <div className="stats-grid animate-in">
        <Link href="/admin/drivers" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card gold" title="Click to view drivers">
            <div className="stat-icon gold">👥</div>
            <div className="stat-number">{activeDrivers}</div>
            <div className="stat-title">Active Drivers</div>
            <div className="stat-change up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
              <span>12 Total Roster • 100% Assigned</span>
            </div>
          </div>
        </Link>

        <Link href="/admin/fleet" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card cyan" title="Click to view fleet condition">
            <div className="stat-icon cyan">🚗</div>
            <div className="stat-number">{demoVehicles.length}</div>
            <div className="stat-title">Total Vehicles</div>
            <div className="stat-change" style={{ color: 'var(--color-green)' }}>
              <span>🟢 {greenVehicles} Healthy • 🟡 {yellowVehicles} Attention</span>
            </div>
          </div>
        </Link>

        <Link href="/admin/sales" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card green" title="Click to view sales and balances">
            <div className="stat-icon green">💰</div>
            <div className="stat-number" style={{ color: 'var(--color-green)' }}>{formatCurrency(totalRevenue)}</div>
            <div className="stat-title">Week 38 Revenue</div>
            <div className="stat-change up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
              <span>+8.4% vs prev week</span>
            </div>
          </div>
        </Link>

        <Link href="/admin/applications" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-card purple" title="Click to review applications">
            <div className="stat-icon purple">📋</div>
            <div className="stat-number" style={{ color: 'var(--color-pending)' }}>{pendingApps}</div>
            <div className="stat-title">Pending Applications</div>
            <div className="stat-change" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Awaiting Ghana Card & Selfie review</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Row 2: Fleet Health & Financial Ledger Alert */}
      <div className="grid-3">
        {/* Fleet Health Breakdown */}
        <div className="card animate-in animate-delay-1">
          <div className="card-header">
            <h3>🛡️ Fleet Condition Status</h3>
            <Link href="/admin/fleet" className="text-xs text-gold">View Fleet →</Link>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-red)', boxShadow: '0 0 10px rgba(239, 68, 68, 0.7)', animation: 'pulse-red 2s infinite ease-in-out' }} />
                  <span className="text-sm font-semibold">🔴 RED — Emergency</span>
                </div>
                <span className="font-bold text-red" style={{ fontSize: '1.1rem' }}>{redVehicles} car</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-yellow)', boxShadow: '0 0 8px rgba(245, 158, 11, 0.5)' }} />
                  <span className="text-sm font-semibold">🟡 YELLOW — Attention</span>
                </div>
                <span className="font-bold" style={{ color: 'var(--color-yellow)', fontSize: '1.1rem' }}>{yellowVehicles} cars</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-green)', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
                  <span className="text-sm font-semibold">🟢 GREEN — Healthy</span>
                </div>
                <span className="font-bold text-green" style={{ fontSize: '1.1rem' }}>{greenVehicles} cars</span>
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', height: 10, borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: 'var(--space-sm)' }}>
                <div style={{ width: `${(redVehicles / demoVehicles.length) * 100}%`, background: 'var(--color-red)' }} title="Red" />
                <div style={{ width: `${(yellowVehicles / demoVehicles.length) * 100}%`, background: 'var(--color-yellow)' }} title="Yellow" />
                <div style={{ width: `${(greenVehicles / demoVehicles.length) * 100}%`, background: 'var(--color-green)' }} title="Green" />
              </div>
            </div>
          </div>
        </div>

        {/* Balance Ledger Summary */}
        <div className="card animate-in animate-delay-2">
          <div className="card-header">
            <h3>⚖️ Driver Balance Ledger</h3>
            <Link href="/admin/sales" className="text-xs text-gold">Settlements →</Link>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div className="text-xs text-muted">Total Owed by Drivers to BYT</div>
              <div className="font-mono font-bold text-red" style={{ fontSize: '1.75rem', marginTop: '4px' }}>
                {formatCurrency(totalOwed)}
              </div>
              <div className="text-xs text-muted" style={{ marginTop: '2px' }}>
                Across 4 drivers with outstanding balances
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-sm)' }}>
              {demoDrivers.filter(d => d.balance > 100).map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span>{d.name}</span>
                  <span className="font-mono font-bold text-red">{formatCurrency(d.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live GPS Telemetry Mini Widget */}
        <div className="card animate-in animate-delay-3" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3>📡 Live GPS Radar Preview</h3>
            <span className="badge badge-green">LIVE</span>
          </div>
          <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(10, 22, 40, 0.95) 75%)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🛰️</div>
                <div className="font-mono font-bold text-green" style={{ fontSize: '1.1rem' }}>
                  {selectedGpsVehicle.plateNumber}
                </div>
                <div className="text-xs text-muted">
                  {selectedGpsVehicle.make} {selectedGpsVehicle.model} • Driver: {selectedGpsVehicle.assignedDriverName}
                </div>
                <div className="font-mono text-xs text-gold" style={{ marginTop: '6px' }}>
                  Accra Central • 5.6037° N, 0.1870° W
                </div>
              </div>
            </div>

            {/* Quick Vehicle Selector */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', marginTop: 'var(--space-sm)', paddingBottom: '4px' }}>
              {demoVehicles.slice(0, 5).map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedGpsVehicle(v)}
                  className={`btn btn-sm ${selectedGpsVehicle.id === v.id ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.68rem', padding: '2px 6px', whiteSpace: 'nowrap' }}
                >
                  {v.plateNumber}
                </button>
              ))}
            </div>

            <Link href="/admin/gps" className="btn btn-secondary btn-sm w-full" style={{ marginTop: 'auto', fontSize: '0.78rem' }}>
              Open Full GPS Satellite Map →
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Interactive Incident Reports Feed */}
      <div className="card animate-in animate-delay-4">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <h3>🚨 Driver Reports & Incident Feed</h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['ALL', 'EMERGENCY', 'UNRESOLVED'] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  className={`btn btn-sm ${reportFilter === f ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setReportFilter(f)}
                  style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <Link href="/admin/reports" className="text-xs text-gold">Manage All Reports →</Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ margin: 0, border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Incident Description</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.slice(0, 5).map(r => (
                  <tr key={r.id}>
                    <td className="font-semibold">{r.driverName}</td>
                    <td className="font-mono text-sm">{r.vehiclePlate || '—'}</td>
                    <td style={{ maxWidth: 320 }} className="text-sm text-secondary">{r.description}</td>
                    <td>
                      {r.suggestedSeverity ? (
                        <span className={`badge badge-${r.suggestedSeverity.toLowerCase()}`}>
                          {r.suggestedSeverity}
                        </span>
                      ) : (
                        <span className="text-muted text-xs">ABSENCE</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${r.status === 'RESOLVED' ? 'badge-green' : r.status === 'ACKNOWLEDGED' ? 'badge-gold' : 'badge-red'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === 'NEW' && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleAcknowledge(r.id)}
                          style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                        >
                          Acknowledge
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
