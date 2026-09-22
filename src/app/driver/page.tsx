/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { formatCurrency, getStoredDrivers, saveStoredDrivers, Driver, getStoredPartsExchange } from '@/lib/demo-data';

export default function DriverHome() {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);

  // Profile Edit State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Parts Exchange for BYT debt calculation
  const [partsExchangeItems, setPartsExchangeItems] = useState<any[]>([]);

  // Paystack Remittance State
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'mtn' | 'telecel' | 'at' | 'card'>('mtn');
  const [payPhone, setPayPhone] = useState('024-123-4567');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [paySuccessReceipt, setPaySuccessReceipt] = useState<{
    reference: string;
    amount: number;
    date: string;
    method: string;
  } | null>(null);
  const [payError, setPayError] = useState('');
  const [pendingSimTx, setPendingSimTx] = useState<{
    reference: string;
    amount: number;
    method: string;
  } | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationStatusText, setVerificationStatusText] = useState('');

  // Hydrate driver from dynamic storage & sync with updates
  useEffect(() => {
    const refreshDriver = () => {
      const allDrivers = getStoredDrivers();
      let d = allDrivers.find(drv => drv.id === '1' || drv.name.toLowerCase().includes('kwame'));
      if (!d && allDrivers.length > 0) d = allDrivers[0];
      if (d) {
        setCurrentDriver(d);
        setPayPhone(d.phone);
      }
    };

    refreshDriver();
    window.addEventListener('storage', refreshDriver);
    window.addEventListener('byt-drivers-updated', refreshDriver);
    return () => {
      window.removeEventListener('storage', refreshDriver);
      window.removeEventListener('byt-drivers-updated', refreshDriver);
    };
  }, []);

  const driver = currentDriver || { name: 'Kwame Asante', email: 'kwame@bytfleet.com', balance: 150.50, phone: '024-123-4567', id: '1', dailyTarget: 100 };
  const vehicle = { plateNumber: 'GR-1234-22', make: 'Toyota', model: 'Corolla', year: 2019, severityStatus: 'GREEN' };

  // Listen for Paystack redirect callback parameters in URL (?reference=... or ?trxref=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('reference') || params.get('trxref');
    if (ref) {
      window.history.replaceState({}, '', window.location.pathname);
      setShowPaystackModal(true);
      verifyTransactionWithBackend(ref);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('byt-role');
      localStorage.removeItem('byt-user');
    } catch {}
    router.push('/');
  };

  // Load DP from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('byt-driver-dp');
      if (saved) setProfilePic(saved);
    } catch {}
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setProfilePic(base64);
      try {
        localStorage.setItem('byt-driver-dp', base64);
        const pics = JSON.parse(localStorage.getItem('byt-driver-pictures') || '{}');
        pics['1'] = base64;
        localStorage.setItem('byt-driver-pictures', JSON.stringify(pics));
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  // Hydrate parts exchange to compute what BYT owes the driver
  useEffect(() => {
    const refreshParts = () => setPartsExchangeItems(getStoredPartsExchange());
    refreshParts();
    window.addEventListener('byt-parts-updated', refreshParts);
    window.addEventListener('storage', refreshParts);
    return () => {
      window.removeEventListener('byt-parts-updated', refreshParts);
      window.removeEventListener('storage', refreshParts);
    };
  }, []);

  const handleOpenEditProfile = () => {
    setEditName(driver.name);
    setEditPhone(driver.phone);
    setEditEmail(driver.email || '');
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const allDrivers = getStoredDrivers();
    const updated = allDrivers.map(d => {
      if (d.id === driver.id || d.name === driver.name) {
        return {
          ...d,
          name: editName.trim() || d.name,
          phone: editPhone.trim() || d.phone,
          email: editEmail.trim() || d.email,
          profilePicture: profilePic || d.profilePicture,
        };
      }
      return d;
    });
    saveStoredDrivers(updated);
    setShowEditProfileModal(false);
  };

  const approvedPartsOwed = partsExchangeItems
    .filter(p => (p.driverName.toLowerCase() === driver.name.toLowerCase() || p.driverName === 'Kwame Asante') && p.reimbursementStatus === 'APPROVED')
    .reduce((sum, p) => sum + p.cost, 0);
  const creditBalance = driver.balance < 0 ? Math.abs(driver.balance) : 0;
  const whatBytOwesDriver = approvedPartsOwed + creditBalance;
  const whatDriverOwesByt = Math.max(0, driver.balance);

  const handleOpenPaystack = () => {
    const defaultAmt = driver.balance > 0 ? driver.balance : (driver as any).dailyTarget || 100;
    setPayAmount(defaultAmt.toString());
    setPayError('');
    setPaySuccessReceipt(null);
    setPendingSimTx(null);
    setShowPaystackModal(true);
  };

  /**
   * Authoritatively verifies transaction with Paystack before giving any success feedback or deducting balances.
   */
  const verifyTransactionWithBackend = async (
    reference: string,
    expectedAmount?: number,
    simulatedOutcome?: 'success' | 'failed' | 'abandoned'
  ) => {
    setVerificationLoading(true);
    setVerificationStatusText('Verifying clearance with Paystack secure servers...');
    setPayError('');

    try {
      const res = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          driverId: driver.id,
          driverName: driver.name,
          simulatedOutcome
        })
      });

      const data = await res.json();

      if (data.status && data.verified && data.paystackStatus === 'success') {
        const amt = data.amount || expectedAmount || 0;

        const allDrivers = getStoredDrivers();
        const updated = allDrivers.map(d => {
          if (d.id === driver.id || d.name === driver.name) {
            const newBal = Math.max(0, d.balance - amt);
            return { ...d, balance: newBal };
          }
          return d;
        });
        saveStoredDrivers(updated);
        setCurrentDriver(prev => prev ? { ...prev, balance: Math.max(0, prev.balance - amt) } : null);

        setPendingSimTx(null);
        setPaySuccessReceipt({
          reference: data.reference,
          amount: amt,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          method: data.channel ? `Paystack (${data.channel.toUpperCase()})` : 'Mobile Money / Card'
        });
      } else {
        setPendingSimTx(null);
        setPaySuccessReceipt(null);
        setPayError(data.message || 'Transaction Unsuccessful: Paystack did not confirm this payment. No balance was deducted.');
      }
    } catch {
      setPendingSimTx(null);
      setPaySuccessReceipt(null);
      setPayError('Verification Error: Could not connect to Paystack verification service. No balance has been deducted.');
    } finally {
      setVerificationLoading(false);
      setVerificationStatusText('');
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) {
      setPayError('Please enter a valid payment amount in GHS.');
      return;
    }

    setIsProcessingPay(true);
    setPayError('');

    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `${driver.name.toLowerCase().replace(/\s+/g, '')}@byt.com`,
          amount: amt,
          driverId: driver.id,
          driverName: driver.name,
          purpose: 'Driver Remittance / Balance Payment'
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
            email: `${driver.name.toLowerCase().replace(/\s+/g, '')}@byt.com`,
            amount: Math.round(amt * 100),
            currency: 'GHS',
            ref: ref,
            channels: [payMethod === 'card' ? 'card' : 'mobile_money'],
            callback: function(response: any) {
              verifyTransactionWithBackend(response.reference || ref, amt);
            },
            onClose: function() {
              setIsProcessingPay(false);
              setPayError('Payment Cancelled: Checkout prompt was dismissed. No balance has been deducted.');
            }
          });
          handler.openIframe();
          return;
        }

        setPendingSimTx({
          reference: ref,
          amount: amt,
          method: payMethod === 'mtn' ? 'MTN Mobile Money' : payMethod === 'telecel' ? 'Telecel Cash' : payMethod === 'at' ? 'AT Money' : 'Debit Card'
        });
      } else {
        setPayError(data.message || 'Payment initialization failed on Paystack.');
      }
    } catch {
      setPayError('Connection error with payment service.');
    } finally {
      setIsProcessingPay(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. DRIVER PROFILE CARD - Calm & Confident */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.75rem 1.5rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Avatar with subtle trigger */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#0891b2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '1.35rem',
                fontWeight: 700,
                border: '2px solid #e2e8f0',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
              title="Upload profile photo"
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Driver Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                driver.name.split(' ').map(n => n[0]).join('')
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#0f172a',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Upload photo"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </div>

          <div style={{ flex: 1, minWidth: '180px' }}>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#64748b',
                marginBottom: '0.2rem',
              }}
            >
              Driver Cockpit
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              {driver.name}
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
              ID: <span style={{ fontFamily: 'ui-monospace, monospace', color: '#0f172a', fontWeight: 600 }}>#{driver.id}</span> • {driver.phone}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleOpenEditProfile}
              style={{
                background: 'var(--byt-gold)',
                border: 'none',
                color: '#0a1628',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              ✏️ Edit Details
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#0f172a',
                fontSize: '0.74rem',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 100ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
            >
              {profilePic ? 'Change Photo' : 'Upload Photo'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. ASSIGNED VEHICLE CARD - Clean Monospace Metadata */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#64748b',
                marginBottom: '0.35rem',
              }}
            >
              Assigned Vehicle
            </div>
            <div
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              {vehicle.plateNumber}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.2rem' }}>
              {vehicle.make} {vehicle.model} • {vehicle.year}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '20px',
              color: '#166534',
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a' }} />
            <span>Operational</span>
          </div>
        </div>
      </div>

      {/* 3. DUAL BALANCE BREAKDOWN: WHAT YOU OWE vs WHAT BYT OWES YOU */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* CARD A: WHAT YOU OWE BYT */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem 1.5rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#64748b',
                }}
              >
                What You Owe BYT
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: whatDriverOwesByt > 0 ? '#dc2626' : '#16a34a',
                  background: whatDriverOwesByt > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                {whatDriverOwesByt > 0 ? 'Due for Settlement' : 'Settled ✓'}
              </span>
            </div>

            <div
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '2.2rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: whatDriverOwesByt > 0 ? '#dc2626' : '#0f172a',
                lineHeight: 1.1,
                margin: '0.5rem 0',
              }}
            >
              {formatCurrency(whatDriverOwesByt)}
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
              {whatDriverOwesByt > 0
                ? 'Weekly fleet sales remittance and operational fees due.'
                : 'Your sales remittances and vehicle account are fully up to date.'}
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={handleOpenPaystack}
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 18px',
                background: '#0891b2',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 100ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#0e7490')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#0891b2')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Pay BYT Now (MoMo &amp; Card)</span>
            </button>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.4rem' }}>
              Instant automated prompt to your phone via Paystack
            </div>
          </div>
        </div>

        {/* CARD B: WHAT BYT OWES YOU */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem 1.5rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#64748b',
                }}
              >
                What BYT Owes You
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: whatBytOwesDriver > 0 ? '#16a34a' : '#64748b',
                  background: whatBytOwesDriver > 0 ? 'rgba(22, 163, 74, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                {whatBytOwesDriver > 0 ? 'Reimbursement Approved' : 'No Claims Pending'}
              </span>
            </div>

            <div
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '2.2rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: whatBytOwesDriver > 0 ? '#16a34a' : '#0f172a',
                lineHeight: 1.1,
                margin: '0.5rem 0',
              }}
            >
              {formatCurrency(whatBytOwesDriver)}
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
              {whatBytOwesDriver > 0
                ? `${formatCurrency(approvedPartsOwed)} approved parts exchange claims + ${formatCurrency(creditBalance)} account credit.`
                : 'All approved parts reimbursements and credits have been disbursed.'}
            </p>
          </div>

          <div>
            <Link
              href="/driver/parts"
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 18px',
                background: '#f8fafc',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              <span>🔧</span>
              <span>View Parts &amp; Claims History</span>
            </Link>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.4rem' }}>
              Reflects immediately upon admin reimbursement approval
            </div>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTIONS GRID - 2-Column Responsive Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        <Link href="/driver/map" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem 1.25rem',
              textAlign: 'center',
              transition: 'border-color 100ms ease, background 100ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0891b2';
              e.currentTarget.style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            <div style={{ width: 36, height: 36, margin: '0 auto 0.75rem', color: '#0891b2' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>Live GPS Map</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>Vehicle telemetry &amp; route</div>
          </div>
        </Link>

        <Link href="/driver/sales" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem 1.25rem',
              textAlign: 'center',
              transition: 'border-color 100ms ease, background 100ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0891b2';
              e.currentTarget.style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            <div style={{ width: 36, height: 36, margin: '0 auto 0.75rem', color: '#0891b2' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>Sales &amp; Ledgers</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>Payment history &amp; targets</div>
          </div>
        </Link>

        <Link href="/driver/reports" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem 1.25rem',
              textAlign: 'center',
              transition: 'border-color 100ms ease, background 100ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0891b2';
              e.currentTarget.style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            <div style={{ width: 36, height: 36, margin: '0 auto 0.75rem', color: '#0891b2' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>Vehicle Reports</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>Defects &amp; maintenance</div>
          </div>
        </Link>

        <Link href="/driver/chat" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem 1.25rem',
              textAlign: 'center',
              transition: 'border-color 100ms ease, background 100ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0891b2';
              e.currentTarget.style.background = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            <div style={{ width: 36, height: 36, margin: '0 auto 0.75rem', color: '#0891b2' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>Fleet Chat</div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>Direct dispatch messaging</div>
          </div>
        </Link>
      </div>

      {/* 5. SESSION END CARD */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '1.5rem',
          background: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
          End Active Shift
        </div>
        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 1rem' }}>
          Signing out secures your device session until your next driving shift.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '0.82rem',
            fontWeight: 600,
            padding: '8px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 100ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign out of cockpit</span>
        </button>
      </div>

      {/* PAYSTACK REMITTANCE MODAL - Senior Product Design Standards */}
      {showPaystackModal && (
        <div
          className="modal-overlay"
          onClick={() => !isProcessingPay && setShowPaystackModal(false)}
          style={{
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="modal"
            style={{
              maxWidth: 460,
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {verificationLoading ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    border: '3px solid #e2e8f0',
                    borderTopColor: '#0891b2',
                    animation: 'spinLoader 0.7s linear infinite',
                    margin: '0 auto 1rem',
                  }}
                />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                  Verifying Gateway Clearance
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
                  {verificationStatusText || 'Communicating with Paystack verification endpoint...'}
                </p>
              </div>
            ) : pendingSimTx ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '8px',
                      background: '#ecfeff',
                      color: '#0891b2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                    }}
                  >
                    ⚡
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                      Gateway Authorization Simulator
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Testing response outcomes</div>
                  </div>
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    marginBottom: '1.25rem',
                    fontSize: '0.82rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Driver:</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{driver.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Amount:</span>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#0891b2' }}>
                      {formatCurrency(pendingSimTx.amount)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Method:</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{pendingSimTx.method}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Reference:</span>
                    <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.72rem', color: '#64748b' }}>
                      {pendingSimTx.reference}
                    </code>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => verifyTransactionWithBackend(pendingSimTx.reference, pendingSimTx.amount, 'success')}
                    style={{
                      padding: '11px 14px',
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>Simulate Successful Payment</span>
                    <span style={{ fontSize: '0.74rem', opacity: 0.85 }}>Clears balance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => verifyTransactionWithBackend(pendingSimTx.reference, pendingSimTx.amount, 'failed')}
                    style={{
                      padding: '11px 14px',
                      background: '#ffffff',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>Simulate Declined Payment</span>
                    <span style={{ fontSize: '0.74rem', color: '#dc2626' }}>Wrong PIN / Insufficient Funds</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => verifyTransactionWithBackend(pendingSimTx.reference, pendingSimTx.amount, 'abandoned')}
                    style={{
                      padding: '11px 14px',
                      background: '#ffffff',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>Simulate Cancelled by Driver</span>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>User dismissed prompt</span>
                  </button>
                </div>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setPendingSimTx(null); setPayError('Payment session cancelled.'); }}
                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    Cancel Session
                  </button>
                </div>
              </div>
            ) : paySuccessReceipt ? (
              <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.35rem', color: '#0f172a' }}>
                  Payment Confirmed
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 1.5rem' }}>
                  Remittance verified and credited to your BYT Fleet ledger.
                </p>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'left',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    fontSize: '0.82rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Amount Paid:</span>
                    <strong style={{ fontFamily: 'ui-monospace, monospace', color: '#16a34a', fontSize: '1.05rem' }}>
                      {formatCurrency(paySuccessReceipt.amount)}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Reference:</span>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.74rem' }}>{paySuccessReceipt.reference}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Method:</span>
                    <span>{paySuccessReceipt.method}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Time:</span>
                    <span>{paySuccessReceipt.date}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                    <span style={{ color: '#64748b' }}>Updated Balance:</span>
                    <strong style={{ fontFamily: 'ui-monospace, monospace', color: '#0f172a' }}>
                      {formatCurrency(driver.balance)}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPaystackModal(false)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                      Pay Remittance
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                      Mobile Money &amp; Card Gateway
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    onClick={() => setShowPaystackModal(false)}
                    style={{ padding: '4px', color: '#64748b' }}
                  >
                    ✕
                  </button>
                </div>

                {payError && (
                  <div
                    style={{
                      padding: '0.65rem 0.9rem',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      color: '#dc2626',
                      fontSize: '0.78rem',
                      marginBottom: '1rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {payError}
                  </div>
                )}

                {/* Balance summary pill */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                      Current Balance
                    </div>
                    <div style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, fontSize: '1.1rem', color: driver.balance > 0 ? '#dc2626' : '#16a34a' }}>
                      {formatCurrency(driver.balance)}
                    </div>
                  </div>
                  {driver.balance > 0 && (
                    <button
                      type="button"
                      onClick={() => setPayAmount(driver.balance.toString())}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      Fill Total Balance
                    </button>
                  )}
                </div>

                {/* Amount input */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.35rem' }}>
                    Amount (GHS)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {/* Quick Chips */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    {[50, 100, 150, 200].map(chip => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setPayAmount(chip.toString())}
                        style={{
                          background: payAmount === chip.toString() ? '#ecfeff' : '#f8fafc',
                          border: `1px solid ${payAmount === chip.toString() ? '#0891b2' : '#e2e8f0'}`,
                          color: payAmount === chip.toString() ? '#0891b2' : '#64748b',
                          fontSize: '0.72rem',
                          fontFamily: 'ui-monospace, monospace',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        +₵{chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Method selector */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.35rem' }}>
                    Channel
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { id: 'mtn', name: 'MTN MoMo' },
                      { id: 'telecel', name: 'Telecel Cash' },
                      { id: 'at', name: 'AT Money' },
                      { id: 'card', name: 'Debit Card' },
                    ].map(method => (
                      <div
                        key={method.id}
                        onClick={() => setPayMethod(method.id as any)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: `1.5px solid ${payMethod === method.id ? '#0891b2' : '#e2e8f0'}`,
                          background: payMethod === method.id ? '#f0fdfa' : '#ffffff',
                          color: payMethod === method.id ? '#0891b2' : '#0f172a',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 100ms ease',
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: payMethod === method.id ? '#0891b2' : '#cbd5e1' }} />
                        <span>{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phone input */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.35rem' }}>
                    Mobile Number for Prompt
                  </label>
                  <input
                    type="text"
                    value={payPhone}
                    onChange={(e) => setPayPhone(e.target.value)}
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
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowPaystackModal(false)}
                    style={{
                      padding: '10px 16px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingPay}
                    style={{
                      padding: '10px 20px',
                      background: '#0891b2',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: isProcessingPay ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {isProcessingPay ? 'Connecting...' : `Pay GHS ${payAmount || '0.00'}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EDIT PROFILE DETAILS MODAL */}
      {showEditProfileModal && (
        <div
          className="modal-overlay animate-in"
          style={{
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
          }}
          onClick={() => setShowEditProfileModal(false)}
        >
          <div
            className="modal-content animate-in"
            style={{ maxWidth: 480, width: '92%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)', fontWeight: 700 }}>
                  Driver Profile Sync
                </span>
                <h3 style={{ marginTop: '2px' }}>Edit Your Personal Details</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowEditProfileModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {/* Photo Preview & Upload Trigger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-sm)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)' }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: '#0891b2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      border: '2px solid var(--byt-gold)',
                    }}
                  >
                    {profilePic ? (
                      <img src={profilePic} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      editName.split(' ').map((n) => n[0]).join('')
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Profile Picture</div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '4px', fontSize: '0.74rem' }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose New Image
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-input font-mono"
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>

                <div className="text-xs text-muted">
                  💡 <em>Changes reflect immediately across the entire platform including Dispatch, Admin directory, and Reports.</em>
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowEditProfileModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
