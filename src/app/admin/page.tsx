'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  demoVehicles, demoReports, demoSales, demoActivityFeed,
  demoMaintenanceSchedules, demoPartsInventory, driverWeeklyEarnings,
  formatCurrency, getScoreColor, getScoreLabel,
  Driver, getStoredDrivers, getStoredInventory, PartInventoryItem
} from '@/lib/demo-data';

// Animated counter
function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1200 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(0);
  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
      else ref.current = value;
    }
    requestAnimationFrame(animate);
  }, [value, duration]);
  return <>{prefix}{typeof value === 'number' && value % 1 !== 0 ? display.toFixed(2) : Math.round(display)}{suffix}</>;
}

// Mini sparkline (pure SVG)
function Sparkline({ data, color = '#0891b2', height = 26, width = 76 }: { data: number[]; color?: string; height?: number; width?: number }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const fillPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polygon points={fillPoints} fill={`${color}15`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={parseFloat(points.split(' ').pop()!.split(',')[0])} cy={parseFloat(points.split(' ').pop()!.split(',')[1])} r="2.5" fill={color} />
    </svg>
  );
}

export default function AdminDashboard() {
  const [selectedGpsVehicle, setSelectedGpsVehicle] = useState(demoVehicles[0]);
  const [reportFilter, setReportFilter] = useState<'ALL' | 'EMERGENCY' | 'UNRESOLVED'>('ALL');
  const [reports, setReports] = useState(demoReports);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [inventory, setInventory] = useState<PartInventoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDrivers(getStoredDrivers());
    setInventory(getStoredInventory());

    const handleUpdate = () => {
      setDrivers(getStoredDrivers());
      setInventory(getStoredInventory());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('byt-drivers-updated', handleUpdate);
    window.addEventListener('byt-inventory-updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('byt-drivers-updated', handleUpdate);
      window.removeEventListener('byt-inventory-updated', handleUpdate);
    };
  }, []);

  const activeDrivers = drivers.filter(d => d.status === 'ACTIVE').length;
  const pendingApps = 2;
  const redVehicles = demoVehicles.filter(v => v.severityStatus === 'RED').length;
  const yellowVehicles = demoVehicles.filter(v => v.severityStatus === 'YELLOW').length;
  const greenVehicles = demoVehicles.filter(v => v.severityStatus === 'GREEN').length;
  const totalRevenue = demoSales.filter(s => s.weekLabel === '2026-W38').reduce((sum, s) => sum + s.amount, 0);
  const totalOwed = drivers.filter(d => d.balance > 0).reduce((sum, d) => sum + d.balance, 0);

  const overdueCount = demoMaintenanceSchedules.filter(s => s.status === 'OVERDUE').length;
  const dueSoonCount = demoMaintenanceSchedules.filter(s => s.status === 'DUE_SOON').length;
  const activeStockList = inventory.length > 0 ? inventory : demoPartsInventory;
  const stockAlerts = activeStockList.filter(i => i.quantity <= i.reorderLevel).length;

  const scoredDrivers = drivers
    .filter(d => d.status === 'ACTIVE' && d.driverScore !== undefined)
    .sort((a, b) => (b.driverScore || 0) - (a.driverScore || 0));
  const topDrivers = scoredDrivers.slice(0, 3);
  const bottomDrivers = scoredDrivers.slice(-3).reverse();

  const revenueSparkline = [3200, 3450, 3100, 3600, 3800, 3550, 3950];

  const filteredReports = reports.filter(r => {
    if (reportFilter === 'EMERGENCY') return r.suggestedSeverity === 'RED';
    if (reportFilter === 'UNRESOLVED') return r.status !== 'RESOLVED';
    return true;
  });

  const handleAcknowledge = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'ACKNOWLEDGED' as const } : r));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. EXECUTIVE COMMAND HEADER - Calm & Confident */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#64748b',
              marginBottom: '0.35rem',
            }}
          >
            BYT Fleet Operating System • Accra Command
          </div>
          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              margin: '0 0 0.35rem',
            }}
          >
            Executive Overview
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0, maxWidth: 580, lineHeight: 1.5 }}>
            Real-time operations across <strong style={{ color: '#0f172a' }}>{demoVehicles.length} vehicles</strong>,{' '}
            <strong style={{ color: '#0f172a' }}>{activeDrivers} active drivers</strong>, and weekly sales settlements.
          </p>
        </div>

        {/* Action Hub */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Link
            href="/admin/fleet"
            style={{
              padding: '8px 14px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#0f172a',
              textDecoration: 'none',
              transition: 'background 100ms ease',
            }}
          >
            + Add Vehicle
          </Link>
          <Link
            href="/admin/sales"
            style={{
              padding: '8px 14px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#0f172a',
              textDecoration: 'none',
              transition: 'background 100ms ease',
            }}
          >
            Verify Sales
          </Link>
          <Link
            href="/admin/applications"
            style={{
              padding: '8px 14px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#0f172a',
              textDecoration: 'none',
              transition: 'background 100ms ease',
            }}
          >
            Applications ({pendingApps})
          </Link>
          <Link
            href="/admin/gps"
            style={{
              padding: '8px 16px',
              background: '#0891b2',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'background 100ms ease',
            }}
          >
            Live GPS Radar
          </Link>
        </div>
      </div>

      {/* 2. STATS GRID - 12-Column Responsive Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Active Drivers */}
        <Link href="/admin/drivers" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem',
              transition: 'border-color 100ms ease, background 100ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0891b2';
              e.currentTarget.style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#334155' }}>
                Active Drivers
              </span>
              {mounted && <Sparkline data={[8, 9, 9, 10, 10, 9, activeDrivers]} color="#0891b2" />}
            </div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em' }}>
              {mounted ? <AnimatedNumber value={activeDrivers} /> : activeDrivers}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600, marginTop: '0.35rem' }}>
              {drivers.length} registered • 100% assigned
            </div>
          </div>
        </Link>

        {/* Total Vehicles */}
        <Link href="/admin/fleet" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem',
              transition: 'border-color 100ms ease, background 100ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0891b2';
              e.currentTarget.style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#334155' }}>
                Total Fleet
              </span>
              {mounted && <Sparkline data={[6, 7, 7, 8, 8, 8, demoVehicles.length]} color="#0891b2" />}
            </div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em' }}>
              {mounted ? <AnimatedNumber value={demoVehicles.length} /> : demoVehicles.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem', fontWeight: 600 }}>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>{greenVehicles} Healthy</span> • <span style={{ color: '#d97706', fontWeight: 700 }}>{yellowVehicles} Attention</span>
            </div>
          </div>
        </Link>

        {/* Weekly Revenue */}
        <Link href="/admin/sales" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem',
              transition: 'border-color 100ms ease, background 100ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0891b2';
              e.currentTarget.style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#334155' }}>
                Week 38 Revenue
              </span>
              {mounted && <Sparkline data={revenueSparkline} color="#0891b2" />}
            </div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em' }}>
              {mounted ? <>GHS <AnimatedNumber value={totalRevenue} /></> : formatCurrency(totalRevenue)}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#16a34a', marginTop: '0.35rem', fontWeight: 700 }}>
              +8.4% vs previous week
            </div>
          </div>
        </Link>

        {/* Pending Applications */}
        <Link href="/admin/applications" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem',
              transition: 'border-color 100ms ease, background 100ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0891b2';
              e.currentTarget.style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#334155' }}>
                Pending Applications
              </span>
              <span style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: '12px', background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>
                Review
              </span>
            </div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em' }}>
              {mounted ? <AnimatedNumber value={pendingApps} /> : pendingApps}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem', fontWeight: 600 }}>
              Awaiting Ghana Card &amp; license review
            </div>
          </div>
        </Link>
      </div>

      {/* 3. ROW 2: FLEET HEALTH, BALANCES, & GPS TELEMETRY */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Fleet Health Breakdown */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Fleet Condition Status
            </h3>
            <Link href="/admin/fleet" style={{ fontSize: '0.76rem', color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>
              View Fleet →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626' }} />
                <span>Critical Attention</span>
              </div>
              <strong style={{ fontFamily: 'ui-monospace, monospace', color: '#dc2626' }}>{redVehicles} car</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706' }} />
                <span>Service Scheduled</span>
              </div>
              <strong style={{ fontFamily: 'ui-monospace, monospace', color: '#d97706' }}>{yellowVehicles} cars</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
                <span>Operational</span>
              </div>
              <strong style={{ fontFamily: 'ui-monospace, monospace', color: '#16a34a' }}>{greenVehicles} cars</strong>
            </div>

            {/* Proportion Bar */}
            <div style={{ display: 'flex', height: 6, borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem', background: '#f1f5f9' }}>
              <div style={{ width: `${(redVehicles / demoVehicles.length) * 100}%`, background: '#dc2626' }} />
              <div style={{ width: `${(yellowVehicles / demoVehicles.length) * 100}%`, background: '#d97706' }} />
              <div style={{ width: `${(greenVehicles / demoVehicles.length) * 100}%`, background: '#16a34a' }} />
            </div>

            {(overdueCount > 0 || dueSoonCount > 0) && (
              <div style={{ marginTop: '0.75rem', padding: '10px 12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#dc2626' }}>
                  {overdueCount > 0 ? `${overdueCount} Overdue Service Schedules` : `${dueSoonCount} Services Due Soon`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Balance Ledger Summary */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Driver Balance Summary
            </h3>
            <Link href="/admin/sales" style={{ fontSize: '0.76rem', color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>
              Manage →
            </Link>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
              Total Outstanding Balance
            </div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.65rem', fontWeight: 700, color: '#dc2626', marginTop: '4px' }}>
              {mounted ? <>GHS <AnimatedNumber value={totalOwed} /></> : formatCurrency(totalOwed)}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
              Across {drivers.filter(d => d.balance > 0).length} drivers
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
            {drivers.filter(d => d.balance > 100).slice(0, 3).map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: '#0f172a' }}>{d.name}</span>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#dc2626' }}>
                  {formatCurrency(d.balance)}
                </span>
              </div>
            ))}
          </div>

          {stockAlerts > 0 && (
            <div style={{ marginTop: '0.75rem', padding: '8px 12px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, color: '#92400e' }}>
                {stockAlerts} inventory parts low in stock
              </div>
            </div>
          )}
        </div>

        {/* Live GPS Telemetry Preview */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Live Telemetry Preview
            </h3>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#166534', background: '#f0fdf4', padding: '2px 6px', borderRadius: '12px' }}>
              LIVE RADAR
            </span>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              {selectedGpsVehicle.plateNumber}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
              {selectedGpsVehicle.make} {selectedGpsVehicle.model} • Driver: {selectedGpsVehicle.assignedDriverName}
            </div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.72rem', color: '#0891b2', marginTop: '6px' }}>
              Accra Central • 5.6037° N, 0.1870° W
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', marginBottom: '1rem', paddingBottom: '4px' }}>
            {demoVehicles.slice(0, 5).map(v => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedGpsVehicle(v)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: `1px solid ${selectedGpsVehicle.id === v.id ? '#0891b2' : '#e2e8f0'}`,
                  background: selectedGpsVehicle.id === v.id ? '#ecfeff' : '#ffffff',
                  color: selectedGpsVehicle.id === v.id ? '#0891b2' : '#64748b',
                  fontSize: '0.7rem',
                  fontFamily: 'ui-monospace, monospace',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {v.plateNumber}
              </button>
            ))}
          </div>

          <Link
            href="/admin/gps"
            style={{
              marginTop: 'auto',
              padding: '8px',
              textAlign: 'center',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#0f172a',
              textDecoration: 'none',
              transition: 'background 100ms ease',
            }}
          >
            Open Full Satellite Map →
          </Link>
        </div>
      </div>

      {/* 4. DRIVER PERFORMANCE & INCIDENT FEED */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Performance Leaderboard */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Driver Safety &amp; Compliance
            </h3>
            <Link href="/admin/drivers" style={{ fontSize: '0.76rem', color: '#0891b2', textDecoration: 'none', fontWeight: 600 }}>
              All Drivers →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topDrivers.map((d, i) => {
              const score = d.driverScore || 0;
              const color = getScoreColor(score);
              const earnings = driverWeeklyEarnings[d.id] || [];
              return (
                <div
                  key={d.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#0f172a',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{d.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{d.tripsCompleted} trips • {d.onTimeRate}% on-time</div>
                  </div>
                  {mounted && <Sparkline data={earnings} color={color} width={50} height={20} />}
                  <div
                    style={{
                      fontFamily: 'ui-monospace, monospace',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      color,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: '#ffffff',
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Activity Feed
            </h3>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#166534', background: '#f0fdf4', padding: '2px 6px', borderRadius: '12px' }}>
              UPDATED LIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {demoActivityFeed.slice(0, 5).map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px 10px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>{item.title}</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'ui-monospace, monospace' }}>
                      {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. INCIDENT REPORTS TABLE */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.75rem 1.5rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Driver Reports &amp; Incidents
            </h3>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>Recent submissions from mobile driver app</div>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {(['ALL', 'EMERGENCY', 'UNRESOLVED'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setReportFilter(f)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${reportFilter === f ? '#0891b2' : '#e2e8f0'}`,
                  background: reportFilter === f ? '#ecfeff' : '#ffffff',
                  color: reportFilter === f ? '#0891b2' : '#64748b',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#1e293b' }}>
                <th style={{ padding: '10px 12px', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1e293b' }}>Driver</th>
                <th style={{ padding: '10px 12px', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1e293b' }}>Plate</th>
                <th style={{ padding: '10px 12px', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1e293b' }}>Incident</th>
                <th style={{ padding: '10px 12px', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1e293b' }}>Severity</th>
                <th style={{ padding: '10px 12px', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1e293b' }}>Status</th>
                <th style={{ padding: '10px 12px', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1e293b' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.slice(0, 5).map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 100ms ease' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{r.driverName}</td>
                  <td style={{ padding: '12px', fontFamily: 'ui-monospace, monospace', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{r.vehiclePlate || '—'}</td>
                  <td style={{ padding: '12px', color: '#334155', maxWidth: 280, fontWeight: 500 }}>{r.description}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: r.suggestedSeverity === 'RED' ? '#fef2f2' : r.suggestedSeverity === 'YELLOW' ? '#fefce8' : '#f0fdf4',
                        color: r.suggestedSeverity === 'RED' ? '#dc2626' : r.suggestedSeverity === 'YELLOW' ? '#ca8a04' : '#16a34a',
                      }}
                    >
                      {r.suggestedSeverity || 'INFO'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: r.status === 'RESOLVED' ? '#f0fdf4' : r.status === 'ACKNOWLEDGED' ? '#ecfeff' : '#fef2f2',
                        color: r.status === 'RESOLVED' ? '#16a34a' : r.status === 'ACKNOWLEDGED' ? '#0891b2' : '#dc2626',
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {r.status === 'NEW' && (
                      <button
                        type="button"
                        onClick={() => handleAcknowledge(r.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#0f172a',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
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
  );
}
