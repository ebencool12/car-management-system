'use client';

import { useState } from 'react';
import { demoVehicles, getSeverityBadgeClass } from '@/lib/demo-data';

export default function FleetPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = demoVehicles.filter(v => {
    const matchSearch = v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      (v.assignedDriverName || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = severityFilter === 'ALL' || v.severityStatus === severityFilter;
    return matchSearch && matchFilter;
  }).sort((a, b) => {
    const order = { RED: 0, YELLOW: 1, GREEN: 2 };
    return (order[a.severityStatus as keyof typeof order] ?? 3) - (order[b.severityStatus as keyof typeof order] ?? 3);
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Fleet Management</h1>
          <p className="subtitle">{demoVehicles.length} vehicles in your fleet</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Vehicle
        </button>
      </div>

      {/* Severity Summary */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="stat-card red">
          <div className="stat-number text-red">{demoVehicles.filter(v => v.severityStatus === 'RED').length}</div>
          <div className="stat-title">Emergency</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <div className="stat-number" style={{ color: 'var(--color-yellow)' }}>{demoVehicles.filter(v => v.severityStatus === 'YELLOW').length}</div>
          <div className="stat-title">Needs Attention</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number text-green">{demoVehicles.filter(v => v.severityStatus === 'GREEN').length}</div>
          <div className="stat-title">Healthy</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search vehicles..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
          {['ALL', 'RED', 'YELLOW', 'GREEN'].map(f => (
            <button key={f} className={`btn btn-sm ${severityFilter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSeverityFilter(f)} style={{ fontSize: '0.75rem' }}>
              {f === 'ALL' ? 'ALL' : f === 'RED' ? '🔴 RED' : f === 'YELLOW' ? '🟡 YELLOW' : '🟢 GREEN'}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
          <button className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setViewMode('grid')}>Grid</button>
          <button className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setViewMode('table')}>Table</button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid-4 animate-in">
          {filtered.map(vehicle => (
            <div key={vehicle.id} className="card" style={{ cursor: 'pointer', position: 'relative', overflow: 'visible' }}>
              {vehicle.severityStatus === 'RED' && (
                <div style={{
                  position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: '50%',
                  background: 'var(--color-red)', boxShadow: '0 0 12px var(--color-red-glow)',
                  animation: 'pulse-red 2s ease-in-out infinite'
                }} />
              )}
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <div className="font-mono font-bold" style={{ fontSize: '1.1rem' }}>{vehicle.plateNumber}</div>
                    <div className="text-sm text-muted">{vehicle.make} {vehicle.model} • {vehicle.year}</div>
                  </div>
                  <span className={`badge ${getSeverityBadgeClass(vehicle.severityStatus)}`}>
                    {vehicle.severityStatus}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                  <div className="text-xs text-muted" style={{ marginBottom: '2px' }}>Assigned Driver</div>
                  <div className="text-sm font-semibold">{vehicle.assignedDriverName || 'Unassigned'}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-md)' }}>
                  <div className="text-xs text-muted">GPS: <span className="text-green">{vehicle.gpsDeviceId}</span></div>
                  <button className="btn btn-ghost btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Details →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container animate-in">
          <table>
            <thead>
              <tr>
                <th>Plate Number</th>
                <th>Vehicle</th>
                <th>Year</th>
                <th>Assigned Driver</th>
                <th>Severity</th>
                <th>GPS Device</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(vehicle => (
                <tr key={vehicle.id}>
                  <td className="font-mono font-bold">{vehicle.plateNumber}</td>
                  <td>{vehicle.make} {vehicle.model}</td>
                  <td>{vehicle.year}</td>
                  <td>{vehicle.assignedDriverName || <span className="text-muted">Unassigned</span>}</td>
                  <td><span className={`badge ${getSeverityBadgeClass(vehicle.severityStatus)}`}>{vehicle.severityStatus}</span></td>
                  <td className="text-sm text-muted">{vehicle.gpsDeviceId}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <button className="btn btn-ghost btn-sm">✏️</button>
                      <button className="btn btn-ghost btn-sm">📍</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Vehicle</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                <div className="form-group">
                  <label className="form-label">Plate Number</label>
                  <input className="form-input" placeholder="GR-XXXX-XX" />
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input className="form-input" type="number" placeholder="2024" />
                </div>
              </div>
              <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                <div className="form-group">
                  <label className="form-label">Make</label>
                  <input className="form-input" placeholder="Toyota" />
                </div>
                <div className="form-group">
                  <label className="form-label">Model</label>
                  <input className="form-input" placeholder="Corolla" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">GPS Device ID</label>
                <input className="form-input" placeholder="GPS-XXX" />
              </div>
              <div className="form-group">
                <label className="form-label">Assign Driver</label>
                <select className="form-select">
                  <option value="">Unassigned</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowAddModal(false)}>Add Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
