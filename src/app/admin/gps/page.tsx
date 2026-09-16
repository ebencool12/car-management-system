'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { demoLocations, demoVehicles, demoDrivers } from '@/lib/demo-data';
import type { GpsVehiclePoint } from '@/components/RealGpsMap';

// Dynamically import Leaflet map with SSR disabled to prevent 'window is not defined'
const RealGpsMap = dynamic(() => import('@/components/RealGpsMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: 520,
      background: '#090e17',
      color: 'var(--byt-gold)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid rgba(212, 168, 67, 0.2)'
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px', animation: 'spin 1.5s linear infinite' }}>🛰️</div>
      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Connecting to Real GPS Telemetry Engine...</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
        Loading CartoDB Dark Matter & OpenStreetMap tiles
      </div>
    </div>
  )
});

interface HardwareTracker {
  id: string;
  model: string;
  imei: string;
  protocol: 'HTTP_WEBHOOK' | 'TRACCAR' | 'TELTONIKA' | 'MQTT';
  assignedPlate: string;
  status: 'ONLINE' | 'AWAITING_SIGNAL' | 'STANDBY';
  simNumber?: string;
}

interface GpsConfig {
  telemetryEndpoint: string;
  apiKey: string;
  mapProvider: 'cartodb_dark' | 'satellite' | 'streets';
  mapboxToken: string;
  googleMapsApiKey: string;
  pollingIntervalSeconds: number;
  trackers: HardwareTracker[];
}

const defaultGpsConfig: GpsConfig = {
  telemetryEndpoint: '/api/gps/telemetry',
  apiKey: 'byt-live-telemetry-key-demo',
  mapProvider: 'cartodb_dark',
  mapboxToken: '',
  googleMapsApiKey: '',
  pollingIntervalSeconds: 5,
  trackers: [
    { id: 'trk-1', model: 'Teltonika FMB920', imei: '865321045892110', protocol: 'HTTP_WEBHOOK', assignedPlate: 'GR-1234-22', status: 'ONLINE', simNumber: '+233 24 123 4567' },
    { id: 'trk-2', model: 'Coban GPS-303G', imei: '865321045892111', protocol: 'TRACCAR', assignedPlate: 'GR-5678-21', status: 'ONLINE', simNumber: '+233 55 123 4567' },
    { id: 'trk-3', model: 'Sinotrack ST-901', imei: '865321045892112', protocol: 'HTTP_WEBHOOK', assignedPlate: 'GW-9012-23', status: 'ONLINE', simNumber: '+233 27 123 4567' },
    { id: 'trk-4', model: 'Teltonika FMC130', imei: '865321045892113', protocol: 'TELTONIKA', assignedPlate: 'GR-3456-20', status: 'ONLINE', simNumber: '+233 20 123 4567' },
    { id: 'trk-5', model: 'Concox AT4 Asset', imei: '865321045892114', protocol: 'HTTP_WEBHOOK', assignedPlate: 'GN-7890-22', status: 'ONLINE', simNumber: '+233 54 123 4567' }
  ]
};

