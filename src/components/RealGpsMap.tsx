'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface GpsVehiclePoint {
  vehicleId: string;
  plateNumber: string;
  driverName: string | null;
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

interface RealGpsMapProps {
  vehicles: GpsVehiclePoint[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  mapLayer: 'dark' | 'satellite' | 'streets';
  followSelected: boolean;
  historyTrail?: [number, number][];
}

const TILE_LAYERS = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 20
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19
  },
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }
};

export default function RealGpsMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  mapLayer,
  followSelected,
  historyTrail = []
}: RealGpsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const trailPolylineRef = useRef<L.Polyline | null>(null);

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

      const existingMarker = markersRef.current.get(vehicle.vehicleId);

      if (existingMarker) {
        // Smoothly update existing marker position and icon
        existingMarker.setLatLng([vehicle.lat, vehicle.lng]);
        existingMarker.setIcon(customIcon);
      } else {
        // Create new marker
        const newMarker = L.marker([vehicle.lat, vehicle.lng], { icon: customIcon }).addTo(map);

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

  // Update Breadcrumb Polyline Trail for selected vehicle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (trailPolylineRef.current) {
      map.removeLayer(trailPolylineRef.current);
      trailPolylineRef.current = null;
    }

    if (selectedVehicleId && historyTrail.length > 1) {
      const polyline = L.polyline(historyTrail, {
        color: '#d4a843',
        weight: 4,
        opacity: 0.8,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      trailPolylineRef.current = polyline;
    }
  }, [selectedVehicleId, historyTrail]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 520, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: 520, background: '#090e17' }} />

      <style jsx global>{`
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
