'use client';

import { useState, useEffect } from 'react';
import {
  Application,
  Driver,
  getStoredApplications,
  saveStoredApplications,
  getStoredDrivers,
  saveStoredDrivers,
} from '@/lib/demo-data';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Lightbox for document zoom
  const [zoomMedia, setZoomMedia] = useState<{ title: string; url: string } | null>(null);

  const loadData = () => {
    setApplications(getStoredApplications());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => setApplications(getStoredApplications());
    window.addEventListener('byt-applications-updated', handleUpdate);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('byt-applications-updated', handleUpdate);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const selected = applications.find(a => a.id === selectedApp);

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    const target = applications.find(a => a.id === id);
    if (!target) return;

    // 1. Update application status
    const updatedApps = applications.map(a => (a.id === id ? { ...a, status: action } : a));
    saveStoredApplications(updatedApps);

    // 2. If approved, provision a new Driver account into the fleet
    if (action === 'APPROVED') {
      const existingDrivers = getStoredDrivers();
      const newDriver: Driver = {
        id: `drv-${Date.now()}`,
        name: target.fullName,
        phone: target.phone,
        email: target.email || `${target.fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        status: 'ACTIVE',
        operationalStatus: 'ACTIVE',
        balance: 0,
        profilePicture: target.selfieUrl || null,
        createdAt: new Date().toISOString().split('T')[0],
        driverScore: 88,
        tripsCompleted: 0,
        onTimeRate: 100,
        totalEarnings: 0,
        dailyTarget: 100,
        weeklyTarget: 600,
      };
      saveStoredDrivers([newDriver, ...existingDrivers]);
    }

    setSelectedApp(null);
  };

  const copyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/apply` : 'https://fleet.byt.com/apply';
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const pending = applications.filter(a => a.status === 'PENDING');
  const processed = applications.filter(a => a.status !== 'PENDING');

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)', fontWeight: 700 }}>
            Driver Recruitment & Onboarding
          </span>
          <h1 style={{ marginTop: '2px' }}>Driver Applications</h1>
          <p className="subtitle">
            {pending.length} pending review • Review uploaded licenses, national IDs, and live selfie verifications
          </p>
        </div>
        <button className="btn btn-primary" onClick={copyLink}>
          {linkCopied ? '✓ Link Copied to Clipboard!' : '🔗 Copy Onboarding Link'}
        </button>
      </div>

      {/* Pending Queue */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ margin: 0 }}>Pending Review ({pending.length})</h3>
        <span className="text-xs text-muted">Click any application card to review proofs</span>
      </div>

      {pending.length === 0 ? (
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="empty-state" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <div className="empty-icon" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📋</div>
            <h3>No pending applications</h3>
            <p className="text-sm text-muted">All incoming driver applicants have been processed. Share the application link to recruit more drivers.</p>
          </div>
        </div>
      ) : (
        <div className="grid-2 animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
          {pending.map(app => (
            <div
              key={app.id}
              className="card"
              style={{ cursor: 'pointer', transition: 'border-color 0.2s' }}
              onClick={() => setSelectedApp(app.id)}
            >
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                    {app.selfieUrl ? (
                      <img
                        src={app.selfieUrl}
                        alt={app.fullName}
                        style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--byt-gold)' }}
                      />
                    ) : (
                      <div className="chat-avatar" style={{ width: 50, height: 50 }}>
                        {app.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div>
                      <div className="font-bold" style={{ fontSize: '1.05rem' }}>{app.fullName}</div>
                      <div className="text-xs text-muted">{app.phone} • {app.email}</div>
                    </div>
                  </div>
                  <span className="badge badge-purple">PENDING REVIEW</span>
                </div>

                <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)' }}>
                  <div className="text-xs text-muted" style={{ marginBottom: '2px', fontWeight: 600 }}>Reason for Applying:</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{app.reason}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)', flexWrap: 'wrap', gap: '4px' }}>
                  <span className="text-xs text-muted">Applied {app.createdAt}</span>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <span className={`badge ${app.licenseUrl ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.65rem' }}>
                      {app.licenseUrl ? '✓ License' : 'License Pending'}
                    </span>
                    <span className={`badge ${app.ghanaCardUrl ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.65rem' }}>
                      {app.ghanaCardUrl ? '✓ Ghana Card' : 'ID Pending'}
                    </span>
                    <span className={`badge ${app.selfieUrl ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.65rem' }}>
                      {app.selfieUrl ? '✓ Live Selfie' : 'Selfie Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Processed Applications */}
      {processed.length > 0 && (
        <>
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Processed Applications ({processed.length})</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Verification Proofs</th>
                  <th>Status</th>
                  <th>Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {processed.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {app.selfieUrl ? (
                          <img src={app.selfieUrl} alt={app.fullName} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '1rem' }}>👤</span>
                        )}
                        <span className="font-semibold">{app.fullName}</span>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{app.phone}</td>
                    <td className="text-sm">{app.email}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {app.licenseUrl && <span className="text-xs" title="License on file">📄</span>}
                        {app.ghanaCardUrl && <span className="text-xs" title="Ghana Card on file">🆔</span>}
                        {app.selfieUrl && <span className="text-xs" title="Live Selfie verified">📸</span>}
                      </div>
                    </td>
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

      {/* Comprehensive Application Review Modal */}
      {selected && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} onClick={() => setSelectedApp(null)}>
          <div className="modal-content animate-in" style={{ maxWidth: 700, width: '94%' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)' }}>
                  Applicant Verification Review
                </span>
                <h3 style={{ marginTop: '2px' }}>Review Application — {selected.fullName}</h3>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedApp(null)}>✕</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {/* Profile Card Header */}
              <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', padding: 'var(--space-md)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)' }}>
                {selected.selfieUrl ? (
                  <img
                    src={selected.selfieUrl}
                    alt={selected.fullName}
                    style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--byt-gold)' }}
                  />
                ) : (
                  <div className="chat-avatar" style={{ width: 72, height: 72, fontSize: '1.4rem' }}>
                    {selected.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <div className="font-bold" style={{ fontSize: '1.25rem' }}>{selected.fullName}</div>
                  <div className="text-sm text-muted">{selected.phone} • {selected.email}</div>
                  <div className="text-xs text-muted" style={{ marginTop: '3px' }}>
                    Experience: <strong>{selected.experienceYears || 3} Years</strong> • Applied: {selected.createdAt}
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Reason for Applying & Background:
                </strong>
                <div style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}>
                  {selected.reason}
                </div>
              </div>

              {/* Real Documents & Live Selfie Verification Grid */}
              <div>
                <strong style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Submitted Biometric & Document Proofs:
                </strong>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-md)' }}>
                  {/* 1. Driver's License */}
                  <div className="card" style={{ padding: 'var(--space-sm)', textAlign: 'center' }}>
                    <div className="text-xs font-semibold" style={{ marginBottom: '6px' }}>📄 Driver&apos;s License</div>
                    {selected.licenseUrl ? (
                      <div>
                        <img
                          src={selected.licenseUrl}
                          alt="License proof"
                          onClick={() => setZoomMedia({ title: `${selected.fullName} - Driver License`, url: selected.licenseUrl! })}
                          style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 4, cursor: 'pointer', border: '1px solid var(--color-border)' }}
                        />
                        <div className="text-xs text-green" style={{ marginTop: '4px', fontWeight: 600 }}>✓ Attached (Click to expand)</div>
                        {selected.licenseNumber && (
                          <div className="font-mono text-xs text-muted">{selected.licenseNumber}</div>
                        )}
                      </div>
                    ) : (
                      <div style={{ padding: '24px 8px', background: 'var(--color-bg-input)', borderRadius: 4 }}>
                        <div style={{ fontSize: '1.4rem' }}>⚠️</div>
                        <div className="text-xs text-muted">Skipped / Pending physical copy</div>
                      </div>
                    )}
                  </div>

                  {/* 2. Ghana Card */}
                  <div className="card" style={{ padding: 'var(--space-sm)', textAlign: 'center' }}>
                    <div className="text-xs font-semibold" style={{ marginBottom: '6px' }}>🆔 Ghana Card (National ID)</div>
                    {selected.ghanaCardUrl ? (
                      <div>
                        <img
                          src={selected.ghanaCardUrl}
                          alt="Ghana Card proof"
                          onClick={() => setZoomMedia({ title: `${selected.fullName} - Ghana Card`, url: selected.ghanaCardUrl! })}
                          style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 4, cursor: 'pointer', border: '1px solid var(--color-border)' }}
                        />
                        <div className="text-xs text-green" style={{ marginTop: '4px', fontWeight: 600 }}>✓ Attached (Click to expand)</div>
                        {selected.ghanaCardNumber && (
                          <div className="font-mono text-xs text-muted">{selected.ghanaCardNumber}</div>
                        )}
                      </div>
                    ) : (
                      <div style={{ padding: '24px 8px', background: 'var(--color-bg-input)', borderRadius: 4 }}>
                        <div style={{ fontSize: '1.4rem' }}>⚠️</div>
                        <div className="text-xs text-muted">Skipped / Pending physical copy</div>
                      </div>
                    )}
                  </div>

                  {/* 3. Live Selfie Verification */}
                  <div className="card" style={{ padding: 'var(--space-sm)', textAlign: 'center' }}>
                    <div className="text-xs font-semibold" style={{ marginBottom: '6px' }}>📸 Live Selfie Verification</div>
                    {selected.selfieUrl ? (
                      <div>
                        <img
                          src={selected.selfieUrl}
                          alt="Live selfie proof"
                          onClick={() => setZoomMedia({ title: `${selected.fullName} - Live Selfie Verification`, url: selected.selfieUrl! })}
                          style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 4, cursor: 'pointer', border: '1px solid var(--color-border)' }}
                        />
                        <div className="text-xs text-green" style={{ marginTop: '4px', fontWeight: 600 }}>✓ Live Selfie Captured</div>
                      </div>
                    ) : (
                      <div style={{ padding: '24px 8px', background: 'var(--color-bg-input)', borderRadius: 4 }}>
                        <div style={{ fontSize: '1.4rem' }}>⚠️</div>
                        <div className="text-xs text-muted">Selfie Pending</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn btn-ghost" style={{ color: 'var(--color-red)' }} onClick={() => handleAction(selected.id, 'REJECTED')}>
                Reject Application
              </button>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button className="btn btn-ghost" onClick={() => setSelectedApp(null)}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={() => handleAction(selected.id, 'APPROVED')}>
                  ✓ Approve & Provision Driver Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Zoom Modal */}
      {zoomMedia && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000 }} onClick={() => setZoomMedia(null)}>
          <div className="modal-content animate-in" style={{ maxWidth: 800, width: '96%', padding: 'var(--space-sm)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px' }}>
              <div className="font-semibold text-sm" style={{ color: '#fff' }}>{zoomMedia.title}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setZoomMedia(null)} style={{ color: '#fff' }}>✕</button>
            </div>
            <div style={{ textAlign: 'center', background: '#000', borderRadius: 6, overflow: 'hidden', padding: 8 }}>
              <img src={zoomMedia.url} alt={zoomMedia.title} style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
