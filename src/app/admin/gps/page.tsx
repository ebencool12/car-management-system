'use client';

import { useState } from 'react';
import { demoLocations } from '@/lib/demo-data';

export default function GPSPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const selected = selectedVehicle ? demoLocations.find(l => l.vehicleId === selectedVehicle) : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Live GPS Tracking</h1>
          <p className="subtitle">{demoLocations.length} vehicles reporting location</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-green)', animation: 'pulse-red 2s ease-in-out infinite' }} />
          <span className="text-sm text-muted">Live</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-lg)', minHeight: 'calc(100vh - 200px)' }}>
        {/* Vehicle List */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
              <h4 style={{ fontSize: '0.85rem' }}>Vehicles</h4>
            </div>
            <div style={{ overflow: 'auto' }}>
              {demoLocations.map(loc => (
                <div
                  key={loc.vehicleId}
                  className={`chat-list-item ${selectedVehicle === loc.vehicleId ? 'active' : ''}`}
                  onClick={() => setSelectedVehicle(selectedVehicle === loc.vehicleId ? null : loc.vehicleId)}
                  style={{ padding: 'var(--space-sm) var(--space-md)' }}
                >
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: loc.severity === 'RED' ? 'var(--color-red)' : loc.severity === 'YELLOW' ? 'var(--color-yellow)' : 'var(--color-green)',
                    boxShadow: loc.severity === 'RED' ? '0 0 8px var(--color-red-glow)' : 'none',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-mono font-semibold text-sm">{loc.plateNumber}</div>
                    <div className="text-xs text-muted truncate">{loc.driverName}</div>
                  </div>
                  <div className="text-xs text-muted" style={{ flexShrink: 0 }}>
                    {new Date(loc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div style={{ flex: 1 }}>
          <div className="card" style={{ height: '100%', minHeight: 500, position: 'relative', overflow: 'hidden' }}>
            {/* Map placeholder - uses a styled div with markers since Leaflet needs dynamic import */}
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(145deg, #0a1a2e 0%, #0d2240 30%, #0a1628 100%)',
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
            }}>
              {/* Grid pattern overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(136, 153, 180, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(136, 153, 180, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }} />

              {/* Map label */}
              <div style={{
                position: 'absolute', top: 'var(--space-md)', left: 'var(--space-md)',
                padding: 'var(--space-xs) var(--space-md)',
                background: 'rgba(10, 22, 40, 0.8)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                backdropFilter: 'blur(8px)',
              }}>
                📍 Greater Accra Region
              </div>

              {/* Vehicle markers */}
              {demoLocations.map((loc, i) => {
                const x = 15 + ((loc.lng + 0.25) / 0.15) * 60;
                const y = 15 + ((5.66 - loc.lat) / 0.12) * 60;
                const isSelected = selectedVehicle === loc.vehicleId;

                return (
                  <div
                    key={loc.vehicleId}
                    onClick={() => setSelectedVehicle(loc.vehicleId)}
                    style={{
                      position: 'absolute',
                      left: `${Math.min(Math.max(x, 10), 85)}%`,
                      top: `${Math.min(Math.max(y, 10), 85)}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: isSelected ? 10 : i,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {/* Marker dot */}
                    <div style={{
                      width: isSelected ? 20 : 14,
                      height: isSelected ? 20 : 14,
                      borderRadius: '50%',
                      background: loc.severity === 'RED' ? 'var(--color-red)' : loc.severity === 'YELLOW' ? 'var(--color-yellow)' : 'var(--color-green)',
                      border: `2px solid ${isSelected ? 'white' : 'rgba(255,255,255,0.3)'}`,
                      boxShadow: isSelected
                        ? `0 0 20px ${loc.severity === 'RED' ? 'var(--color-red-glow)' : loc.severity === 'YELLOW' ? 'var(--color-yellow-glow)' : 'var(--color-green-glow)'}`
                        : `0 0 8px ${loc.severity === 'RED' ? 'var(--color-red-glow)' : 'rgba(0,0,0,0.3)'}`,
                      transition: 'all var(--transition-fast)',
                      animation: loc.severity === 'RED' ? 'pulse-red 2s ease-in-out infinite' : 'none',
                    }} />

                    {/* Label */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: 6,
                        background: 'var(--byt-navy-light)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-sm) var(--space-md)',
                        whiteSpace: 'nowrap',
                        boxShadow: 'var(--shadow-lg)',
                        animation: 'fadeInUp 0.2s ease-out',
                      }}>
                        <div className="font-mono font-bold text-sm">{loc.plateNumber}</div>
                        <div className="text-xs text-muted">{loc.driverName}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Vehicle Detail */}
      {selected && (
        <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="font-mono font-bold" style={{ fontSize: '1.1rem' }}>{selected.plateNumber}</div>
                <div className="text-sm text-muted">Driver: {selected.driverName} • Last update: {new Date(selected.timestamp).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <span className={`badge badge-${selected.severity === 'RED' ? 'red' : selected.severity === 'YELLOW' ? 'yellow' : 'green'}`}>
                  {selected.severity}
                </span>
                <div className="text-xs font-mono text-muted">
                  {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
