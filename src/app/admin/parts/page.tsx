'use client';

import { useState, useEffect } from 'react';
import {
  formatCurrency,
  getInventoryStatus,
  PartInventoryItem,
  PartsExchangeItem,
  PartIssuanceRecord,
  getStoredInventory,
  saveStoredInventory,
  getStoredPartsExchange,
  saveStoredPartsExchange,
  getStoredPartIssuances,
  saveStoredPartIssuances,
  getStoredDrivers,
  Driver,
  getStoredVehicles,
  Vehicle,
} from '@/lib/demo-data';

export default function PartsPage() {
  const [parts, setParts] = useState<PartsExchangeItem[]>([]);
  const [inventory, setInventory] = useState<PartInventoryItem[]>([]);
  const [issuances, setIssuances] = useState<PartIssuanceRecord[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<'exchange' | 'inventory' | 'issuances'>('inventory');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [invSearch, setInvSearch] = useState('');
  const [invCategoryFilter, setInvCategoryFilter] = useState('ALL');
  const [issuanceSearch, setIssuanceSearch] = useState('');

  // Modal states for Inventory Management
  const [showAddSkuModal, setShowAddSkuModal] = useState(false);
  const [editingSku, setEditingSku] = useState<PartInventoryItem | null>(null);
  const [newSku, setNewSku] = useState({
    name: '',
    category: 'Fluids & Lubricants',
    quantity: 10,
    reorderLevel: 5,
    unitCost: 50,
    supplier: 'AutoParts Ghana',
  });

  // Requisition / Issue to Driver State
  const [issuingPart, setIssuingPart] = useState<PartInventoryItem | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState('1');
  const [driverName, setDriverName] = useState('Kwame Asante');
  const [driverPhone, setDriverPhone] = useState('024-419-8234');
  const [vehiclePlate, setVehiclePlate] = useState('GR-1234-22');
  const [issueQuantity, setIssueQuantity] = useState(1);
  const [issuePurpose, setIssuePurpose] = useState('Routine Service / Maintenance');
  const [issueNotes, setIssueNotes] = useState('');
  const [issuedBy, setIssuedBy] = useState('Emma (Admin Dispatch)');

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState<PartIssuanceRecord | null>(null);
  const [receiptCopied, setReceiptCopied] = useState(false);

  // Media & Docs Lightbox Modal
  const [viewingMediaPart, setViewingMediaPart] = useState<PartsExchangeItem | null>(null);

  // Load and sync data
  const loadData = () => {
    setParts(getStoredPartsExchange());
    setInventory(getStoredInventory());
    setIssuances(getStoredPartIssuances());
    const loadedDrivers = getStoredDrivers();
    setDrivers(loadedDrivers);
    const loadedVehicles = getStoredVehicles();
    setVehicles(loadedVehicles);
  };

  useEffect(() => {
    loadData();
    const handlePartsUpdate = () => setParts(getStoredPartsExchange());
    const handleInvUpdate = () => setInventory(getStoredInventory());
    const handleIssuancesUpdate = () => setIssuances(getStoredPartIssuances());
    const handleDriversUpdate = () => setDrivers(getStoredDrivers());
    const handleVehiclesUpdate = () => setVehicles(getStoredVehicles());

    window.addEventListener('byt-parts-updated', handlePartsUpdate);
    window.addEventListener('byt-inventory-updated', handleInvUpdate);
    window.addEventListener('byt-issuances-updated', handleIssuancesUpdate);
    window.addEventListener('byt-drivers-updated', handleDriversUpdate);
    window.addEventListener('byt-vehicles-updated', handleVehiclesUpdate);
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('byt-parts-updated', handlePartsUpdate);
      window.removeEventListener('byt-inventory-updated', handleInvUpdate);
      window.removeEventListener('byt-issuances-updated', handleIssuancesUpdate);
      window.removeEventListener('byt-drivers-updated', handleDriversUpdate);
      window.removeEventListener('byt-vehicles-updated', handleVehiclesUpdate);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // Exchange tab filtering
  const filtered = parts.filter(p => {
    const matchSearch =
      p.partName.toLowerCase().includes(search.toLowerCase()) ||
      p.driverName.toLowerCase().includes(search.toLowerCase()) ||
      p.vehiclePlate.toLowerCase().includes(search.toLowerCase());
    const matchFilter = statusFilter === 'ALL' || p.reimbursementStatus === statusFilter;
    return matchSearch && matchFilter;
  });

  const totalCost = parts.reduce((sum, p) => sum + p.cost, 0);
  const pendingReimb = parts.filter(p => p.reimbursementStatus === 'PENDING').reduce((sum, p) => sum + p.cost, 0);

  // Inventory tab filtering
  const categories = [...new Set(inventory.map(i => i.category))];
  const filteredInventory = inventory.filter(i => {
    const matchSearch =
      i.name.toLowerCase().includes(invSearch.toLowerCase()) ||
      i.category.toLowerCase().includes(invSearch.toLowerCase()) ||
      (i.supplier && i.supplier.toLowerCase().includes(invSearch.toLowerCase()));
    const matchCategory = invCategoryFilter === 'ALL' || i.category === invCategoryFilter;
    return matchSearch && matchCategory;
  });

  const outOfStock = inventory.filter(i => i.quantity === 0).length;
  const lowStock = inventory.filter(i => i.quantity > 0 && i.quantity <= i.reorderLevel).length;
  const totalInventoryValue = inventory.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);

  // Exchange Approval with Inventory Deduction
  const handleApprove = (id: string) => {
    const targetPart = parts.find(p => p.id === id);
    if (!targetPart) return;

    // 1. Update Parts Exchange status
    const updatedParts = parts.map(p =>
      p.id === id ? { ...p, reimbursementStatus: 'APPROVED' as const, inventoryDeducted: true } : p
    );
    saveStoredPartsExchange(updatedParts);

    // 2. Deduct matching item from inventory if available
    const normalizedPartName = targetPart.partName.toLowerCase();
    let inventoryModified = false;
    const updatedInventory = inventory.map(item => {
      const normalizedInvName = item.name.toLowerCase();
      // Match if one contains the other (e.g. "Brake Pads" matches "Brake Pads (Front Set)")
      if (!inventoryModified && (normalizedInvName.includes(normalizedPartName) || normalizedPartName.includes(normalizedInvName))) {
        inventoryModified = true;
        return {
          ...item,
          quantity: Math.max(0, item.quantity - 1),
        };
      }
      return item;
    });

    if (inventoryModified) {
      saveStoredInventory(updatedInventory);
    }
  };

  const handleReject = (id: string) => {
    const updatedParts = parts.map(p =>
      p.id === id ? { ...p, reimbursementStatus: 'REJECTED' as const } : p
    );
    saveStoredPartsExchange(updatedParts);
  };

  const handleReorder = (id: string) => {
    const updated = inventory.map(i =>
      i.id === id
        ? {
            ...i,
            quantity: i.quantity + i.reorderLevel * 2,
            lastRestocked: new Date().toISOString().split('T')[0],
          }
        : i
    );
    saveStoredInventory(updated);
  };

  // Add SKU Handler
  const handleAddSku = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: PartInventoryItem = {
      id: `inv-${Date.now()}`,
      name: newSku.name,
      category: newSku.category,
      quantity: Number(newSku.quantity),
      reorderLevel: Number(newSku.reorderLevel),
      unitCost: Number(newSku.unitCost),
      supplier: newSku.supplier,
      lastRestocked: new Date().toISOString().split('T')[0],
    };
    const updated = [newEntry, ...inventory];
    saveStoredInventory(updated);
    setShowAddSkuModal(false);
    setNewSku({
      name: '',
      category: 'Fluids',
      quantity: 10,
      reorderLevel: 5,
      unitCost: 50,
      supplier: 'AutoParts Ghana',
    });
  };

  // Edit SKU Handler
  const handleUpdateSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSku) return;
    const updated = inventory.map(i => (i.id === editingSku.id ? editingSku : i));
    saveStoredInventory(updated);
    setEditingSku(null);
  };

  // Delete SKU Handler
  const handleDeleteSku = (id: string) => {
    if (window.confirm('Are you sure you want to remove this SKU from inventory?')) {
      const updated = inventory.filter(i => i.id !== id);
      saveStoredInventory(updated);
    }
  };

  // Open Issue Modal for Part
  const handleOpenIssueModal = (item: PartInventoryItem) => {
    if (item.quantity <= 0) {
      alert(`"${item.name}" is currently OUT OF STOCK. Please restock before issuing.`);
      return;
    }
    setIssuingPart(item);
    setIssueQuantity(1);
    setIssuePurpose('Routine Service / Maintenance');
    setIssueNotes('');
    setIssuedBy('Emma (Admin Dispatch)');

    // Preselect active driver if exists
    if (drivers.length > 0) {
      const def = drivers[0];
      setSelectedDriverId(def.id);
      setDriverName(def.name);
      setDriverPhone(def.phone || '024-419-8234');
      const v = vehicles.find(veh => veh.assignedDriverName === def.name);
      setVehiclePlate(v ? v.plateNumber : 'GR-1234-22');
    } else {
      setSelectedDriverId('custom');
      setDriverName('');
      setDriverPhone('');
      setVehiclePlate('');
    }
  };

  // Driver Selection Change
  const handleDriverSelect = (dId: string) => {
    setSelectedDriverId(dId);
    if (dId === 'custom') {
      setDriverName('');
      setDriverPhone('');
      setVehiclePlate('');
      return;
    }
    const d = drivers.find(drv => drv.id === dId);
    if (d) {
      setDriverName(d.name);
      setDriverPhone(d.phone || '');
      const v = vehicles.find(veh => veh.assignedDriverName === d.name);
      setVehiclePlate(v ? v.plateNumber : 'GR-1234-22');
    }
  };

  // Confirm Issuance and Generate Receipt
  const handleConfirmIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issuingPart) return;

    const qty = Math.max(1, Math.min(issueQuantity, issuingPart.quantity));
    const receiptNum = `BYT-ISS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowFormatted = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newRecord: PartIssuanceRecord = {
      id: `iss-${Date.now()}`,
      receiptNumber: receiptNum,
      partId: issuingPart.id,
      partName: issuingPart.name,
      category: issuingPart.category,
      quantity: qty,
      unitCost: issuingPart.unitCost,
      totalCost: qty * issuingPart.unitCost,
      driverId: selectedDriverId,
      driverName: driverName.trim() || 'Driver',
      driverPhone: driverPhone.trim() || '020-000-0000',
      vehiclePlate: vehiclePlate.trim().toUpperCase() || 'FLEET',
      issuedBy: issuedBy.trim() || 'Emma (Admin Dispatch)',
      issuedAt: nowFormatted,
      purpose: issuePurpose,
      notes: issueNotes.trim() || undefined,
    };

    // 1. Deduct quantity from inventory
    const updatedInventory = inventory.map(item =>
      item.id === issuingPart.id
        ? { ...item, quantity: Math.max(0, item.quantity - qty) }
        : item
    );
    saveStoredInventory(updatedInventory);

    // 2. Save issuance record
    const updatedIssuances = [newRecord, ...issuances];
    saveStoredPartIssuances(updatedIssuances);

    // 3. Close issue modal & open printable receipt
    setIssuingPart(null);
    setActiveReceipt(newRecord);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCopyReceipt = (rec: PartIssuanceRecord) => {
    const text = `===========================================
