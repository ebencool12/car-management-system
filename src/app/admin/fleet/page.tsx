/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  demoVehicles,
  demoDrivers,
  demoMaintenanceSchedules,
  getSeverityBadgeClass,
  getMaintenanceStatusColor,
  formatCurrency,
  Vehicle,
  MaintenanceSchedule,
  MaintenanceHistory,
  Driver,
  getStoredDrivers,
  getStoredMaintenanceSchedules,
  saveStoredMaintenanceSchedules,
  getStoredMaintenanceHistory,
  saveStoredMaintenanceHistory,
} from '@/lib/demo-data';

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(demoVehicles);
  const [drivers, setDrivers] = useState<Driver[]>(demoDrivers);
  const [search, setSearch] = useState('');
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceHistory[]>([]);

  const loadData = () => {
    const currentDrivers = getStoredDrivers();
    setDrivers(currentDrivers);
    const currentSchedules = getStoredMaintenanceSchedules();
    const currentHistory = getStoredMaintenanceHistory();

    // INCLUSIVE COVERAGE: Ensure every active driver is covered by maintenance schedule with no exemption
    const activeDrivers = currentDrivers.filter(d => d.status === 'ACTIVE');
    let schedulesModified = false;
    const workingSchedules = [...currentSchedules];

    activeDrivers.forEach(driver => {
      const hasCoverage = workingSchedules.some(
        s => s.driverName?.toLowerCase() === driver.name.toLowerCase()
      );
      if (!hasCoverage) {
        schedulesModified = true;
        const assignedPlate = driver.vehicle?.plateNumber || `GR-${Math.floor(1000 + Math.random() * 9000)}-23`;
        workingSchedules.push({
          id: `ms-auto-${driver.id}-${Date.now()}`,
          vehicleId: driver.vehicle?.id || `v-${driver.id}`,
          vehiclePlate: assignedPlate,
          driverName: driver.name,
          serviceType: 'Routine Scheduled Maintenance',
          dueMileage: 35000,
          currentMileage: 30000,
          dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'UPCOMING',
          cost: 200,
        });
      }
    });

    if (schedulesModified) {
      saveStoredMaintenanceSchedules(workingSchedules);
      setSchedules(workingSchedules);
    } else {
      setSchedules(currentSchedules);
    }

    setMaintenanceHistory(currentHistory);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('byt-drivers-updated', handleUpdate);
    window.addEventListener('byt-maintenance-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('byt-drivers-updated', handleUpdate);
      window.removeEventListener('byt-maintenance-updated', handleUpdate);
    };
  }, []);

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  // Vehicle photo modal & Add vehicle modal states
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString());
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newGps, setNewGps] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newCarImageInput, setNewCarImageInput] = useState('');
  const [newVehicleImages, setNewVehicleImages] = useState<string[]>([]);

  // Tab state
  const [activeTab, setActiveTab] = useState<'fleet' | 'maintenance'>('fleet');

  // Maintenance schedules state
  const [scheduleStatusFilter, setScheduleStatusFilter] = useState('ALL');
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState('ALL');
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);

  // New schedule form state
  const [newSchedPlate, setNewSchedPlate] = useState(demoVehicles[0]?.plateNumber || '');
  const [newSchedDriver, setNewSchedDriver] = useState('Kwame Asante');
  const [newSchedType, setNewSchedType] = useState('Oil Change');
  const [newSchedDueMileage, setNewSchedDueMileage] = useState('50000');
  const [newSchedDueDate, setNewSchedDueDate] = useState('');
  const [newSchedCost, setNewSchedCost] = useState('250');

  // AUTO-ROLLOVER & HISTORY LOGGING
  const handleMarkCompleteSchedule = (id: string) => {
    const item = schedules.find(s => s.id === id);
    if (!item) return;

    // 1. Log to Maintenance History
    const historyEntry: MaintenanceHistory = {
      id: `mh-${Date.now()}`,
      vehicleId: item.vehicleId,
      vehiclePlate: item.vehiclePlate,
      driverName: item.driverName || 'Fleet Driver',
      serviceType: item.serviceType,
      dateCompleted: new Date().toISOString().split('T')[0],
      mileage: item.currentMileage || item.dueMileage || 40000,
      cost: item.cost || 220,
      notes: 'Service completed, inspected and certified by fleet manager.',
      performedBy: 'BYT Certified Fleet Workshop',
    };
    const currentHist = getStoredMaintenanceHistory();
    const updatedHistory = [historyEntry, ...currentHist];
    saveStoredMaintenanceHistory(updatedHistory);
    setMaintenanceHistory(updatedHistory);

    // 2. Auto-schedule next recurring service cycle (+90 days, +5,000 km)
    const nextDueMileage = (item.dueMileage || item.currentMileage || 40000) + 5000;
    const nextDueDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const nextSchedule: MaintenanceSchedule = {
      id: `ms-${Date.now()}`,
      vehicleId: item.vehicleId,
      vehiclePlate: item.vehiclePlate,
      driverName: item.driverName,
      serviceType: item.serviceType === 'Oil Change' ? 'Oil & Filter Change' : item.serviceType,
      dueMileage: nextDueMileage,
      currentMileage: item.currentMileage || (nextDueMileage - 5000),
      dueDate: nextDueDate,
      status: 'UPCOMING',
      cost: item.cost || 220,
    };

    // 3. Mark current as completed and insert new rollover schedule
    const updatedSchedules = schedules.map(s =>
      s.id === id ? { ...s, status: 'COMPLETED' as const, completedDate: new Date().toISOString().split('T')[0] } : s
    );
    const finalSchedules = [nextSchedule, ...updatedSchedules];
    saveStoredMaintenanceSchedules(finalSchedules);
    setSchedules(finalSchedules);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.plateNumber === newSchedPlate);
    const newSched: MaintenanceSchedule = {
      id: `ms-${Date.now()}`,
      vehicleId: veh?.id || `v-${Date.now()}`,
      vehiclePlate: newSchedPlate,
      driverName: newSchedDriver,
      serviceType: newSchedType,
      dueMileage: parseInt(newSchedDueMileage) || 0,
      currentMileage: veh?.mileage || 0,
      dueDate: newSchedDueDate || new Date().toISOString().split('T')[0],
      status: 'UPCOMING',
      cost: newSchedCost ? parseFloat(newSchedCost) : undefined,
    };

    const updated = [newSched, ...schedules];
    saveStoredMaintenanceSchedules(updated);
    setSchedules(updated);
    setShowAddScheduleModal(false);
    setNewSchedCost('');
    setNewSchedDueDate('');
  };

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
          <p className="subtitle">{vehicles.length} vehicles in your fleet • Manage condition, service schedules & vehicle photos</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <Link href="/admin/tco" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>🧮</span>
            <span>TCO & ROI Engine</span>
          </Link>
          {activeTab === 'fleet' ? (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              + Add Vehicle
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowAddScheduleModal(true)}>
              + Schedule Service
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-lg)' }}>
        <button className={`tab ${activeTab === 'fleet' ? 'active' : ''}`} onClick={() => setActiveTab('fleet')}>
          🚗 Vehicle Fleet ({vehicles.length})
        </button>
        <button className={`tab ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>
          🔧 Service Schedules & Maintenance ({schedules.filter(s => s.status !== 'COMPLETED').length} active)
        </button>
      </div>

      {activeTab === 'fleet' && (
        <>
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

                  {/* Mileage & Fuel */}
                  {vehicle.mileage && (
                    <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.85rem' }}>🔢</span>
                        <span className="font-mono" style={{ fontWeight: 600 }}>{vehicle.mileage.toLocaleString()} km</span>
                      </div>
                      {vehicle.fuelType && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}>
                          <span style={{ fontSize: '0.85rem' }}>⛽</span>
                          <span>{vehicle.fuelType}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-sm)', marginTop: 'var(--space-xs)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="text-xs text-muted" style={{ marginBottom: '2px' }}>Assigned Driver</div>
                      <div className="text-sm font-semibold">{vehicle.assignedDriverName || 'Unassigned'}</div>
                    </div>
                    {vehicle.assignedDriverName && (
                      <Link
                        href={`/admin/chat?driverId=${drivers.find(d => d.name === vehicle.assignedDriverName)?.id || demoDrivers.find(d => d.name === vehicle.assignedDriverName)?.id || '1'}`}
                        className="btn btn-sm"
                        style={{
                          fontSize: '0.72rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(8, 145, 178, 0.1)',
                          border: '1px solid var(--byt-sea)',
                          color: 'var(--byt-sea-dark)',
                          textDecoration: 'none',
                          fontWeight: 600
                        }}
                        title={`Chat with ${vehicle.assignedDriverName}`}
                      >
                        <span>💬</span>
                        <span>Chat with Driver</span>
                      </Link>
                    )}
                  </div>

                  {/* Next Service Info */}
                  {(() => {
                    const schedules = demoMaintenanceSchedules.filter(s => s.vehicleId === vehicle.id);
                    const nextDue = schedules.find(s => s.status !== 'COMPLETED');
                    if (!nextDue) return null;
                    const statusColor = getMaintenanceStatusColor(nextDue.status);
                    const mileageProgress = nextDue.dueMileage > 0 ? Math.min((nextDue.currentMileage / nextDue.dueMileage) * 100, 100) : 0;
                    return (
                      <div style={{ marginTop: 'var(--space-sm)', padding: '6px 8px', background: `${statusColor}08`, borderRadius: 'var(--radius-sm)', border: `1px solid ${statusColor}25` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: statusColor }}>
                            🔧 {nextDue.serviceType}
                          </span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: statusColor, padding: '1px 6px', background: `${statusColor}15`, borderRadius: 'var(--radius-full)' }}>
                            {nextDue.status.replace('_', ' ')}
                          </span>
                        </div>
                        {nextDue.dueMileage > 0 && (
                          <div style={{ height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${mileageProgress}%`, background: statusColor, borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                          </div>
                        )}
                        <div className="text-xs text-muted" style={{ marginTop: '2px' }}>
                          Due: {nextDue.dueDate}{nextDue.dueMileage > 0 ? ` • ${nextDue.currentMileage.toLocaleString()}/${nextDue.dueMileage.toLocaleString()} km` : ''}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Condition Log (last 2 events) */}
                  {vehicle.conditionLog && vehicle.conditionLog.length > 0 && (
                    <div style={{ marginTop: 'var(--space-sm)' }}>
                      <div className="text-xs text-muted" style={{ marginBottom: '4px' }}>Recent History</div>
                      {vehicle.conditionLog.slice(0, 2).map((log, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginBottom: '3px' }}>
                          <span style={{ fontSize: '0.65rem', marginTop: '1px' }}>
                            {log.type === 'SERVICE' ? '🔧' : log.type === 'REPAIR' ? '🛠️' : log.type === 'INCIDENT' ? '🚨' : '🔍'}
                          </span>
                          <span>{log.event}</span>
                        </div>
                      ))}
                    </div>
                  )}

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
    </>
  )}

  {/* TAB 2: SERVICE SCHEDULES & MAINTENANCE */}
  {activeTab === 'maintenance' && (
    <div className="animate-in">
      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="stat-card gold">
          <div className="stat-number" style={{ color: 'var(--byt-gold)' }}>
            {schedules.length}
          </div>
          <div className="stat-title">Total Scheduled</div>
          <div className="text-xs text-muted" style={{ marginTop: '4px' }}>All maintenance records</div>
        </div>

        <div className="stat-card red">
          <div className="stat-number text-red">
            {schedules.filter(s => s.status === 'OVERDUE').length}
          </div>
          <div className="stat-title">Overdue Services</div>
          <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Immediate attention required</div>
        </div>

        <div className="stat-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div className="stat-number" style={{ color: 'var(--color-yellow)' }}>
            {schedules.filter(s => s.status === 'DUE_SOON').length}
          </div>
          <div className="stat-title">Due Soon</div>
          <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Within next 14 days / 2,000 km</div>
        </div>

        <div className="stat-card green">
          <div className="stat-number text-green">
            {schedules.filter(s => s.status === 'COMPLETED').length}
          </div>
          <div className="stat-title">Completed</div>
          <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Past services serviced</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Filter by plate, service, driver..."
              value={scheduleSearch}
              onChange={e => setScheduleSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: '2px', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
            {['ALL', 'OVERDUE', 'DUE_SOON', 'UPCOMING', 'COMPLETED'].map(statusKey => (
              <button
                key={statusKey}
                type="button"
                className={`btn btn-sm ${scheduleStatusFilter === statusKey ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
                onClick={() => setScheduleStatusFilter(statusKey)}
              >
                {statusKey === 'ALL' ? 'All' : statusKey.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Service Type Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', fontSize: '0.8rem', padding: '0.35rem 0.6rem' }}
            value={scheduleTypeFilter}
            onChange={e => setScheduleTypeFilter(e.target.value)}
          >
            <option value="ALL">All Service Types</option>
            <option value="Oil Change">🛢️ Oil Change</option>
            <option value="Tire Replacement">🔄 Tire Replacement</option>
            <option value="Brake Inspection">🛑 Brake Inspection</option>
            <option value="Full Service">⚙️ Full Service</option>
            <option value="Suspension Check">🔩 Suspension Check</option>
            <option value="Insurance Renewal">📋 Insurance Renewal</option>
          </select>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddScheduleModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>+</span>
          <span>Schedule Service</span>
        </button>
      </div>

      {/* Service Schedules Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-md)' }}>
        {schedules
          .filter(s => {
            const matchSearch =
              s.vehiclePlate.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
              s.serviceType.toLowerCase().includes(scheduleSearch.toLowerCase());
            const matchStatus = scheduleStatusFilter === 'ALL' || s.status === scheduleStatusFilter;
            const matchType = scheduleTypeFilter === 'ALL' || s.serviceType === scheduleTypeFilter;
            return matchSearch && matchStatus && matchType;
          })
          .map(item => {
            const veh = vehicles.find(v => v.plateNumber === item.vehiclePlate);
            const statusColor = getMaintenanceStatusColor(item.status);
            const mileageProgress = item.dueMileage > 0 ? Math.min((item.currentMileage / item.dueMileage) * 100, 100) : 0;
            const kmDiff = item.dueMileage > 0 ? item.dueMileage - item.currentMileage : 0;

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  borderLeft: `4px solid ${statusColor}`,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>
                          {item.serviceType.includes('Oil') ? '🛢️' :
                           item.serviceType.includes('Tire') ? '🔄' :
                           item.serviceType.includes('Brake') ? '🛑' :
                           item.serviceType.includes('Insurance') ? '📋' :
                           item.serviceType.includes('Suspension') ? '🔩' : '⚙️'}
                        </span>
                        <span>{item.serviceType}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        {veh ? `${veh.make} ${veh.model}` : 'Vehicle'}
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: statusColor,
                      padding: '3px 8px',
                      background: `${statusColor}18`,
                      borderRadius: 'var(--radius-full)',
                      border: `1px solid ${statusColor}33`,
                      letterSpacing: '0.5px'
                    }}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Plate & Driver */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    background: 'var(--color-bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    margin: 'var(--space-xs) 0 var(--space-sm)'
                  }}>
                    <div>
                      <div className="text-xs text-muted">Vehicle Plate</div>
                      <div className="font-mono font-bold" style={{ fontSize: '0.85rem', color: 'var(--byt-gold)' }}>{item.vehiclePlate}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="text-xs text-muted">Assigned Driver</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <span className="font-semibold text-sm">{veh?.assignedDriverName || item.driverName || 'Unassigned'}</span>
                        {(veh?.assignedDriverName || item.driverName) && (
                          <Link
                            href={`/admin/chat?driverId=${drivers.find(d => d.name === (veh?.assignedDriverName || item.driverName))?.id || '1'}`}
                            className="btn btn-ghost btn-sm"
                            style={{
                              fontSize: '0.68rem',
                              padding: '1px 6px',
                              border: '1px solid var(--color-border)',
                              borderRadius: '4px',
                              color: 'var(--byt-sea-dark)',
                              textDecoration: 'none',
                              fontWeight: 600
                            }}
                            title={`Chat with ${veh?.assignedDriverName || item.driverName}`}
                          >
                            💬 Chat
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mileage progress */}
                  {item.dueMileage > 0 && (
                    <div style={{ marginBottom: 'var(--space-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                        <span className="text-muted">Mileage Progress</span>
                        <span className="font-mono font-bold">
                          {item.currentMileage.toLocaleString()} / {item.dueMileage.toLocaleString()} km
                        </span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${mileageProgress}%`,
                          background: statusColor,
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
                        <span>
                          {kmDiff > 0 ? `${kmDiff.toLocaleString()} km remaining` : `${Math.abs(kmDiff).toLocaleString()} km overdue`}
                        </span>
                        <span>{mileageProgress.toFixed(0)}%</span>
                      </div>
                    </div>
                  )}

                  {/* Dates & Cost */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 'auto', paddingTop: 'var(--space-xs)' }}>
                    <div>
                      <span className="text-muted">Due Date: </span>
                      <span style={{ fontWeight: 600, color: item.status === 'OVERDUE' ? 'var(--color-red)' : 'var(--color-text)' }}>
                        {item.dueDate}
                      </span>
                    </div>
                    {item.cost && (
                      <div>
                        <span className="text-muted">Est. Cost: </span>
                        <span className="font-mono font-bold" style={{ color: 'var(--byt-gold)' }}>{formatCurrency(item.cost)}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer actions */}
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-sm)', marginTop: 'var(--space-sm)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-xs)' }}>
                    {item.status !== 'COMPLETED' ? (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
                        onClick={() => handleMarkCompleteSchedule(item.id)}
                      >
                        ✓ Mark Completed
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ✓ Service Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* COMPLETED MAINTENANCE HISTORY LOG */}
      <div className="card animate-in" style={{ marginTop: 'var(--space-xl)' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div>
            <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)', fontWeight: 700 }}>
              Official Service Archive
            </span>
            <h3 style={{ margin: 0 }}>📋 Completed Maintenance History Log</h3>
          </div>
          <span className="text-xs text-muted">{maintenanceHistory.length} certified services recorded</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container" style={{ margin: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Date Completed</th>
                  <th>Vehicle Plate</th>
                  <th>Assigned Driver</th>
                  <th>Service Performed</th>
                  <th>Service Mileage</th>
                  <th>Total Cost</th>
                  <th>Certified By</th>
                  <th>Record Status</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceHistory.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--color-text-muted)' }}>
                      No maintenance completed yet. When you mark a schedule complete, it will automatically log here and rollover the next cycle.
                    </td>
                  </tr>
                ) : (
                  maintenanceHistory.map(hist => (
                    <tr key={hist.id}>
                      <td className="text-sm">{hist.dateCompleted}</td>
                      <td>
                        <code className="font-mono text-xs" style={{ color: 'var(--byt-gold)', background: 'var(--color-bg-input)', padding: '2px 6px', borderRadius: '4px' }}>
                          {hist.vehiclePlate}
                        </code>
                      </td>
                      <td className="font-semibold text-sm">{hist.driverName}</td>
                      <td className="text-sm">{hist.serviceType}</td>
                      <td className="font-mono text-sm">{hist.mileage.toLocaleString()} km</td>
                      <td className="font-mono text-sm font-bold text-green">{formatCurrency(hist.cost)}</td>
                      <td className="text-xs text-muted">{hist.performedBy || 'BYT Certified Workshop'}</td>
                      <td>
                        <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>✓ Logged & Rolled Over</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
                    <select
                      className="form-select"
                      value={newDriver}
                      onChange={e => setNewDriver(e.target.value)}
                    >
                      <option value="">Unassigned (None)</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.name}>
                          {d.name} ({d.phone}) {d.vehicle ? `[Vehicle: ${d.vehicle.plateNumber}]` : '[Unassigned]'}
                        </option>
                      ))}
                    </select>
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

      {/* SCHEDULE SERVICE MODAL */}
      {showAddScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowAddScheduleModal(false)}>
          <div className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleCreateSchedule}>
              <div className="modal-header">
                <div>
                  <h3 style={{ margin: 0 }}>🔧 Schedule Service / Maintenance</h3>
                  <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                    Track mileage-based or date-based routine maintenance for fleet vehicles.
                  </p>
                </div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowAddScheduleModal(false)}>✕</button>
              </div>

              <div className="modal-body">
                {/* Vehicle Selection */}
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Select Vehicle *</label>
                  <select
                    className="form-select font-mono font-bold"
                    value={newSchedPlate}
                    onChange={e => setNewSchedPlate(e.target.value)}
                    required
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.plateNumber}>
                        {v.plateNumber} — {v.make} {v.model} ({v.assignedDriverName || 'No Driver'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Type */}
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Service Type *</label>
                  <select
                    className="form-select"
                    value={newSchedType}
                    onChange={e => setNewSchedType(e.target.value)}
                    required
                  >
                    <option value="Oil Change">🛢️ Oil Change (Engine Oil & Filter)</option>
                    <option value="Tire Replacement">🔄 Tire Replacement / Balancing</option>
                    <option value="Brake Inspection">🛑 Brake Pads & Disc Inspection</option>
                    <option value="Full Service">⚙️ Full Service (Filters, Plugs, Fluids)</option>
                    <option value="Suspension Check">🔩 Suspension & Shocks Overhaul</option>
                    <option value="Insurance Renewal">📋 Comprehensive Insurance Renewal</option>
                    <option value="Air Conditioning">❄️ A/C Regas & Cleaning</option>
                  </select>
                </div>

                {/* Due Mileage */}
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Target Due Mileage (km)</label>
                  <input
                    type="number"
                    className="form-input font-mono"
                    placeholder="e.g. 50000 (0 if date-only)"
                    value={newSchedDueMileage}
                    onChange={e => setNewSchedDueMileage(e.target.value)}
                  />
                  <div className="text-xs text-muted" style={{ marginTop: '2px' }}>
                    Leave as 0 for calendar-based items like insurance.
                  </div>
                </div>

                {/* Due Date */}
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Scheduled Due Date *</label>
                  <input
                    type="date"
                    className="form-input font-mono"
                    value={newSchedDueDate}
                    onChange={e => setNewSchedDueDate(e.target.value)}
                    required
                  />
                </div>

                {/* Estimated Cost */}
                <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                  <label className="form-label">Estimated Cost (GHS)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input font-mono"
                    placeholder="e.g. 250"
                    value={newSchedCost}
                    onChange={e => setNewSchedCost(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddScheduleModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
