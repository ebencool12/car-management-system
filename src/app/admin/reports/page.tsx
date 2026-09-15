'use client';

import { useState } from 'react';
import { demoReports } from '@/lib/demo-data';

export default function ReportsPage() {
  const [reports, setReports] = useState(demoReports);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = reports.filter(r => {
    const matchType = typeFilter === 'ALL' || r.type === typeFilter;
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSearch = r.driverName.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      (r.vehiclePlate || '').toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const handleAction = (id: string, newStatus: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus as typeof r.status } : r));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Driver Reports</h1>
          <p className="subtitle">{reports.filter(r => r.status === 'NEW').length} new reports need attention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <select className="form-select" style={{ width: 'auto', minWidth: 140 }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="ALL">All Types</option>
          <option value="ISSUE">Vehicle Issues</option>
          <option value="ABSENCE">Absences</option>
        </select>

        <select className="form-select" style={{ width: 'auto', minWidth: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="ALL">All Status</option>
          <option value="NEW">New</option>
          <option value="ACKNOWLEDGED">Acknowledged</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Reports Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }} className="animate-in">
        {filtered.map(report => (
          <div key={report.id} className="card">
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', flex: 1 }}>
                  <div className="chat-avatar" style={{ width: 42, height: 42, fontSize: '0.8rem', flexShrink: 0 }}>
                    {report.driverName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span className="font-semibold">{report.driverName}</span>
                      <span className={`badge ${report.type === 'ISSUE' ? 'badge-red' : 'badge-cyan'}`}>{report.type}</span>
                      {report.vehiclePlate && (
                        <code className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{report.vehiclePlate}</code>
                      )}
                    </div>
                    <p className="text-sm" style={{ marginBottom: 'var(--space-sm)', lineHeight: 1.6 }}>{report.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                      {report.suggestedSeverity && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Suggested: <span className={`badge badge-${report.suggestedSeverity === 'RED' ? 'red' : report.suggestedSeverity === 'YELLOW' ? 'yellow' : 'green'}`}>{report.suggestedSeverity}</span>
                        </span>
                      )}
                      <span className="text-xs text-muted">{new Date(report.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span className={`badge ${report.status === 'NEW' ? 'badge-purple' : report.status === 'ACKNOWLEDGED' ? 'badge-cyan' : 'badge-green'}`}>
                    {report.status}
                  </span>
                  {report.status === 'NEW' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleAction(report.id, 'ACKNOWLEDGED')}>
                      Acknowledge
                    </button>
                  )}
                  {report.status === 'ACKNOWLEDGED' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleAction(report.id, 'RESOLVED')}>
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No reports found</h3>
            <p>Try adjusting your filters or search.</p>
          </div>
        </div>
      )}
    </div>
  );
}
