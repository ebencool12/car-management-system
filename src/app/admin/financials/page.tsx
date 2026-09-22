'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import {
  weeklyRevenueData,
  expenseBreakdown,
  perDriverRevenue,
  formatCurrency,
  demoParts,
  demoDrivers,
  demoSales,
  Driver,
  getStoredDrivers,
} from '@/lib/demo-data';

// Animated counter hook
function useAnimatedValue(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const start = ref.current;
    const diff = target - start;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = start + diff * eased;
      setValue(current);
      if (progress < 1) requestAnimationFrame(animate);
      else ref.current = target;
    }
    requestAnimationFrame(animate);
  }, [target, duration]);
  return value;
}

const CHART_COLORS = ['#0891b2', '#d4a843', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4'];
const DRIVER_COLORS: Record<string, string> = {
  'Kwame Asante': '#0891b2',
  'Ama Mensah': '#d4a843',
  'Kofi Boateng': '#10b981',
  'Yaa Serwaa': '#ef4444',
  'Kwesi Appiah': '#8b5cf6',
  'Akua Donkor': '#f59e0b',
  'Others': '#64748b',
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.97)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      fontSize: '0.78rem',
    }}>
      <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--color-text)' }}>{label}</div>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, display: 'inline-block' }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>{entry.name}:</span>
          <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function FinancialsPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [mounted, setMounted] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>(demoDrivers);

  useEffect(() => {
    setMounted(true);
    setDrivers(getStoredDrivers());

    const handleUpdate = () => {
      setDrivers(getStoredDrivers());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('byt-drivers-updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('byt-drivers-updated', handleUpdate);
    };
  }, []);

  const baseRevenue = weeklyRevenueData.reduce((sum, d) => sum + d.revenue, 0);
  const baseExpenses = weeklyRevenueData.reduce((sum, d) => sum + d.expenses, 0);

  const totalRevenue = Math.round(baseRevenue * (period === 'weekly' ? 1 : period === 'monthly' ? 1.05 : 12.5));
  const totalExpenses = Math.round(baseExpenses * (period === 'weekly' ? 1 : period === 'monthly' ? 1.02 : 12.1));
  const totalProfit = totalRevenue - totalExpenses;
  const margin = ((totalProfit / totalRevenue) * 100);

  const latestWeek = weeklyRevenueData[weeklyRevenueData.length - 1];
  const prevWeek = weeklyRevenueData[weeklyRevenueData.length - 2];
  const revenueChange = ((latestWeek.revenue - prevWeek.revenue) / prevWeek.revenue * 100).toFixed(1);

  // Animated values
  const animRevenue = useAnimatedValue(totalRevenue);
  const animExpenses = useAnimatedValue(totalExpenses);
  const animProfit = useAnimatedValue(totalProfit);
  const animMargin = useAnimatedValue(margin);

  // Per-driver revenue breakdown keys
  const driverKeys = Object.keys(perDriverRevenue[0] || {}).filter(k => k !== 'week');

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    const headers = ['Week', 'Revenue', 'Expenses', 'Profit'];
    const rows = weeklyRevenueData.map(d => [d.week, d.revenue, d.expenses, d.profit].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `byt-financials-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const periodTitle =
    period === 'weekly' ? 'Weekly Financial Statement' : period === 'monthly' ? 'Monthly Financial Statement' : 'Annual Financial Statement';

  // Driver earnings summary (dynamic fleet drivers)
  const activeDrivers = drivers.filter(d => d.status === 'ACTIVE');
  const driverEarningsSummary = activeDrivers
    .map(d => ({
      name: d.name,
      totalSales: demoSales.filter(s => s.driverName === d.name && s.weekLabel === '2026-W38').reduce((sum, s) => sum + s.amount, 0),
      target: d.weeklyTarget || 600,
    }))
    .sort((a, b) => b.totalSales - a.totalSales);

  return (
    <div className="financials-container">
      {/* SCREEN HEADER */}
      <div className="page-header no-print">
        <div>
          <h1>Financial Telemetry & Audits</h1>
          <p className="subtitle">Live view of fleet-wide revenue, expenses, margins & printable financial records</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px', border: '1px solid var(--color-border)' }}>
            {(['weekly', 'monthly', 'yearly'] as const).map(p => (
              <button
                key={p}
                type="button"
                className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <button onClick={handleExportCSV} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📄</span>
            <span>Export CSV</span>
          </button>

          <Link href="/admin/tco" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🧮</span>
            <span>TCO & ROI Engine</span>
          </Link>

          <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🖨️</span>
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* PRINT-ONLY HEADER */}
      <div className="print-only print-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0891b2', paddingBottom: '12px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', margin: 0, color: '#0891b2', fontWeight: 800 }}>BYT FLEET MANAGEMENT</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569' }}>{periodTitle} (Official Accounting Record)</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
            <div><strong>Reporting Cycle:</strong> {period.toUpperCase()}</div>
            <div><strong>Generated:</strong> {new Date().toLocaleString()}</div>
            <div><strong>Status:</strong> AUDITED & RECONCILED</div>
          </div>
        </div>

        {/* Print Summary Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>METRIC</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>AMOUNT (GHS)</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>% OF REVENUE</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px 12px', fontWeight: 600 }}>Total Fleet Revenue</td>
              <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>{formatCurrency(totalRevenue)}</td>
              <td style={{ padding: '8px 12px', textAlign: 'right' }}>100.0%</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px 12px', fontWeight: 600 }}>Total Operational Expenses</td>
              <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>{formatCurrency(totalExpenses)}</td>
              <td style={{ padding: '8px 12px', textAlign: 'right' }}>{((totalExpenses / totalRevenue) * 100).toFixed(1)}%</td>
            </tr>
            <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
              <td style={{ padding: '10px 12px' }}>Net Fleet Profit</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0891b2' }}>{formatCurrency(totalProfit)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{margin.toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Stats with animated counters */}
      <div className="stats-grid animate-in">
        <div className="stat-card green">
          <div className="stat-icon green">💰</div>
          <div className="stat-number text-green" style={{ fontFamily: 'var(--font-mono)' }}>
            {mounted ? formatCurrency(Math.round(animRevenue)) : formatCurrency(totalRevenue)}
          </div>
          <div className="stat-title">Total Revenue ({period})</div>
          <div className="stat-change up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            +{revenueChange}% vs prev period
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon red">📉</div>
          <div className="stat-number text-red" style={{ fontFamily: 'var(--font-mono)' }}>
            {mounted ? formatCurrency(Math.round(animExpenses)) : formatCurrency(totalExpenses)}
          </div>
          <div className="stat-title">Total Expenses ({period})</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon gold">📊</div>
          <div className="stat-number" style={{ color: 'var(--byt-sea-dark)', fontFamily: 'var(--font-mono)' }}>
            {mounted ? formatCurrency(Math.round(animProfit)) : formatCurrency(totalProfit)}
          </div>
          <div className="stat-title">Net Profit ({period})</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon cyan">📈</div>
          <div className="stat-number" style={{ color: 'var(--byt-sea)', fontFamily: 'var(--font-mono)' }}>
            {mounted ? animMargin.toFixed(1) : margin.toFixed(1)}%
          </div>
          <div className="stat-title">Profit Margin</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 'var(--space-lg)' }}>
        {/* Revenue & Expenses Area Chart */}
        <div className="card animate-in animate-delay-1">
          <div className="card-header">
            <h3>Revenue & Expenses Trend</h3>
            <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>LIVE</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={weeklyRevenueData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#gradRevenue)" animationDuration={1500} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#gradExpenses)" animationDuration={1500} animationBegin={300} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.75rem', paddingTop: '8px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown Pie Chart */}
        <div className="card animate-in animate-delay-2">
          <div className="card-header">
            <h3>Expense Breakdown</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  animationDuration={1200}
                  animationBegin={400}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value || 0) * (period === 'weekly' ? 1 : period === 'monthly' ? 4 : 52)), '']}
                  contentStyle={{
                    background: 'rgba(255,255,255,0.97)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: 'var(--space-sm)' }}>
              {expenseBreakdown.map(e => (
                <div key={e.category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: e.color, display: 'inline-block' }} />
                    <span style={{ fontSize: '0.82rem' }}>{e.category}</span>
                  </div>
                  <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {formatCurrency(e.amount * (period === 'weekly' ? 1 : period === 'monthly' ? 4 : 52))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 'var(--space-lg)' }}>
        {/* Profit Trend Bar Chart */}
        <div className="card animate-in animate-delay-3">
          <div className="card-header">
            <h3>Profit Trend</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyRevenueData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="profit" name="Profit" radius={[6, 6, 0, 0]} animationDuration={1200}>
                  {weeklyRevenueData.map((entry, index) => (
                    <Cell key={index} fill={`rgba(8, 145, 178, ${0.4 + (index / weeklyRevenueData.length) * 0.6})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-Driver Revenue Stacked Bar */}
        <div className="card animate-in animate-delay-4">
          <div className="card-header">
            <h3>Driver Revenue Contribution</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={perDriverRevenue} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`} />
                <Tooltip content={<CustomTooltip />} />
                {driverKeys.map((key, i) => (
                  <Bar key={key} dataKey={key} name={key} stackId="a" fill={DRIVER_COLORS[key] || CHART_COLORS[i % CHART_COLORS.length]} animationDuration={1200} animationBegin={i * 100} />
                ))}
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.68rem', paddingTop: '8px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Driver Earnings Summary & Parts Spend */}
      <div className="grid-2" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="card animate-in animate-delay-3">
          <div className="card-header">
            <h3>Driver Earnings — Week 38</h3>
            <span className="text-xs text-muted">Target: GHS 600/week</span>
          </div>
          <div className="card-body">
            {driverEarningsSummary.map(d => {
              const pct = Math.min((d.totalSales / d.target) * 100, 100);
              const overTarget = d.totalSales >= d.target;
              return (
                <div key={d.name} style={{ marginBottom: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{d.name}</span>
                    <span className="font-mono" style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: overTarget ? '#10b981' : d.totalSales >= d.target * 0.7 ? '#f59e0b' : '#ef4444'
                    }}>
                      {formatCurrency(d.totalSales)}
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'var(--color-bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: overTarget
                        ? 'linear-gradient(90deg, #10b981, #22d3ee)'
                        : pct >= 70
                          ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                          : 'linear-gradient(90deg, #ef4444, #f87171)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card animate-in animate-delay-4">
          <div className="card-header">
            <h3>Top Parts Spend by Vehicle</h3>
          </div>
          <div className="card-body">
            {(() => {
              const byVehicle: Record<string, number> = {};
              demoParts.forEach(p => { byVehicle[p.vehiclePlate] = (byVehicle[p.vehiclePlate] || 0) + p.cost; });
              const sorted = Object.entries(byVehicle).sort((a, b) => b[1] - a[1]);
              const maxVal = sorted[0]?.[1] || 1;
              return sorted.map(([plate, cost]) => (
                <div key={plate} style={{ marginBottom: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="font-mono text-sm">{plate}</span>
                    <span className="font-mono text-sm font-bold" style={{ color: 'var(--byt-sea-dark)' }}>{formatCurrency(cost)}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-bg-input)', borderRadius: 'var(--radius-full)' }}>
                    <div style={{
                      height: '100%', width: `${(cost / maxVal) * 100}%`,
                      background: 'linear-gradient(90deg, var(--byt-sea), var(--byt-sea-dark))',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="print-only" style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #cbd5e1', fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>BYT Fleet Accounting — Reconciled & Audited Financial Statement</span>
        <span>Page 1 of 1</span>
      </div>

      <style jsx global>{`
        .print-only {
          display: none;
        }
        @media print {
          body {
            background: #ffffff !important;
            color: #0f172a !important;
          }
          .no-print,
          .admin-topbar,
          .sidebar,
          .mobile-backdrop {
            display: none !important;
          }
          .admin-shell .main-content {
            margin-left: 0 !important;
            padding: 0 !important;
          }
          .print-only {
            display: block !important;
          }
          .card {
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            break-inside: avoid;
            margin-bottom: 16px !important;
            background: #ffffff !important;
          }
        }
      `}</style>
    </div>
  );
}
