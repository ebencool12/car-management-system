'use client';

import { useState } from 'react';
import { demoParts, formatCurrency } from '@/lib/demo-data';

export default function PartsPage() {
  const [parts, setParts] = useState(demoParts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = parts.filter(p => {
    const matchSearch = p.partName.toLowerCase().includes(search.toLowerCase()) ||
      p.driverName.toLowerCase().includes(search.toLowerCase()) ||
      p.vehiclePlate.toLowerCase().includes(search.toLowerCase());
    const matchFilter = statusFilter === 'ALL' || p.reimbursementStatus === statusFilter;
    return matchSearch && matchFilter;
  });

  const totalCost = parts.reduce((sum, p) => sum + p.cost, 0);
  const pendingReimb = parts.filter(p => p.reimbursementStatus === 'PENDING').reduce((sum, p) => sum + p.cost, 0);

  const handleApprove = (id: string) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, reimbursementStatus: 'APPROVED' as const } : p));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Parts Exchange</h1>
          <p className="subtitle">Track vehicle parts replacement and reimbursements</p>
        </div>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="stat-card gold">
          <div className="stat-number" style={{ color: 'var(--byt-gold)' }}>{formatCurrency(totalCost)}</div>
          <div className="stat-title">Total Parts Cost</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-number" style={{ color: 'var(--color-pending)' }}>{formatCurrency(pendingReimb)}</div>
          <div className="stat-title">Pending Reimbursement</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number text-green">{parts.filter(p => p.reimbursementStatus === 'APPROVED').length}</div>
          <div className="stat-title">Approved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search parts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
            <button key={f} className={`btn btn-sm ${statusFilter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setStatusFilter(f)} style={{ fontSize: '0.75rem' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-container animate-in">
        <table>
          <thead>
            <tr>
              <th>Part Name</th>
              <th>Cost</th>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Docs</th>
              <th>Reimbursement</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(part => (
              <tr key={part.id}>
                <td className="font-semibold">{part.partName}</td>
                <td className="font-mono font-bold">{formatCurrency(part.cost)}</td>
                <td>{part.driverName}</td>
                <td><code className="font-mono text-xs" style={{ color: 'var(--color-text-secondary)' }}>{part.vehiclePlate}</code></td>
                <td className="text-sm text-muted">{part.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <span className="text-xs" title="Photo">📷</span>
                    <span className="text-xs" title="Receipt">🧾</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${part.reimbursementStatus === 'APPROVED' ? 'badge-green' : part.reimbursementStatus === 'REJECTED' ? 'badge-red' : 'badge-purple'}`}>
                    {part.reimbursementStatus}
                  </span>
                </td>
                <td>
                  {part.reimbursementStatus === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleApprove(part.id)}>Approve</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-red)' }}>Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
