'use client';

import { useState } from 'react';
import { demoDrivers, demoVehicles, getStatusBadgeClass, getBalanceLabel } from '@/lib/demo-data';

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = demoDrivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) || d.email.includes(search);
    const matchFilter = filter === 'ALL' || d.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Drivers</h1>
          <p className="subtitle">Manage your driver roster</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Driver
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
          {['ALL', 'ACTIVE', 'PENDING', 'REMOVED'].map(f => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
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
              <th>Driver</th>
              <th>Phone</th>
              <th>Assigned Vehicle</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(driver => {
              const vehicle = demoVehicles.find(v => v.assignedDriverName === driver.name);
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
                        <div className="text-xs text-muted">{driver.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-sm">{driver.phone}</td>
                  <td>
                    {vehicle ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <code className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>{vehicle.plateNumber}</code>
                        <span className="text-xs text-muted">{vehicle.make} {vehicle.model}</span>
                      </span>
                    ) : (
                      <span className="text-muted text-sm">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`text-sm font-semibold ${bal.className}`}>{bal.text}</span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(driver.status)}`}>{driver.status}</span>
                  </td>
                  <td className="text-sm text-muted">{driver.createdAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <button className="btn btn-ghost btn-sm" title="Edit">✏️</button>
                      <button className="btn btn-ghost btn-sm" title="Reassign Vehicle">🔄</button>
                      {driver.status === 'ACTIVE' && (
                        <button className="btn btn-ghost btn-sm" title="Deactivate" style={{ color: 'var(--color-red)' }}>⛔</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Driver</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="e.g. Kwame Asante" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="024-XXX-XXXX" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="driver@email.com" />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Assign Vehicle</label>
                <select className="form-select">
                  <option value="">Select a vehicle...</option>
                  {demoVehicles.filter(v => !v.assignedDriverName).map(v => (
                    <option key={v.id} value={v.id}>{v.plateNumber} — {v.make} {v.model}</option>
                  ))}
                  <option value="none">No vehicle (assign later)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowAddModal(false)}>Add Driver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
