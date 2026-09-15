'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/demo-data';

export default function DriverSalesPage() {
  const [method, setMethod] = useState<'MOMO' | 'CASH'>('MOMO');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const history = [
    { week: '2026-W38', amount: 520, method: 'MOMO', ref: 'MTN7834521098', status: 'PENDING' },
    { week: '2026-W37', amount: 495, method: 'CASH', ref: null, status: 'CONFIRMED' },
    { week: '2026-W36', amount: 530, method: 'MOMO', ref: 'MTN1234567890', status: 'CONFIRMED' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setAmount(''); setReference(''); }, 2000);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--space-lg)' }}>Weekly Sales</h2>

      {/* Submit Form */}
      <div className="card animate-in" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-header">
          <h3>Submit This Week&apos;s Sales</h3>
        </div>
        <div className="card-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>✅</div>
              <h3>Sales Submitted!</h3>
              <p className="text-sm text-muted">Your admin will confirm the payment.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Payment Method</label>
                <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
                  <button type="button" className={`btn btn-sm ${method === 'MOMO' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMethod('MOMO')} style={{ flex: 1 }}>
                    📱 Momo
                  </button>
                  <button type="button" className={`btn btn-sm ${method === 'CASH' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMethod('CASH')} style={{ flex: 1 }}>
                    💵 Cash
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Amount (GHS)</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 500.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'center' }}
                />
              </div>

              {method === 'MOMO' && (
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Momo Transaction Reference</label>
                  <input
                    className="form-input"
                    placeholder="e.g. MTN1234567890"
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                    required
                  />
                  <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                    Find this in your Momo transaction SMS or app history
                  </div>
                </div>
              )}

              {method === 'CASH' && (
                <div style={{ padding: 'var(--space-md)', background: 'var(--color-yellow-bg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                  <div className="text-sm" style={{ color: 'var(--color-yellow)' }}>
                    ⚠️ Cash payments require physical handover confirmation from admin
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full btn-lg">
                Submit Sales — {amount ? formatCurrency(parseFloat(amount)) : 'GHS 0.00'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* History */}
      <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', color: 'var(--color-text-secondary)' }}>Submission History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {history.map(h => (
          <div key={h.week} className="card">
            <div className="card-body" style={{ padding: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="font-mono font-bold" style={{ color: 'var(--byt-gold)', fontSize: '1.1rem' }}>{formatCurrency(h.amount)}</div>
                  <div className="text-xs text-muted" style={{ marginTop: '2px' }}>
                    {h.week} • <span className={`badge badge-${h.method === 'MOMO' ? 'gold' : 'cyan'}`} style={{ fontSize: '0.65rem' }}>{h.method}</span>
                    {h.ref && <span className="font-mono" style={{ marginLeft: 'var(--space-sm)' }}>{h.ref}</span>}
                  </div>
                </div>
                <span className={`badge ${h.status === 'CONFIRMED' ? 'badge-green' : 'badge-purple'}`}>{h.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
