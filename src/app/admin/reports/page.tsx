'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  DriverReport,
  getStoredReports,
  saveStoredReports,
} from '@/lib/demo-data';

export default function ReportsPage() {
  const [reports, setReports] = useState<DriverReport[]>([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [periodFilter, setPeriodFilter] = useState<'ALL' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('ALL');
  const [search, setSearch] = useState('');

  // Media preview modal state
  const [selectedReport, setSelectedReport] = useState<DriverReport | null>(null);

  const loadData = () => {
    setReports(getStoredReports());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => setReports(getStoredReports());
    window.addEventListener('byt-reports-updated', handleUpdate);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('byt-reports-updated', handleUpdate);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // Date filtering helper
  const filtered = useMemo(() => {
    const now = new Date();
    return reports.filter(r => {
      const matchType = typeFilter === 'ALL' || r.type === typeFilter;
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchSearch =
        r.driverName.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        (r.vehiclePlate || '').toLowerCase().includes(search.toLowerCase());

      // Period filter
      let matchPeriod = true;
      if (periodFilter !== 'ALL') {
        const reportDate = new Date(r.createdAt);
        const diffMs = now.getTime() - reportDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (periodFilter === 'WEEKLY') {
          matchPeriod = diffDays <= 7;
        } else if (periodFilter === 'MONTHLY') {
          matchPeriod = diffDays <= 30;
        } else if (periodFilter === 'YEARLY') {
          matchPeriod = diffDays <= 365;
        }
      }

      return matchType && matchStatus && matchSearch && matchPeriod;
    });
  }, [reports, typeFilter, statusFilter, periodFilter, search]);

  const handleAction = (id: string, newStatus: string) => {
    const updated = reports.map(r => (r.id === id ? { ...r, status: newStatus as typeof r.status } : r));
    saveStoredReports(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  // Stats for the report summary
  const totalCount = filtered.length;
  const issueCount = filtered.filter(r => r.type === 'ISSUE').length;
  const absenceCount = filtered.filter(r => r.type === 'ABSENCE').length;
  const resolvedCount = filtered.filter(r => r.status === 'RESOLVED').length;
  const newCount = filtered.filter(r => r.status === 'NEW').length;

  const periodLabel =
    periodFilter === 'WEEKLY'
      ? 'Weekly (Last 7 Days)'
      : periodFilter === 'MONTHLY'
      ? 'Monthly (Last 30 Days)'
      : periodFilter === 'YEARLY'
      ? 'Yearly (Last 365 Days)'
      : 'All Recorded Time';

  return (
    <div className="reports-page-container">
      {/* SCREEN ONLY HEADER */}
      <div className="page-header no-print">
        <div>
          <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)', fontWeight: 700 }}>
            Fleet Safety & Dispatch
          </span>
          <h1 style={{ marginTop: '2px' }}>Driver & Operational Reports</h1>
          <p className="subtitle">
            {reports.filter(r => r.status === 'NEW').length} new reports need attention • Filter, review attached media, and export official records
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🖨️</span>
            <span>Print / Export Report</span>
          </button>
        </div>
      </div>

      {/* PRINT-ONLY OFFICIAL HEADER */}
      <div className="print-only print-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0891b2', paddingBottom: '12px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', margin: 0, color: '#0891b2', fontWeight: 800 }}>BYT FLEET MANAGEMENT</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569' }}>Official Driver Incidents & Operational Report</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
            <div><strong>Period:</strong> {periodLabel}</div>
            <div><strong>Generated:</strong> {new Date().toLocaleString()}</div>
            <div><strong>Total Records:</strong> {totalCount}</div>
          </div>
        </div>

        {/* Summary Metric Strip for Print */}
        <div style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '16px', fontSize: '12px' }}>
          <div><strong>Total:</strong> {totalCount}</div>
          <div><strong>Vehicle Issues:</strong> {issueCount}</div>
          <div><strong>Absences:</strong> {absenceCount}</div>
          <div><strong>Resolved:</strong> {resolvedCount}</div>
          <div><strong>Pending Attention:</strong> {newCount}</div>
        </div>
      </div>

      {/* SCREEN CONTROLS & FILTERS */}
      <div className="card no-print" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-body" style={{ padding: 'var(--space-md)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search */}
            <div className="search-box" style={{ flex: '1 1 240px' }}>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by driver, plate, or keyword..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Period Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="text-xs text-muted" style={{ fontWeight: 600 }}>Period:</span>
              <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                {(['ALL', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map(p => (
                  <button
                    key={p}
                    className={`btn btn-sm ${periodFilter === p ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setPeriodFilter(p)}
                    style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                  >
                    {p === 'ALL' ? 'All' : p === 'WEEKLY' ? '7 Days' : p === 'MONTHLY' ? '30 Days' : '1 Year'}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="text-xs text-muted" style={{ fontWeight: 600 }}>Type:</span>
              <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                {['ALL', 'ISSUE', 'ABSENCE'].map(t => (
                  <button
                    key={t}
                    className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setTypeFilter(t)}
                    style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                  >
                    {t === 'ALL' ? 'All' : t === 'ISSUE' ? 'Issues' : 'Absences'}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="text-xs text-muted" style={{ fontWeight: 600 }}>Status:</span>
              <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                {['ALL', 'NEW', 'ACKNOWLEDGED', 'RESOLVED'].map(s => (
                  <button
                    key={s}
                    className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setStatusFilter(s)}
                    style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {filtered.map(report => (
          <div key={report.id} className="card animate-in">
            <div className="card-body" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)', flex: 1, minWidth: 280 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 'var(--radius-md)',
                      background: report.type === 'ISSUE' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(8, 145, 178, 0.1)',
                      color: report.type === 'ISSUE' ? 'var(--color-red)' : 'var(--byt-sea)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0,
                    }}
                  >
                    {report.type === 'ISSUE' ? '🚨' : '📅'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                      <span className="font-semibold text-sm">{report.driverName}</span>
                      {report.vehiclePlate && (
                        <code className="font-mono text-xs" style={{ background: 'var(--color-bg-input)', padding: '2px 6px', borderRadius: '4px' }}>
                          {report.vehiclePlate}
                        </code>
                      )}
                      <span className={`badge ${report.type === 'ISSUE' ? 'badge-red' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                        {report.type === 'ISSUE' ? 'Vehicle Issue' : 'Driver Absence'}
                      </span>
                      {report.suggestedSeverity && (
                        <span
                          className={`badge ${
                            report.suggestedSeverity === 'RED'
                              ? 'badge-red'
                              : report.suggestedSeverity === 'YELLOW'
                              ? 'badge-yellow'
                              : 'badge-green'
                          }`}
                          style={{ fontSize: '0.65rem' }}
                        >
                          {report.suggestedSeverity}
                        </span>
                      )}
                      {report.mediaUrl && (
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                          📷 Media Attached
                        </span>
                      )}
                    </div>

                    <p style={{ margin: '8px 0', fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>
                      {report.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      <span>Submitted: {new Date(report.createdAt).toLocaleString()}</span>
                      {report.mediaUrl && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm no-print"
                          style={{ padding: '2px 6px', fontSize: '0.72rem', color: 'var(--byt-sea)' }}
                          onClick={() => setSelectedReport(report)}
                        >
                          🔍 View Attached Media
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span
                    className={`badge ${
                      report.status === 'NEW'
                        ? 'badge-purple'
                        : report.status === 'ACKNOWLEDGED'
                        ? 'badge-cyan'
                        : 'badge-green'
                    }`}
                  >
                    {report.status}
                  </span>
                  {report.status === 'NEW' && (
                    <button className="btn btn-secondary btn-sm no-print" onClick={() => handleAction(report.id, 'ACKNOWLEDGED')}>
                      Acknowledge
                    </button>
                  )}
                  {report.status === 'ACKNOWLEDGED' && (
                    <button className="btn btn-primary btn-sm no-print" onClick={() => handleAction(report.id, 'RESOLVED')}>
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
          <div className="empty-state" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <div className="empty-icon" style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</div>
            <h3>No reports found</h3>
            <p className="text-sm text-muted">Try adjusting your period filter ({periodLabel}) or search criteria.</p>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Attached Evidence */}
      {selectedReport && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="modal-content animate-in" style={{ maxWidth: 600, width: '92%' }}>
            <div className="modal-header">
              <div>
                <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)' }}>
                  Report Evidence & Media
                </span>
                <h3 style={{ marginTop: '2px' }}>{selectedReport.driverName} — {selectedReport.vehiclePlate || 'Absence'}</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedReport(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
                {selectedReport.description}
              </p>
              {selectedReport.mediaUrl ? (
                <div style={{ textAlign: 'center', background: '#000', borderRadius: 'var(--radius-md)', padding: 'var(--space-sm)' }}>
                  {selectedReport.mediaType === 'video' ? (
                    <video src={selectedReport.mediaUrl} controls style={{ maxWidth: '100%', maxHeight: 360, borderRadius: 6 }} />
                  ) : (
                    <img src={selectedReport.mediaUrl} alt="Report evidence" style={{ maxWidth: '100%', maxHeight: 360, objectFit: 'contain', borderRadius: 6 }} />
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--color-text-muted)' }}>
                  No media attached to this report.
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setSelectedReport(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Footer */}
      <div className="print-only" style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #cbd5e1', fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>BYT Fleet Management System — Confidential Operational Record</span>
        <span>Page 1 of 1</span>
      </div>

      {/* Print and layout styles */}
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
            margin-bottom: 12px !important;
            background: #ffffff !important;
          }

          .badge {
            border: 1px solid #94a3b8 !important;
          }
        }
      `}</style>
    </div>
  );
}
