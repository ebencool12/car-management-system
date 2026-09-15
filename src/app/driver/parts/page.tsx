'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/demo-data';

export default function DriverPartsPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const myParts = [
    { id: 'p1', partName: 'Front Left Tire', cost: 280, date: '2026-09-10', status: 'APPROVED' },
    { id: 'p5', partName: 'Engine Oil (5W-30)', cost: 85, date: '2026-09-05', status: 'APPROVED' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); }, 1500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <h2>Parts Exchange</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Log Part'}
        </button>
      </div>

      {showForm && (
        <div className="card animate-in" style={{ marginBottom: 'var(--space-lg)' }}>
          <div className="card-body">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>✅</div>
                <h3>Part Logged</h3>
                <p className="text-sm text-muted">Pending admin review for reimbursement.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Part Name</label>
                  <input className="form-input" placeholder="e.g. Brake Pads (Front)" required />
                </div>

                <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Cost (GHS)</label>
                    <input className="form-input" type="number" step="0.01" placeholder="0.00" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input className="form-input" type="date" required />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Photo of Part</label>
                  <div className="upload-zone">
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📷</div>
                    <div className="text-sm text-muted">Tap to take a photo of the part</div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                  <label className="form-label">Receipt Photo</label>
                  <div className="upload-zone">
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🧾</div>
                    <div className="text-sm text-muted">Tap to photograph the receipt</div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-full">Submit Part Exchange</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* History */}
      <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', color: 'var(--color-text-secondary)' }}>Your Parts History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {myParts.map(part => (
          <div key={part.id} className="card">
            <div className="card-body" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="font-semibold">{part.partName}</div>
                  <div className="text-xs text-muted" style={{ marginTop: '2px' }}>
                    {part.date} • <span className="font-mono font-bold" style={{ color: 'var(--byt-gold)' }}>{formatCurrency(part.cost)}</span>
                  </div>
                </div>
                <span className={`badge ${part.status === 'APPROVED' ? 'badge-green' : part.status === 'REJECTED' ? 'badge-red' : 'badge-purple'}`}>
                  {part.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
