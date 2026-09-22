'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, demoPaymentChannels, PaymentChannel, getStoredDrivers, saveStoredDrivers, demoSales, SalesRecord } from '@/lib/demo-data';

export default function DriverSalesPage() {
  const availableChannels = demoPaymentChannels.filter(c => c.enabledForDrivers);
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel>(availableChannels[0] || demoPaymentChannels[0]);
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentDriver, setCurrentDriver] = useState<any>(null);
  const [pendingSimTx, setPendingSimTx] = useState<{ reference: string; amount: number } | null>(null);
  const [manualRefMode, setManualRefMode] = useState(false);

  useEffect(() => {
    const drivers = getStoredDrivers();
    const active = drivers[0] || { id: '1', name: 'Kwame Asante', balance: 140 };
    setCurrentDriver(active);
  }, []);

  // Listen for Paystack redirect callback parameters in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('trxref');
    if (ref) {
      window.history.replaceState({}, '', window.location.pathname);
      verifySalesPaymentWithBackend(ref);
    }
  }, []);

  const history = [
    { week: '2026-W38', amount: 520, method: 'MTN Mobile Money', ref: 'PS-7834521098', status: 'CONFIRMED' },
    { week: '2026-W37', amount: 495, method: 'Cash Handover', ref: null, status: 'CONFIRMED' },
    { week: '2026-W36', amount: 530, method: 'MTN Mobile Money', ref: 'MTN1234567890', status: 'CONFIRMED' },
  ];

  /**
   * Strictly verifies transaction with Paystack backend before marking submitted or deducting balance
   */
  const verifySalesPaymentWithBackend = async (
    ref: string,
    expectedAmount?: number,
    simulatedOutcome?: 'success' | 'failed' | 'abandoned'
  ) => {
    setIsPayingOnline(true);
    setErrorMessage('');

    try {
      const drvName = currentDriver?.name || 'Kwame Asante';
      const drvId = currentDriver?.id || '1';

      const res = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: ref,
          driverId: drvId,
          driverName: drvName,
          simulatedOutcome
        })
      });

      const data = await res.json();

      if (data.status && data.verified && data.paystackStatus === 'success') {
        const val = data.amount || expectedAmount || 0;
        setReference(data.reference);

        const allDrivers = getStoredDrivers();
        const updated = allDrivers.map(d => {
          if (d.id === drvId || d.name === drvName) {
            return { ...d, balance: Math.max(0, d.balance - val) };
          }
          return d;
        });
        saveStoredDrivers(updated);

        setStatusMessage(`Payment of ${formatCurrency(val)} verified. Balance updated on file.`);
        setPendingSimTx(null);
        setSubmitted(true);
      } else {
        setPendingSimTx(null);
        setSubmitted(false);
        setErrorMessage(data.message || 'Payment Unsuccessful: Gateway clearance could not be confirmed.');
      }
    } catch {
      setPendingSimTx(null);
      setSubmitted(false);
      setErrorMessage('Verification Error: Could not connect to verification endpoint.');
    } finally {
      setIsPayingOnline(false);
    }
  };

  const handlePaystackCheckout = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      alert('Please enter a valid amount before launching payment.');
      return;
    }

    setIsPayingOnline(true);
    setErrorMessage('');
    try {
      const drvName = currentDriver?.name || 'Kwame Asante';
      const drvId = currentDriver?.id || '1';

      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `${drvName.toLowerCase().replace(/\s+/g, '')}@byt.com`,
          amount: val,
          driverId: drvId,
          driverName: drvName,
          purpose: `Weekly Sales Remittance (W38)`
        })
      });

      const data = await res.json();

      if (data.status && data.data?.reference) {
        const ref = data.data.reference;

        if (data.data.authorization_url && data.data.authorization_url.startsWith('https://checkout.paystack.com')) {
          window.location.href = data.data.authorization_url;
          return;
        }

        const pk = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
        if (pk && (window as any).PaystackPop) {
          const handler = (window as any).PaystackPop.setup({
            key: pk,
            email: `${drvName.toLowerCase().replace(/\s+/g, '')}@byt.com`,
            amount: Math.round(val * 100),
            currency: 'GHS',
            ref: ref,
            callback: function(response: any) {
              verifySalesPaymentWithBackend(response.reference || ref, val);
            },
            onClose: function() {
              setIsPayingOnline(false);
              setErrorMessage('Payment Cancelled: Checkout prompt dismissed.');
            }
          });
          handler.openIframe();
          return;
        }

        setPendingSimTx({ reference: ref, amount: val });
      } else {
        setErrorMessage(data.message || 'Payment initialization failed.');
      }
    } catch {
      setErrorMessage('Error connecting to gateway.');
    } finally {
      setIsPayingOnline(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount) || 0;
    const drvName = currentDriver?.name || 'Kwame Asante';

    const newSale: SalesRecord = {
      id: `sale-${Date.now()}`,
      driverName: drvName,
      weekLabel: '2026-W38',
      amount: val,
      paymentMethod: selectedChannel.name,
      status: selectedChannel.type === 'ONLINE' ? 'VERIFIED' : 'PENDING',
      momoReference: reference || undefined,
      date: new Date().toISOString().split('T')[0]
    };
    demoSales.unshift(newSale);

    setStatusMessage(`Sales notice submitted via ${selectedChannel.name}.`);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setAmount(''); setReference(''); }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* HEADER SECTION */}
      <div>
        <div
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#64748b',
            marginBottom: '0.25rem',
          }}
        >
          Remittance Ledger
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
          Weekly Sales Submission
        </h2>
      </div>

      {/* SUBMISSION CARD - 1px Crisp Border Elevation */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem 1.75rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        {errorMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#dc2626',
              fontSize: '0.82rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: 0 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* SIMULATOR TEST PANEL (Clean, Clinical) */}
        {pendingSimTx && (
          <div
            style={{
              padding: '1.25rem',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.1rem' }}>⚡</span>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                  Gateway Response Simulator
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Reference: <code style={{ fontFamily: 'ui-monospace, monospace' }}>{pendingSimTx.reference}</code> • Amount: <strong style={{ fontFamily: 'ui-monospace, monospace' }}>{formatCurrency(pendingSimTx.amount)}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => verifySalesPaymentWithBackend(pendingSimTx.reference, pendingSimTx.amount, 'success')}
                disabled={isPayingOnline}
                style={{
                  padding: '10px 14px',
                  background: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Simulate Successful Payment</span>
                <span style={{ fontSize: '0.74rem', opacity: 0.85 }}>Credits sales ledger</span>
              </button>

              <button
                type="button"
                onClick={() => verifySalesPaymentWithBackend(pendingSimTx.reference, pendingSimTx.amount, 'failed')}
                disabled={isPayingOnline}
                style={{
                  padding: '10px 14px',
                  background: '#ffffff',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Simulate Declined Payment</span>
                <span style={{ fontSize: '0.74rem' }}>Wrong PIN / Insufficient Funds</span>
              </button>

              <button
                type="button"
                onClick={() => verifySalesPaymentWithBackend(pendingSimTx.reference, pendingSimTx.amount, 'abandoned')}
                disabled={isPayingOnline}
                style={{
                  padding: '10px 14px',
                  background: '#ffffff',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Simulate Cancelled by User</span>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Dismissed prompt</span>
              </button>
            </div>
          </div>
        )}

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#0f172a' }}>
              {statusMessage || 'Sales Record Submitted'}
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              Your payment has been processed and logged on the fleet sales ledger.
            </p>
            <button
              type="button"
              onClick={() => { setSubmitted(false); setAmount(''); setReference(''); }}
              style={{
                padding: '8px 18px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Submit Another Payment
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* PAYMENT CHANNEL SELECTOR */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#64748b',
                  marginBottom: '0.5rem',
                }}
              >
                Choose Payment Channel
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '8px',
                  marginBottom: '1rem',
                }}
              >
                {availableChannels.map(chan => (
                  <button
                    key={chan.id}
                    type="button"
                    onClick={() => setSelectedChannel(chan)}
                    style={{
                      padding: '0.65rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: '8px',
                      border: `1.5px solid ${selectedChannel.id === chan.id ? '#0891b2' : '#e2e8f0'}`,
                      background: selectedChannel.id === chan.id ? '#f0fdfa' : '#ffffff',
                      color: selectedChannel.id === chan.id ? '#0891b2' : '#0f172a',
                      cursor: 'pointer',
                      transition: 'all 100ms ease',
                      textAlign: 'center',
                    }}
                  >
                    {chan.name}
                  </button>
                ))}
              </div>

              {/* Selected Channel Metadata */}
              <div
                style={{
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.82rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedChannel.name}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: '#ecfeff',
                      color: '#0891b2',
                    }}
                  >
                    {selectedChannel.type}
                  </span>
                </div>
                {selectedChannel.accountNumber && (
                  <div style={{ color: '#64748b' }}>
                    Account / Number: <strong style={{ fontFamily: 'ui-monospace, monospace', color: '#0f172a' }}>{selectedChannel.accountNumber}</strong>
                  </div>
                )}
                {selectedChannel.instructions && (
                  <div style={{ color: '#64748b', fontSize: '0.76rem', marginTop: '4px', borderTop: '1px solid #e2e8f0', paddingTop: '4px' }}>
                    {selectedChannel.instructions}
                  </div>
                )}
              </div>
            </div>

            {/* AMOUNT INPUT */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#64748b',
                  marginBottom: '0.45rem',
                }}
              >
                Sales Amount (GHS)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="500.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Automated Paystack prompt button */}
            {(selectedChannel.type === 'MOMO' || selectedChannel.type === 'ONLINE') && !manualRefMode ? (
              <div style={{ marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={handlePaystackCheckout}
                  disabled={isPayingOnline || !amount || parseFloat(amount) <= 0}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#0891b2',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.94rem',
                    fontWeight: 600,
                    cursor: isPayingOnline || !amount ? 'not-allowed' : 'pointer',
                    transition: 'background 100ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isPayingOnline && amount) e.currentTarget.style.background = '#0e7490';
                  }}
                  onMouseLeave={(e) => {
                    if (!isPayingOnline && amount) e.currentTarget.style.background = '#0891b2';
                  }}
                >
                  {isPayingOnline ? 'Sending prompt to phone via Paystack...' : `Pay ${amount ? formatCurrency(parseFloat(amount)) : 'Sales'} with ${selectedChannel.name}`}
                </button>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.5rem' }}>
                  An automated prompt will be sent directly to your phone. Enter your PIN to clear.
                </div>

                <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setManualRefMode(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '0.76rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Transferred manually outside the app? Enter SMS reference code
                  </button>
                </div>
              </div>
            ) : (selectedChannel.type === 'MOMO' || selectedChannel.type === 'ONLINE') && manualRefMode ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', margin: 0 }}>
                    {selectedChannel.name} SMS Reference
                  </label>
                  <button
                    type="button"
                    onClick={() => setManualRefMode(false)}
                    style={{ background: 'none', border: 'none', color: '#0891b2', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    ← Switch to Phone Prompt
                  </button>
                </div>
                <input
                  placeholder="e.g. MTN1234567890 or Bank Ref ID"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginBottom: '1rem',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0891b2',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Submit Manual Sales Record — {amount ? formatCurrency(parseFloat(amount)) : 'GHS 0.00'}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ padding: '12px', background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem', color: '#854d0e' }}>
                  Physical cash handover requires receipt confirmation from the BYT fleet cashier.
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Submit Cash Handover Notice — {amount ? formatCurrency(parseFloat(amount)) : 'GHS 0.00'}
                </button>
              </div>
            )}
          </form>
        )}
      </div>

      {/* SUBMISSION HISTORY TABLE - Monospace Figures & Clean 1px Borders */}
      <div>
        <div
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#64748b',
            marginBottom: '0.75rem',
          }}
        >
          Recent Submissions
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {history.map(h => (
            <div
              key={h.week}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                  {formatCurrency(h.amount)}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace' }}>{h.week}</span> • {h.method}
                  {h.ref && (
                    <span style={{ fontFamily: 'ui-monospace, monospace', marginLeft: '6px', color: '#94a3b8' }}>
                      ({h.ref})
                    </span>
                  )}
                </div>
              </div>
              <span
                style={{
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '3px 8px',
                  borderRadius: '12px',
                }}
              >
                {h.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
