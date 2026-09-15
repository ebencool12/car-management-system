/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { demoVehicles, getSeverityBadgeClass, Vehicle } from '@/lib/demo-data';

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(demoVehicles);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  // Photo management modal
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [photoError, setPhotoError] = useState('');

  // Add vehicle form state
  const [newPlate, setNewPlate] = useState('');
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newGps, setNewGps] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newVehicleImages, setNewVehicleImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80'
  ]);
  const [newCarImageInput, setNewCarImageInput] = useState('');

  const filtered = vehicles.filter(v => {
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

  const handleOpenPhotos = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setNewPhotoUrl('');
    setPhotoError('');
  };

  const handleRemovePhoto = (photoIndex: number) => {
    if (!selectedVehicle) return;
    const updatedImages = (selectedVehicle.images || []).filter((_, idx) => idx !== photoIndex);
    const updatedVehicle = { ...selectedVehicle, images: updatedImages };
    setSelectedVehicle(updatedVehicle);
    setVehicles(prev => prev.map(v => v.id === selectedVehicle.id ? updatedVehicle : v));
  };

  const handleAddPhotoUrl = () => {
    if (!selectedVehicle) return;
    const trimmed = newPhotoUrl.trim();
    if (!trimmed) {
      setPhotoError('Please enter a valid image URL');
      return;
    }
    const updatedImages = [...(selectedVehicle.images || []), trimmed];
    const updatedVehicle = { ...selectedVehicle, images: updatedImages };
    setSelectedVehicle(updatedVehicle);
    setVehicles(prev => prev.map(v => v.id === selectedVehicle.id ? updatedVehicle : v));
    setNewPhotoUrl('');
    setPhotoError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedVehicle || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const updatedImages = [...(selectedVehicle.images || []), dataUrl];
      const updatedVehicle = { ...selectedVehicle, images: updatedImages };
      setSelectedVehicle(updatedVehicle);
      setVehicles(prev => prev.map(v => v.id === selectedVehicle.id ? updatedVehicle : v));
      setPhotoError('');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddPresetPhoto = (url: string) => {
    if (!selectedVehicle) return;
    const updatedImages = [...(selectedVehicle.images || []), url];
    const updatedVehicle = { ...selectedVehicle, images: updatedImages };
    setSelectedVehicle(updatedVehicle);
    setVehicles(prev => prev.map(v => v.id === selectedVehicle.id ? updatedVehicle : v));
    setPhotoError('');
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newMake || !newModel) return;

    const newVeh: Vehicle = {
      id: `v-${Date.now()}`,
      plateNumber: newPlate.toUpperCase(),
      make: newMake,
      model: newModel,
      year: parseInt(newYear) || 2024,
      severityStatus: 'GREEN',
      gpsDeviceId: newGps || `GPS-${Math.floor(100 + Math.random() * 900)}`,
      assignedDriverName: newDriver || null,
      images: newVehicleImages
    };

    setVehicles(prev => [newVeh, ...prev]);
    setShowAddModal(false);
    // Reset
    setNewPlate('');
    setNewMake('');
    setNewModel('');
    setNewGps('');
    setNewDriver('');
    setNewVehicleImages([]);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Fleet Management</h1>
          <p className="subtitle">{vehicles.length} vehicles in your fleet • Manage condition & vehicle photos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Vehicle
        </button>
      </div>

      {/* Severity Summary */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="stat-card red">
          <div className="stat-number text-red">{vehicles.filter(v => v.severityStatus === 'RED').length}</div>
          <div className="stat-title">Emergency</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <div className="stat-number" style={{ color: 'var(--color-yellow)' }}>{vehicles.filter(v => v.severityStatus === 'YELLOW').length}</div>
          <div className="stat-title">Needs Attention</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number text-green">{vehicles.filter(v => v.severityStatus === 'GREEN').length}</div>
          <div className="stat-title">Healthy</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search vehicles by plate, make, model or driver..." value={search} onChange={e => setSearch(e.target.value)} />
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
          {filtered.map(vehicle => {
            const hasImages = vehicle.images && vehicle.images.length > 0;
            const primaryImage = hasImages ? vehicle.images![0] : null;

            return (
              <div key={vehicle.id} className="card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {vehicle.severityStatus === 'RED' && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8, zIndex: 10, width: 14, height: 14, borderRadius: '50%',
                    background: 'var(--color-red)', boxShadow: '0 0 12px var(--color-red-glow)',
                    animation: 'pulse-red 2s ease-in-out infinite'
                  }} />
                )}

                {/* Car Photo Banner */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: 150,
                  backgroundColor: 'var(--color-bg-input)',
                  backgroundImage: primaryImage ? `url(${primaryImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid var(--color-border)'
                }}>
                  {!primaryImage && (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🚗</div>
                      <div>No photo uploaded</div>
                    </div>
                  )}

                  {/* Photo count badge */}
                  <button
                    type="button"
                    onClick={() => handleOpenPhotos(vehicle)}
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'white',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Click to view/add/remove photos"
                  >
                    <span>📷</span>
                    <span>{vehicle.images?.length || 0} {vehicle.images?.length === 1 ? 'photo' : 'photos'}</span>
                  </button>

                  <div style={{ position: 'absolute', top: 8, left: 8 }}>
                    <span className={`badge ${getSeverityBadgeClass(vehicle.severityStatus)}`}>
                      {vehicle.severityStatus}
                    </span>
                  </div>
                </div>

                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
                    <div>
                      <div className="font-mono font-bold" style={{ fontSize: '1.1rem' }}>{vehicle.plateNumber}</div>
                      <div className="text-sm text-muted">{vehicle.make} {vehicle.model} • {vehicle.year}</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-sm)', marginTop: 'var(--space-xs)' }}>
                    <div className="text-xs text-muted" style={{ marginBottom: '2px' }}>Assigned Driver</div>
                    <div className="text-sm font-semibold">{vehicle.assignedDriverName || 'Unassigned'}</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--space-md)' }}>
                    <div className="text-xs text-muted">GPS: <span className="text-green">{vehicle.gpsDeviceId}</span></div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenPhotos(vehicle)}
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                    >
                      📷 Manage Photos
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="table-container animate-in">
          <table>
            <thead>
              <tr>
                <th>Vehicle Photo</th>
                <th>Plate Number</th>
                <th>Vehicle</th>
                <th>Year</th>
                <th>Assigned Driver</th>
                <th>Severity</th>
                <th>GPS Device</th>
                <th>Photos</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(vehicle => {
                const primaryImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : null;
                return (
                  <tr key={vehicle.id}>
                    <td>
                      <div
                        onClick={() => handleOpenPhotos(vehicle)}
                        style={{
                          width: 48,
                          height: 36,
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-bg-input)',
                          backgroundImage: primaryImage ? `url(${primaryImage})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--color-border)'
                        }}
                        title="Click to manage photos"
                      >
                        {!primaryImage && <span style={{ fontSize: '1rem' }}>🚗</span>}
                      </div>
                    </td>
                    <td className="font-mono font-bold">{vehicle.plateNumber}</td>
                    <td>{vehicle.make} {vehicle.model}</td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.assignedDriverName || <span className="text-muted">Unassigned</span>}</td>
                    <td><span className={`badge ${getSeverityBadgeClass(vehicle.severityStatus)}`}>{vehicle.severityStatus}</span></td>
                    <td className="text-sm text-muted">{vehicle.gpsDeviceId}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleOpenPhotos(vehicle)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        📷 {vehicle.images?.length || 0}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenPhotos(vehicle)} title="Manage Car Images">
                          📷 Photos
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MANAGE CAR PHOTOS MODAL */}
      {selectedVehicle && (
        <div className="modal-overlay" onClick={() => setSelectedVehicle(null)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>
                  📷 Car Photos: {selectedVehicle.make} {selectedVehicle.model}
                </h3>
                <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                  Plate: <strong className="font-mono text-white">{selectedVehicle.plateNumber}</strong> • Total Photos: {selectedVehicle.images?.length || 0}
                </p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedVehicle(null)}>✕</button>
            </div>

            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Existing photos gallery */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--byt-gold)' }}>Current Gallery</h4>
                  <span className="text-xs text-muted">Click &quot;Remove&quot; to delete any image</span>
                </div>

                {(!selectedVehicle.images || selectedVehicle.images.length === 0) ? (
                  <div style={{
                    padding: 'var(--space-xl)',
                    textAlign: 'center',
                    background: 'var(--color-bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--color-border)'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>📷</div>
                    <p className="font-semibold" style={{ marginBottom: '4px' }}>No images for this vehicle yet</p>
                    <p className="text-xs text-muted">Upload a photo or paste an image URL below to add to this car&apos;s gallery.</p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: 'var(--space-md)'
                  }}>
                    {selectedVehicle.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-bg-input)'
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`${selectedVehicle.make} ${selectedVehicle.model} photo ${idx + 1}`}
                          style={{
                            width: '100%',
                            height: 130,
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 6,
                          left: 6,
                          background: 'rgba(0,0,0,0.65)',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.65rem',
                          color: 'white',
                          fontWeight: 600
                        }}>
                          #{idx + 1} {idx === 0 ? '• Cover' : ''}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            background: 'rgba(239, 68, 68, 0.9)',
                            border: 'none',
                            color: 'white',
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                          title="Remove this photo"
                        >
                          <span>🗑️</span> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Photos Section */}
              <div style={{
                background: 'var(--color-bg-input)',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-sm)', color: 'var(--byt-gold)' }}>
                  ➕ Add New Photo to this Car
                </h4>

                {photoError && (
                  <div style={{
                    color: 'var(--color-red)',
                    fontSize: '0.8rem',
                    marginBottom: 'var(--space-sm)',
                    padding: '0.4rem 0.75rem',
                    background: 'var(--color-red-bg)',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {photoError}
                  </div>
                )}

                {/* Option 1: File Upload */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>
                    Option 1: Upload Image from Computer
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="form-input"
                    style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                  />
                  <div className="text-xs text-muted" style={{ marginTop: '3px' }}>
                    Select JPG, PNG, or WebP photo of the vehicle.
                  </div>
                </div>

                {/* Option 2: Image URL */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>
                    Option 2: Paste Web Image URL
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://example.com/car-photo.jpg"
                      value={newPhotoUrl}
                      onChange={e => { setNewPhotoUrl(e.target.value); setPhotoError(''); }}
                      style={{ fontSize: '0.82rem' }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleAddPhotoUrl}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      + Add URL
                    </button>
                  </div>
                </div>

                {/* Option 3: Preset sample photos */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '4px' }}>
                    Option 3: Quick Add from Fleet Presets
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      { label: '🚘 Front View', url: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&auto=format&fit=crop&q=80' },
                      { label: '🛋️ Interior Cabin', url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop&q=80' },
                      { label: '🏎️ Side Profile', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80' },
                      { label: '🚙 Rear View', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80' },
                    ].map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleAddPresetPhoto(preset.url)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setSelectedVehicle(null)}>
                Done & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleCreateVehicle}>
              <div className="modal-header">
                <h3>Add Vehicle to Fleet</h3>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Plate Number *</label>
                    <input
                      className="form-input"
                      placeholder="GR-1234-24"
                      value={newPlate}
                      onChange={e => setNewPlate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year *</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="2024"
                      value={newYear}
                      onChange={e => setNewYear(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label">Make *</label>
                    <input
                      className="form-input"
                      placeholder="Toyota"
                      value={newMake}
                      onChange={e => setNewMake(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model *</label>
                    <input
                      className="form-input"
                      placeholder="Corolla"
                      value={newModel}
                      onChange={e => setNewModel(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                  <div className="form-group">
                    <label className="form-label">GPS Device ID</label>
                    <input
                      className="form-input"
                      placeholder="GPS-009"
                      value={newGps}
                      onChange={e => setNewGps(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign Driver</label>
                    <input
                      className="form-input"
                      placeholder="Driver Name (or leave unassigned)"
                      value={newDriver}
                      onChange={e => setNewDriver(e.target.value)}
                    />
                  </div>
                </div>

                {/* Car Photos when adding */}
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Car Photo (URL)</label>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <input
                      className="form-input"
                      placeholder="https://images.unsplash.com/..."
                      value={newCarImageInput}
                      onChange={e => setNewCarImageInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (newCarImageInput.trim()) {
                          setNewVehicleImages(prev => [...prev, newCarImageInput.trim()]);
                          setNewCarImageInput('');
                        }
                      }}
                    >
                      + Add
                    </button>
                  </div>
                  {newVehicleImages.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                      {newVehicleImages.map((img, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img
                            src={img}
                            alt="preview"
                            style={{ width: 60, height: 42, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                          />
                          <button
                            type="button"
                            onClick={() => setNewVehicleImages(prev => prev.filter((_, idx) => idx !== i))}
                            style={{
                              position: 'absolute', top: -4, right: -4, background: 'red', color: 'white',
                              border: 'none', borderRadius: '50%', width: 16, height: 16, fontSize: '10px',
                              cursor: 'pointer', lineHeight: '14px', textAlign: 'center', padding: 0
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
