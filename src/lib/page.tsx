'use client';

import { useState } from 'react';
import { formatCurrency, demoPaymentChannels, PaymentChannel } from '@/lib/demo-data';

export default function DriverSalesPage() {
  const availableChannels = demoPaymentChannels.filter(c => c.enabledForDrivers);
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel>(availableChannels[0] || demoPaymentChannels[0]);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const history = [
    { week: '2026-W38', amount: 520, method: 'MTN Mobile Money', ref: 'MTN7834521098', status: 'PENDING' },
    { week: '2026-W37', amount: 495, method: 'Cash Handover', ref: null, status: 'CONFIRMED' },
    { week: '2026-W36', amount: 530, method: 'MTN Mobile Money', ref: 'MTN1234567890', status: 'CONFIRMED' },
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
              <h3>Sales Submitted via {selectedChannel.name}!</h3>
              <p className="text-sm text-muted">Your admin will verify and confirm the payment.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Payment Method Selector */}
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Choose Means of Payment (Approved by BYT Admin)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '6px', marginBottom: 'var(--space-sm)' }}>
                  {availableChannels.map(chan => (
                    <button
                      key={chan.id}
                      type="button"
                      className={`btn btn-sm ${selectedChannel.id === chan.id ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setSelectedChannel(chan)}
                      style={{
                        padding: '0.5rem',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        border: selectedChannel.id === chan.id ? '1px solid var(--byt-gold)' : '1px solid var(--color-border)'
                      }}
                    >
                      <span>{chan.icon}</span>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{chan.name}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Channel Details & Instructions */}
                <div style={{
                  padding: 'var(--space-md)',
                  background: 'var(--color-bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="font-semibold text-gold">{selectedChannel.name}</span>
                    <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{selectedChannel.type}</span>
                  </div>
                  {selectedChannel.accountNumber && (
                    <div style={{ margin: '2px 0' }}>
                      <span className="text-muted">Merchant / Account: </span>
                      <strong className="font-mono text-white">{selectedChannel.accountNumber}</strong>
                    </div>
                  )}
                  {selectedChannel.accountName && (
                    <div style={{ margin: '2px 0' }}>
                      <span className="text-muted">Account Name: </span>
                      <strong>{selectedChannel.accountName}</strong>
                    </div>
                  )}
                  {selectedChannel.instructions && (
                    <div className="text-xs text-muted" style={{ marginTop: '6px', borderTop: '1px solid var(--color-border)', paddingTop: '4px' }}>
                      ℹ️ {selectedChannel.instructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Sales Amount (GHS)</label>
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

              {/* Transaction Reference (if Momo or Bank) */}
              {selectedChannel.type !== 'CASH' && (
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">{selectedChannel.name} Transaction Reference</label>
                  <input
                    className="form-input"
                    placeholder="e.g. MTN1234567890 or Bank Ref ID"
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                    required
                  />
                  <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                    Copy this code from your {selectedChannel.name} SMS or confirmation notice
                  </div>
                </div>
              )}

              {/* Cash notice */}
              {selectedChannel.type === 'CASH' && (
                <div style={{ padding: 'var(--space-md)', background: 'var(--color-yellow-bg)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                  <div className="text-sm" style={{ color: 'var(--color-yellow)' }}>
                    ⚠️ Physical cash handover requires cashier receipt confirmation from BYT dispatch
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
                    {h.week} • <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{h.method}</span>
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
