'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  demoDrivers,
  demoSales,
  demoPaymentChannels,
  demoVehicles,
  formatCurrency,
  getBalanceLabel,
  PaymentChannel,
  Driver,
  SalesRecord,
  getStoredDrivers,
  saveStoredDrivers
} from '@/lib/demo-data';

// Demo daily remittance records (Mon-Sun) per driver for target tracking
const dailyRemittanceRecords: Record<string, Record<string, number[]>> = {
  '2026-W38': {
    '1': [100, 110, 100, 105, 100, 115, 0], // Kwame Asante: 630 (105%)
    '2': [100, 100, 100, 100, 100, 100, 0], // Ama Mensah: 600 (100%)
    '3': [80, 85, 75, 90, 70, 80, 0],       // Kofi Boateng: 480 (80%)
    '4': [50, 60, 45, 70, 55, 60, 0],       // Yaa Serwaa: 340 (56.7%)
    '5': [95, 100, 100, 95, 100, 95, 0],    // Kwesi Appiah: 585 (97.5%)
    '6': [85, 90, 80, 85, 90, 85, 0],       // Akua Donkor: 515 (85.8%)
    '7': [105, 100, 110, 100, 100, 100, 0], // Nana Osei: 615 (102.5%)
    '8': [90, 95, 90, 100, 95, 90, 0],      // Efua Amoah: 560 (93.3%)
    '12': [75, 80, 70, 75, 80, 70, 0],      // Adwoa Poku: 450 (75%)
  },
  '2026-W37': {
    '1': [100, 100, 105, 100, 110, 100, 0],
    '2': [100, 100, 100, 100, 100, 100, 0],
    '3': [90, 85, 80, 85, 90, 80, 0],
    '4': [65, 70, 60, 65, 70, 60, 0],
    '5': [100, 100, 100, 100, 100, 100, 0],
    '6': [85, 85, 85, 90, 85, 90, 0],
    '7': [100, 105, 100, 100, 105, 100, 0],
    '8': [95, 95, 90, 95, 95, 90, 0],
    '12': [80, 75, 80, 75, 80, 75, 0],
  }
};

export interface BalanceAdjustmentRecord {
  id: string;
  driverId: string;
  driverName: string;
  previousBalance: number;
  newBalance: number;
  amount: number;
  direction: 'DRIVER_OWES_BYT' | 'BYT_OWES_DRIVER' | 'SETTLED';
  mode: 'SET_EXACT' | 'ADJUST';
  reason: string;
  note?: string;
  timestamp: string;
  date: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<SalesRecord[]>(demoSales);
  const [drivers, setDrivers] = useState<Driver[]>(demoDrivers);

