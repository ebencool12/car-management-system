'use client';

import { useState } from 'react';
import { demoApplications } from '@/lib/demo-data';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState(demoApplications);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const selected = applications.find(a => a.id === selectedApp);

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
    setSelectedApp(null);
  };

  const copyLink = () => {
    navigator.clipboard.writeText('https://fleet.byt.com/apply');
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const pending = applications.filter(a => a.status === 'PENDING');
  const processed = applications.filter(a => a.status !== 'PENDING');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p className="subtitle">{pending.length} pending review</p>
        </div>
        <button className="btn btn-primary" onClick={copyLink}>
          {linkCopied ? '✓ Link Copied!' : '🔗 Copy Application Link'}
        </button>
      </div>

      {/* Pending Queue */}
      <h3 style={{ marginBottom: 'var(--space-md)' }}>Pending Review</h3>
      {pending.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No pending applications</h3>
            <p>Share the application link to receive new driver applications.</p>
          </div>
        </div>
      ) : (
        <div className="grid-2 animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
          {pending.map(app => (
            <div key={app.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedApp(app.id)}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                    <div className="chat-avatar" style={{ width: 48, height: 48 }}>
                      {app.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold" style={{ fontSize: '1.05rem' }}>{app.fullName}</div>
                      <div className="text-sm text-muted">{app.phone} • {app.email}</div>
                    </div>
                  </div>
                  <span className="badge badge-purple">PENDING</span>
                </div>

                <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'rgba(17, 29, 53, 0.5)', borderRadius: 'var(--radius-md)' }}>
                  <div className="text-xs text-muted" style={{ marginBottom: '4px' }}>Reason for applying</div>
                  <div className="text-sm">{app.reason}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)' }}>
                  <span className="text-xs text-muted">Applied {app.createdAt}</span>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <span className="text-xs text-muted">📄 License</span>
                    <span className="text-xs text-muted">🆔 Ghana Card</span>
                    <span className="text-xs text-muted">👁️ Iris Scan</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Processed */}
      {processed.length > 0 && (
        <>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Processed</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {processed.map(app => (
                  <tr key={app.id}>
                    <td className="font-semibold">{app.fullName}</td>
                    <td className="font-mono text-sm">{app.phone}</td>
                    <td className="text-sm">{app.email}</td>
                    <td>
                      <span className={`badge ${app.status === 'APPROVED' ? 'badge-green' : 'badge-red'}`}>{app.status}</span>
                    </td>
                    <td className="text-sm text-muted">{app.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Review Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3>Review Application</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedApp(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <div className="chat-avatar" style={{ width: 64, height: 64, fontSize: '1.25rem' }}>
                  {selected.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold" style={{ fontSize: '1.2rem' }}>{selected.fullName}</div>
                  <div className="text-sm text-muted">{selected.phone} • {selected.email}</div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Reason for Applying</label>
                <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                  {selected.reason}
                </div>
              </div>

              <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div className="card-body" style={{ padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📄</div>
                    <div className="text-xs font-semibold">Driver&apos;s License</div>
                    <div className="text-xs text-muted" style={{ marginTop: '2px' }}>Uploaded</div>
                  </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div className="card-body" style={{ padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🆔</div>
                    <div className="text-xs font-semibold">Ghana Card</div>
                    <div className="text-xs text-muted" style={{ marginTop: '2px' }}>Uploaded</div>
                  </div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                  <div className="card-body" style={{ padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>👁️</div>
                    <div className="text-xs font-semibold">Iris / Selfie</div>
                    <div className="text-xs text-muted" style={{ marginTop: '2px' }}>Captured</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" onClick={() => handleAction(selected.id, 'REJECTED')}>
                Reject
              </button>
              <button className="btn btn-primary" onClick={() => handleAction(selected.id, 'APPROVED')}>
                ✓ Approve & Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
