'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface GpsVehiclePoint {
  vehicleId: string;
  plateNumber: string;
  driverName: string | null;
  driverPhone?: string;
  severity: string;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  altitude?: number;
  battery?: number;
  ignition?: boolean;
  imei?: string;
  timestamp: string;
}

export type MapLayerType =
  | 'googleHybrid'
  | 'googleRoads'
  | 'googleTraffic'
  | 'googleTerrain'
  | 'satellite'
  | 'dark'
  | 'streets';

export interface GeofenceZone {
  id: string;
  name: string;
  center: [number, number];
  radiusMeters: number;
  type: 'SAFE_ZONE' | 'RESTRICTED_ZONE' | 'AIRPORT_VIP' | 'MAINTENANCE_HUB';
  speedLimitKmh?: number;
  color?: string;
  active: boolean;
}

export interface RealGpsMapProps {
  vehicles: GpsVehiclePoint[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  mapLayer: MapLayerType;
  onLayerChange?: (layer: MapLayerType) => void;
  followSelected: boolean;
  historyTrail?: [number, number][];
  trackedPhone?: string | null;
  trackedTarget?: {
    lat: number;
    lng: number;
    label: string;
    phone: string;
    driverName?: string;
    vehiclePlate?: string;
    carrier?: string;
    deviceModel?: string;
  } | null;
  geofences?: GeofenceZone[];
  showGeofences?: boolean;
}

export const TILE_LAYERS: Record<MapLayerType, { url: string; attribution: string; maxZoom: number }> = {
  // Google Satellite with roads & place labels (Hybrid)
  googleHybrid: {
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Satellite &copy; Maxar Technologies',
    maxZoom: 22
  },
  // Google Standard Roadmap
  googleRoads: {
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    maxZoom: 22
  },
  // Google Live Real-time Traffic flow
  googleTraffic: {
    url: 'https://mt1.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Traffic',
    maxZoom: 22
  },
  // Google Topographic Terrain
  googleTerrain: {
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Terrain',
    maxZoom: 20
  },
  // Tactical Dark Matter
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap contributors',
    maxZoom: 20
  },
  // Esri World Satellite
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Maxar, Earthstar Geographics',
    maxZoom: 19
  },
  // OpenStreetMap
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }
};