export default function GPSPage() {
  // Selected vehicle & Live Telemetry State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('v1');
  const [vehicles, setVehicles] = useState<GpsVehiclePoint[]>(() =>
    demoLocations.map((loc, idx) => ({
      ...loc,
      speed: [48, 55, 32, 0, 62, 45, 18, 50][idx] || 35,
      heading: [45, 180, 270, 90, 135, 210, 30, 315][idx] || 0,
      altitude: 52 + idx * 4,
      battery: [96, 92, 88, 14, 98, 91, 74, 95][idx] || 90,
      ignition: loc.severity !== 'RED',
      imei: `86532104589211${idx}`,
      timestamp: new Date().toISOString()
    }))
  );

  // Map display controls
  const [mapLayer, setMapLayer] = useState<'dark' | 'satellite' | 'streets'>('dark');
  const [followSelected, setFollowSelected] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'GREEN' | 'YELLOW' | 'RED'>('ALL');

  // Hardware & API Settings Modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [gpsConfig, setGpsConfig] = useState<GpsConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('byt-gps-hardware-config');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return defaultGpsConfig;
  });

  // Track trails for the selected vehicle (breadcrumb path history)
  const [trails, setTrails] = useState<Record<string, [number, number][]>>(() => {
    const initTrails: Record<string, [number, number][]> = {};
    demoLocations.forEach(loc => {
      initTrails[loc.vehicleId] = [
        [loc.lat - 0.006, loc.lng - 0.005],
        [loc.lat - 0.004, loc.lng - 0.003],
        [loc.lat - 0.002, loc.lng - 0.001],
        [loc.lat, loc.lng]
      ];
    });
    return initTrails;
  });

  // Active selected telemetry point
  const selectedVehicle = useMemo(() =>
    vehicles.find(v => v.vehicleId === selectedVehicleId) || null,
    [vehicles, selectedVehicleId]
  );

  const selectedVehicleDetails = useMemo(() => {
    if (!selectedVehicle) return null;
    const vInfo = demoVehicles.find(v => v.id === selectedVehicle.vehicleId || v.plateNumber === selectedVehicle.plateNumber);
    const dInfo = demoDrivers.find(d => d.name === selectedVehicle.driverName);
    return { vInfo, dInfo };
  }, [selectedVehicle]);

  // Save Settings to LocalStorage
  const handleSaveSettings = () => {
    try {
      localStorage.setItem('byt-gps-hardware-config', JSON.stringify(gpsConfig));
      alert('✅ GPS Hardware & API settings saved successfully!');
    } catch {}
    setShowSettingsModal(false);
  };

  // Add new hardware tracker
  const handleAddTracker = () => {
    const newTracker: HardwareTracker = {
      id: `trk-${Date.now()}`,
      model: 'Teltonika FMB920',
      imei: `865${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      protocol: 'HTTP_WEBHOOK',
      assignedPlate: demoVehicles[0]?.plateNumber || 'GR-9999-24',
      status: 'AWAITING_SIGNAL'
    };

    setGpsConfig(prev => ({
      ...prev,
      trackers: [...prev.trackers, newTracker]
    }));
  };

  // Simulate Live Hardware Telemetry Drift (Smooth vehicle movement on roads)
  const handleSimulateLivePing = () => {
    setVehicles(prev => prev.map(v => {
      // Small simulated coordinate delta (~30-80 meters)
      const latDelta = (Math.random() - 0.48) * 0.0015;
      const lngDelta = (Math.random() - 0.48) * 0.0015;
      const newLat = Number((v.lat + latDelta).toFixed(5));
      const newLng = Number((v.lng + lngDelta).toFixed(5));
      const newSpeed = v.severity === 'RED' ? 0 : Math.floor(25 + Math.random() * 45);
      const newHeading = Math.floor((v.heading || 0) + (Math.random() * 40 - 20) + 360) % 360;

      return {
        ...v,
        lat: newLat,
        lng: newLng,
        speed: newSpeed,
        heading: newHeading,
        timestamp: new Date().toISOString()
      };
    }));

    // Update trails
    if (selectedVehicleId) {
      setTrails(prev => {
        const currentTrail = prev[selectedVehicleId] || [];
        const currentV = vehicles.find(v => v.vehicleId === selectedVehicleId);
        if (!currentV) return prev;
        const newCoords: [number, number] = [currentV.lat, currentV.lng];
        return {
          ...prev,
          [selectedVehicleId]: [...currentTrail.slice(-15), newCoords]
        };
      });
    }
  };

  // Auto-pulse telemetry polling every 6 seconds to emulate live hardware feed
  useEffect(() => {
    const timer = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        const latDelta = (Math.random() - 0.48) * 0.0015;
        const lngDelta = (Math.random() - 0.48) * 0.0015;
        const newLat = Number((v.lat + latDelta).toFixed(5));
        const newLng = Number((v.lng + lngDelta).toFixed(5));
        const newSpeed = v.severity === 'RED' ? 0 : Math.floor(25 + Math.random() * 45);
        const newHeading = Math.floor((v.heading || 0) + (Math.random() * 40 - 20) + 360) % 360;

        return {
          ...v,
          lat: newLat,
          lng: newLng,
          speed: newSpeed,
          heading: newHeading,
          timestamp: new Date().toISOString()
        };
      }));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchSearch = v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.driverName && v.driverName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchSeverity = severityFilter === 'ALL' || v.severity === severityFilter;
      return matchSearch && matchSeverity;
    });
  }, [vehicles, searchQuery, severityFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Top Header Controls */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Real GPS Fleet Tracking</span>
            <span className="badge badge-green" style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'pulse-dot 1.5s infinite' }} />
              Live Hardware Feed Active
            </span>
          </h1>
          <p className="subtitle">
            Real-time interactive OpenStreetMap & CartoDB dark telemetry map • {vehicles.length} active GPS trackers connected
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Map Layer Switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '3px',
            gap: '2px'
          }}>
            <button
              type="button"
              className={`btn btn-sm ${mapLayer === 'dark' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMapLayer('dark')}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              title="CartoDB Dark Matter Tactical Map"
            >
              🌙 Dark
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mapLayer === 'satellite' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMapLayer('satellite')}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              title="Esri World Satellite Imagery"
            >
              🛰️ Satellite
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mapLayer === 'streets' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMapLayer('streets')}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              title="Standard OpenStreetMap Streets"
            >
              🗺️ Streets
            </button>
          </div>

          {/* Simulate Live Ping */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleSimulateLivePing}
            style={{ fontSize: '0.75rem', gap: '6px' }}
            title="Simulate incoming real-time GPS telemetry ping"
          >
            <span>⚡</span>
            <span>Simulate Ping</span>
          </button>

          {/* Hardware Device & API Configuration */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowSettingsModal(true)}
            style={{ fontSize: '0.75rem', gap: '6px' }}
          >
            <span>⚙️</span>
            <span>GPS & Hardware Device Settings</span>
          </button>
        </div>
      </div>

      {/* Main Map & Telemetry Dashboard */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', minHeight: 'calc(100vh - 210px)' }}>
        {/* Left Column: Vehicle List */}
        <div style={{ width: '310px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Search & Severity Filters */}
            <div style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search plate or driver..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.78rem', padding: '6px 10px', marginBottom: '8px' }}
              />

              <div style={{ display: 'flex', gap: '3px' }}>
                {(['ALL', 'GREEN', 'YELLOW', 'RED'] as const).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    className={`btn btn-sm ${severityFilter === sev ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setSeverityFilter(sev)}
                    style={{ flex: 1, fontSize: '0.65rem', padding: '3px 4px' }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Roster List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
              {filteredVehicles.map(loc => {
                const isSelected = selectedVehicleId === loc.vehicleId;
                const tracker = gpsConfig.trackers.find(t => t.assignedPlate === loc.plateNumber);

                return (
                  <div
                    key={loc.vehicleId}
                    onClick={() => {
                      setSelectedVehicleId(loc.vehicleId);
                      setFollowSelected(true);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '6px',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(212, 168, 67, 0.12)' : 'var(--color-bg-card)',
                      border: isSelected ? '1px solid var(--byt-gold)' : '1px solid var(--color-border)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: loc.severity === 'RED' ? '#ef4444' : loc.severity === 'YELLOW' ? '#f59e0b' : '#10b981',
                          boxShadow: loc.severity === 'RED' ? '0 0 8px rgba(239,68,68,0.6)' : 'none'
                        }} />
                        <span className="font-mono font-bold" style={{ fontSize: '0.85rem', color: '#fff' }}>
                          {loc.plateNumber}
                        </span>
                      </div>
                      <span className="font-mono text-xs" style={{ color: 'var(--byt-gold)', fontWeight: 700 }}>
                        {loc.speed} km/h
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                      <span className="truncate" style={{ maxWidth: 140 }}>👤 {loc.driverName || 'Unassigned'}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>🔋 {loc.battery}%</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '0.65rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      <span>IMEI: {loc.imei?.slice(-6) || tracker?.imei.slice(-6) || '865110'}</span>
                      <span>{loc.heading}° {loc.heading! > 180 ? 'SW' : 'NE'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Real Leaflet Map Container & Live Telemetry HUD */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', position: 'relative' }}>
          {/* Real GPS Map Component */}
          <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative' }}>
            <RealGpsMap
              vehicles={filteredVehicles}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
              mapLayer={mapLayer}
              followSelected={followSelected}
              historyTrail={selectedVehicleId ? trails[selectedVehicleId] || [] : []}
            />

            {/* Floating Top Map Telemetry Indicator */}
            <div style={{
              position: 'absolute',
              top: 14,
              left: 14,
              zIndex: 1000,
              background: 'rgba(10, 22, 40, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(212, 168, 67, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              fontSize: '0.75rem',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 1.5s infinite' }} />
                <strong>GPS Feed:</strong> OpenStreetMap + CartoDB
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <button
                type="button"
                onClick={() => setFollowSelected(prev => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: followSelected ? 'var(--byt-gold)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <span>🎯</span> {followSelected ? 'Auto-Lock: ON' : 'Auto-Lock: OFF'}
              </button>
            </div>
          </div>

          {/* Selected Vehicle Live Telemetry HUD Bar */}
          {selectedVehicle && (
            <div className="card animate-in" style={{
              padding: '16px 20px',
              background: 'linear-gradient(90deg, #0d1a29 0%, #0a1628 100%)',
              border: '1px solid rgba(212, 168, 67, 0.4)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                {/* Vehicle & Driver Identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    border: '2px solid var(--byt-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    🚗
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', fontFamily: 'monospace' }}>
                        {selectedVehicle.plateNumber}
                      </h3>
                      <span className={`badge ${selectedVehicle.severity === 'RED' ? 'badge-red' : selectedVehicle.severity === 'YELLOW' ? 'badge-gold' : 'badge-green'}`}>
                        {selectedVehicle.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {selectedVehicleDetails?.vInfo?.make} {selectedVehicleDetails?.vInfo?.model} • Driver: <strong style={{ color: '#fff' }}>{selectedVehicle.driverName}</strong>
                    </div>
                  </div>
                </div>

                {/* Telemetry Metrics Grid */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  {/* Speed */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Speed</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--byt-gold)', fontFamily: 'monospace' }}>
                      {selectedVehicle.speed} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>km/h</span>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>GPS Position</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                      {selectedVehicle.lat.toFixed(4)}° N, {Math.abs(selectedVehicle.lng).toFixed(4)}° W
                    </div>
                  </div>

                  {/* Heading & Altitude */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Bearing / Alt</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                      {selectedVehicle.heading}° • {selectedVehicle.altitude}m
                    </div>
                  </div>

                  {/* Battery & Signal */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Device Telemetry</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', fontFamily: 'monospace' }}>
                      🔋 {selectedVehicle.battery}% • 3D Fix
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link
                      href="/admin/drivers"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <span>💬</span>
                      <span>Chat Driver</span>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setFollowSelected(true)}
                      style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <span>📍</span>
                      <span>Center Map</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* HARDWARE GPS DEVICE & API SETTINGS CONFIGURATION MODAL */}
      {/* ========================================================= */}
      {showSettingsModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSettingsModal(false)}
          style={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{
              width: '95%',
              maxWidth: '850px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#0a1424',
              border: '1px solid var(--byt-gold)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212,168,67,0.25)',
              borderRadius: 'var(--radius-xl)'
            }}
          >
            {/* Modal Header */}
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚙️ GPS Hardware Trackers & API Configuration</span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Enter your real GPS tracker device details, API keys, and server endpoints. You can fill them in anytime.
                </p>
              </div>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowSettingsModal(false)}>✕</button>
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
              {/* Section 1: Telemetry Ingestion API */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', color: 'var(--byt-gold)' }}>
                  🌐 1. Live Telemetry API & Webhook Endpoint
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>HTTP Webhook / Ingestion URL</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      value={gpsConfig.telemetryEndpoint}
                      onChange={e => setGpsConfig({ ...gpsConfig, telemetryEndpoint: e.target.value })}
                      placeholder="/api/gps/telemetry"
                      style={{ fontSize: '0.8rem' }}
                    />
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Configure this URL in your GPS device (e.g. Teltonika / Traccar / Coban server target).
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>API Key / Secret Token</label>
                    <input
                      type="text"
                      className="form-input font-mono"
                      value={gpsConfig.apiKey}
                      onChange={e => setGpsConfig({ ...gpsConfig, apiKey: e.target.value })}
                      placeholder="Paste your secret API key..."
                      style={{ fontSize: '0.8rem' }}
                    />
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Token used to authenticate incoming payloads from your hardware devices.
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Hardware Trackers List */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--byt-gold)' }}>
                    📡 2. Physical GPS Tracker Hardware Registry ({gpsConfig.trackers.length} Devices)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddTracker}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                  >
                    + Register New Hardware Device
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '8px' }}>Tracker Model</th>
                        <th style={{ padding: '8px' }}>IMEI / Serial #</th>
                        <th style={{ padding: '8px' }}>Protocol</th>
                        <th style={{ padding: '8px' }}>Assigned Vehicle</th>
                        <th style={{ padding: '8px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gpsConfig.trackers.map((tracker, idx) => (
                        <tr key={tracker.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '8px' }}>
                            <input
                              type="text"
                              value={tracker.model}
                              onChange={e => {
                                const newTrackers = [...gpsConfig.trackers];
                                newTrackers[idx].model = e.target.value;
                                setGpsConfig({ ...gpsConfig, trackers: newTrackers });
                              }}
                              className="form-input"
                              style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                            />
                          </td>
                          <td style={{ padding: '8px' }}>
                            <input
                              type="text"
                              value={tracker.imei}
                              onChange={e => {
                                const newTrackers = [...gpsConfig.trackers];
                                newTrackers[idx].imei = e.target.value;
                                setGpsConfig({ ...gpsConfig, trackers: newTrackers });
                              }}
                              className="form-input font-mono"
                              style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                            />
                          </td>
                          <td style={{ padding: '8px' }}>
                            <select
                              value={tracker.protocol}
                              onChange={e => {
                                const newTrackers = [...gpsConfig.trackers];
                                newTrackers[idx].protocol = e.target.value as HardwareTracker['protocol'];
                                setGpsConfig({ ...gpsConfig, trackers: newTrackers });
                              }}
                              className="form-select"
                              style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                            >
                              <option value="HTTP_WEBHOOK">HTTP Webhook</option>
                              <option value="TRACCAR">Traccar API</option>
                              <option value="TELTONIKA">Teltonika Codec 8</option>
                              <option value="MQTT">MQTT Broker</option>
                            </select>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <select
                              value={tracker.assignedPlate}
                              onChange={e => {
                                const newTrackers = [...gpsConfig.trackers];
                                newTrackers[idx].assignedPlate = e.target.value;
                                setGpsConfig({ ...gpsConfig, trackers: newTrackers });
                              }}
                              className="form-select font-mono"
                              style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                            >
                              {demoVehicles.map(v => (
                                <option key={v.id} value={v.plateNumber}>{v.plateNumber} ({v.make} {v.model})</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: '8px' }}>
                            <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>{tracker.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Map Provider & Optional External Keys */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', color: 'var(--byt-gold)' }}>
                  🗺️ 3. Map Tile Engine & External Keys (Optional)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Google Maps JavaScript API Key</label>
                    <input
                      type="password"
                      className="form-input"
                      value={gpsConfig.googleMapsApiKey}
                      onChange={e => setGpsConfig({ ...gpsConfig, googleMapsApiKey: e.target.value })}
                      placeholder="AIzaSy..."
                      style={{ fontSize: '0.8rem' }}
                    />
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Optional: Only needed if you want Google Maps tiles instead of OpenStreetMap.
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Mapbox Public Access Token</label>
                    <input
                      type="password"
                      className="form-input"
                      value={gpsConfig.mapboxToken}
                      onChange={e => setGpsConfig({ ...gpsConfig, mapboxToken: e.target.value })}
                      placeholder="pk.eyJ1..."
                      style={{ fontSize: '0.8rem' }}
                    />
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Optional: Only needed if you want custom Mapbox vector studio styles.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setGpsConfig(defaultGpsConfig);
                  try { localStorage.removeItem('byt-gps-hardware-config'); } catch {}
                }}
                style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}
              >
                Reset to Factory Defaults
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSettingsModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveSettings}>
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
