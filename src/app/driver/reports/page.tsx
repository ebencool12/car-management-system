'use client';

import { useState } from 'react';

export default function DriverReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('ISSUE');
  const [severity, setSeverity] = useState('YELLOW');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const myReports = [
    { id: '1', type: 'ISSUE', description: 'Left front tire tread is very low, needs replacement soon.', severity: 'YELLOW', status: 'NEW', date: '2026-09-14' },
    { id: '2', type: 'ISSUE', description: 'AC not cooling properly.', severity: 'YELLOW', status: 'RESOLVED', date: '2026-09-12' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setDescription('');
    }, 1500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h2>Reports</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Report'}
        </button>
      </div>

      {/* New Report Form */}
      {showForm && (
        <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="card-body">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>✅</div>
                <h3>Report Submitted</h3>
                <p className="text-sm text-muted">Your admin has been notified.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Report Type</label>
                  <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
                    <button type="button" className={`btn btn-sm ${type === 'ISSUE' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setType('ISSUE')} style={{ flex: 1 }}>
                      🚗 Vehicle Issue
                    </button>
                    <button type="button" className={`btn btn-sm ${type === 'ABSENCE' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setType('ABSENCE')} style={{ flex: 1 }}>
                      🏠 Unable to Work
                    </button>
                  </div>
                </div>

                {type === 'ISSUE' && (
                  <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                    <label className="form-label">Suggested Severity</label>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                      {(['RED', 'YELLOW', 'GREEN'] as const).map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSeverity(s)}
                          className={`btn btn-sm ${severity === s ? '' : 'btn-ghost'}`}
                          style={{
                            flex: 1,
                            background: severity === s
                              ? s === 'RED' ? 'var(--color-red-bg)' : s === 'YELLOW' ? 'var(--color-yellow-bg)' : 'var(--color-green-bg)'
                              : undefined,
                            color: severity === s
                              ? s === 'RED' ? 'var(--color-red)' : s === 'YELLOW' ? 'var(--color-yellow)' : 'var(--color-green)'
                              : undefined,
                            border: severity === s
                              ? `1px solid ${s === 'RED' ? 'rgba(239, 68, 68, 0.3)' : s === 'YELLOW' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                              : undefined,
                          }}
                        >
                          {s === 'RED' ? '🔴 Emergency' : s === 'YELLOW' ? '🟡 Attention' : '🟢 Low'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder={type === 'ISSUE' ? 'Describe the vehicle issue...' : 'Explain why you cannot work...'}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                  <label className="form-label">Photo (optional)</label>
                  <div className="upload-zone">
                    <div className="upload-icon" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📷</div>
                    <div className="text-sm text-muted">Tap to take a photo</div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full">Submit Report</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* My Reports */}
      <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', color: 'var(--color-text-secondary)' }}>Your Reports</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {myReports.map(report => (
          <div key={report.id} className="card">
            <div className="card-body" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                  <span className={`badge ${report.type === 'ISSUE' ? 'badge-red' : 'badge-cyan'}`}>{report.type}</span>
                  {report.severity && <span className={`badge badge-${report.severity === 'RED' ? 'red' : report.severity === 'YELLOW' ? 'yellow' : 'green'}`}>{report.severity}</span>}
                </div>
                <span className={`badge ${report.status === 'NEW' ? 'badge-purple' : report.status === 'ACKNOWLEDGED' ? 'badge-cyan' : 'badge-green'}`}>
                  {report.status}
                </span>
              </div>
              <p className="text-sm" style={{ marginTop: 'var(--space-sm)' }}>{report.description}</p>
              <div className="text-xs text-muted" style={{ marginTop: 'var(--space-sm)' }}>{report.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
