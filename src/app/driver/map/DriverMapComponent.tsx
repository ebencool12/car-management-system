'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DriverMapComponentProps {
  currentPos: { lat: number; lng: number } | null;
  trail: [number, number][];
  heading: number | null;
  mapLayer?: 'googleHybrid' | 'googleRoads' | 'googleTraffic' | 'satellite' | 'streets';
}

const DRIVER_TILE_LAYERS = {
  googleHybrid: {
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Satellite &copy; Maxar',
    maxZoom: 22
  },
  googleRoads: {
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    maxZoom: 22
  },
  googleTraffic: {
    url: 'https://mt1.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Traffic',
    maxZoom: 22
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Maxar',
    maxZoom: 19
  },
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }
};

export default function DriverMapComponent({ currentPos, trail, heading, mapLayer = 'googleHybrid' }: DriverMapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  const trailLineRef = useRef<L.Polyline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [5.6037, -0.1870], // Default: Accra, Ghana
      zoom: 16,
      zoomControl: true,
    });

    const layerCfg = DRIVER_TILE_LAYERS[mapLayer] || DRIVER_TILE_LAYERS.googleHybrid;
    const tileLayer = L.tileLayer(layerCfg.url, {
      attribution: layerCfg.attribution,
      maxZoom: layerCfg.maxZoom,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Switch tile layer when mapLayer changes
  useEffect(() => {
    if (!mapRef.current) return;
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    const layerCfg = DRIVER_TILE_LAYERS[mapLayer] || DRIVER_TILE_LAYERS.googleHybrid;
    const newLayer = L.tileLayer(layerCfg.url, {
      attribution: layerCfg.attribution,
      maxZoom: layerCfg.maxZoom,
    }).addTo(mapRef.current);
    tileLayerRef.current = newLayer;
  }, [mapLayer]);

  // Update marker and trail when position changes
  useEffect(() => {
    if (!mapRef.current || !currentPos) return;

    const { lat, lng } = currentPos;

    // Update or create marker
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.circleMarker([lat, lng], {
        radius: 10,
        color: '#0891b2',
        fillColor: '#22d3ee',
        fillOpacity: 0.9,
        weight: 3,
      }).addTo(mapRef.current);

      // Add accuracy circle
      L.circleMarker([lat, lng], {
        radius: 25,
        color: '#0891b2',
        fillColor: '#0891b2',
        fillOpacity: 0.1,
        weight: 1,
        dashArray: '4 4',
      }).addTo(mapRef.current);

      markerRef.current.bindPopup(
        `<div style="font-family:Inter,system-ui,sans-serif; min-width: 220px; padding: 2px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
            <strong style="font-size: 13px; color: #0891b2;">📍 Your Live Position</strong>
            <span style="font-size: 10px; background: #ecfeff; color: #0891b2; padding: 2px 6px; border-radius: 10px; font-weight:700;">Active GPS</span>
          </div>
          <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-bottom: 8px;">
            ${lat.toFixed(5)}°N, ${Math.abs(lng).toFixed(5)}°W
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 4px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap: 4px; background: #0891b2; color: #fff; text-decoration: none; padding: 5px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">
              🗺️ Google Maps
            </a>
            <a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap: 4px; background: #f8fafc; color: #0f172a; text-decoration: none; padding: 5px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; border: 1px solid #cbd5e1;">
              🚶 Street View
            </a>
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center; justify-content:center; gap: 4px; background: #10b981; color: #fff; text-decoration: none; padding: 5px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-top: 4px;">
            🧭 Google Navigation
          </a>
        </div>`
      );
    }

    // Update trail polyline
    if (trail.length > 1) {
      if (trailLineRef.current) {
        trailLineRef.current.setLatLngs(trail);
      } else {
        trailLineRef.current = L.polyline(trail, {
          color: '#0891b2',
          weight: 4,
          opacity: 0.7,
          smoothFactor: 1,
          dashArray: '8 6',
        }).addTo(mapRef.current);
      }
    }

    // Center map on current position
    mapRef.current.setView([lat, lng], mapRef.current.getZoom(), { animate: true });

  }, [currentPos, trail, heading]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: 300 }}
    />
  );
}
