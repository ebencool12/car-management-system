'use client';

import { useState } from 'react';
import {
  demoDrivers,
  demoSales,
  demoPaymentChannels,
  formatCurrency,
  getBalanceLabel,
  PaymentChannel,
  Driver,
  SalesRecord
} from '@/lib/demo-data';

export default function SalesPage() {
  const [sales, setSales] = useState<SalesRecord[]>(demoSales);
  const [drivers, setDrivers] = useState<Driver[]>(demoDrivers);
  const [channels, setChannels] = useState<PaymentChannel[]>(demoPaymentChannels);
  const [activeTab, setActiveTab] = useState<'sales' | 'balances' | 'channels'>('sales');
  const [weekFilter, setWeekFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Settlement modal
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMethod, setSettleMethod] = useState('');
  const [settleReference, setSettleReference] = useState('');
  const [settleDirection, setSettleDirection] = useState<'RECEIVE_FROM_DRIVER' | 'PAY_TO_DRIVER'>('RECEIVE_FROM_DRIVER');
  const [settleSuccess, setSettleSuccess] = useState('');

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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Sales & Balances</h1>
          <p className="subtitle">Weekly sales submissions, driver balances & payment channel management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>
          💰 Weekly Sales
        </button>
        <button className={`tab ${activeTab === 'balances' ? 'active' : ''}`} onClick={() => setActiveTab('balances')}>
          ⚖️ Driver Balances
        </button>
        <button className={`tab ${activeTab === 'channels' ? 'active' : ''}`} onClick={() => setActiveTab('channels')}>
          💳 Payment Means & Channels ({channels.filter(c => c.enabledForDrivers).length} active)
        </button>
      </div>

      {/* TAB 1: WEEKLY SALES */}
      {activeTab === 'sales' && (
        <>
          {/* Summary */}
          <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="stat-card gold">
              <div className="stat-number" style={{ color: 'var(--byt-gold)' }}>
                {formatCurrency(sales.filter(s => s.weekLabel === '2026-W38').reduce((sum, s) => sum + s.amount, 0))}
              </div>
              <div className="stat-title">Week 38 Total</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-number" style={{ color: 'var(--color-pending)' }}>
                {sales.filter(s => s.confirmationStatus === 'PENDING').length}
              </div>
              <div className="stat-title">Pending Confirmation</div>
            </div>
            <div className="stat-card cyan">
              <div className="stat-number" style={{ color: 'var(--color-confirmed)' }}>
                {sales.filter(s => s.paymentMethod === 'MOMO').length}
              </div>
              <div className="stat-title">Momo Payments</div>
            </div>
            <div className="stat-card green">
              <div className="stat-number text-green">
                {sales.filter(s => s.paymentMethod === 'CASH').length}
              </div>
              <div className="stat-title">Cash Payments</div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-bar">
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
          <div className="table-container animate-in">
            <table>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Week</th>
                  <th>Amount</th>
                  <th>Means of Payment</th>
                  <th>Transaction Reference</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(sale => (
                  <tr key={sale.id}>
                    <td className="font-semibold">{sale.driverName}</td>
                    <td className="font-mono text-sm">{sale.weekLabel}</td>
                    <td className="font-mono font-bold" style={{ color: 'var(--byt-gold)' }}>{formatCurrency(sale.amount)}</td>
                    <td>
                      <span className={`badge ${sale.paymentMethod === 'MOMO' ? 'badge-gold' : 'badge-cyan'}`}>
                        {sale.paymentMethod === 'MOMO' ? '📱 Mobile Money' : '💵 Cash'}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-muted">{sale.momoReference || '—'}</td>
                    <td>
                      <span className={`badge ${sale.confirmationStatus === 'CONFIRMED' ? 'badge-green' : sale.confirmationStatus === 'DISPUTED' ? 'badge-red' : 'badge-purple'}`}>
                        {sale.confirmationStatus}
                      </span>
                    </td>
                    <td>
                      {sale.confirmationStatus === 'PENDING' && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleConfirm(sale.id)}>
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 2: DRIVER BALANCES */}
      {activeTab === 'balances' && (
        <>
          <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="stat-card red">
              <div className="stat-number text-red">
                {formatCurrency(activeDrivers.filter(d => d.balance > 0).reduce((sum, d) => sum + d.balance, 0))}
              </div>
              <div className="stat-title">Total Owed to BYT</div>
            </div>
            <div className="stat-card gold">
              <div className="stat-number" style={{ color: 'var(--byt-gold)' }}>
                {formatCurrency(Math.abs(activeDrivers.filter(d => d.balance < 0).reduce((sum, d) => sum + d.balance, 0)))}
              </div>
              <div className="stat-title">BYT Owes Drivers</div>
            </div>
            <div className="stat-card green">
              <div className="stat-number text-green">
                {activeDrivers.filter(d => d.balance === 0).length}
              </div>
              <div className="stat-title">Settled</div>
            </div>
          </div>

          <div className="table-container animate-in">
            <table>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Balance</th>
                  <th>Direction</th>
                  <th>Settlement Action</th>
                </tr>
              </thead>
              <tbody>
                {activeDrivers.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)).map(driver => {
                  const bal = getBalanceLabel(driver.balance);
                  return (
                    <tr key={driver.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                          <div className="chat-avatar" style={{ width: 36, height: 36, fontSize: '0.75rem' }}>
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold">{driver.name}</div>
                            <div className="text-xs text-muted">{driver.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`font-mono font-bold ${bal.className}`}>
                        {driver.balance !== 0 ? formatCurrency(driver.balance) : '—'}
                      </td>
                      <td>
                        <span className={`badge ${driver.balance > 0 ? 'badge-red' : driver.balance < 0 ? 'badge-gold' : 'badge-green'}`}>
                          {bal.text}
                        </span>
                      </td>
                      <td>
                        {driver.balance !== 0 ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenSettle(driver)}
                          >
                            {driver.balance > 0 ? 'Receive Payment' : 'Pay Driver'}
                          </button>
                        ) : (
                          <span className="text-xs text-muted">Settled</span>
                        )}
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
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleExecuteSettlement}>
              <div className="modal-header">
                <div>
                  <h3 style={{ margin: 0 }}>Record Settlement</h3>
                  <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                    Driver: <strong className="text-white">{selectedDriver.name}</strong> • Current Balance: <span className="font-mono text-gold">{formatCurrency(selectedDriver.balance)}</span>
                  </p>
                </div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setSelectedDriver(null)}>✕</button>
              </div>

              <div className="modal-body">
                {settleSuccess && (
                  <div style={{
                    padding: 'var(--space-md)',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid #10b981',
                    borderRadius: 'var(--radius-sm)',
                    color: '#10b981',
                    marginBottom: 'var(--space-md)',
                    fontSize: '0.85rem'
                  }}>
                    {settleSuccess}
                  </div>
                )}

                {/* Direction Selector */}
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Settlement Direction</label>
                  <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg-input)', padding: '3px', borderRadius: 'var(--radius-sm)' }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${settleDirection === 'RECEIVE_FROM_DRIVER' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setSettleDirection('RECEIVE_FROM_DRIVER')}
                      style={{ flex: 1, fontSize: '0.75rem' }}
                    >
                      💰 Receive From Driver
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${settleDirection === 'PAY_TO_DRIVER' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setSettleDirection('PAY_TO_DRIVER')}
                      style={{ flex: 1, fontSize: '0.75rem' }}
                    >
                      💸 Disburse To Driver
                    </button>
                  </div>
                </div>

                {/* Means of Payment Selector */}
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">
                    Choose Means of Payment ({settleDirection === 'RECEIVE_FROM_DRIVER' ? 'Received From Driver' : 'Disbursed To Driver'})
                  </label>
                  <select
                    className="form-select"
                    value={settleMethod}
                    onChange={e => setSettleMethod(e.target.value)}
                    required
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
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Amount (GHS) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input font-mono font-bold"
                    value={settleAmount}
                    onChange={e => setSettleAmount(e.target.value)}
                    required
                  />
                </div>

                {/* Reference */}
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Payment / Transaction Reference</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Momo ID, Bank Transfer ref or Cashier Voucher #"
                    value={settleReference}
                    onChange={e => setSettleReference(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedDriver(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
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
    </div>
  );
}