BYT FLEET MANAGEMENT - OFFICIAL ISSUANCE RECEIPT
Receipt No: ${rec.receiptNumber}
Date: ${rec.issuedAt}
===========================================
RECIPIENT DRIVER DETAILS:
Driver Name:   ${rec.driverName}
Contact Phone: ${rec.driverPhone}
Vehicle Plate: ${rec.vehiclePlate}

DISBURSED PART:
Item:          ${rec.partName}
Category:      ${rec.category}
Quantity:      ${rec.quantity} unit(s)
Unit Cost:     GHS ${rec.unitCost.toFixed(2)}
TOTAL COST:    GHS ${rec.totalCost.toFixed(2)}

WORK ORDER & REASON:
Purpose:       ${rec.purpose}
${rec.notes ? `Notes:         ${rec.notes}\n` : ''}
ISSUED BY:
Dispatcher:    ${rec.issuedBy}
Status:        VERIFIED & DISBURSED
===========================================`;

    navigator.clipboard.writeText(text).then(() => {
      setReceiptCopied(true);
      setTimeout(() => setReceiptCopied(false), 3000);
    });
  };

  // Filtered Issuances for Tab 3
  const filteredIssuances = issuances.filter(iss => {
    const q = issuanceSearch.toLowerCase();
    return (
      iss.receiptNumber.toLowerCase().includes(q) ||
      iss.driverName.toLowerCase().includes(q) ||
      iss.vehiclePlate.toLowerCase().includes(q) ||
      iss.partName.toLowerCase().includes(q) ||
      iss.purpose.toLowerCase().includes(q)
    );
  });

  const totalIssuanceCost = issuances.reduce((sum, iss) => sum + iss.totalCost, 0);
  const totalItemsIssued = issuances.reduce((sum, iss) => sum + iss.quantity, 0);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem', color: 'var(--byt-gold)', fontWeight: 700 }}>
            Fleet Stock & Logistics
          </span>
          <h1 style={{ marginTop: '2px' }}>Parts & Inventory</h1>
          <p className="subtitle">Track vehicle parts, live stock levels, issue items to drivers, and print official receipts</p>
        </div>
        {activeTab === 'inventory' && (
          <button className="btn btn-primary" onClick={() => setShowAddSkuModal(true)}>
            + Add New SKU
          </button>
        )}
      </div>

      {/* Tab Switcher */}
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
          className={`btn btn-sm ${activeTab === 'inventory' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('inventory')}
          style={{ padding: '0.4rem 1rem', position: 'relative' }}
        >
          📦 Fleet Inventory ({inventory.length})
          {outOfStock + lowStock > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: outOfStock > 0 ? '#ef4444' : '#f59e0b',
                color: 'white',
                fontSize: '0.76rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {outOfStock + lowStock}
            </span>
          )}
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'issuances' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('issuances')}
          style={{ padding: '0.4rem 1rem', position: 'relative' }}
        >
          📜 Issuance Records & Receipts ({issuances.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'exchange' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('exchange')}
          style={{ padding: '0.4rem 1rem' }}
        >
          🔧 Driver Exchange Claims ({parts.filter(p => p.reimbursementStatus === 'PENDING').length} pending)
        </button>
      </div>

      {/* ── PARTS EXCHANGE TAB ── */}
      {activeTab === 'exchange' && (
        <>
          {/* Summary */}
          <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="stat-card gold">
              <div className="stat-number font-mono" style={{ color: 'var(--byt-gold)' }}>
                {formatCurrency(totalCost)}
              </div>
              <div className="stat-title">Total Parts Claimed</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-number font-mono" style={{ color: 'var(--color-pending)' }}>
                {formatCurrency(pendingReimb)}
              </div>
              <div className="stat-title">Pending Reimbursement</div>
            </div>
            <div className="stat-card green">
              <div className="stat-number font-mono text-green">
                {parts.filter(p => p.reimbursementStatus === 'APPROVED').length}
              </div>
              <div className="stat-title">Approved & Settled</div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by part, driver, or vehicle plate..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '2px',
                background: 'var(--color-bg-input)',
                borderRadius: 'var(--radius-md)',
                padding: '3px',
              }}
            >
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
                <button
                  key={f}
                  className={`btn btn-sm ${statusFilter === f ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setStatusFilter(f)}
                  style={{ fontSize: '0.75rem' }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="table-container animate-in">
            <table>
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Cost</th>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Date</th>
                  <th>Docs & Media</th>
                  <th>Status</th>
                  <th>Inventory Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
                      No parts exchange requests found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(part => (
                    <tr key={part.id}>
                      <td className="font-semibold">{part.partName}</td>
                      <td className="font-mono font-bold">{formatCurrency(part.cost)}</td>
                      <td>{part.driverName}</td>
                      <td>
                        <code className="font-mono text-xs" style={{ color: 'var(--color-text-secondary)', background: 'var(--color-bg-input)', padding: '2px 6px', borderRadius: '4px' }}>
                          {part.vehiclePlate}
                        </code>
                      </td>
                      <td className="text-sm text-muted">{part.date}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.75rem',
                          }}
                          onClick={() => setViewingMediaPart(part)}
                          title="Click to view attached photos, videos, or receipt docs"
                        >
                          <span>📷</span>
                          <span>Receipt/Media</span>
                        </button>
                      </td>
                      <td>
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
                      </td>
                      <td>
                        {part.inventoryDeducted ? (
                          <span className="text-xs text-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            ✓ Stock Deducted
                          </span>
                        ) : (
                          <span className="text-xs text-muted">Awaiting Admin</span>
                        )}
                      </td>
                      <td>
                        {part.reimbursementStatus === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleApprove(part.id)}
                              title="Approve reimbursement and automatically deduct from inventory"
                            >
                              Approve & Deduct
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--color-red)' }}
                              onClick={() => handleReject(part.id)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── INVENTORY TAB ── */}
      {activeTab === 'inventory' && (
        <>
          {/* Inventory Summary */}
          <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="stat-card cyan">
              <div className="stat-icon cyan">📦</div>
              <div className="stat-number font-mono" style={{ color: 'var(--byt-sea)' }}>
                {inventory.length}
              </div>
              <div className="stat-title">Total Active SKUs</div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon green">💰</div>
              <div className="stat-number font-mono text-green">{formatCurrency(totalInventoryValue)}</div>
              <div className="stat-title">Total Asset Value</div>
            </div>
            <div className="stat-card" style={{ borderColor: outOfStock > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)' }}>
              <div className="stat-icon red">⚠️</div>
              <div className="stat-number font-mono text-red">{outOfStock}</div>
              <div className="stat-title">Out of Stock</div>
            </div>
            <div className="stat-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                📊
              </div>
              <div className="stat-number font-mono" style={{ color: '#f59e0b' }}>
                {lowStock}
              </div>
              <div className="stat-title">Low Stock Level</div>
            </div>
          </div>

          {/* Alerts Banner */}
          {(outOfStock > 0 || lowStock > 0) && (
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
              {outOfStock > 0 && (
                <div
                  className="card animate-in"
                  style={{
                    flex: 1,
                    minWidth: 260,
                    borderLeft: '4px solid #ef4444',
                    background: 'rgba(239, 68, 68, 0.04)',
                  }}
                >
                  <div className="card-body" style={{ padding: 'var(--space-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🚫</span>
                      <span style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.85rem' }}>
                        Out of Stock ({outOfStock} SKUs)
                      </span>
                    </div>
                    {inventory
                      .filter(i => i.quantity === 0)
                      .slice(0, 3)
                      .map(i => (
                        <div
                          key={i.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            padding: '4px 0',
                          }}
                        >
                          <span>{i.name}</span>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                            onClick={() => handleReorder(i.id)}
                          >
                            Reorder +{i.reorderLevel * 2}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {lowStock > 0 && (
                <div
                  className="card animate-in"
                  style={{
                    flex: 1,
                    minWidth: 260,
                    borderLeft: '4px solid #f59e0b',
                    background: 'rgba(245, 158, 11, 0.04)',
                  }}
                >
                  <div className="card-body" style={{ padding: 'var(--space-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                      <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.85rem' }}>
                        Low Stock Alert ({lowStock} SKUs)
                      </span>
                    </div>
                    {inventory
                      .filter(i => i.quantity > 0 && i.quantity <= i.reorderLevel)
                      .slice(0, 3)
                      .map(i => (
                        <div
                          key={i.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            padding: '4px 0',
                          }}
                        >
                          <span>
                            {i.name} —{' '}
                            <span className="font-mono font-bold" style={{ color: '#f59e0b' }}>
                              {i.quantity} left
                            </span>
                          </span>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                            onClick={() => handleReorder(i.id)}
                          >
                            Restock
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Inventory Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search inventory by name, category, or supplier..."
                value={invSearch}
                onChange={e => setInvSearch(e.target.value)}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '2px',
                background: 'var(--color-bg-input)',
                borderRadius: 'var(--radius-md)',
                padding: '3px',
                flexWrap: 'wrap',
              }}
            >
              <button
                className={`btn btn-sm ${invCategoryFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setInvCategoryFilter('ALL')}
                style={{ fontSize: '0.75rem' }}
              >
                ALL
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn btn-sm ${invCategoryFilter === cat ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setInvCategoryFilter(cat)}
                  style={{ fontSize: '0.75rem' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Instruction Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              padding: '0.65rem 1rem',
              background: 'rgba(212, 160, 23, 0.08)',
              border: '1px solid rgba(212, 160, 23, 0.25)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-md)',
              fontSize: '0.82rem',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>💡</span>
            <span>
              <strong>Fleet Dispatch & Requisitions:</strong> Click any part name or the{' '}
              <strong>&quot;📤 Issue&quot;</strong> button to assign a part to a driver, record vehicle maintenance, and print an official disbursement receipt.
            </span>
          </div>

          {/* Inventory Table */}
          <div className="table-container animate-in">
            <table>
              <thead>
                <tr>
                  <th>Part / SKU Name</th>
                  <th>Category</th>
                  <th>In Stock</th>
                  <th>Reorder Point</th>
                  <th>Unit Cost</th>
                  <th>Total Value</th>
                  <th>Status</th>
                  <th>Supplier</th>
                  <th>Restocked</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => {
                  const status = getInventoryStatus(item);
                  return (
                    <tr key={item.id}>
                      <td className="font-semibold">
                        <button
                          type="button"
                          onClick={() => handleOpenIssueModal(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            font: 'inherit',
                            fontWeight: 700,
                            color: item.quantity > 0 ? '#0f172a' : '#64748b',
                            textAlign: 'left',
                            cursor: item.quantity > 0 ? 'pointer' : 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.96rem',
                            lineHeight: 1.4,
                          }}
                          title={item.quantity > 0 ? 'Click to issue this part to a driver & print receipt' : 'Out of stock'}
                        >
                          <span style={{ textDecoration: item.quantity > 0 ? 'underline' : 'none', textDecorationColor: '#0891b2' }}>{item.name}</span>
                          {item.quantity > 0 && (
                            <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '2px 7px', fontWeight: 700 }}>
                              Issue 📤
                            </span>
                          )}
                        </button>
                      </td>
                      <td>
                        <span className="badge badge-cyan" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="font-mono font-bold" style={{ color: status.color, minWidth: 28, fontSize: '1rem' }}>
                            {item.quantity}
                          </span>
                          <div
                            style={{
                              width: 44,
                              height: 8,
                              background: '#e2e8f0',
                              borderRadius: 'var(--radius-full)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${Math.min((item.quantity / (item.reorderLevel * 3)) * 100, 100)}%`,
                                background: status.color,
                                borderRadius: 'var(--radius-full)',
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-sm" style={{ fontWeight: 600, color: '#334155' }}>{item.reorderLevel}</td>
                      <td className="font-mono text-sm font-semibold" style={{ color: '#0f172a' }}>{formatCurrency(item.unitCost)}</td>
                      <td className="font-mono text-sm font-bold" style={{ color: '#0f172a' }}>{formatCurrency(item.quantity * item.unitCost)}</td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: status.color,
                            background: status.bg,
                            border: `1px solid ${status.color}40`,
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              background: status.color,
                              display: 'inline-block',
                            }}
                          />
                          {status.label}
                        </span>
                      </td>
                      <td className="text-sm" style={{ color: '#334155', fontWeight: 600 }}>{item.supplier || 'AutoParts Ghana'}</td>
                      <td className="text-sm" style={{ color: '#334155', fontWeight: 600 }}>{item.lastRestocked}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{
                              padding: '4px 10px',
                              fontSize: '0.82rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: 700,
                            }}
                            disabled={item.quantity <= 0}
                            onClick={() => handleOpenIssueModal(item)}
                            title={item.quantity <= 0 ? 'Out of stock' : 'Issue to driver & print receipt'}
                          >
                            <span>📤</span> Issue
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.8rem', fontWeight: 600 }}
                            onClick={() => setEditingSku(item)}
                            title="Edit SKU details & stock"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.8rem', color: 'var(--color-red)' }}
                            onClick={() => handleDeleteSku(item.id)}
                            title="Remove SKU from inventory"
                          >
                            🗑️
                          </button>
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

      {/* ── ISSUANCES & RECEIPTS TAB ── */}
      {activeTab === 'issuances' && (
        <>
          {/* Summary Stats */}
          <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="stat-card cyan">
              <div className="stat-icon cyan">🧾</div>
              <div className="stat-number font-mono" style={{ color: 'var(--byt-sea)' }}>
                {issuances.length}
              </div>
              <div className="stat-title">Official Vouchers Issued</div>
            </div>
            <div className="stat-card gold">
              <div className="stat-icon gold">📦</div>
              <div className="stat-number font-mono" style={{ color: 'var(--byt-gold)' }}>
                {totalItemsIssued}
              </div>
              <div className="stat-title">Total Parts Disbursed</div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon green">💰</div>
              <div className="stat-number font-mono text-green">
                {formatCurrency(totalIssuanceCost)}
              </div>
              <div className="stat-title">Total Value Issued</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-icon purple">👤</div>
              <div className="stat-number font-mono" style={{ color: '#a855f7' }}>
                {new Set(issuances.map(i => i.driverName)).size}
              </div>
              <div className="stat-title">Unique Drivers Serviced</div>
            </div>
          </div>

          {/* Issuance Search & Filters */}
          <div className="filters-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div className="search-box" style={{ flex: 1, minWidth: 260 }}>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by receipt #, driver name, vehicle plate, or part..."
                value={issuanceSearch}
                onChange={e => setIssuanceSearch(e.target.value)}
              />
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('inventory')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span>+</span> Issue Another Part
            </button>
          </div>

          {/* Issuances Table */}
          <div className="table-container animate-in">
            <table>
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Date & Time</th>
                  <th>Driver & Contact</th>
                  <th>Vehicle Plate</th>
                  <th>Part Disbursed</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Total Cost</th>
                  <th>Purpose / Work Order</th>
                  <th>Issued By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssuances.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-muted)' }}>
                      No issuance records found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredIssuances.map(record => (
                    <tr key={record.id}>
                      <td>
                        <button
                          type="button"
                          onClick={() => setActiveReceipt(record)}
                          className="badge badge-purple"
                          style={{
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            border: '1px solid rgba(168, 85, 247, 0.4)',
                            background: 'rgba(168, 85, 247, 0.1)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title="Click to view & reprint official receipt"
                        >
                          <span>🧾</span>
                          <span>{record.receiptNumber}</span>
                        </button>
                      </td>
                      <td className="text-sm text-muted">{record.issuedAt}</td>
                      <td>
                        <div className="font-semibold text-sm">{record.driverName}</div>
                        <div className="font-mono text-xs text-muted">{record.driverPhone}</div>
                      </td>
                      <td>
                        <span className="badge badge-gold font-mono" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                          {record.vehiclePlate}
                        </span>
                      </td>
                      <td className="font-semibold text-sm">{record.partName}</td>
                      <td>
                        <span className="badge badge-cyan" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                          {record.category}
                        </span>
                      </td>
                      <td className="font-mono font-bold text-center">{record.quantity}</td>
                      <td className="font-mono font-bold text-sm text-green">
                        {formatCurrency(record.totalCost)}
                      </td>
                      <td className="text-sm">
                        <div>{record.purpose}</div>
                        {record.notes && (
                          <div className="text-xs text-muted" style={{ maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {record.notes}
                          </div>
                        )}
                      </td>
                      <td className="text-xs text-muted">{record.issuedBy}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                          }}
                          onClick={() => setActiveReceipt(record)}
                          title="Open printable official receipt"
                        >
                          <span>🖨️</span> Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── MODAL: ADD SKU ── */}
      {showAddSkuModal && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-content animate-in" style={{ maxWidth: 500, width: '90%' }}>
            <div className="modal-header">
              <h3>Add New Inventory SKU</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddSkuModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSku}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="form-group">
                  <label className="form-label">Part / Item Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Brake Rotor (Vented)"
                    value={newSku.name}
                    onChange={e => setNewSku({ ...newSku, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-input"
                      value={newSku.category}
                      onChange={e => setNewSku({ ...newSku, category: e.target.value })}
                    >
                      <option value="Fluids & Lubricants">Fluids & Lubricants</option>
                      <option value="Filters">Filters</option>
                      <option value="Braking System">Braking System</option>
                      <option value="Suspension & Steering">Suspension & Steering</option>
                      <option value="Engine & Belts">Engine & Belts</option>
                      <option value="Transmission & Drivetrain">Transmission & Drivetrain</option>
                      <option value="Electrical & Battery">Electrical & Battery</option>
                      <option value="Cooling & AC">Cooling & AC</option>
                      <option value="Tires & Wheels">Tires & Wheels</option>
                      <option value="Body & Lighting">Body & Lighting</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit Cost (GHS)</label>
                    <input
                      className="form-input font-mono"
                      type="number"
                      step="0.01"
                      value={newSku.unitCost}
                      onChange={e => setNewSku({ ...newSku, unitCost: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Initial Quantity</label>
                    <input
                      className="form-input font-mono"
                      type="number"
                      min="0"
                      value={newSku.quantity}
                      onChange={e => setNewSku({ ...newSku, quantity: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reorder Level</label>
                    <input
                      className="form-input font-mono"
                      type="number"
                      min="1"
                      value={newSku.reorderLevel}
                      onChange={e => setNewSku({ ...newSku, reorderLevel: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Supplier Name</label>
                  <input
                    className="form-input"
                    placeholder="e.g. AutoParts Ghana, Toyota Accra"
                    value={newSku.supplier}
                    onChange={e => setNewSku({ ...newSku, supplier: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSkuModal(false)} style={{ color: '#334155', fontWeight: 700 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save SKU to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT SKU ── */}
      {editingSku && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-content animate-in" style={{ maxWidth: 500, width: '90%' }}>
            <div className="modal-header">
              <h3>Edit Inventory Item</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingSku(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateSku}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="form-group">
                  <label className="form-label">Part Name</label>
                  <input
                    className="form-input"
                    value={editingSku.name}
                    onChange={e => setEditingSku({ ...editingSku, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={editingSku.category}
                    onChange={e => setEditingSku({ ...editingSku, category: e.target.value })}
                  >
                    <option value="Fluids & Lubricants">Fluids & Lubricants</option>
                    <option value="Filters">Filters</option>
                    <option value="Braking System">Braking System</option>
                    <option value="Suspension & Steering">Suspension & Steering</option>
                    <option value="Engine & Belts">Engine & Belts</option>
                    <option value="Transmission & Drivetrain">Transmission & Drivetrain</option>
                    <option value="Electrical & Battery">Electrical & Battery</option>
                    <option value="Cooling & AC">Cooling & AC</option>
                    <option value="Tires & Wheels">Tires & Wheels</option>
                    <option value="Body & Lighting">Body & Lighting</option>
                  </select>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">In Stock Quantity</label>
                    <input
                      className="form-input font-mono"
                      type="number"
                      min="0"
                      value={editingSku.quantity}
                      onChange={e => setEditingSku({ ...editingSku, quantity: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reorder Level</label>
                    <input
                      className="form-input font-mono"
                      type="number"
                      min="1"
                      value={editingSku.reorderLevel}
                      onChange={e => setEditingSku({ ...editingSku, reorderLevel: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Unit Cost (GHS)</label>
                    <input
                      className="form-input font-mono"
                      type="number"
                      step="0.01"
                      value={editingSku.unitCost}
                      onChange={e => setEditingSku({ ...editingSku, unitCost: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Supplier</label>
                    <input
                      className="form-input"
                      value={editingSku.supplier || ''}
                      onChange={e => setEditingSku({ ...editingSku, supplier: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingSku(null)} style={{ color: '#334155', fontWeight: 700 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DOCS & MEDIA LIGHTBOX ── */}
      {viewingMediaPart && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
          <div className="modal-content animate-in" style={{ maxWidth: 640, width: '92%' }}>
            <div className="modal-header">
              <div>
                <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem', color: '#b45309', fontWeight: 800 }}>
                  Exchange Proof & Documents
                </span>
                <h3 style={{ marginTop: '2px', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>{viewingMediaPart.partName}</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewingMediaPart(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-sm)', padding: 'var(--space-sm)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                <div>
                  <div className="text-xs text-muted">Driver</div>
                  <div className="font-semibold text-sm">{viewingMediaPart.driverName}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Vehicle Plate</div>
                  <div className="font-mono font-semibold text-sm">{viewingMediaPart.vehiclePlate}</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Cost Claimed</div>
                  <div className="font-mono font-bold text-sm" style={{ color: 'var(--byt-gold)' }}>
                    {formatCurrency(viewingMediaPart.cost)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted">Date Submitted</div>
                  <div className="text-sm">{viewingMediaPart.date}</div>
                </div>
              </div>

              {/* Media Display */}
              {viewingMediaPart.mediaUrl ? (
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden', padding: 'var(--space-sm)' }}>
                  {viewingMediaPart.mediaType === 'video' ? (
                    <video src={viewingMediaPart.mediaUrl} controls style={{ maxWidth: '100%', maxHeight: 380, borderRadius: 'var(--radius-sm)' }} />
                  ) : (
                    <img src={viewingMediaPart.mediaUrl} alt="Part or Receipt" style={{ maxWidth: '100%', maxHeight: 380, objectFit: 'contain', borderRadius: 'var(--radius-sm)' }} />
                  )}
                </div>
              ) : viewingMediaPart.docUrl ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-xl)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)' }}>📄</div>
                  <div className="font-semibold">Attached Document</div>
                  <a href={viewingMediaPart.docUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-sm)' }}>
                    Open Document Link
                  </a>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-xl)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-xs)' }}>🧾</div>
                  <div className="font-semibold">Physical Receipt Stamped on File</div>
                  <div className="text-xs text-muted" style={{ marginTop: '4px' }}>
                    Reference #{viewingMediaPart.id} logged via driver inspection desk.
                  </div>
                </div>
              )}

              {viewingMediaPart.notes && (
                <div style={{ padding: 'var(--space-sm)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                  <strong style={{ display: 'block', marginBottom: '2px', color: 'var(--color-text-secondary)' }}>Driver Notes:</strong>
                  {viewingMediaPart.notes}
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`badge ${viewingMediaPart.reimbursementStatus === 'APPROVED' ? 'badge-green' : viewingMediaPart.reimbursementStatus === 'REJECTED' ? 'badge-red' : 'badge-purple'}`} style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Status: {viewingMediaPart.reimbursementStatus}
              </span>
              <button className="btn btn-secondary" onClick={() => setViewingMediaPart(null)} style={{ color: '#334155', fontWeight: 700 }}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ISSUE PART TO DRIVER ── */}
      {issuingPart && (
        <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1000 }}>
          <div
            className="modal-content animate-in"
            style={{
              maxWidth: 580,
              width: '94%',
              maxHeight: '92vh',
              overflowY: 'auto',
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '16px',
              border: '2px solid #cbd5e1',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.5)',
            }}
          >
            <div className="modal-header" style={{ borderBottom: '2px solid #e2e8f0', padding: '16px 20px', background: '#ffffff' }}>
              <div>
                <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem', color: '#b45309', fontWeight: 800 }}>
                  Fleet Requisition & Disbursement
                </span>
                <h3 style={{ marginTop: '2px', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Issue Part to Driver</h3>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIssuingPart(null)}
                style={{ fontSize: '1rem', fontWeight: 700, padding: '4px 10px', color: '#334155' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmIssue}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: '20px', background: '#ffffff', color: '#0f172a' }}>
                {/* Part Summary Card */}
                <div
                  style={{
                    padding: '14px 18px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Selected Part</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', marginTop: '2px' }}>{issuingPart.name}</div>
                    <span className="badge badge-cyan" style={{ fontSize: '0.8rem', marginTop: '6px', fontWeight: 700 }}>
                      {issuingPart.category}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Available Stock</div>
                    <div className="font-mono font-bold" style={{ fontSize: '1.35rem', color: '#0891b2' }}>
                      {issuingPart.quantity} units
                    </div>
                    <div className="font-mono font-semibold" style={{ fontSize: '0.92rem', color: '#334155', marginTop: '2px' }}>
                      {formatCurrency(issuingPart.unitCost)} / unit
                    </div>
                  </div>
                </div>

                {/* Driver Selection */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>👤</span>
                    <span>Who or which driver needs it?</span>
                  </label>
                  <select
                    className="form-input"
                    value={selectedDriverId}
                    onChange={e => handleDriverSelect(e.target.value)}
                    required
                    style={{ fontSize: '0.98rem', fontWeight: 600, padding: '10px 14px', border: '1.5px solid #94a3b8', background: '#ffffff', color: '#0f172a' }}
                  >
                    <optgroup label="Active Fleet Drivers">
                      {drivers.map(d => {
                        const veh = vehicles.find(v => v.assignedDriverName === d.name);
                        return (
                          <option key={d.id} value={d.id}>
                            {d.name} — {veh ? veh.plateNumber : d.phone || 'Fleet Driver'}
                          </option>
                        );
                      })}
                    </optgroup>
                    <optgroup label="Other">
                      <option value="custom">+ Other / External Driver or Workshop Contractor</option>
                    </optgroup>
                  </select>
                </div>

                {/* Driver Details */}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                      Driver Full Name
                    </label>
                    <input
                      className="form-input"
                      placeholder="e.g. Kwame Asante"
                      value={driverName}
                      onChange={e => setDriverName(e.target.value)}
                      required
                      style={{ fontSize: '0.95rem', fontWeight: 600, padding: '10px 14px', border: '1.5px solid #94a3b8', background: '#ffffff', color: '#0f172a' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                      Driver Phone Number
                    </label>
                    <input
                      className="form-input font-mono"
                      placeholder="e.g. 024-419-8234"
                      value={driverPhone}
                      onChange={e => setDriverPhone(e.target.value)}
                      required
                      style={{ fontSize: '0.95rem', fontWeight: 600, padding: '10px 14px', border: '1.5px solid #94a3b8', background: '#ffffff', color: '#0f172a' }}
                    />
                  </div>
                </div>

                {/* Vehicle Plate & Quantity */}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                      Assigned Vehicle Plate
                    </label>
                    <input
                      className="form-input font-mono"
                      placeholder="e.g. GR-1234-22"
                      value={vehiclePlate}
                      onChange={e => setVehiclePlate(e.target.value)}
                      required
                      style={{ fontSize: '0.95rem', fontWeight: 700, padding: '10px 14px', border: '1.5px solid #94a3b8', background: '#ffffff', color: '#0f172a' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                      Quantity to Issue (Max {issuingPart.quantity})
                    </label>
                    <input
                      className="form-input font-mono"
                      type="number"
                      min="1"
                      max={issuingPart.quantity}
                      value={issueQuantity}
                      onChange={e => setIssueQuantity(Math.max(1, Math.min(Number(e.target.value), issuingPart.quantity)))}
                      required
                      style={{ fontSize: '1rem', fontWeight: 700, padding: '10px 14px', border: '1.5px solid #94a3b8', background: '#ffffff', color: '#0f172a' }}
                    />
                  </div>
                </div>

                {/* Cost Preview */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 18px',
                    background: '#ecfdf5',
                    borderRadius: '10px',
                    border: '1.5px solid #86efac',
                  }}
                >
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534' }}>
                    Total Disbursed Value:
                  </span>
                  <span className="font-mono font-bold" style={{ fontSize: '1.25rem', color: '#15803d' }}>
                    {formatCurrency(issueQuantity * issuingPart.unitCost)}
                  </span>
                </div>

                {/* Purpose / Work Order */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                    Requisition Purpose / Work Order
                  </label>
                  <select
                    className="form-input"
                    value={issuePurpose}
                    onChange={e => setIssuePurpose(e.target.value)}
                    style={{ fontSize: '0.95rem', fontWeight: 500, padding: '10px 14px', border: '1.5px solid #94a3b8', background: '#ffffff', color: '#0f172a' }}
                  >
                    <option value="Routine Service / Maintenance">Routine Service / Maintenance</option>
                    <option value="Scheduled 5,000km Engine Service">Scheduled 5,000km Engine Service</option>
                    <option value="Braking System Repair">Braking System Repair</option>
                    <option value="Suspension & Steering Overhaul">Suspension & Steering Overhaul</option>
                    <option value="Electrical & Battery Replacement">Electrical & Battery Replacement</option>
                    <option value="Cooling & AC System Fix">Cooling & AC System Fix</option>
                    <option value="Emergency Breakdown Repair">Emergency Breakdown Repair</option>
                    <option value="Worn Part Replacement">Worn Part Replacement</option>
                    <option value="Pre-Trip Inspection Fix">Pre-Trip Inspection Fix</option>
                    <option value="Other Maintenance">Other Maintenance</option>
                  </select>
                </div>

                {/* Maintenance Notes */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                    Work Order / Mechanics Notes (Optional)
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    placeholder="e.g. Installed at Accra workshop bay 1; old part surrendered for disposal..."
                    value={issueNotes}
                    onChange={e => setIssueNotes(e.target.value)}
                    style={{ fontSize: '0.95rem', fontWeight: 500, padding: '10px 14px', border: '1.5px solid #94a3b8', background: '#ffffff', color: '#0f172a' }}
                  />
                </div>

                {/* Issued By */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                    Authorized Dispatcher
                  </label>
                  <input
                    className="form-input"
                    value={issuedBy}
                    onChange={e => setIssuedBy(e.target.value)}
                    required
                    style={{ fontSize: '0.95rem', fontWeight: 600, padding: '10px 14px', border: '1.5px solid #94a3b8', background: '#ffffff', color: '#0f172a' }}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 20px', borderTop: '2px solid #e2e8f0', background: '#f8fafc' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIssuingPart(null)}
                  style={{ fontSize: '0.95rem', fontWeight: 700, padding: '10px 18px', border: '1.5px solid #cbd5e1', color: '#334155', background: '#ffffff' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '0.95rem', fontWeight: 700, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🧾</span>
                  <span>Issue & Generate Official Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: OFFICIAL PRINTABLE RECEIPT / VOUCHER ── */}
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
            {/* Top Action Bar (hidden on print) */}
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
                <span className="font-semibold text-sm">Disbursement Receipt Ready</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handlePrintReceipt}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <span>🖨️</span>
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleCopyReceipt(activeReceipt)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <span>📋</span>
                  <span>{receiptCopied ? '✓ Copied!' : 'Copy Text'}</span>
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

            {/* PRINTABLE RECEIPT DOCUMENT CONTAINER */}
            <div
              id="byt-printable-receipt"
              style={{
                background: '#ffffff',
                color: '#111827',
                padding: '28px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              {/* Receipt Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Logo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/byt-logomark.png"
                    alt="BYT Logo"
                    style={{ width: 44, height: 44, objectFit: 'contain' }}
                    onError={e => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.02em', color: '#111827' }}>
                      BYT FLEET LOGISTICS
                    </h2>
                    <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px' }}>
                      Vehicle Maintenance &amp; Parts Logistics • Ring Road Central, Accra, Ghana
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                      Fleet Desk: 0208713722 • Dispatcher: {activeReceipt.issuedBy}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#4b5563',
                    }}
                  >
                    Inventory Requisition Voucher
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      color: '#b45309',
                      marginTop: '2px',
                    }}
                  >
                    {activeReceipt.receiptNumber}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Date: {activeReceipt.issuedAt}</div>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      padding: '3px 10px',
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      borderRadius: '4px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    ✓ DISBURSED &amp; RECORDED
                  </span>
                </div>
              </div>

              {/* Two-Column Info Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                {/* Driver / Vehicle Box */}
                <div
                  style={{
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1.5px solid #e5e7eb',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#374151', fontWeight: 800, marginBottom: '4px', letterSpacing: '0.04em' }}>
                    Recipient Driver &amp; Vehicle
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>{activeReceipt.driverName}</div>
                  <div style={{ fontSize: '0.88rem', color: '#374151', fontFamily: 'monospace', fontWeight: 600 }}>
                    Tel: {activeReceipt.driverPhone}
                  </div>
                  <div style={{ marginTop: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid #fde68a',
                      }}
                    >
                      {activeReceipt.vehiclePlate}
                    </span>
                  </div>
                </div>

                {/* Work Order / Purpose Box */}
                <div
                  style={{
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1.5px solid #e5e7eb',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#374151', fontWeight: 800, marginBottom: '4px', letterSpacing: '0.04em' }}>
                    Requisition Purpose &amp; Dispatch
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>{activeReceipt.purpose}</div>
                  <div style={{ fontSize: '0.88rem', color: '#374151', marginTop: '4px' }}>
                    Issued by: <strong style={{ color: '#111827', fontWeight: 800 }}>{activeReceipt.issuedBy}</strong>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px' }}>
                    SKU Ref: <span style={{ fontFamily: 'monospace' }}>{activeReceipt.partId}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.82rem',
                  marginBottom: '16px',
                  color: '#111827',
                }}
              >
                <thead>
                  <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px', color: '#374151', fontWeight: 700 }}>#</th>
                    <th style={{ padding: '8px 10px', color: '#374151', fontWeight: 700 }}>Item / Part Description</th>
                    <th style={{ padding: '8px 10px', color: '#374151', fontWeight: 700 }}>Category</th>
                    <th style={{ padding: '8px 10px', color: '#374151', fontWeight: 700, textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 10px', color: '#374151', fontWeight: 700, textAlign: 'right' }}>Unit Cost</th>
                    <th style={{ padding: '8px 10px', color: '#374151', fontWeight: 700, textAlign: 'right' }}>Total (GHS)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px', color: '#6b7280' }}>1</td>
                    <td style={{ padding: '10px', fontWeight: 600, color: '#111827' }}>{activeReceipt.partName}</td>
                    <td style={{ padding: '10px', color: '#4b5563' }}>{activeReceipt.category}</td>
                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700, fontFamily: 'monospace' }}>
                      {activeReceipt.quantity}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontFamily: 'monospace' }}>
                      {formatCurrency(activeReceipt.unitCost)}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', color: '#111827' }}>
                      {formatCurrency(activeReceipt.totalCost)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style={{ background: '#f9fafb', borderTop: '2px solid #d1d5db' }}>
                    <td colSpan={4} style={{ padding: '10px', fontWeight: 700, textAlign: 'right', color: '#374151' }}>
                      Grand Total Disbursed:
                    </td>
                    <td colSpan={2} style={{ padding: '10px', textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: '#047857', fontFamily: 'monospace' }}>
                      {formatCurrency(activeReceipt.totalCost)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Maintenance Notes if any */}
              {activeReceipt.notes && (
                <div
                  style={{
                    padding: '8px 12px',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    border: '1px dashed #d1d5db',
                    fontSize: '0.78rem',
                    color: '#4b5563',
                    marginBottom: '16px',
                  }}
                >
                  <strong style={{ color: '#111827' }}>Technician / Workshop Notes:</strong> {activeReceipt.notes}
                </div>
              )}

              {/* Signatures & Verification Block */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '24px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                {/* Driver Signature Box */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#4b5563', marginBottom: '28px' }}>
                    I acknowledge receipt of the genuine part(s) specified above for installation in vehicle {activeReceipt.vehiclePlate}.
                  </div>
                  <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#374151' }}>
                    <span>Driver: {activeReceipt.driverName}</span>
                    <span>Sign &amp; Date</span>
                  </div>
                </div>

                {/* Storekeeper / Dispatch Stamp Box */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      border: '2px dashed #059669',
                      borderRadius: '6px',
                      padding: '8px 18px',
                      color: '#059669',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    <div>BYT FLEET LOGISTICS</div>
                    <div>★ VERIFIED &amp; DISBURSED ★</div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#047857', marginTop: '2px' }}>
                      {activeReceipt.issuedBy}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 600 }}>
                    Official Inventory Disbursement Record • BYT Systems
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
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
            max-width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #ccc !important;
            border-radius: 0 !important;
            padding: 24px !important;
            margin: 0 !important;
            z-index: 9999999 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