export default function RealGpsMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  mapLayer,
  onLayerChange,
  followSelected,
  historyTrail = [],
  trackedPhone,
  trackedTarget,
  geofences = [],
  showGeofences = true,
}: RealGpsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const trailPolylineRef = useRef<L.Polyline | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const targetMarkerRef = useRef<L.Marker | null>(null);
  const geofenceCirclesRef = useRef<Map<string, L.Circle>>(new Map());

  // Helper to check phone match
  const isPhoneMatch = (p1?: string | null, p2?: string | null) => {
    if (!p1 || !p2) return false;
    const c1 = p1.replace(/\D/g, '');
    const c2 = p2.replace(/\D/g, '');
    if (!c1 || !c2) return false;
    const s1 = c1.startsWith('233') ? c1.slice(3) : c1.startsWith('0') ? c1.slice(1) : c1;
    const s2 = c2.startsWith('233') ? c2.slice(3) : c2.startsWith('0') ? c2.slice(1) : c2;
    return s1 === s2 || c1.includes(c2) || c2.includes(c1);
  };

  // Handle Precise Phone Tracking Reticle & High-Zoom FlyTo
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let targetLat: number | null = null;
    let targetLng: number | null = null;
    let targetLabel = '';
    let targetPhoneStr = '';

    if (trackedTarget) {
      targetLat = trackedTarget.lat;
      targetLng = trackedTarget.lng;
      targetLabel = trackedTarget.label;
      targetPhoneStr = trackedTarget.phone;
    } else if (trackedPhone) {
      const match = vehicles.find(v => isPhoneMatch(v.driverPhone, trackedPhone));
      if (match) {
        targetLat = match.lat;
        targetLng = match.lng;
        targetLabel = match.driverName ? `${match.driverName} (${match.plateNumber})` : match.plateNumber;
        targetPhoneStr = match.driverPhone || trackedPhone;
      }
    }

    if (targetLat !== null && targetLng !== null) {
      // Fly to exact coordinates with high street-level zoom
      map.flyTo([targetLat, targetLng], 17, {
        animate: true,
        duration: 1.2
      });

      // Update or create radar accuracy circle (±25m accuracy radius)
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setLatLng([targetLat, targetLng]);
      } else {
        accuracyCircleRef.current = L.circle([targetLat, targetLng], {
          radius: 35,
          color: '#06b6d4',
          weight: 2,
          opacity: 0.8,
          fillColor: '#22d3ee',
          fillOpacity: 0.18,
          dashArray: '6, 6'
        }).addTo(map);
      }

      // Add target lock reticle overlay
      const targetIcon = L.divIcon({
        className: 'gps-target-reticle',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: none;">
            <div style="
              background: linear-gradient(135deg, #0891b2, #0284c7);
              color: #ffffff;
              padding: 4px 10px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.5px;
              display: flex;
              align-items: center;
              gap: 6px;
              box-shadow: 0 4px 15px rgba(8, 145, 178, 0.7);
              border: 1px solid #22d3ee;
              white-space: nowrap;
              animation: bounce-subtle 1.5s infinite alternate;
            ">
              <span style="font-size: 13px;">🎯</span>
              <span>LIVE GPS LOCK: ${targetLabel || targetPhoneStr}</span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid #0891b2;
            "></div>
          </div>
        `,
        iconSize: [260, 45],
        iconAnchor: [130, 45]
      });

      if (targetMarkerRef.current) {
        targetMarkerRef.current.setLatLng([targetLat, targetLng]);
        targetMarkerRef.current.setIcon(targetIcon);
      } else {
        targetMarkerRef.current = L.marker([targetLat, targetLng], { icon: targetIcon, zIndexOffset: 1000 }).addTo(map);
      }
    } else {
      if (accuracyCircleRef.current) {
        map.removeLayer(accuracyCircleRef.current);
        accuracyCircleRef.current = null;
      }
      if (targetMarkerRef.current) {
        map.removeLayer(targetMarkerRef.current);
        targetMarkerRef.current = null;
      }
    }
  }, [trackedPhone, trackedTarget, vehicles]);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Accra, Ghana by default
    const initialCenter: [number, number] = [5.6037, -0.1870];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: false, // We'll add custom positioned controls
      attributionControl: false
    });

    // Add minimal attribution in corner
    L.control.attribution({ position: 'bottomright' }).addTo(map);

    // Add zoom controls at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial tile layer (Dark Matter by default)
    const initialLayer = TILE_LAYERS.dark;
    const tileLayer = L.tileLayer(initialLayer.url, {
      attribution: initialLayer.attribution,
      maxZoom: initialLayer.maxZoom
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once

  // Update Tile Layer when mapLayer prop changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const layerConfig = TILE_LAYERS[mapLayer] || TILE_LAYERS.dark;
    const newTileLayer = L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution,
      maxZoom: layerConfig.maxZoom
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [mapLayer]);

  // Update Geofence Zones Circles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing geofence layers
    geofenceCirclesRef.current.forEach(circle => {
      map.removeLayer(circle);
    });
    geofenceCirclesRef.current.clear();

    if (!showGeofences || !geofences || geofences.length === 0) return;

    geofences.forEach(zone => {
      if (!zone.active) return;

      const colorMap: Record<string, { stroke: string; fill: string }> = {
        SAFE_ZONE: { stroke: '#10b981', fill: '#10b981' },
        RESTRICTED_ZONE: { stroke: '#ef4444', fill: '#ef4444' },
        AIRPORT_VIP: { stroke: '#0891b2', fill: '#0891b2' },
        MAINTENANCE_HUB: { stroke: '#d4a843', fill: '#d4a843' },
      };

      const style = colorMap[zone.type] || { stroke: '#d4a843', fill: '#d4a843' };
      const strokeColor = zone.color || style.stroke;
      const fillColor = zone.color || style.fill;

      const circle = L.circle(zone.center, {
        radius: zone.radiusMeters,
        color: strokeColor,
        weight: 2,
        dashArray: zone.type === 'RESTRICTED_ZONE' ? '6, 8' : undefined,
        fillColor: fillColor,
        fillOpacity: 0.14,
      }).addTo(map);

      circle.bindTooltip(
        `<div style="font-family: inherit; font-size: 11px; padding: 2px 4px; line-height: 1.3;">
          <strong style="color: ${strokeColor}; font-size: 12px;">🛡️ ${zone.name}</strong><br/>
          <span>Type: <b>${zone.type.replace('_', ' ')}</b></span><br/>
          <span>Radius: <b>${(zone.radiusMeters / 1000).toFixed(1)} km</b> • Max Speed: <b>${zone.speedLimitKmh ? `${zone.speedLimitKmh} km/h` : 'No limit'}</b></span>
        </div>`,
        { permanent: false, direction: 'top', sticky: true }
      );

      geofenceCirclesRef.current.set(zone.id, circle);
    });
  }, [geofences, showGeofences]);

  // Update Vehicle Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentMarkerIds = new Set<string>();

    vehicles.forEach(vehicle => {
      currentMarkerIds.add(vehicle.vehicleId);
      const isSelected = selectedVehicleId === vehicle.vehicleId;
      const heading = vehicle.heading || 0;
      const speed = vehicle.speed !== undefined ? Math.round(vehicle.speed) : 0;

      // Color scheme based on severity status
      const color = vehicle.severity === 'RED'
        ? '#ef4444'
        : vehicle.severity === 'YELLOW'
        ? '#f59e0b'
        : '#10b981';

      // Create Custom SVG DivIcon with heading arrow and speed
      const iconHtml = `
        <div class="real-gps-marker ${isSelected ? 'selected' : ''}" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.7));
          transform: translate(-50%, -50%);
        ">
          <!-- Directional Pulse & Vehicle Symbol -->
          <div style="
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0d1a29 0%, #060e18 100%);
            border: 2px solid ${color};
            box-shadow: 0 0 ${isSelected ? '18px' : '8px'} ${color};
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          ">
            <!-- Rotating Bearing Arrow -->
            <div style="
              position: absolute;
              inset: 0;
              display: flex;
              align-items: flex-start;
              justify-content: center;
              transform: rotate(${heading}deg);
              pointer-events: none;
            ">
              <div style="
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 7px solid ${color};
                margin-top: 2px;
              "></div>
            </div>

            <!-- Vehicle Icon -->
            <span style="font-size: 16px; position: relative; z-index: 2;">🚗</span>
          </div>

          <!-- Plate & Speed Pill -->
          <div style="
            margin-top: 3px;
            padding: 2px 7px;
            border-radius: 12px;
            background: rgba(10, 22, 40, 0.9);
            border: 1px solid ${isSelected ? 'var(--byt-gold)' : 'rgba(255,255,255,0.15)'};
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            font-family: monospace;
            white-space: nowrap;
            letter-spacing: 0.3px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>${vehicle.plateNumber}</span>
            <span style="color: ${color}; font-size: 9px;">${speed}km/h</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'gps-vehicle-marker-wrapper',
        iconSize: [40, 52],
        iconAnchor: [20, 26]
      });

      // Helper to generate Google Maps vehicle popup HTML
      const getVehiclePopupContent = (v: GpsVehiclePoint) => `
        <div style="font-family:Inter,system-ui,sans-serif; min-width: 230px; padding: 2px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
            <strong style="font-size: 13px; color: #0f172a; font-family: monospace;">🚗 ${v.plateNumber}</strong>
            <span style="font-size: 10px; font-weight: 700; color: ${color};">${speed} km/h</span>
          </div>
          <div style="font-size: 11px; color: #334155; margin-bottom: 3px;">
            Driver: <strong style="color: #0f172a;">${v.driverName || 'Unassigned'}</strong>
          </div>
          ${v.driverPhone ? `<div style="font-size: 10px; color: #0891b2; font-weight: 600; margin-bottom: 6px;">📞 ${v.driverPhone}</div>` : ''}
          <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-bottom: 8px;">
            ${v.lat.toFixed(5)}°N, ${Math.abs(v.lng).toFixed(5)}°W
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 4px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap: 4px; background: #0891b2; color: #fff; text-decoration: none; padding: 5px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">
              🗺️ Google Maps
            </a>
            <a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${v.lat},${v.lng}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap: 4px; background: #f8fafc; color: #0f172a; text-decoration: none; padding: 5px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; border: 1px solid #cbd5e1;">
              🚶 Street View
            </a>
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${v.lat},${v.lng}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap: 4px; background: #10b981; color: #fff; text-decoration: none; padding: 5px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-top: 4px;">
            🧭 Google Navigation Directions
          </a>
        </div>
      `;

      const existingMarker = markersRef.current.get(vehicle.vehicleId);

      if (existingMarker) {
        // Smoothly update existing marker position and icon
        existingMarker.setLatLng([vehicle.lat, vehicle.lng]);
        existingMarker.setIcon(customIcon);
        existingMarker.bindPopup(getVehiclePopupContent(vehicle));
      } else {
        // Create new marker
        const newMarker = L.marker([vehicle.lat, vehicle.lng], { icon: customIcon }).addTo(map);

        newMarker.bindPopup(getVehiclePopupContent(vehicle));

        newMarker.on('click', () => {
          onSelectVehicle(vehicle.vehicleId);
        });

        markersRef.current.set(vehicle.vehicleId, newMarker);
      }
    });

    // Remove deleted markers
    markersRef.current.forEach((marker, id) => {
      if (!currentMarkerIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [vehicles, selectedVehicleId, onSelectVehicle]);

  // Handle Pan to selected vehicle or follow mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedVehicleId) return;

    const selectedVehicle = vehicles.find(v => v.vehicleId === selectedVehicleId);
    if (!selectedVehicle) return;

    if (followSelected) {
      map.panTo([selectedVehicle.lat, selectedVehicle.lng], {
        animate: true,
        duration: 0.8
      });
    }
  }, [selectedVehicleId, vehicles, followSelected]);

  // Update Trail Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (historyTrail.length > 1) {
      if (trailPolylineRef.current) {
        trailPolylineRef.current.setLatLngs(historyTrail);
      } else {
        trailPolylineRef.current = L.polyline(historyTrail, {
          color: '#d4a843',
          weight: 3,
          opacity: 0.8,
          dashArray: '8, 8',
          smoothFactor: 1
        }).addTo(map);
      }
    } else if (trailPolylineRef.current) {
      map.removeLayer(trailPolylineRef.current);
      trailPolylineRef.current = null;
    }
  }, [historyTrail]);

  // Active target coordinates for quick Google actions
  const activeFocus = trackedTarget
    ? { lat: trackedTarget.lat, lng: trackedTarget.lng }
    : vehicles.find(v => v.vehicleId === selectedVehicleId)
      ? { lat: vehicles.find(v => v.vehicleId === selectedVehicleId)!.lat, lng: vehicles.find(v => v.vehicleId === selectedVehicleId)!.lng }
      : vehicles.length > 0 ? { lat: vehicles[0].lat, lng: vehicles[0].lng } : { lat: 5.6037, lng: -0.1870 };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Map Canvas */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '520px',
          background: '#0a1628'
        }}
      />

      {/* Real Google Maps Floating Switcher & Actions Bar */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 60,
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(10px)',
        padding: '5px 8px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        flexWrap: 'wrap'
      }}>
        {/* Layer Switcher Buttons */}
        <div style={{ display: 'flex', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
          <button
            type="button"
            onClick={() => onLayerChange?.('googleHybrid')}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 700,
              background: mapLayer === 'googleHybrid' || mapLayer === 'satellite' ? '#0891b2' : 'transparent',
              color: mapLayer === 'googleHybrid' || mapLayer === 'satellite' ? '#fff' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Google Satellite Hybrid (Photographic Satellite with street names & borders)"
          >
            🛰️ Satellite
          </button>
          <button
            type="button"
            onClick={() => onLayerChange?.('googleRoads')}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 700,
              background: mapLayer === 'googleRoads' ? '#0891b2' : 'transparent',
              color: mapLayer === 'googleRoads' ? '#fff' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Google Maps Standard Roadmap"
          >
            🗺️ Google Map
          </button>
          <button
            type="button"
            onClick={() => onLayerChange?.('googleTraffic')}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 700,
              background: mapLayer === 'googleTraffic' ? '#10b981' : 'transparent',
              color: mapLayer === 'googleTraffic' ? '#fff' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Google Live Traffic Congestion Flow"
          >
            🚦 Traffic
          </button>
          <button
            type="button"
            onClick={() => onLayerChange?.('googleTerrain')}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 700,
              background: mapLayer === 'googleTerrain' ? '#0891b2' : 'transparent',
              color: mapLayer === 'googleTerrain' ? '#fff' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Google Terrain & Elevation"
          >
            ⛰️ Terrain
          </button>
          <button
            type="button"
            onClick={() => onLayerChange?.('dark')}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 700,
              background: mapLayer === 'dark' ? '#0891b2' : 'transparent',
              color: mapLayer === 'dark' ? '#fff' : '#cbd5e1',
              border: 'none',
              cursor: 'pointer'
            }}
            title="CartoDB Tactical Dark Matter"
          >
            🌙 Dark
          </button>
        </div>

        {/* Separator */}
        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.2)' }} />

        {/* Real Google Maps Actions */}
        <a
          href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${activeFocus.lat},${activeFocus.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            color: '#facc15',
            borderRadius: '5px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Open Google Street View 360° at focused target"
        >
          <span>🚶</span>
          <span>Street View</span>
        </a>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${activeFocus.lat},${activeFocus.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'rgba(8, 145, 178, 0.2)',
            border: '1px solid rgba(8, 145, 178, 0.5)',
            color: '#38bdf8',
            borderRadius: '5px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Open focused target in official Google Maps app/website"
        >
          <span>↗️ Google Maps</span>
        </a>
      </div>

      <style jsx global>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.9; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes bounce-subtle {
          0% { transform: translate(-50%, -100%); }
          100% { transform: translate(-50%, -108%); }
        }
        .leaflet-container {
          width: 100%;
          height: 100%;
          background: #090e17 !important;
          font-family: inherit;
        }
        .leaflet-bar {
          border: 1px solid rgba(212, 168, 67, 0.4) !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-bar a {
          background: rgba(10, 22, 40, 0.95) !important;
          color: #d4a843 !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        .leaflet-bar a:hover {
          background: rgba(212, 168, 67, 0.2) !important;
          color: #fff !important;
        }
        .gps-vehicle-marker-wrapper {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
