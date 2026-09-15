'use client';

import { useState } from 'react';
import { weeklyRevenueData, expenseBreakdown, formatCurrency, demoParts } from '@/lib/demo-data';

export default function FinancialsPage() {
  const [period, setPeriod] = useState('weekly');

  const totalRevenue = weeklyRevenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = weeklyRevenueData.reduce((sum, d) => sum + d.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const latestWeek = weeklyRevenueData[weeklyRevenueData.length - 1];
  const prevWeek = weeklyRevenueData[weeklyRevenueData.length - 2];
  const revenueChange = ((latestWeek.revenue - prevWeek.revenue) / prevWeek.revenue * 100).toFixed(1);

  const maxRevenue = Math.max(...weeklyRevenueData.map(d => d.revenue));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Financial Telemetry</h1>
          <p className="subtitle">Live view of fleet-wide revenue, expenses, and profit</p>
        </div>
        <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
          {['weekly', 'monthly'].map(p => (
            <button key={p} className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPeriod(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid animate-in">
        <div className="stat-card green">
          <div className="stat-icon green">💰</div>
          <div className="stat-number text-green">{formatCurrency(totalRevenue)}</div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-change up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            +{revenueChange}% vs last week
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon red">📉</div>
          <div className="stat-number text-red">{formatCurrency(totalExpenses)}</div>
          <div className="stat-title">Total Expenses</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-icon gold">📊</div>
          <div className="stat-number" style={{ color: 'var(--byt-gold)' }}>{formatCurrency(totalProfit)}</div>
          <div className="stat-title">Net Profit</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon cyan">📈</div>
          <div className="stat-number" style={{ color: 'var(--color-confirmed)' }}>{((totalProfit / totalRevenue) * 100).toFixed(1)}%</div>
          <div className="stat-title">Profit Margin</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 'var(--space-lg)' }}>
        {/* Revenue Chart (CSS-based bar chart) */}
        <div className="card animate-in animate-delay-1">
          <div className="card-header">
            <h3>Weekly Revenue & Expenses</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {weeklyRevenueData.map(d => (
                <div key={d.week}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="text-xs font-mono text-muted">{d.week}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--byt-gold)' }}>{formatCurrency(d.revenue)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', height: 20 }}>
                    <div style={{
                      width: `${(d.revenue / maxRevenue) * 100}%`,
                      background: 'linear-gradient(90deg, var(--color-green), rgba(16, 185, 129, 0.5))',
                      borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                      transition: 'width 0.6s ease',
                    }} />
                    <div style={{
                      width: `${(d.expenses / maxRevenue) * 100}%`,
                      background: 'linear-gradient(90deg, var(--color-red), rgba(239, 68, 68, 0.5))',
                      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--color-green)' }} />
                  <span className="text-xs text-muted">Revenue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--color-red)' }} />
                  <span className="text-xs text-muted">Expenses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="card animate-in animate-delay-2">
          <div className="card-header">
            <h3>Expense Breakdown</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {/* Donut placeholder */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-md)' }}>
                <div style={{ position: 'relative', width: 160, height: 160 }}>
                  <svg viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                    {(() => {
                      const total = expenseBreakdown.reduce((s, e) => s + e.amount, 0);
                      const circumference = 2 * Math.PI * 60;
                      const slices = expenseBreakdown.map((e, index) => {
                        const pct = e.amount / total;
                        const offset = expenseBreakdown.slice(0, index).reduce((sum, item) => sum + (item.amount / total), 0);
                        return { ...e, pct, offset };
                      });
                      return slices.map((e, i) => {
                        const dashArray = `${e.pct * circumference} ${circumference}`;
                        const dashOffset = -e.offset * circumference;
                        return (
                          <circle
                            key={i}
                            cx="80" cy="80" r="60"
                            fill="none"
                            stroke={e.color}
                            strokeWidth="24"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            style={{ transition: 'all 0.6s ease' }}
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                  }}>
                    <div className="font-bold" style={{ fontSize: '1.1rem' }}>{formatCurrency(expenseBreakdown.reduce((s, e) => s + e.amount, 0))}</div>
                    <div className="text-xs text-muted">Total</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              {expenseBreakdown.map(e => (
                <div key={e.category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: e.color }} />
                    <span className="text-sm">{e.category}</span>
                  </div>
                  <span className="font-mono text-sm font-semibold">{formatCurrency(e.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Expense Drivers */}
      <div className="grid-2" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="card animate-in animate-delay-3">
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
                    <span className="font-mono text-sm font-bold" style={{ color: 'var(--byt-gold)' }}>{formatCurrency(cost)}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-bg-input)', borderRadius: 'var(--radius-full)' }}>
                    <div style={{
                      height: '100%', width: `${(cost / maxVal) * 100}%`,
                      background: 'linear-gradient(90deg, var(--byt-gold), var(--byt-gold-dark))',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        <div className="card animate-in animate-delay-4">
          <div className="card-header">
            <h3>Profit Trend</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: 180, paddingTop: 'var(--space-md)' }}>
              {weeklyRevenueData.map(d => {
                const maxProfit = Math.max(...weeklyRevenueData.map(w => w.profit));
                const height = (d.profit / maxProfit) * 150;
                return (
                  <div key={d.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span className="text-xs font-mono" style={{ color: 'var(--byt-gold)' }}>{formatCurrency(d.profit)}</span>
                    <div style={{
                      width: '100%',
                      height: height,
                      background: 'linear-gradient(to top, rgba(212, 168, 67, 0.3), rgba(212, 168, 67, 0.1))',
                      border: '1px solid rgba(212, 168, 67, 0.3)',
                      borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                      transition: 'height 0.6s ease',
                    }} />
                    <span className="text-xs text-muted">{d.week}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
