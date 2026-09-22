'use client';

import { useState, useEffect, useRef } from 'react';
import {
  formatCurrency,
  PartsExchangeItem,
  PartIssuanceRecord,
  getStoredPartsExchange,
  saveStoredPartsExchange,
  getStoredPartIssuances,
  getStoredDrivers,
} from '@/lib/demo-data';

export default function DriverPartsPage() {
  const [activeDriverTab, setActiveDriverTab] = useState<'claims' | 'disbursed'>('claims');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [parts, setParts] = useState<PartsExchangeItem[]>([]);
  const [issuances, setIssuances] = useState<PartIssuanceRecord[]>([]);
  const [currentDriverName, setCurrentDriverName] = useState('Kwame Asante');
  const [currentPlate, setCurrentPlate] = useState('GR-1234-22');

  // Form State
  const [partName, setPartName] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'doc'>('image');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  // File input refs
  const partFileInputRef = useRef<HTMLInputElement>(null);
  const receiptFileInputRef = useRef<HTMLInputElement>(null);

  // Media preview lightbox
  const [viewingItem, setViewingItem] = useState<PartsExchangeItem | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<PartIssuanceRecord | null>(null);
  const [receiptCopied, setReceiptCopied] = useState(false);

  const loadData = () => {
    setParts(getStoredPartsExchange());
    setIssuances(getStoredPartIssuances());

    // Get current driver info if stored
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
    const handlePartsUpdate = () => setParts(getStoredPartsExchange());
    const handleIssuancesUpdate = () => setIssuances(getStoredPartIssuances());
    window.addEventListener('byt-parts-updated', handlePartsUpdate);
    window.addEventListener('byt-issuances-updated', handleIssuancesUpdate);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('byt-parts-updated', handlePartsUpdate);
      window.removeEventListener('byt-issuances-updated', handleIssuancesUpdate);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // Filter parts for this driver (or show all if Kwame)
  const myParts = parts.filter(
    p => p.driverName.toLowerCase() === currentDriverName.toLowerCase() || p.driverName === 'Kwame Asante'
  );

  // Filter issuances for this driver
  const myIssuances = issuances.filter(
    iss =>
      iss.driverName.toLowerCase() === currentDriverName.toLowerCase() ||
      iss.driverName === 'Kwame Asante' ||
      iss.vehiclePlate.toLowerCase() === currentPlate.toLowerCase()
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'part' | 'receipt') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'part') {
        setMediaUrl(result);
        setMediaType(isVideo ? 'video' : 'image');
      } else {
        setReceiptUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: PartsExchangeItem = {
      id: `p-${Date.now()}`,
      partName,
      cost: parseFloat(cost) || 0,
      date,
      reimbursementStatus: 'PENDING',
      driverName: currentDriverName,
      vehiclePlate: currentPlate,
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? mediaType : undefined,
      docUrl: receiptUrl || undefined,
      notes: notes || undefined,
    };

    const updated = [newItem, ...parts];
    saveStoredPartsExchange(updated);

    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setPartName('');
      setCost('');
      setNotes('');
      setMediaUrl(null);
      setReceiptUrl(null);
    }, 1500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem', color: '#b45309', fontWeight: 800 }}>
            Fleet Maintenance & Parts
          </span>
          <h2 style={{ marginTop: '2px', fontSize: '1.5rem', fontWeight: 800 }}>Parts & Service Portal</h2>
          <p className="subtitle" style={{ fontSize: '0.95rem', color: '#334155' }}>
            Driver: <strong style={{ color: '#0f172a' }}>{currentDriverName}</strong> • Vehicle: <span className="font-mono font-bold" style={{ color: '#0891b2' }}>{currentPlate}</span>
          </p>
        </div>
        {activeDriverTab === 'claims' && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Log Part Exchange'}
          </button>
        )}
      </div>

      {/* Driver Tab Switcher */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          gap: '2px',
          background: 'var(--color-bg-input)',
          borderRadius: 'var(--radius-md)',
          padding: '3px',
          marginBottom: 'var(--space-lg)',
          width: 'fit-content',
          border: '1px solid var(--color-border)',
          flexWrap: 'wrap',
        }}
      >
        <button
          className={`btn btn-sm ${activeDriverTab === 'claims' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveDriverTab('claims')}
          style={{ padding: '0.4rem 1rem' }}
        >
          🔧 My Exchange Claims ({myParts.length})
        </button>
        <button
          className={`btn btn-sm ${activeDriverTab === 'disbursed' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveDriverTab('disbursed')}
          style={{ padding: '0.4rem 1rem' }}
        >
          📜 Fleet Disbursed Parts & Receipts ({myIssuances.length})
        </button>
      </div>

      {/* ── TAB 1: CLAIMS & REIMBURSEMENTS ── */}
      {activeDriverTab === 'claims' && (
        <>
          {showForm && (
            <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="card-body">
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>✅</div>
                    <h3>Part Exchange Submitted!</h3>
                    <p className="text-sm text-muted">Your request and photos have been sent to Admin for review & reimbursement.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                      <label className="form-label">Part Name / Item Replaced</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Front Brake Pads, Alternator, Oil Filter"
                        value={partName}
                        onChange={e => setPartName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                      <div className="form-group">
                        <label className="form-label">Cost (GHS)</label>
                        <input
                          className="form-input font-mono"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={cost}
                          onChange={e => setCost(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date of Replacement</label>
                        <input
                          className="form-input"
                          type="date"
                          value={date}
                          onChange={e => setDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Real File Upload for Part Photo / Video */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                      <label className="form-label">Photo or Video of Installed Part</label>
                      <input
                        ref={partFileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: 'none' }}
                        onChange={e => handleFileUpload(e, 'part')}
                      />
                      <div
                        className="upload-zone"
                        onClick={() => partFileInputRef.current?.click()}
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
                              <img src={mediaUrl} alt="Part preview" style={{ maxHeight: 120, borderRadius: 6, margin: '0 auto 8px' }} />
                            )}
                            <div className="text-xs text-green" style={{ fontWeight: 600 }}>✓ Media Attached (Tap to replace)</div>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>📷 / 🎥</div>
                            <div className="text-sm font-semibold">Tap to take photo or upload video</div>
                            <div className="text-xs text-muted">Supports JPG, PNG, MP4, MOV</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Real File Upload for Receipt */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                      <label className="form-label">Receipt / Payment Voucher</label>
                      <input
                        ref={receiptFileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        style={{ display: 'none' }}
                        onChange={e => handleFileUpload(e, 'receipt')}
                      />
                      <div
                        className="upload-zone"
                        onClick={() => receiptFileInputRef.current?.click()}
                        style={{
                          border: '2px dashed var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-md)',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: receiptUrl ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-bg-input)',
                        }}
                      >
                        {receiptUrl ? (
                          <div>
                            <img src={receiptUrl} alt="Receipt preview" style={{ maxHeight: 120, borderRadius: 6, margin: '0 auto 8px' }} />
                            <div className="text-xs text-green" style={{ fontWeight: 600 }}>✓ Receipt Attached (Tap to replace)</div>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>🧾</div>
                            <div className="text-sm font-semibold">Tap to photograph the official receipt</div>
                            <div className="text-xs text-muted">Clear snapshot of vendor receipt or invoice</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                      <label className="form-label">Notes & Comments (Optional)</label>
                      <textarea
                        className="form-input"
                        placeholder="Explain work done, shop name, or why part needed replacement..."
                        rows={2}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                      Submit Claim to Admin
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Driver's Claims History */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Your Submitted Claims
            </h3>
            <span className="text-xs text-muted">{myParts.length} records</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {myParts.length === 0 ? (
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
                  No parts logged yet. Tap &ldquo;+ Log Part Exchange&rdquo; above to file your first claim.
                </div>
              </div>
            ) : (
              myParts.map(part => (
                <div key={part.id} className="card" style={{ cursor: 'pointer', transition: 'border-color 0.2s' }} onClick={() => setViewingItem(part)}>
                  <div className="card-body" style={{ padding: 'var(--space-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="font-semibold" style={{ fontSize: '1rem', color: '#0f172a' }}>{part.partName}</span>
                          {(part.mediaUrl || part.docUrl) && (
                            <span className="badge badge-cyan" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                              📷 Media attached
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted" style={{ marginTop: '3px' }}>
                          {part.date} • Vehicle: <code className="font-mono text-xs">{part.vehiclePlate}</code> •{' '}
                          <span className="font-mono font-bold" style={{ color: 'var(--byt-gold)' }}>
                            {formatCurrency(part.cost)}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          className={`badge ${
                            part.reimbursementStatus === 'APPROVED'
                              ? 'badge-green'
                              : part.reimbursementStatus === 'REJECTED'
                              ? 'badge-red'
                              : 'badge-purple'
                          }`}
                        >
                          {part.reimbursementStatus}
                        </span>
                        <span className="text-xs text-muted">View details →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ── TAB 2: DISBURSED FLEET PARTS & RECEIPTS ── */}
      {activeDriverTab === 'disbursed' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <div>
              <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                Parts Issued from Fleet Stock to Your Vehicle
              </h3>
              <p className="text-xs text-muted" style={{ margin: '2px 0 0 0' }}>
                All replacement parts issued by Emma at the Dispatch Desk with official requisition receipts
              </p>
            </div>
            <span className="badge badge-gold font-mono">{myIssuances.length} parts issued</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {myIssuances.length === 0 ? (
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
                  No inventory parts have been disbursed to your vehicle yet.
                </div>
              </div>
            ) : (
              myIssuances.map(iss => (
                <div key={iss.id} className="card" style={{ borderLeft: '4px solid var(--byt-gold)' }}>
                  <div className="card-body" style={{ padding: 'var(--space-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="font-semibold" style={{ fontSize: '1rem', color: '#0f172a' }}>{iss.partName}</span>
                          <span className="badge badge-cyan" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                            {iss.category}
                          </span>
                          <span className="badge badge-purple font-mono" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                            {iss.receiptNumber}
                          </span>
                        </div>
                        <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                          Issued: <strong>{iss.issuedAt}</strong> • Qty: <strong>{iss.quantity} unit(s)</strong> • Vehicle:{' '}
                          <code className="font-mono text-xs">{iss.vehiclePlate}</code> • By: <strong>{iss.issuedBy}</strong>
                        </div>
                        <div className="text-xs" style={{ marginTop: '2px', color: 'var(--color-text-secondary)' }}>
                          Work Order: <em>{iss.purpose}</em>
                          {iss.notes && <span> — &ldquo;{iss.notes}&rdquo;</span>}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div className="text-xs text-muted">Value</div>
                          <div className="font-mono font-bold text-sm text-green">
                            {formatCurrency(iss.totalCost)}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px' }}
                          onClick={() => setActiveReceipt(iss)}
                          title="View and print official receipt"
                        >
                          <span>🧾</span>
                          <span>View Receipt</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Lightbox Modal for Driver Preview */}
      {viewingItem && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="modal-content animate-in" style={{ maxWidth: 560, width: '92%' }}>
            <div className="modal-header">
              <div>
                <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)' }}>
                  Part Exchange Details
                </span>
                <h3 style={{ marginTop: '2px' }}>{viewingItem.partName}</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingItem(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', padding: 'var(--space-sm)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                <div>
                  <div className="text-xs text-muted">Cost</div>
                  <div className="font-mono font-bold" style={{ color: 'var(--byt-gold)' }}>{formatCurrency(viewingItem.cost)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Status</div>
                  <span className={`badge ${viewingItem.reimbursementStatus === 'APPROVED' ? 'badge-green' : viewingItem.reimbursementStatus === 'REJECTED' ? 'badge-red' : 'badge-purple'}`}>
                    {viewingItem.reimbursementStatus}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-muted">Vehicle</div>
                  <div className="font-mono text-sm">{viewingItem.vehiclePlate}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Date</div>
                  <div className="text-sm">{viewingItem.date}</div>
                </div>
              </div>

              {viewingItem.mediaUrl ? (
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)', background: '#000', borderRadius: 'var(--radius-md)', padding: 'var(--space-sm)' }}>
                  <div className="text-xs text-muted" style={{ marginBottom: '4px', color: '#fff' }}>Installed Part Proof:</div>
                  {viewingItem.mediaType === 'video' ? (
                    <video src={viewingItem.mediaUrl} controls style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 6 }} />
                  ) : (
                    <img src={viewingItem.mediaUrl} alt="Part proof" style={{ maxWidth: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 6 }} />
                  )}
                </div>
              ) : null}

              {viewingItem.docUrl ? (
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)', background: '#000', borderRadius: 'var(--radius-md)', padding: 'var(--space-sm)' }}>
                  <div className="text-xs text-muted" style={{ marginBottom: '4px', color: '#fff' }}>Receipt Attached:</div>
                  <img src={viewingItem.docUrl} alt="Receipt proof" style={{ maxWidth: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 6 }} />
                </div>
              ) : null}

              {viewingItem.notes && (
                <div style={{ padding: 'var(--space-sm)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                  <strong style={{ display: 'block', marginBottom: '2px', color: 'var(--color-text-secondary)' }}>Your Notes:</strong>
                  {viewingItem.notes}
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setViewingItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DRIVER RECEIPT MODAL ── */}
      {activeReceipt && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', zIndex: 1100 }}>
          <div
            className="modal-content animate-in"
            style={{
              maxWidth: 680,
              width: '94%',
              maxHeight: '94vh',
              overflowY: 'auto',
              padding: 'var(--space-md)',
              background: 'var(--color-bg-card)',
            }}
          >
            {/* Top Action Bar */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-md)',
                paddingBottom: 'var(--space-sm)',
                borderBottom: '1px solid var(--color-border)',
                flexWrap: 'wrap',
                gap: 'var(--space-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>🧾</span>
                <span className="font-semibold text-sm">Official Issuance Voucher</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => window.print()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <span>🖨️</span>
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    const text = `BYT RECEIPT ${activeReceipt.receiptNumber}\nDate: ${activeReceipt.issuedAt}\nPart: ${activeReceipt.partName}\nQty: ${activeReceipt.quantity}\nCost: GHS ${activeReceipt.totalCost.toFixed(2)}\nVehicle: ${activeReceipt.vehiclePlate}`;
                    navigator.clipboard.writeText(text).then(() => {
                      setReceiptCopied(true);
                      setTimeout(() => setReceiptCopied(false), 3000);
                    });
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <span>📋</span>
                  <span>{receiptCopied ? '✓ Copied!' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setActiveReceipt(null)}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* PRINTABLE RECEIPT */}
            <div
              id="byt-printable-receipt"
              style={{
                background: '#ffffff',
                color: '#111827',
                padding: '24px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '14px',
                  marginBottom: '14px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/byt-logomark.png"
                    alt="BYT Logo"
                    style={{ width: 40, height: 40, objectFit: 'contain' }}
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                      BYT FLEET LOGISTICS
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>
                      Ring Road Central, Accra, Ghana • Tel: 0208713722
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Requisition Voucher
                  </div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: '#b45309' }}>
                    {activeReceipt.receiptNumber}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>{activeReceipt.issuedAt}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: '8px', border: '1.5px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#374151', fontWeight: 800 }}>Recipient</div>
                  <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#111827' }}>{activeReceipt.driverName}</div>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#374151', fontWeight: 600 }}>Plate: {activeReceipt.vehiclePlate}</div>
                </div>
                <div style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: '8px', border: '1.5px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#374151', fontWeight: 800 }}>Dispatch Purpose</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>{activeReceipt.purpose}</div>
                  <div style={{ fontSize: '0.85rem', color: '#374151' }}>By: <strong style={{ color: '#111827' }}>{activeReceipt.issuedBy}</strong></div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '14px', color: '#111827' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', color: '#1f2937', fontWeight: 700 }}>Item Disbursed</th>
                    <th style={{ padding: '10px 12px', color: '#1f2937', fontWeight: 700, textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '10px 12px', color: '#1f2937', fontWeight: 700, textAlign: 'right' }}>Unit Cost</th>
                    <th style={{ padding: '10px 12px', color: '#1f2937', fontWeight: 700, textAlign: 'right' }}>Total (GHS)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>{activeReceipt.partName}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 700 }}>{activeReceipt.quantity}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>{formatCurrency(activeReceipt.unitCost)}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, fontFamily: 'monospace' }}>{formatCurrency(activeReceipt.totalCost)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style={{ background: '#f9fafb', borderTop: '2px solid #d1d5db' }}>
                    <td colSpan={3} style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'right', fontSize: '0.95rem' }}>Total:</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#047857', fontFamily: 'monospace', fontSize: '1.05rem' }}>
                      {formatCurrency(activeReceipt.totalCost)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'inline-block', border: '2px dashed #059669', borderRadius: '6px', padding: '6px 16px', color: '#059669', fontSize: '0.82rem', fontWeight: 800 }}>
                  ★ OFFICIAL BYT DISBURSEMENT VOUCHER • VERIFIED ★
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Driver Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #byt-printable-receipt,
          #byt-printable-receipt * {
            visibility: visible !important;
          }
          #byt-printable-receipt {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 24px !important;
            margin: 0 !important;
            z-index: 9999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
