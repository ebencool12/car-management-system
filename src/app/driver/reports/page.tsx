'use client';

import { useState, useEffect, useRef } from 'react';
import {
  DriverReport,
  getStoredReports,
  saveStoredReports,
  getStoredDrivers,
} from '@/lib/demo-data';

export default function DriverReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'ISSUE' | 'ABSENCE'>('ISSUE');
  const [severity, setSeverity] = useState<'RED' | 'YELLOW' | 'GREEN'>('YELLOW');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reports, setReports] = useState<DriverReport[]>([]);
  const [currentDriverName, setCurrentDriverName] = useState('Kwame Asante');
  const [currentPlate, setCurrentPlate] = useState('GR-1234-22');

  // Media upload state
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox preview modal
  const [viewingReport, setViewingReport] = useState<DriverReport | null>(null);

  const loadData = () => {
    setReports(getStoredReports());
    const drivers = getStoredDrivers();
    const activeDriver = drivers.find(d => d.status === 'ACTIVE') || drivers[0];
    if (activeDriver) {
      setCurrentDriverName(activeDriver.name);
      if (activeDriver.vehicle?.plateNumber) {
        setCurrentPlate(activeDriver.vehicle.plateNumber);
      }
    }
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

  const myReports = reports.filter(
    r => r.driverName.toLowerCase() === currentDriverName.toLowerCase() || r.driverName === 'Kwame Asante'
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const reader = new FileReader();
    reader.onload = () => {
      setMediaUrl(reader.result as string);
      setMediaType(isVideo ? 'video' : 'image');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: DriverReport = {
      id: `rep-${Date.now()}`,
      type,
      description,
      suggestedSeverity: type === 'ISSUE' ? severity : null,
      status: 'NEW',
      driverName: currentDriverName,
      vehiclePlate: type === 'ISSUE' ? currentPlate : null,
      createdAt: new Date().toISOString(),
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? mediaType : undefined,
    };

    const updated = [newReport, ...reports];
    saveStoredReports(updated);

    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setDescription('');
      setMediaUrl(null);
    }, 1500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)', fontWeight: 700 }}>
            Operations & Incidents
          </span>
          <h2 style={{ marginTop: '2px' }}>Driver Reports</h2>
          <p className="subtitle" style={{ fontSize: '0.85rem' }}>
            Logged driver: <strong>{currentDriverName}</strong> • Report breakdown, mechanical faults, or scheduled absence
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Incident Report'}
        </button>
      </div>

      {/* New Report Form */}
      {showForm && (
        <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="card-body">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>✅</div>
                <h3>Report Submitted to Dispatch!</h3>
                <p className="text-sm text-muted">Management has been alerted in real time.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Report Category</label>
                  <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${type === 'ISSUE' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setType('ISSUE')}
                      style={{ flex: 1 }}
                    >
                      🚗 Vehicle / Mechanical Issue
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${type === 'ABSENCE' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setType('ABSENCE')}
                      style={{ flex: 1 }}
                    >
                      🏠 Absence / Emergency Leave
                    </button>
                  </div>
                </div>

                {type === 'ISSUE' && (
                  <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                    <label className="form-label">Suggested Urgency & Severity</label>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                      {(['RED', 'YELLOW', 'GREEN'] as const).map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSeverity(s)}
                          className={`btn btn-sm ${severity === s ? '' : 'btn-ghost'}`}
                          style={{
                            flex: 1,
                            background:
                              severity === s
                                ? s === 'RED'
                                  ? 'rgba(239, 68, 68, 0.15)'
                                  : s === 'YELLOW'
                                  ? 'rgba(245, 158, 11, 0.15)'
                                  : 'rgba(16, 185, 129, 0.15)'
                                : undefined,
                            color:
                              severity === s
                                ? s === 'RED'
                                  ? 'var(--color-red)'
                                  : s === 'YELLOW'
                                  ? 'var(--color-yellow)'
                                  : 'var(--color-green)'
                                : undefined,
                            border:
                              severity === s
                                ? `1px solid ${
                                    s === 'RED'
                                      ? 'rgba(239, 68, 68, 0.4)'
                                      : s === 'YELLOW'
                                      ? 'rgba(245, 158, 11, 0.4)'
                                      : 'rgba(16, 185, 129, 0.4)'
                                  }`
                                : '1px solid var(--color-border)',
                          }}
                        >
                          {s === 'RED' ? '🔴 Critical Emergency' : s === 'YELLOW' ? '🟡 Moderate Attention' : '🟢 Minor / Advisory'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Incident Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder={
                      type === 'ISSUE'
                        ? 'Describe the issue in detail (e.g. Engine knocking at 60km/h, front tire flat on motorway)...'
                        : 'Explain reason for leave and estimated days absent...'
                    }
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Real File Upload */}
                <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                  <label className="form-label">Photo or Video Proof (Optional)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                  <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-md)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: mediaUrl ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-bg-input)',
                    }}
                  >
                    {mediaUrl ? (
                      <div>
                        {mediaType === 'video' ? (
                          <video src={mediaUrl} controls style={{ maxHeight: 120, borderRadius: 6, margin: '0 auto 8px' }} />
                        ) : (
                          <img src={mediaUrl} alt="Report evidence preview" style={{ maxHeight: 120, borderRadius: 6, margin: '0 auto 8px' }} />
                        )}
                        <div className="text-xs text-green" style={{ fontWeight: 600 }}>✓ Evidence Attached (Tap to change)</div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>📷 / 🎥</div>
                        <div className="text-sm font-semibold">Tap to upload photo or record video evidence</div>
                        <div className="text-xs text-muted">Supports camera snapshots, screenshots, or short videos</div>
                      </>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Submit Incident Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reports List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Your Incident History
        </h3>
        <span className="text-xs text-muted">{myReports.length} reports filed</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {myReports.length === 0 ? (
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
              No reports filed yet. If you experience an issue with your vehicle or need emergency absence, tap &ldquo;+ New Incident Report&rdquo;.
            </div>
          </div>
        ) : (
          myReports.map(report => (
            <div
              key={report.id}
              className="card"
              style={{ cursor: 'pointer', transition: 'border-color 0.2s' }}
              onClick={() => setViewingReport(report)}
            >
              <div className="card-body" style={{ padding: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1rem' }}>{report.type === 'ISSUE' ? '🚗' : '🏠'}</span>
                      <span className="font-semibold text-sm">
                        {report.type === 'ISSUE' ? 'Vehicle Issue' : 'Absence Report'}
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
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                          📷 Media
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)', margin: '4px 0' }}>
                      {report.description}
                    </p>
                    <div className="text-xs text-muted">
                      {new Date(report.createdAt).toLocaleString()} {report.vehiclePlate ? `• Vehicle: ${report.vehiclePlate}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className={`badge ${
                        report.status === 'RESOLVED'
                          ? 'badge-green'
                          : report.status === 'ACKNOWLEDGED'
                          ? 'badge-cyan'
                          : 'badge-purple'
                      }`}
                    >
                      {report.status}
                    </span>
                    <span className="text-xs text-muted">View →</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox Modal */}
      {viewingReport && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="modal-content animate-in" style={{ maxWidth: 560, width: '92%' }}>
            <div className="modal-header">
              <div>
                <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)' }}>
                  Incident Report Summary
                </span>
                <h3 style={{ marginTop: '2px' }}>{viewingReport.type === 'ISSUE' ? '🚗 Vehicle Issue' : '🏠 Absence Notice'}</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingReport(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', padding: 'var(--space-sm)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                <div>
                  <div className="text-xs text-muted">Report Status</div>
                  <span className={`badge ${viewingReport.status === 'RESOLVED' ? 'badge-green' : viewingReport.status === 'ACKNOWLEDGED' ? 'badge-cyan' : 'badge-purple'}`}>
                    {viewingReport.status}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-muted">Severity</div>
                  <div className="font-semibold text-sm">{viewingReport.suggestedSeverity || 'Standard'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Vehicle</div>
                  <div className="font-mono text-sm">{viewingReport.vehiclePlate || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Submitted</div>
                  <div className="text-sm">{new Date(viewingReport.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Full Description:</strong>
                <p style={{ background: 'var(--color-bg-surface)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                  {viewingReport.description}
                </p>
              </div>

              {viewingReport.mediaUrl && (
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)', background: '#000', borderRadius: 'var(--radius-md)', padding: 'var(--space-sm)' }}>
                  <div className="text-xs text-muted" style={{ marginBottom: '4px', color: '#fff' }}>Attached Evidence:</div>
                  {viewingReport.mediaType === 'video' ? (
                    <video src={viewingReport.mediaUrl} controls style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 6 }} />
                  ) : (
                    <img src={viewingReport.mediaUrl} alt="Report evidence" style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 6 }} />
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setViewingReport(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
