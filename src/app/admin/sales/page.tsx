'use client';

import { useState } from 'react';
import { demoDrivers, demoSales, formatCurrency, getBalanceLabel } from '@/lib/demo-data';

export default function SalesPage() {
  const [sales, setSales] = useState(demoSales);
  const [activeTab, setActiveTab] = useState<'sales' | 'balances'>('sales');
  const [weekFilter, setWeekFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredSales = sales.filter(s => {
    const matchWeek = weekFilter === 'ALL' || s.weekLabel === weekFilter;
    const matchSearch = s.driverName.toLowerCase().includes(search.toLowerCase());
    return matchWeek && matchSearch;
  });

  const activeDrivers = demoDrivers.filter(d => d.status === 'ACTIVE');

  const handleConfirm = (id: string) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, confirmationStatus: 'CONFIRMED' as const } : s));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Sales & Balances</h1>
          <p className="subtitle">Weekly sales submissions and driver balance ledger</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>
          💰 Weekly Sales
        </button>
        <button className={`tab ${activeTab === 'balances' ? 'active' : ''}`} onClick={() => setActiveTab('balances')}>
          ⚖️ Driver Balances
        </button>
      </div>

      {activeTab === 'sales' ? (
        <>
          {/* Summary */}
          <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="stat-card gold">
              <div className="stat-number" style={{ color: 'var(--byt-gold)' }}>
                {formatCurrency(sales.filter(s => s.weekLabel === '2026-W38').reduce((sum, s) => sum + s.amount, 0))}
              </div>
              <div className="stat-title">Week 38 Total</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-number" style={{ color: 'var(--color-pending)' }}>
                {sales.filter(s => s.confirmationStatus === 'PENDING').length}
              </div>
              <div className="stat-title">Pending Confirmation</div>
            </div>
            <div className="stat-card cyan">
              <div className="stat-number" style={{ color: 'var(--color-confirmed)' }}>
                {sales.filter(s => s.paymentMethod === 'MOMO').length}
              </div>
              <div className="stat-title">Momo Payments</div>
            </div>
            <div className="stat-card green">
              <div className="stat-number text-green">
                {sales.filter(s => s.paymentMethod === 'CASH').length}
              </div>
              <div className="stat-title">Cash Payments</div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search by driver..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: 'auto' }} value={weekFilter} onChange={e => setWeekFilter(e.target.value)}>
              <option value="ALL">All Weeks</option>
              <option value="2026-W38">Week 38</option>
              <option value="2026-W37">Week 37</option>
              <option value="2026-W36">Week 36</option>
            </select>
          </div>

          {/* Sales Table */}
          <div className="table-container animate-in">
            <table>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Week</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(sale => (
                  <tr key={sale.id}>
                    <td className="font-semibold">{sale.driverName}</td>
                    <td className="font-mono text-sm">{sale.weekLabel}</td>
                    <td className="font-mono font-bold" style={{ color: 'var(--byt-gold)' }}>{formatCurrency(sale.amount)}</td>
                    <td>
                      <span className={`badge ${sale.paymentMethod === 'MOMO' ? 'badge-gold' : 'badge-cyan'}`}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-muted">{sale.momoReference || '—'}</td>
                    <td>
                      <span className={`badge ${sale.confirmationStatus === 'CONFIRMED' ? 'badge-green' : sale.confirmationStatus === 'DISPUTED' ? 'badge-red' : 'badge-purple'}`}>
                        {sale.confirmationStatus}
                      </span>
                    </td>
                    <td>
                      {sale.confirmationStatus === 'PENDING' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleConfirm(sale.id)}>
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Balances View */}
          <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="stat-card red">
              <div className="stat-number text-red">
                {formatCurrency(activeDrivers.filter(d => d.balance > 0).reduce((sum, d) => sum + d.balance, 0))}
              </div>
              <div className="stat-title">Total Owed to BYT</div>
            </div>
            <div className="stat-card gold">
              <div className="stat-number" style={{ color: 'var(--byt-gold)' }}>
                {formatCurrency(Math.abs(activeDrivers.filter(d => d.balance < 0).reduce((sum, d) => sum + d.balance, 0)))}
              </div>
              <div className="stat-title">BYT Owes Drivers</div>
            </div>
            <div className="stat-card green">
              <div className="stat-number text-green">
                {activeDrivers.filter(d => d.balance === 0).length}
              </div>
              <div className="stat-title">Settled</div>
            </div>
          </div>

          <div className="table-container animate-in">
            <table>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Balance</th>
                  <th>Direction</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeDrivers.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)).map(driver => {
                  const bal = getBalanceLabel(driver.balance);
                  return (
                    <tr key={driver.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                          <div className="chat-avatar" style={{ width: 36, height: 36, fontSize: '0.75rem' }}>
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold">{driver.name}</div>
                            <div className="text-xs text-muted">{driver.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`font-mono font-bold ${bal.className}`}>
                        {driver.balance !== 0 ? formatCurrency(driver.balance) : '—'}
                      </td>
                      <td>
                        <span className={`badge ${driver.balance > 0 ? 'badge-red' : driver.balance < 0 ? 'badge-gold' : 'badge-green'}`}>
                          {bal.text}
                        </span>
                      </td>
                      <td>
                        {driver.balance !== 0 && (
                          <button className="btn btn-secondary btn-sm">Record Settlement</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