  useEffect(() => {
    setDrivers(getStoredDrivers());

    const handleUpdate = () => {
      setDrivers(getStoredDrivers());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('byt-drivers-updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('byt-drivers-updated', handleUpdate);
    };
  }, []);
  const [channels, setChannels] = useState<PaymentChannel[]>(demoPaymentChannels);
  const [activeTab, setActiveTab] = useState<'sales' | 'remittance' | 'balances' | 'channels'>('sales');
  const [weekFilter, setWeekFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Daily remittance tracking state
  const [remittanceWeek, setRemittanceWeek] = useState('2026-W38');
  const [complianceFilter, setComplianceFilter] = useState<'ALL' | 'MET' | 'PARTIAL' | 'AT_RISK'>('ALL');
  const [remittanceSearch, setRemittanceSearch] = useState('');
  const [nudgeAlert, setNudgeAlert] = useState<string | null>(null);

  // Settlement modal
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMethod, setSettleMethod] = useState('');
  const [settleReference, setSettleReference] = useState('');
  const [settleDirection, setSettleDirection] = useState<'RECEIVE_FROM_DRIVER' | 'PAY_TO_DRIVER'>('RECEIVE_FROM_DRIVER');
  const [settleSuccess, setSettleSuccess] = useState('');

  // Punch Driver Balance Modal State
  const [showPunchModal, setShowPunchModal] = useState(false);
  const [punchDriverId, setPunchDriverId] = useState('');
  const [punchDirection, setPunchDirection] = useState<'DRIVER_OWES_BYT' | 'BYT_OWES_DRIVER' | 'SETTLED'>('DRIVER_OWES_BYT');
  const [punchMode, setPunchMode] = useState<'SET_EXACT' | 'ADJUST'>('SET_EXACT');
  const [punchAmount, setPunchAmount] = useState('');
  const [punchReason, setPunchReason] = useState('Weekly Remittance Deficit / Debt');
  const [punchNote, setPunchNote] = useState('');
  const [punchSuccessMessage, setPunchSuccessMessage] = useState<string | null>(null);

  // Balance table filtering & audit log
  const [balanceFilter, setBalanceFilter] = useState<'ALL' | 'DRIVER_OWES' | 'BYT_OWES' | 'SETTLED'>('ALL');
  const [balanceSearch, setBalanceSearch] = useState('');
  const [showAdjustmentLog, setShowAdjustmentLog] = useState(false);

  // Paystack Integration state
  const [paystackWebhookUrl, setPaystackWebhookUrl] = useState('');
  const [paystackCopied, setPaystackCopied] = useState(false);
  const [paystackTesting, setPaystackTesting] = useState(false);
  const [paystackTestStatus, setPaystackTestStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPaystackWebhookUrl(`${window.location.origin}/api/paystack/webhook`);
    }
  }, []);

  const handleTestPaystack = async () => {
    setPaystackTesting(true);
    setPaystackTestStatus(null);
    try {
      const res = await fetch('/api/paystack/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'charge.success',
          data: {
            amount: 10000,
            reference: `test-ref-${Date.now()}`,
            metadata: {
              driverId: drivers[0]?.id || '1',
              driverName: drivers[0]?.name || 'Kwame Asante',
              purpose: 'Gateway Health Check Test'
            }
          }
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPaystackTestStatus('✅ Paystack Gateway & Webhook verified successfully! Live reconciliation is active.');
      } else {
        setPaystackTestStatus('⚠️ Webhook responded: ' + (data.message || JSON.stringify(data)));
      }
    } catch (err: any) {
      setPaystackTestStatus('❌ Webhook test failed: ' + (err.message || 'Network error'));
    } finally {
      setPaystackTesting(false);
    }
  };

  // Balance Adjustments Audit History
  const [balanceAdjustments, setBalanceAdjustments] = useState<BalanceAdjustmentRecord[]>([]);

  useEffect(() => {
    try {
      const savedAdj = localStorage.getItem('byt-balance-adjustments');
      if (savedAdj) {
        setBalanceAdjustments(JSON.parse(savedAdj));
      } else {
        const initialAdj: BalanceAdjustmentRecord[] = [
          {
            id: 'adj-1',
            driverId: '1',
            driverName: 'Kwame Asante',
            previousBalance: 0,
            newBalance: 240,
            amount: 240,
            direction: 'DRIVER_OWES_BYT',
            mode: 'SET_EXACT',
            reason: 'Weekly Remittance Deficit / Debt',
            note: 'Shortfall on Thursday shift remittance',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
          },
          {
            id: 'adj-2',
            driverId: '2',
            driverName: 'Ama Mensah',
            previousBalance: 0,
            newBalance: -150,
            amount: 150,
            direction: 'BYT_OWES_DRIVER',
            mode: 'SET_EXACT',
            reason: 'Bonus / Reimbursement',
            note: 'Exceeded weekly 100% remittance target bonus',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            date: new Date(Date.now() - 172800000).toISOString().split('T')[0]
          }
        ];
        setBalanceAdjustments(initialAdj);
        localStorage.setItem('byt-balance-adjustments', JSON.stringify(initialAdj));
      }
    } catch {}
  }, []);

  // Channel edit modal
  const [editingChannel, setEditingChannel] = useState<PaymentChannel | null>(null);
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'MOMO' | 'CASH' | 'BANK'>('MOMO');
  const [newChannelIcon, setNewChannelIcon] = useState('📱');
  const [newChannelAccNum, setNewChannelAccNum] = useState('');
  const [newChannelAccName, setNewChannelAccName] = useState('');
  const [newChannelNotes, setNewChannelNotes] = useState('');

  const filteredSales = sales.filter(s => {
    const matchWeek = weekFilter === 'ALL' || s.weekLabel === weekFilter;
    const matchMethod = methodFilter === 'ALL' || s.paymentMethod === methodFilter;
    const matchSearch = s.driverName.toLowerCase().includes(search.toLowerCase());
    return matchWeek && matchMethod && matchSearch;
  });

  const activeDrivers = drivers.filter(d => d.status === 'ACTIVE');

  const handleConfirm = (id: string) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, confirmationStatus: 'CONFIRMED' as const } : s));
  };

  const handleToggleChannel = (id: string, field: 'enabledForDrivers' | 'enabledForDisbursement') => {
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, [field]: !c[field] };
      }
      return c;
    }));
  };

  const handleOpenSettle = (driver: Driver) => {
    setSelectedDriver(driver);
    setSettleAmount(Math.abs(driver.balance).toString());
    setSettleDirection(driver.balance > 0 ? 'RECEIVE_FROM_DRIVER' : 'PAY_TO_DRIVER');
    const defaultChan = channels.find(c => driver.balance > 0 ? c.enabledForDrivers : c.enabledForDisbursement);
    setSettleMethod(defaultChan ? defaultChan.name : 'Cash Handover (Office)');
    setSettleReference('');
    setSettleSuccess('');
  };

  const handleExecuteSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    const amt = parseFloat(settleAmount);
    if (isNaN(amt) || amt <= 0) return;

    // Update driver balance
    const balanceAdjustment = settleDirection === 'RECEIVE_FROM_DRIVER' ? -amt : amt;
    const updatedDrivers = drivers.map(d => {
      if (d.id === selectedDriver.id) {
        return { ...d, balance: d.balance + balanceAdjustment };
      }
      return d;
    });
    setDrivers(updatedDrivers);
    saveStoredDrivers(updatedDrivers);

    // Record in sales list
    const newRecord: SalesRecord = {
      id: `s-${Date.now()}`,
      weekLabel: '2026-W38',
      amount: amt,
      paymentMethod: settleMethod.toLowerCase().includes('cash') ? 'CASH' : 'MOMO',
      momoReference: settleReference || `SETTLE-${Date.now().toString().slice(-6)}`,
      confirmationStatus: 'CONFIRMED',
      driverName: selectedDriver.name,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSales(prev => [newRecord, ...prev]);

    setSettleSuccess(`Settlement of ${formatCurrency(amt)} via ${settleMethod} recorded successfully!`);
    setTimeout(() => {
      setSelectedDriver(null);
      setSettleSuccess('');
    }, 1200);
  };

  const handleOpenPunchModal = (driver?: Driver) => {
    const target = driver || activeDrivers[0];
    if (target) {
      setPunchDriverId(target.id);
      if (target.balance > 0) {
        setPunchDirection('DRIVER_OWES_BYT');
        setPunchAmount(Math.abs(target.balance).toString());
      } else if (target.balance < 0) {
        setPunchDirection('BYT_OWES_DRIVER');
        setPunchAmount(Math.abs(target.balance).toString());
      } else {
        setPunchDirection('DRIVER_OWES_BYT');
        setPunchAmount('');
      }
    }
    setPunchMode('SET_EXACT');
    setPunchReason('Weekly Remittance Deficit / Debt');
    setPunchNote('');
    setPunchSuccessMessage(null);
    setShowPunchModal(true);
  };

  const handleExecutePunchBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const target = drivers.find(d => d.id === punchDriverId);
    if (!target) return;

    const amt = parseFloat(punchAmount) || 0;
    if (punchDirection !== 'SETTLED' && (isNaN(amt) || amt < 0)) {
      alert('Please enter a valid amount.');
      return;
    }

    const prevBal = target.balance;
    let newBal = 0;
    if (punchDirection === 'SETTLED') {
      newBal = 0;
    } else if (punchMode === 'SET_EXACT') {
      newBal = punchDirection === 'DRIVER_OWES_BYT' ? Math.abs(amt) : -Math.abs(amt);
    } else {
      newBal = punchDirection === 'DRIVER_OWES_BYT' ? prevBal + Math.abs(amt) : prevBal - Math.abs(amt);
    }

    // Update drivers in state & persistent storage
    const updated = drivers.map(d => (d.id === target.id ? { ...d, balance: newBal } : d));
    setDrivers(updated);
    saveStoredDrivers(updated);

    // Record adjustment entry in audit log
    const newAdj: BalanceAdjustmentRecord = {
      id: `adj-${Date.now()}`,
      driverId: target.id,
      driverName: target.name,
      previousBalance: prevBal,
      newBalance: newBal,
      amount: punchDirection === 'SETTLED' ? Math.abs(prevBal) : amt,
      direction: punchDirection,
      mode: punchMode,
      reason: punchReason,
      note: punchNote.trim() || undefined,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };

    const nextAdjustments = [newAdj, ...balanceAdjustments];
    setBalanceAdjustments(nextAdjustments);
    try {
      localStorage.setItem('byt-balance-adjustments', JSON.stringify(nextAdjustments));
    } catch {}

    const balInfo = getBalanceLabel(newBal);
    setPunchSuccessMessage(`Punched balance for ${target.name}: ${balInfo.text}`);
    setTimeout(() => {
      setShowPunchModal(false);
      setPunchSuccessMessage(null);
    }, 1200);
  };

  const handleSaveEditedChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChannel) return;

    setChannels(prev => prev.map(c => c.id === editingChannel.id ? editingChannel : c));
    setEditingChannel(null);
  };

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName) return;

    const newChan: PaymentChannel = {
      id: `pay-${Date.now()}`,
      name: newChannelName,
      type: newChannelType,
      icon: newChannelIcon,
      enabledForDrivers: true,
      enabledForDisbursement: true,
      accountNumber: newChannelAccNum,
      accountName: newChannelAccName,
      instructions: newChannelNotes
    };

    setChannels(prev => [...prev, newChan]);
    setShowAddChannelModal(false);
    setNewChannelName('');
    setNewChannelAccNum('');
    setNewChannelAccName('');
    setNewChannelNotes('');
  };

  const handleExportRemittanceCsv = () => {
    const weekData = dailyRemittanceRecords[remittanceWeek] || {};
    const rows = [
      ['Driver', 'Vehicle', 'Daily Target', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Total Remitted', 'Weekly Target', 'Compliance %', 'Status']
    ];
    activeDrivers.forEach(d => {
      const days = weekData[d.id] || [d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, 0];
      const total = days.reduce((a, b) => a + b, 0);
      const target = d.weeklyTarget || 600;
      const pct = ((total / target) * 100).toFixed(1);
      const veh = demoVehicles.find(v => v.assignedDriverName === d.name)?.plateNumber || 'Unassigned';
      const status = Number(pct) >= 95 ? 'TARGET MET' : Number(pct) >= 70 ? 'PARTIAL' : 'AT RISK';
      rows.push([d.name, veh, `${d.dailyTarget || 100}`, ...days.map(String), `${total}`, `${target}`, `${pct}%`, status]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `byt_remittance_${remittanceWeek}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendNudge = (driver: Driver) => {
    setNudgeAlert(`WhatsApp remittance reminder sent to ${driver.name} (${driver.phone})!`);
    setTimeout(() => setNudgeAlert(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* SCREEN HEADER */}
      <div className="page-header no-print" style={{ marginBottom: '1.75rem' }}>
        <div>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#0891b2',
            marginBottom: '4px'
          }}>
            FINANCIAL OPERATIONS & AUDIT
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#0f172a', margin: '0 0 6px 0' }}>
            Sales & Balances
          </h1>
          <p className="subtitle" style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
            Weekly sales submissions, daily remittance tracking, driver balances & Paystack payment channels
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#0f172a',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
          >
            <span>🖨️</span>
            <span>Print Financial Ledger</span>
          </button>
        </div>
      </div>

      {/* PRINT-ONLY OFFICIAL HEADER */}
      <div className="print-only" style={{ marginBottom: '20px', borderBottom: '2px solid #0891b2', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '22px', margin: 0, color: '#0891b2', fontWeight: 800 }}>BYT FLEET MANAGEMENT</h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569' }}>
              Official Financial Ledger & Driver Sales Report ({activeTab === 'sales' ? 'Weekly Sales Submissions' : activeTab === 'remittance' ? 'Daily Remittance Tracker' : activeTab === 'balances' ? 'Driver Balance Ledger' : 'Payment Channels'})
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
            <div><strong>Generated:</strong> {new Date().toLocaleString()}</div>
            <div><strong>Total Records:</strong> {activeTab === 'sales' ? filteredSales.length : activeTab === 'remittance' ? activeDrivers.length : drivers.length}</div>
          </div>
        </div>
      </div>

      {/* Calm Segmented Tabs */}
      <div className="no-print" style={{
        display: 'inline-flex',
        gap: '4px',
        background: '#f1f5f9',
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        marginBottom: '1.75rem',
        maxWidth: '100%',
        overflowX: 'auto',
      }}>
        {[
          { key: 'sales', label: '💰 Weekly Sales' },
          { key: 'remittance', label: '📅 Daily Remittance Tracker' },
          { key: 'balances', label: '⚖️ Driver Balances' },
          { key: 'channels', label: `💳 Payment Means & Channels (${channels.filter(c => c.enabledForDrivers).length} active)` },
        ].map(t => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key as any)}
              style={{
                padding: '0.5rem 0.95rem',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#0f172a' : '#64748b',
                background: isActive ? '#ffffff' : 'transparent',
                border: isActive ? '1px solid #e2e8f0' : '1px solid transparent',
                borderRadius: '7px',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: WEEKLY SALES */}
      {activeTab === 'sales' && (
        <>
          {/* Summary KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '1.75rem'
          }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                WEEK 38 TOTAL REMITTANCE
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', fontFamily: 'ui-monospace, monospace' }}>
                {formatCurrency(sales.filter(s => s.weekLabel === '2026-W38').reduce((sum, s) => sum + s.amount, 0))}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>
                Active Live Cycle
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                PENDING VERIFICATION
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', fontFamily: 'ui-monospace, monospace' }}>
                {sales.filter(s => s.confirmationStatus === 'PENDING').length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                Awaiting admin confirmation
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                MOBILE MONEY SUBMISSIONS
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0891b2', fontFamily: 'ui-monospace, monospace' }}>
                {sales.filter(s => s.paymentMethod === 'MOMO').length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                MTN MoMo & Telecel Cash
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                CASH OFFICE HANDOVERS
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', fontFamily: 'ui-monospace, monospace' }}>
                {sales.filter(s => s.paymentMethod === 'CASH').length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                Verified cash receipts
              </div>
            </div>
          </div>


          {/* Filters */}
          <div className="filters-bar no-print">
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search by driver name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <select className="form-select" style={{ width: 'auto' }} value={weekFilter} onChange={e => setWeekFilter(e.target.value)}>
              <option value="ALL">All Weeks</option>
              <option value="2026-W38">Week 38</option>
              <option value="2026-W37">Week 37</option>
              <option value="2026-W36">Week 36</option>
            </select>

            <select className="form-select" style={{ width: 'auto' }} value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
              <option value="ALL">All Payment Means</option>
              <option value="MOMO">Mobile Money (MOMO)</option>
              <option value="CASH">Cash Office Handover</option>
            </select>
          </div>

          {/* Sales Table */}
          <div className="table-container animate-in" style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <table>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>DRIVER</th>
                  <th style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>WEEK</th>
                  <th style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>AMOUNT</th>
                  <th style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>CHANNEL</th>
                  <th style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>TX REFERENCE</th>
                  <th style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>CLEARANCE STATUS</th>
                  <th style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(sale => (
                  <tr key={sale.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="font-semibold" style={{ color: '#0f172a' }}>{sale.driverName}</td>
                    <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', color: '#64748b' }}>{sale.weekLabel}</td>
                    <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                      {formatCurrency(sale.amount)}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: sale.paymentMethod === 'MOMO' ? '#f0fdf4' : '#f8fafc',
                        color: sale.paymentMethod === 'MOMO' ? '#16a34a' : '#475569',
                        border: `1px solid ${sale.paymentMethod === 'MOMO' ? '#bbf7d0' : '#e2e8f0'}`
                      }}>
                        {sale.paymentMethod === 'MOMO' ? '📱 Mobile Money' : '💵 Cash Handover'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: '#64748b' }}>
                      {sale.momoReference ? `[${sale.momoReference}]` : '—'}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        background: sale.confirmationStatus === 'CONFIRMED' ? '#f0fdf4' : sale.confirmationStatus === 'DISPUTED' ? '#fef2f2' : '#fffbeb',
                        color: sale.confirmationStatus === 'CONFIRMED' ? '#16a34a' : sale.confirmationStatus === 'DISPUTED' ? '#dc2626' : '#d97706',
                        border: `1px solid ${sale.confirmationStatus === 'CONFIRMED' ? '#bbf7d0' : sale.confirmationStatus === 'DISPUTED' ? '#fecaca' : '#fde68a'}`
                      }}>
                        {sale.confirmationStatus === 'CONFIRMED' ? '✓ CONFIRMED' : sale.confirmationStatus === 'DISPUTED' ? '✕ DISPUTED' : '⏳ PENDING'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {sale.confirmationStatus === 'PENDING' ? (
                        <button
                          type="button"
                          onClick={() => handleConfirm(sale.id)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            background: '#0891b2',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Confirm
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 2: DAILY REMITTANCE TRACKER (HEATMAP GRID) */}
      {activeTab === 'remittance' && (
        <div className="animate-in">
          {/* Nudge notification banner */}
          {nudgeAlert && (
            <div style={{
              padding: 'var(--space-md) var(--space-lg)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-md)',
              color: '#10b981',
              marginBottom: 'var(--space-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>📲</span>
                <span style={{ fontWeight: 600 }}>{nudgeAlert}</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setNudgeAlert(null)}>✕</button>
            </div>
          )}

          {/* Remittance Summary KPI Cards */}
          {(() => {
            const weekData = dailyRemittanceRecords[remittanceWeek] || {};
            let totalRemitted = 0;
            let totalTarget = 0;
            let metCount = 0;
            let partialCount = 0;
            let atRiskCount = 0;
            let topDriver = { name: '', pct: 0, amount: 0 };

            activeDrivers.forEach(d => {
              const days = weekData[d.id] || [d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, 0];
              const sum = days.reduce((a, b) => a + b, 0);
              const target = d.weeklyTarget || 600;
              const pct = (sum / target) * 100;
              totalRemitted += sum;
              totalTarget += target;
              if (pct >= 95) metCount++;
              else if (pct >= 70) partialCount++;
              else atRiskCount++;

              if (pct > topDriver.pct) {
                topDriver = { name: d.name, pct, amount: sum };
              }
            });

            const overallCompliance = totalTarget > 0 ? (totalRemitted / totalTarget) * 100 : 0;

            return (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '1.75rem'
              }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    {remittanceWeek} TOTAL REMITTED
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', fontFamily: 'ui-monospace, monospace' }}>
                    {formatCurrency(totalRemitted)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', fontFamily: 'ui-monospace, monospace' }}>
                    Target: {formatCurrency(totalTarget)} ({overallCompliance.toFixed(1)}%)
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    TARGET MET (≥95%)
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', fontFamily: 'ui-monospace, monospace' }}>
                    {metCount} / {activeDrivers.length}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                    Compliant active drivers
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    AT RISK DEFICIT (&lt;70%)
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: atRiskCount > 0 ? '#dc2626' : '#64748b', fontFamily: 'ui-monospace, monospace' }}>
                    {atRiskCount}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                    {partialCount} in partial compliance
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    TOP PERFORMER ({topDriver.pct.toFixed(0)}%)
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0891b2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {topDriver.name || '—'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', fontFamily: 'ui-monospace, monospace' }}>
                    Remitted {formatCurrency(topDriver.amount)}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Filters & Export Bar */}
          <div className="filters-bar no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <div className="search-box">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter by driver..."
                  value={remittanceSearch}
                  onChange={e => setRemittanceSearch(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={remittanceWeek}
                onChange={e => setRemittanceWeek(e.target.value)}
              >
                <option value="2026-W38">Week 38 (Current)</option>
                <option value="2026-W37">Week 37 (Previous)</option>
              </select>

              <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg-input)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
                {(['ALL', 'MET', 'PARTIAL', 'AT_RISK'] as const).map(filterKey => (
                  <button
                    key={filterKey}
                    type="button"
                    className={`btn btn-sm ${complianceFilter === filterKey ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                    onClick={() => setComplianceFilter(filterKey)}
                  >
                    {filterKey === 'ALL' ? 'All' : filterKey === 'MET' ? '✓ Met' : filterKey === 'PARTIAL' ? '⚠️ Partial' : '🚨 At Risk'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExportRemittanceCsv}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>📥</span>
              <span>Export CSV</span>
            </button>
          </div>

          {/* Heatmap Grid Table */}
          <div className="table-container animate-in">
            <table>
              <thead>
                <tr>
                  <th>Driver & Vehicle</th>
                  <th style={{ textAlign: 'center' }}>Daily Target</th>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <th key={day} style={{ textAlign: 'center', minWidth: 62 }}>
                      <div>{day}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 400, opacity: 0.7 }}>
                        {idx === 5 ? 'Today' : idx === 6 ? 'Rest' : ''}
                      </div>
                    </th>
                  ))}
                  <th style={{ textAlign: 'right' }}>Total</th>
                  <th style={{ textAlign: 'center' }}>Target Met</th>
                  <th style={{ textAlign: 'center' }}>Compliance</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeDrivers
                  .filter(d => d.name.toLowerCase().includes(remittanceSearch.toLowerCase()))
                  .filter(d => {
                    const weekData = dailyRemittanceRecords[remittanceWeek] || {};
                    const days = weekData[d.id] || [d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, d.dailyTarget || 100, 0];
                    const sum = days.reduce((a, b) => a + b, 0);
                    const target = d.weeklyTarget || 600;
                    const pct = (sum / target) * 100;
                    if (complianceFilter === 'MET') return pct >= 95;
                    if (complianceFilter === 'PARTIAL') return pct >= 70 && pct < 95;
                    if (complianceFilter === 'AT_RISK') return pct < 70;
                    return true;
                  })
                  .map(driver => {
                    const weekData = dailyRemittanceRecords[remittanceWeek] || {};
                    const days = weekData[driver.id] || [
                      driver.dailyTarget || 100,
                      driver.dailyTarget || 100,
                      driver.dailyTarget || 100,
                      driver.dailyTarget || 100,
                      driver.dailyTarget || 100,
                      driver.dailyTarget || 100,
                      0
                    ];
                    const totalRemitted = days.reduce((a, b) => a + b, 0);
                    const weeklyTarget = driver.weeklyTarget || 600;
                    const dailyTarget = driver.dailyTarget || 100;
                    const compliancePct = Math.min((totalRemitted / weeklyTarget) * 100, 200);
                    const assignedVeh = demoVehicles.find(v => v.assignedDriverName === driver.name);

                    const statusBadgeClass =
                      compliancePct >= 95 ? 'badge-green' :
                      compliancePct >= 70 ? 'badge-gold' : 'badge-red';
                    const statusText =
                      compliancePct >= 95 ? '✓ Target Met' :
                      compliancePct >= 70 ? '⚠️ Partial' : '🚨 At Risk';

                    return (
                      <tr key={driver.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{driver.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                            {assignedVeh ? `${assignedVeh.plateNumber} • ${assignedVeh.make} ${assignedVeh.model}` : 'No vehicle'}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 600 }}>
                          {formatCurrency(dailyTarget)}
                        </td>

                        {/* 7-day heatmap cells */}
                        {days.map((amount, dayIdx) => {
                          const isRestDay = dayIdx === 6 && amount === 0;
                          const ratio = amount / dailyTarget;
                          let cellBg = 'transparent';
                          let cellColor = 'var(--color-text)';
                          let cellBorder = '1px solid var(--color-border)';

                          if (isRestDay) {
                            cellBg = 'rgba(255,255,255,0.03)';
                            cellColor = 'var(--color-text-secondary)';
                          } else if (ratio >= 1.0) {
                            cellBg = 'rgba(16, 185, 129, 0.18)';
                            cellColor = '#10b981';
                            cellBorder = '1px solid rgba(16, 185, 129, 0.4)';
                          } else if (ratio >= 0.85) {
                            cellBg = 'rgba(59, 130, 246, 0.15)';
                            cellColor = '#3b82f6';
                            cellBorder = '1px solid rgba(59, 130, 246, 0.3)';
                          } else if (ratio >= 0.70) {
                            cellBg = 'rgba(245, 158, 11, 0.18)';
                            cellColor = '#f59e0b';
                            cellBorder = '1px solid rgba(245, 158, 11, 0.4)';
                          } else {
                            cellBg = 'rgba(239, 68, 68, 0.18)';
                            cellColor = '#ef4444';
                            cellBorder = '1px solid rgba(239, 68, 68, 0.4)';
                          }

                          const isToday = dayIdx === 5;

                          return (
                            <td key={dayIdx} style={{ textAlign: 'center', padding: '6px 4px' }}>
                              <div style={{
                                background: cellBg,
                                color: cellColor,
                                border: cellBorder,
                                borderRadius: 'var(--radius-sm)',
                                padding: '4px 2px',
                                fontFamily: 'monospace',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                outline: isToday ? '2px solid var(--byt-gold)' : 'none',
                                outlineOffset: '-1px'
                              }}>
                                {isRestDay ? 'Rest' : `₵${amount}`}
                              </div>
                            </td>
                          );
                        })}

                        {/* Total */}
                        <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>
                          <span style={{ color: totalRemitted >= weeklyTarget ? '#10b981' : totalRemitted >= weeklyTarget * 0.7 ? '#f59e0b' : '#ef4444' }}>
                            {formatCurrency(totalRemitted)}
                          </span>
                        </td>

                        {/* Target Met % */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ minWidth: 90 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '2px' }}>
                              <span style={{ fontWeight: 700 }}>{compliancePct.toFixed(0)}%</span>
                              <span className="text-muted">{formatCurrency(weeklyTarget)}</span>
                            </div>
                            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%',
                                width: `${Math.min(compliancePct, 100)}%`,
                                background: compliancePct >= 95 ? '#10b981' : compliancePct >= 70 ? '#f59e0b' : '#ef4444',
                                borderRadius: 'var(--radius-full)',
                                transition: 'width 0.4s ease'
                              }} />
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${statusBadgeClass}`}>
                            {statusText}
                          </span>
                        </td>

                        {/* Action */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{
                                fontSize: '0.72rem',
                                padding: '3px 8px',
                                color: 'var(--byt-gold)',
                                borderColor: 'rgba(212, 168, 67, 0.45)',
                                fontWeight: 700,
                                background: 'rgba(212, 168, 67, 0.1)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                              onClick={() => handleOpenPunchModal(driver)}
                              title={`Punch / adjust balance directly for ${driver.name}`}
                            >
                              <span>⚡ Punch</span>
                            </button>
                            <Link
                              href={`/admin/chat?driverId=${driver.id}`}
                              className="btn btn-sm"
                              style={{
                                fontSize: '0.72rem',
                                padding: '3px 8px',
                                color: 'var(--byt-sea-dark)',
                                border: '1px solid var(--byt-sea)',
                                background: 'rgba(8, 145, 178, 0.08)',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontWeight: 600
                              }}
                              title={`Open dispatch chat with ${driver.name}`}
                            >
                              <span>💬 Chat</span>
                            </Link>
                            {compliancePct < 95 ? (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.72rem', padding: '3px 7px' }}
                                onClick={() => handleSendNudge(driver)}
                                title={`Send WhatsApp nudge to ${driver.name}`}
                              >
                                📲 Nudge
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>✓ Met</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Heatmap Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            marginTop: 'var(--space-md)',
            padding: 'var(--space-sm) var(--space-md)',
            background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontWeight: 600 }}>Heatmap Legend:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 14, height: 14, background: 'rgba(16, 185, 129, 0.3)', border: '1px solid #10b981', borderRadius: 3 }} />
              <span>100%+ (Target Met)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 14, height: 14, background: 'rgba(59, 130, 246, 0.3)', border: '1px solid #3b82f6', borderRadius: 3 }} />
              <span>85 - 99%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 14, height: 14, background: 'rgba(245, 158, 11, 0.3)', border: '1px solid #f59e0b', borderRadius: 3 }} />
              <span>70 - 84% (Partial)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 14, height: 14, background: 'rgba(239, 68, 68, 0.3)', border: '1px solid #ef4444', borderRadius: 3 }} />
              <span>&lt;70% (At Risk)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
              <div style={{ width: 14, height: 14, border: '2px solid var(--byt-gold)', borderRadius: 3 }} />
              <span>Gold Outline = Today</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DRIVER BALANCES */}
      {activeTab === 'balances' && (
        <>
          {/* Notification banner if just punched */}
          {punchSuccessMessage && (
            <div className="card animate-in" style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#fff',
              padding: '12px 18px',
              marginBottom: 'var(--space-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <span style={{ fontWeight: 600 }}>{punchSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setPunchSuccessMessage(null)}
                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* 4 Stat Cards */}
          <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div className="stat-card red">
              <div className="stat-number text-red">
                {formatCurrency(activeDrivers.filter(d => d.balance > 0).reduce((sum, d) => sum + d.balance, 0))}
              </div>
              <div className="stat-title">Total Owed to BYT</div>
              <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                {activeDrivers.filter(d => d.balance > 0).length} drivers owing remittance / fuel debt
              </div>
            </div>

            <div className="stat-card gold">
              <div className="stat-number" style={{ color: 'var(--byt-gold)' }}>
                {formatCurrency(Math.abs(activeDrivers.filter(d => d.balance < 0).reduce((sum, d) => sum + d.balance, 0)))}
              </div>
              <div className="stat-title">BYT Owes Drivers</div>
              <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                {activeDrivers.filter(d => d.balance < 0).length} drivers owed credit / reimbursements
              </div>
            </div>

            <div className="stat-card" style={{ borderLeft: '4px solid #06b6d4' }}>
              {(() => {
                const owedToByt = activeDrivers.filter(d => d.balance > 0).reduce((sum, d) => sum + d.balance, 0);
                const bytOwes = Math.abs(activeDrivers.filter(d => d.balance < 0).reduce((sum, d) => sum + d.balance, 0));
                const net = owedToByt - bytOwes;
                return (
                  <>
                    <div className="stat-number" style={{ color: net >= 0 ? '#10b981' : 'var(--byt-gold)' }}>
                      {net >= 0 ? `+${formatCurrency(net)}` : `-${formatCurrency(Math.abs(net))}`}
                    </div>
                    <div className="stat-title">Net Fleet Position</div>
                    <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                      {net >= 0 ? 'Net Receivable by BYT' : 'Net Payable to Drivers'}
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="stat-card green">
              <div className="stat-number text-green">
                {activeDrivers.filter(d => d.balance === 0).length}
              </div>
              <div className="stat-title">Settled Drivers</div>
              <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                Zero balance accounts
              </div>
            </div>
          </div>

          {/* Filter & Action Toolbar */}
          <div className="filters-bar no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <div className="search-box">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter by driver or phone..."
                  value={balanceSearch}
                  onChange={e => setBalanceSearch(e.target.value)}
                />
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg-input)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${balanceFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                  onClick={() => setBalanceFilter('ALL')}
                >
                  All ({activeDrivers.length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${balanceFilter === 'DRIVER_OWES' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                  onClick={() => setBalanceFilter('DRIVER_OWES')}
                >
                  🔴 Drivers Owing Me ({activeDrivers.filter(d => d.balance > 0).length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${balanceFilter === 'BYT_OWES' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                  onClick={() => setBalanceFilter('BYT_OWES')}
                >
                  🟡 I Owe Drivers ({activeDrivers.filter(d => d.balance < 0).length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${balanceFilter === 'SETTLED' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                  onClick={() => setBalanceFilter('SETTLED')}
                >
                  🟢 Settled ({activeDrivers.filter(d => d.balance === 0).length})
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowAdjustmentLog(!showAdjustmentLog)}
                className={`btn btn-sm ${showAdjustmentLog ? 'btn-primary' : 'btn-secondary'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>📜</span>
                <span>Audit History ({balanceAdjustments.length})</span>
              </button>
            </div>
          </div>

          {/* Audit History Log Dropdown Section */}
          {showAdjustmentLog && (
            <div className="card animate-in" style={{
              background: 'var(--color-bg-card)',
              border: '1px solid rgba(212, 168, 67, 0.3)',
              padding: '16px 20px',
              marginBottom: 'var(--space-md)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--byt-gold)' }}>
                    📜 Recent Balance Punches & Adjustments Audit Log
                  </h4>
                  <p className="text-xs text-muted" style={{ margin: '2px 0 0' }}>
                    Transparent record of manual debits, credits, and exact balance punches
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowAdjustmentLog(false)}
                >
                  ✕ Close
                </button>
              </div>

              {balanceAdjustments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>
                  No balance adjustments recorded yet.
                </div>
              ) : (
                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '6px 8px' }}>Date</th>
                        <th style={{ padding: '6px 8px' }}>Driver</th>
                        <th style={{ padding: '6px 8px' }}>Punched Type</th>
                        <th style={{ padding: '6px 8px' }}>Amount</th>
                        <th style={{ padding: '6px 8px' }}>Resulting Balance</th>
                        <th style={{ padding: '6px 8px' }}>Reason & Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {balanceAdjustments.slice(0, 15).map(adj => (
                        <tr key={adj.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '6px 8px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                            {adj.date}
                          </td>
                          <td style={{ padding: '6px 8px', fontWeight: 600 }}>{adj.driverName}</td>
                          <td style={{ padding: '6px 8px' }}>
                            <span className={`badge ${adj.direction === 'DRIVER_OWES_BYT' ? 'badge-red' : adj.direction === 'BYT_OWES_DRIVER' ? 'badge-gold' : 'badge-green'}`} style={{ fontSize: '0.68rem' }}>
                              {adj.direction === 'DRIVER_OWES_BYT' ? 'Driver Owes Me' : adj.direction === 'BYT_OWES_DRIVER' ? 'I Owe Driver' : 'Settled'}
                            </span>
                          </td>
                          <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontWeight: 700 }}>
                            {formatCurrency(adj.amount)}
                          </td>
                          <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontWeight: 700 }}>
                            <span className={getBalanceLabel(adj.newBalance).className}>
                              {getBalanceLabel(adj.newBalance).text}
                            </span>
                          </td>
                          <td style={{ padding: '6px 8px', color: 'var(--color-text-secondary)' }}>
                            <span>{adj.reason}</span>
                            {adj.note && <span style={{ opacity: 0.7, marginLeft: '6px' }}>({adj.note})</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Driver Balances Table */}
          <div className="table-container animate-in">
            <table>
              <thead>
                <tr>
                  <th>Driver & Vehicle</th>
                  <th>Current Balance</th>
                  <th>Balance Direction</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeDrivers
                  .filter(d => {
                    const q = balanceSearch.toLowerCase().trim();
                    const matchQ = !q || d.name.toLowerCase().includes(q) || d.phone.toLowerCase().includes(q);
                    const matchFilter =
                      balanceFilter === 'ALL' ||
                      (balanceFilter === 'DRIVER_OWES' && d.balance > 0) ||
                      (balanceFilter === 'BYT_OWES' && d.balance < 0) ||
                      (balanceFilter === 'SETTLED' && d.balance === 0);
                    return matchQ && matchFilter;
                  })
                  .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
                  .map(driver => {
                    const bal = getBalanceLabel(driver.balance);
                    const assignedVeh = demoVehicles.find(v => v.assignedDriverName === driver.name || (driver.vehicle && driver.vehicle.plateNumber === v.plateNumber));
                    return (
                      <tr key={driver.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                            <div className="chat-avatar" style={{ width: 36, height: 36, fontSize: '0.75rem' }}>
                              {driver.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-semibold">{driver.name}</div>
                              <div className="text-xs text-muted">
                                📞 {driver.phone} {assignedVeh ? `• 🚗 ${assignedVeh.plateNumber}` : ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={`font-mono font-bold ${bal.className}`} style={{ fontSize: '1rem' }}>
                          {driver.balance !== 0 ? formatCurrency(driver.balance) : 'GHS 0.00'}
                        </td>
                        <td>
                          <span className={`badge ${driver.balance > 0 ? 'badge-red' : driver.balance < 0 ? 'badge-gold' : 'badge-green'}`} style={{ fontWeight: 700 }}>
                            {bal.text}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {/* Direct Punch Balance Button for Individual Driver */}
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{
                                color: 'var(--byt-gold)',
                                borderColor: 'rgba(212, 168, 67, 0.5)',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: 'rgba(212, 168, 67, 0.12)',
                                padding: '5px 12px',
                                borderRadius: 'var(--radius-sm)'
                              }}
                              onClick={() => handleOpenPunchModal(driver)}
                              title={`Directly edit & punch balance for ${driver.name}`}
                            >
                              <span>⚡</span>
                              <span>Punch Balance</span>
                            </button>

                            {/* Direct Chat with Driver Button */}
                            <Link
                              href={`/admin/chat?driverId=${driver.id}`}
                              className="btn btn-sm"
                              style={{
                                fontSize: '0.78rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '5px 10px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(8, 145, 178, 0.1)',
                                border: '1px solid var(--byt-sea)',
                                color: 'var(--byt-sea-dark)',
                                textDecoration: 'none',
                                fontWeight: 600
                              }}
                              title={`Open dispatch chat with ${driver.name}`}
                            >
                              <span>💬</span>
                              <span>Chat with Driver</span>
                            </Link>

                            {/* Settlement Action Button */}
                            {driver.balance !== 0 ? (
                              <button
                                type="button"
                                className={`btn btn-sm ${driver.balance > 0 ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => handleOpenSettle(driver)}
                              >
                                {driver.balance > 0 ? 'Receive Payment' : 'Pay Driver'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                style={{ fontSize: '0.72rem', color: '#10b981' }}
                                onClick={() => handleOpenPunchModal(driver)}
                              >
                                ✓ Settled
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 3: PAYMENT MEANS & CHANNELS CONFIGURATION */}
      {activeTab === 'channels' && (
        <div className="animate-in">
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <div>
                <h3 style={{ margin: 0 }}>Means of Payment Configuration</h3>
                <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
                  As Admin, choose which payment channels drivers are allowed to pay with, and which channels BYT uses to disburse funds to drivers.
                </p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddChannelModal(true)}>
                + Add Payment Channel
              </button>
            </div>

            {/* Paystack Automated Gateway Integration Card */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderLeft: '4px solid #0891b2',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: '8px',
                    background: '#0891b2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    ⚡
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#0891b2',
                      marginBottom: '2px'
                    }}>
                      PAYSTACK AUTOMATED RECONCILIATION
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                        Live Gateway & Webhook Synchronization
                      </h4>
                      <span style={{
                        background: '#f0fdf4',
                        color: '#16a34a',
                        border: '1px solid #bbf7d0',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                      }}>
                        ACTIVE & READY
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                      Enables real-time Mobile Money (MTN MoMo, Telecel Cash, AT Money) and Card collections with automated webhook ledger settlement.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleTestPaystack}
                    disabled={paystackTesting}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0.5rem 0.9rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0891b2'; e.currentTarget.style.color = '#0891b2'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                  >
                    <span>🧪</span>
                    <span>{paystackTesting ? 'Testing Webhook...' : 'Test Webhook & Gateway'}</span>
                  </button>
                </div>
              </div>

              {/* Status feedback message */}
              {paystackTestStatus && (
                <div style={{
                  marginTop: '14px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: paystackTestStatus.includes('✅') ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${paystackTestStatus.includes('✅') ? '#bbf7d0' : '#fecaca'}`,
                  color: paystackTestStatus.includes('✅') ? '#16a34a' : '#dc2626',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}>
                  {paystackTestStatus}
                </div>
              )}

              {/* Webhook Configuration & Keys */}
              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
                      PAYSTACK WEBHOOK ENDPOINT
                    </span>
                    <button
                      type="button"
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        color: paystackCopied ? '#16a34a' : '#0891b2',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                      onClick={() => {
                        if (paystackWebhookUrl) {
                          navigator.clipboard.writeText(paystackWebhookUrl);
                          setPaystackCopied(true);
                          setTimeout(() => setPaystackCopied(false), 2500);
                        }
                      }}
                    >
                      {paystackCopied ? '✓ Copied' : '📋 Copy URL'}
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={paystackWebhookUrl || '/api/paystack/webhook'}
                    className="font-mono"
                    style={{
                      width: '100%',
                      fontSize: '0.78rem',
                      background: '#ffffff',
                      color: '#0891b2',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '8px 10px'
                    }}
                  />
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                    Configure in Paystack Dashboard → Settings → Preferences → Webhooks
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '8px' }}>
                    SUPPORTED PAYMENT RAILS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', background: '#fff', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '6px', color: '#0f172a' }}>🟡 MTN Mobile Money</span>
                    <span style={{ fontSize: '0.72rem', background: '#fff', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '6px', color: '#0f172a' }}>🔴 Telecel Cash</span>
                    <span style={{ fontSize: '0.72rem', background: '#fff', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '6px', color: '#0f172a' }}>🔵 AT Money</span>
                    <span style={{ fontSize: '0.72rem', background: '#fff', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: '6px', color: '#0f172a' }}>💳 Visa / Mastercard</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '8px', fontFamily: 'ui-monospace, monospace' }}>
                    Environment Keys: [PAYSTACK_SECRET_KEY] &amp; [NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY]
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
              {channels.map(chan => (
                <div
                  key={chan.id}
                  style={{
                    background: 'var(--color-bg-input)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{chan.icon}</span>
                      <div>
                        <div className="font-semibold" style={{ fontSize: '0.95rem' }}>{chan.name}</div>
                        <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{chan.type}</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.75rem', padding: '2px 6px' }}
                      onClick={() => setEditingChannel({ ...chan })}
                    >
                      ✏️ Edit
                    </button>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', paddingTop: '6px' }}>
                    {chan.accountNumber && (
                      <div><strong>Account / Number:</strong> <span className="font-mono text-white">{chan.accountNumber}</span></div>
                    )}
                    {chan.accountName && (
                      <div><strong>Name:</strong> {chan.accountName}</div>
                    )}
                    {chan.instructions && (
                      <div className="text-xs text-muted" style={{ marginTop: '4px' }}>{chan.instructions}</div>
                    )}
                  </div>

                  {/* Channel Controls for Admin */}
                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '8px',
                    borderTop: '1px dashed var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    {/* Toggle: From Drivers */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        📥 <strong>Accept From Drivers:</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleChannel(chan.id, 'enabledForDrivers')}
                        className={`btn btn-sm ${chan.enabledForDrivers ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                      >
                        {chan.enabledForDrivers ? '✓ Enabled' : '✕ Disabled'}
                      </button>
                    </div>

                    {/* Toggle: For Drivers (Payouts) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        📤 <strong>Payout For Drivers:</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleChannel(chan.id, 'enabledForDisbursement')}
                        className={`btn btn-sm ${chan.enabledForDisbursement ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                      >
                        {chan.enabledForDisbursement ? '✓ Enabled' : '✕ Disabled'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RECORD SETTLEMENT MODAL */}
      {selectedDriver && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedDriver(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="modal"
            style={{
              maxWidth: 480,
              width: '100%',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.18)',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleExecuteSettlement}>
              <div className="modal-header" style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#0891b2',
                    marginBottom: '2px'
                  }}>
                    DIRECT SETTLEMENT ENTRY
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    Record Settlement
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    Driver: <strong style={{ color: '#0f172a' }}>{selectedDriver.name}</strong> • Current: <span className="font-mono" style={{ fontWeight: 700, color: '#0891b2' }}>{formatCurrency(selectedDriver.balance)}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDriver(null)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #e2e8f0',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body" style={{ padding: '1.25rem 1.5rem' }}>
                {settleSuccess && (
                  <div style={{
                    padding: '10px 14px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    color: '#16a34a',
                    marginBottom: '14px',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}>
                    {settleSuccess}
                  </div>
                )}

                {/* Direction Selector */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>Settlement Direction</label>
                  <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <button
                      type="button"
                      style={{
                        flex: 1,
                        fontSize: '0.78rem',
                        fontWeight: settleDirection === 'RECEIVE_FROM_DRIVER' ? 600 : 500,
                        padding: '6px',
                        borderRadius: '6px',
                        border: settleDirection === 'RECEIVE_FROM_DRIVER' ? '1px solid #e2e8f0' : 'none',
                        background: settleDirection === 'RECEIVE_FROM_DRIVER' ? '#ffffff' : 'transparent',
                        color: settleDirection === 'RECEIVE_FROM_DRIVER' ? '#0f172a' : '#64748b',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSettleDirection('RECEIVE_FROM_DRIVER')}
                    >
                      💰 Receive From Driver
                    </button>
                    <button
                      type="button"
                      style={{
                        flex: 1,
                        fontSize: '0.78rem',
                        fontWeight: settleDirection === 'PAY_TO_DRIVER' ? 600 : 500,
                        padding: '6px',
                        borderRadius: '6px',
                        border: settleDirection === 'PAY_TO_DRIVER' ? '1px solid #e2e8f0' : 'none',
                        background: settleDirection === 'PAY_TO_DRIVER' ? '#ffffff' : 'transparent',
                        color: settleDirection === 'PAY_TO_DRIVER' ? '#0f172a' : '#64748b',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSettleDirection('PAY_TO_DRIVER')}
                    >
                      💸 Disburse To Driver
                    </button>
                  </div>
                </div>

                {/* Means of Payment Selector */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>
                    Choose Means of Payment ({settleDirection === 'RECEIVE_FROM_DRIVER' ? 'Received From Driver' : 'Disbursed To Driver'})
                  </label>
                  <select
                    className="form-select"
                    value={settleMethod}
                    onChange={e => setSettleMethod(e.target.value)}
                    required
                    style={{ fontSize: '0.85rem', padding: '10px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  >
                    {channels
                      .filter(c => settleDirection === 'RECEIVE_FROM_DRIVER' ? c.enabledForDrivers : c.enabledForDisbursement)
                      .map(c => (
                        <option key={c.id} value={c.name}>
                          {c.icon} {c.name} {c.accountNumber ? `(${c.accountNumber})` : ''}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>Amount (GHS) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="font-mono font-bold"
                    value={settleAmount}
                    onChange={e => setSettleAmount(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', fontSize: '1.1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                {/* Reference */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>Payment / Transaction Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. Momo ID, Bank Transfer ref or Cashier Voucher #"
                    value={settleReference}
                    onChange={e => setSettleReference(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', fontSize: '0.85rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '12px 1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedDriver(null)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    padding: '0.55rem 1.25rem',
                    background: '#0891b2',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Settlement ({settleAmount ? formatCurrency(parseFloat(settleAmount) || 0) : 'GHS 0.00'})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PAYMENT CHANNEL MODAL */}
      {editingChannel && (
        <div className="modal-overlay" onClick={() => setEditingChannel(null)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSaveEditedChannel}>
              <div className="modal-header">
                <h3>Edit Payment Channel</h3>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setEditingChannel(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Channel Name</label>
                  <input
                    className="form-input"
                    value={editingChannel.name}
                    onChange={e => setEditingChannel({ ...editingChannel, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Account / Phone / Merchant Number</label>
                  <input
                    className="form-input"
                    value={editingChannel.accountNumber || ''}
                    onChange={e => setEditingChannel({ ...editingChannel, accountNumber: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Account Name</label>
                  <input
                    className="form-input"
                    value={editingChannel.accountName || ''}
                    onChange={e => setEditingChannel({ ...editingChannel, accountName: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Instructions for Drivers</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={editingChannel.instructions || ''}
                    onChange={e => setEditingChannel({ ...editingChannel, instructions: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingChannel(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW PAYMENT CHANNEL MODAL */}
      {showAddChannelModal && (
        <div className="modal-overlay" onClick={() => setShowAddChannelModal(false)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleCreateChannel}>
              <div className="modal-header">
                <h3>Add New Payment Channel</h3>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowAddChannelModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Channel Name *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Zeepay / Ecobank / Fidelity Bank"
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={newChannelType}
                      onChange={e => setNewChannelType(e.target.value as 'MOMO' | 'CASH' | 'BANK')}
                    >
                      <option value="MOMO">Mobile Money</option>
                      <option value="BANK">Bank Transfer</option>
                      <option value="CASH">Cash Office</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Icon</label>
                    <select
                      className="form-select"
                      value={newChannelIcon}
                      onChange={e => setNewChannelIcon(e.target.value)}
                    >
                      <option value="📱">📱 Mobile App</option>
                      <option value="🟡">🟡 MTN Gold</option>
                      <option value="🔴">🔴 Telecel Red</option>
                      <option value="🔵">🔵 AT Blue</option>
                      <option value="🏦">🏦 Bank</option>
                      <option value="💵">💵 Cash</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Account / Merchant Number</label>
                  <input
                    className="form-input"
                    placeholder="e.g. 024-XXXX-XXX or Account #"
                    value={newChannelAccNum}
                    onChange={e => setNewChannelAccNum(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Account Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. BYT Fleet Enterprise"
                    value={newChannelAccName}
                    onChange={e => setNewChannelAccName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Instructions for Driver</label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="Instructions visible to drivers when submitting sales..."
                    value={newChannelNotes}
                    onChange={e => setNewChannelNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddChannelModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Channel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PUNCH DRIVER BALANCE MODAL */}
      {showPunchModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPunchModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="modal"
            style={{
              maxWidth: 560,
              width: '100%',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.18)',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={handleExecutePunchBalance}>
              <div className="modal-header" style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#0891b2',
                    marginBottom: '2px'
                  }}>
                    BALANCE OVERRIDE & LEDGER PUNCH
                  </div>
                  {(() => {
                    const targetD = drivers.find(d => d.id === punchDriverId);
                    return (
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                          Adjust Balance: {targetD ? targetD.name : 'Driver'}
                        </h3>
                        <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                          Directly override or adjust ledger balance for {targetD ? targetD.name : 'selected driver'}
                        </p>
                      </div>
                    );
                  })()}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPunchModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #e2e8f0',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
                {/* 1. Driver Selector */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>Select Fleet Driver *</label>
                  <select
                    className="form-select"
                    value={punchDriverId}
                    onChange={e => {
                      const id = e.target.value;
                      setPunchDriverId(id);
                      const d = drivers.find(drv => drv.id === id);
                      if (d) {
                        if (d.balance > 0) {
                          setPunchDirection('DRIVER_OWES_BYT');
                          setPunchAmount(Math.abs(d.balance).toString());
                        } else if (d.balance < 0) {
                          setPunchDirection('BYT_OWES_DRIVER');
                          setPunchAmount(Math.abs(d.balance).toString());
                        } else {
                          setPunchDirection('DRIVER_OWES_BYT');
                          setPunchAmount('');
                        }
                      }
                    }}
                    required
                    style={{ fontSize: '0.85rem', padding: '10px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  >
                    {activeDrivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.phone}) — Current: {d.balance > 0 ? `Owes BYT GHS ${d.balance.toFixed(2)}` : d.balance < 0 ? `BYT owes GHS ${Math.abs(d.balance).toFixed(2)}` : 'Settled (GHS 0.00)'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driver Current Position Banner */}
                {(() => {
                  const currD = drivers.find(d => d.id === punchDriverId);
                  if (!currD) return null;
                  const balInfo = getBalanceLabel(currD.balance);
                  return (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                          CURRENT REGISTERED POSITION
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginTop: '2px', fontFamily: 'ui-monospace, monospace' }}>
                          {currD.name}: <span className={balInfo.className}>{balInfo.text}</span>
                        </div>
                      </div>
                      <span style={{
                        background: currD.balance > 0 ? '#fef2f2' : currD.balance < 0 ? '#fffbeb' : '#f0fdf4',
                        color: currD.balance > 0 ? '#dc2626' : currD.balance < 0 ? '#d97706' : '#16a34a',
                        border: `1px solid ${currD.balance > 0 ? '#fecaca' : currD.balance < 0 ? '#fde68a' : '#bbf7d0'}`,
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        {currD.balance === 0 ? '✓ ZERO BALANCE' : currD.balance > 0 ? 'DEBT TO BYT' : 'CREDIT WITH BYT'}
                      </span>
                    </div>
                  );
                })()}

                {/* 2. Choose Balance Direction */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#0f172a', marginBottom: '8px', fontSize: '0.8rem' }}>
                    Balance Direction (Who Owes?) *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    {/* Option 1: Driver Owes BYT */}
                    <div
                      onClick={() => setPunchDirection('DRIVER_OWES_BYT')}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '8px',
                        border: punchDirection === 'DRIVER_OWES_BYT' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                        background: punchDirection === 'DRIVER_OWES_BYT' ? '#fef2f2' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🔴</div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: punchDirection === 'DRIVER_OWES_BYT' ? '#dc2626' : '#0f172a' }}>
                        Driver Owes BYT
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                        Remittance deficit
                      </div>
                    </div>

                    {/* Option 2: BYT Owes Driver */}
                    <div
                      onClick={() => setPunchDirection('BYT_OWES_DRIVER')}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '8px',
                        border: punchDirection === 'BYT_OWES_DRIVER' ? '2px solid #0891b2' : '1px solid #e2e8f0',
                        background: punchDirection === 'BYT_OWES_DRIVER' ? '#f0f9ff' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🔵</div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: punchDirection === 'BYT_OWES_DRIVER' ? '#0891b2' : '#0f172a' }}>
                        BYT Owes Driver
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                        Bonus / Credit
                      </div>
                    </div>

                    {/* Option 3: Mark Settled */}
                    <div
                      onClick={() => {
                        setPunchDirection('SETTLED');
                        setPunchAmount('0');
                      }}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '8px',
                        border: punchDirection === 'SETTLED' ? '2px solid #16a34a' : '1px solid #e2e8f0',
                        background: punchDirection === 'SETTLED' ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🟢</div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: punchDirection === 'SETTLED' ? '#16a34a' : '#0f172a' }}>
                        Mark Settled
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                        Zero out (GHS 0)
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Punch Mode: Set Exact vs Add Adjustment */}
                {punchDirection !== 'SETTLED' && (
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ fontWeight: 600, color: '#0f172a', marginBottom: '6px', fontSize: '0.8rem' }}>
                      Punch Method
                    </label>
                    <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <button
                        type="button"
                        style={{
                          flex: 1,
                          fontSize: '0.78rem',
                          fontWeight: punchMode === 'SET_EXACT' ? 600 : 500,
                          padding: '6px',
                          borderRadius: '6px',
                          border: punchMode === 'SET_EXACT' ? '1px solid #e2e8f0' : 'none',
                          background: punchMode === 'SET_EXACT' ? '#ffffff' : 'transparent',
                          color: punchMode === 'SET_EXACT' ? '#0f172a' : '#64748b',
                          cursor: 'pointer'
                        }}
                        onClick={() => setPunchMode('SET_EXACT')}
                      >
                        🎯 Set New Exact Balance
                      </button>
                      <button
                        type="button"
                        style={{
                          flex: 1,
                          fontSize: '0.78rem',
                          fontWeight: punchMode === 'ADJUST' ? 600 : 500,
                          padding: '6px',
                          borderRadius: '6px',
                          border: punchMode === 'ADJUST' ? '1px solid #e2e8f0' : 'none',
                          background: punchMode === 'ADJUST' ? '#ffffff' : 'transparent',
                          color: punchMode === 'ADJUST' ? '#0f172a' : '#64748b',
                          cursor: 'pointer'
                        }}
                        onClick={() => setPunchMode('ADJUST')}
                      >
                        ➕ Add / Deduct Adjustment
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Amount Input + Quick Chips */}
                {punchDirection !== 'SETTLED' && (
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label className="form-label" style={{ fontWeight: 600, color: '#0f172a', margin: 0, fontSize: '0.8rem' }}>
                        {punchMode === 'SET_EXACT' ? 'Exact Balance Amount (GHS) *' : 'Adjustment Amount (GHS) *'}
                      </label>
                      <span style={{ fontSize: '0.72rem', color: '#0891b2', fontWeight: 600 }}>Ghana Cedis</span>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b', fontSize: '0.95rem' }}>
                        GHS
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="font-mono font-bold"
                        placeholder="0.00"
                        value={punchAmount}
                        onChange={e => setPunchAmount(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          paddingLeft: '54px',
                          paddingRight: '14px',
                          paddingTop: '10px',
                          paddingBottom: '10px',
                          fontSize: '1.2rem',
                          color: '#0f172a',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                    </div>

                    {/* Quick Amount Chips */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {[50, 100, 200, 300, 500, 1000].map(chip => (
                        <button
                          key={chip}
                          type="button"
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#0f172a',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                          onClick={() => {
                            if (punchMode === 'ADJUST') {
                              const curr = parseFloat(punchAmount) || 0;
                              setPunchAmount((curr + chip).toString());
                            } else {
                              setPunchAmount(chip.toString());
                            }
                          }}
                        >
                          +{chip}
                        </button>
                      ))}
                      <button
                        type="button"
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          color: '#dc2626',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                        onClick={() => setPunchAmount('')}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. Category / Reason */}
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>Reason / Category</label>
                  <select
                    className="form-select"
                    value={punchReason}
                    onChange={e => setPunchReason(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '10px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  >
                    <option value="Weekly Remittance Deficit / Debt">Weekly Remittance Deficit / Debt</option>
                    <option value="Fuel Advance / Commercial Card Credit">Fuel Advance / Commercial Card Credit</option>
                    <option value="Maintenance / Spare Parts Repair Deduction">Maintenance / Spare Parts Repair Deduction</option>
                    <option value="Bonus / Sales Incentive Payout">Bonus / Sales Incentive Payout</option>
                    <option value="Driver Cash Reimbursement">Driver Cash Reimbursement</option>
                    <option value="Opening Balance Agreement">Opening Balance Agreement</option>
                    <option value="Discrepancy Correction">Discrepancy Correction</option>
                    <option value="Other Manual Adjustment">Other Manual Adjustment</option>
                  </select>
                </div>

                {/* 6. Memo / Note */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.8rem' }}>Reference Note / Memo (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Agreed deduction for clutch replacement / extra shift credit"
                    value={punchNote}
                    onChange={e => setPunchNote(e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem', padding: '10px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                </div>

                {/* 7. Real-Time Resulting Balance Preview Box */}
                {(() => {
                  const targetD = drivers.find(d => d.id === punchDriverId);
                  const prev = targetD ? targetD.balance : 0;
                  const amt = parseFloat(punchAmount) || 0;
                  let resulting = 0;
                  if (punchDirection === 'SETTLED') {
                    resulting = 0;
                  } else if (punchMode === 'SET_EXACT') {
                    resulting = punchDirection === 'DRIVER_OWES_BYT' ? Math.abs(amt) : -Math.abs(amt);
                  } else {
                    resulting = punchDirection === 'DRIVER_OWES_BYT' ? prev + Math.abs(amt) : prev - Math.abs(amt);
                  }
                  const resultingInfo = getBalanceLabel(resulting);

                  return (
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
                          RESULTING BALANCE AFTER PUNCH
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', marginTop: '2px', fontFamily: 'ui-monospace, monospace' }}>
                          <span className={resultingInfo.className}>{resultingInfo.text}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b', fontFamily: 'ui-monospace, monospace' }}>
                        <div>Previous: <strong>{getBalanceLabel(prev).text}</strong></div>
                        <div style={{ color: '#0891b2' }}>Delta: {resulting - prev >= 0 ? `+GHS ${(resulting - prev).toFixed(2)}` : `-GHS ${Math.abs(resulting - prev).toFixed(2)}`}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '12px 1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowPunchModal(false)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    padding: '0.55rem 1.25rem',
                    background: '#0891b2',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span>⚡</span>
                  <span>Confirm & Punch Balance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Footer */}
      <div className="print-only" style={{ marginTop: '30px', paddingTop: '15px', borderTop: '1px solid #cbd5e1', fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>BYT Fleet Management — Official Sales & Balances Record</span>
        <span>Page 1 of 1</span>
      </div>

      <style jsx global>{`
        .print-only {
          display: none;
        }
        @media print {
          body {
            background: #ffffff !important;
            color: #0f172a !important;
          }
          .no-print,
          .admin-topbar,
          .sidebar,
          .mobile-backdrop,
          .modal-overlay {
            display: none !important;
          }
          .admin-shell .main-content {
            margin-left: 0 !important;
            padding: 0 !important;
          }
          .print-only {
            display: block !important;
          }
          .card {
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            break-inside: avoid;
            margin-bottom: 16px !important;
            background: #ffffff !important;
          }
          .data-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .data-table th, .data-table td {
            border: 1px solid #e2e8f0 !important;
            padding: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}
