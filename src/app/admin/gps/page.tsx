'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { demoLocations, demoVehicles, demoDrivers, Driver, getStoredDrivers } from '@/lib/demo-data';
import type { GpsVehiclePoint, MapLayerType, GeofenceZone } from '@/components/RealGpsMap';
import {
  getDriverPhoneTelemetry,
  DriverPhoneTelemetry,
  getGoogleMapsUrl,
  getGoogleStreetViewUrl,
  getGoogleDirectionsUrl,
  getWhatsAppUrl
} from '@/lib/driver-telemetry';

export interface SecurityAlarm {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  type: 'SPEEDING' | 'GEOFENCE_BREACH' | 'RESTRICTED_ENTRY' | 'IMMOBILIZED';
  message: string;
  severity: 'HIGH' | 'CRITICAL' | 'WARNING';
  timestamp: string;
  speed?: number;
  limit?: number;
  lat: number;
  lng: number;
}

const INITIAL_GEOFENCES: GeofenceZone[] = [
  {
    id: 'geo-accra-core',
    name: 'Greater Accra Core Operational Boundary',
    center: [5.6037, -0.1870],
    radiusMeters: 17500,
    type: 'SAFE_ZONE',
    speedLimitKmh: 80,
    active: true,
  },
  {
    id: 'geo-airport-vip',
    name: 'Kotoka Airport VIP Terminal Corridor',
    center: [5.6052, -0.1668],
    radiusMeters: 2800,
    type: 'AIRPORT_VIP',
    speedLimitKmh: 45,
    active: true,
  },
  {
    id: 'geo-achimota-hub',
    name: 'BYT Fleet Central Maintenance & Depot',
    center: [5.6150, -0.2250],
    radiusMeters: 1600,
    type: 'MAINTENANCE_HUB',
    speedLimitKmh: 30,
    active: true,
  },
  {
    id: 'geo-eastern-restricted',
    name: 'Eastern Out-of-Bounds Security Perimeter',
    center: [5.6700, -0.0400],
    radiusMeters: 6000,
    type: 'RESTRICTED_ZONE',
    speedLimitKmh: 50,
    active: true,
  },
];

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
  apiKey: 'byt_live_enterprise_telemetry_prod_891048',
  mapProvider: 'cartodb_dark',
  mapboxToken: '',
  googleMapsApiKey: '',
  pollingIntervalSeconds: 5,
  trackers: [
    { id: 'trk-1', model: 'Teltonika FMB920', imei: '865321045892110', protocol: 'HTTP_WEBHOOK', assignedPlate: 'GR-1234-22', status: 'ONLINE', simNumber: '+233 24 419 8234' },
    { id: 'trk-2', model: 'Coban GPS-303G', imei: '865321045892111', protocol: 'TRACCAR', assignedPlate: 'GR-5678-21', status: 'ONLINE', simNumber: '+233 55 892 1045' },
    { id: 'trk-3', model: 'Sinotrack ST-901', imei: '865321045892112', protocol: 'HTTP_WEBHOOK', assignedPlate: 'GW-9012-23', status: 'ONLINE', simNumber: '+233 27 314 9820' },
    { id: 'trk-4', model: 'Teltonika FMC130', imei: '865321045892113', protocol: 'TELTONIKA', assignedPlate: 'GR-3456-20', status: 'ONLINE', simNumber: '+233 20 562 3918' },
    { id: 'trk-5', model: 'Concox AT4 Asset', imei: '865321045892114', protocol: 'HTTP_WEBHOOK', assignedPlate: 'GN-7890-22', status: 'ONLINE', simNumber: '+233 54 712 4491' }
  ]
};

const DRIVER_PRECISE_LOCATIONS: Record<string, {
  lat: number;
  lng: number;
  address: string;
  carrier: string;
  plate: string;
}> = {
  '024-419-8234': { lat: 5.6145, lng: -0.1870, address: 'Airport Bypass Rd, near Accra Mall & Tetteh Quarshie Interchange', carrier: 'MTN Ghana 4G LTE', plate: 'GR-1234-22' },
  '055-892-1045': { lat: 5.5560, lng: -0.1820, address: 'Oxford Street, Osu Commercial District, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-5678-21' },
  '027-314-9820': { lat: 5.6350, lng: -0.1550, address: 'Lagos Avenue, East Legon, Accra', carrier: 'AirtelTigo 4G LTE', plate: 'GW-9012-23' },
  '020-562-3918': { lat: 5.5600, lng: -0.2150, address: 'Kwame Nkrumah Interchange, Circle Overpass, Accra', carrier: 'Telecel Ghana 4G', plate: 'GR-3456-20' },
  '054-712-4491': { lat: 5.6200, lng: -0.1650, address: 'Spintex Road, near Flower Pot Flyover', carrier: 'MTN Ghana 4G LTE', plate: 'GN-7890-22' },
  '026-883-2051': { lat: 5.5560, lng: -0.1980, address: 'Labadi Beach Road, South La Estates', carrier: 'AirtelTigo 4G LTE', plate: 'GT-2345-21' },
  '050-619-3382': { lat: 5.6480, lng: -0.1820, address: 'Madina Zongo Junction, near UPSA, Accra', carrier: 'Telecel Ghana 4G', plate: 'GR-6789-23' },
  '023-441-9028': { lat: 5.6050, lng: -0.2210, address: 'Achimota Mile 7, near New Achimota Station', carrier: 'Telecel Ghana 4G', plate: 'GW-0123-22' },
  '057-920-1147': { lat: 5.5780, lng: -0.1760, address: 'Cantonments Road, near US Embassy, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-4321-24' },
  '025-338-7190': { lat: 5.6420, lng: -0.0980, address: 'Tema Motorway Tollbooth area, Greater Accra', carrier: 'Telecel Ghana 4G', plate: 'GT-8765-23' },
  '053-840-2261': { lat: 5.5680, lng: -0.2450, address: 'Kaneshie First Light, Winneba Road, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GW-3210-21' },
  '059-472-8819': { lat: 5.6010, lng: -0.1920, address: 'Roman Ridge, near Airport West, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-7654-22' },
  // Legacy aliases
  '024-123-4567': { lat: 5.6145, lng: -0.1870, address: 'Airport Bypass Rd, near Accra Mall & Tetteh Quarshie Interchange', carrier: 'MTN Ghana 4G LTE', plate: 'GR-1234-22' },
  '055-123-4567': { lat: 5.5560, lng: -0.1820, address: 'Oxford Street, Osu Commercial District, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-5678-21' },
  '027-123-4567': { lat: 5.6350, lng: -0.1550, address: 'Lagos Avenue, East Legon, Accra', carrier: 'AirtelTigo 4G LTE', plate: 'GW-9012-23' },
  '020-123-4567': { lat: 5.5600, lng: -0.2150, address: 'Kwame Nkrumah Interchange, Circle Overpass', carrier: 'Telecel Ghana 4G', plate: 'GR-3456-20' },
  '054-123-4567': { lat: 5.6200, lng: -0.1650, address: 'Spintex Road, near Flower Pot Flyover', carrier: 'MTN Ghana 4G LTE', plate: 'GN-7890-22' },
  '026-123-4567': { lat: 5.5560, lng: -0.1980, address: 'Labadi Beach Road, South La Estates', carrier: 'AirtelTigo 4G LTE', plate: 'GT-2345-21' },
  '050-123-4567': { lat: 5.6480, lng: -0.1820, address: 'Madina Zongo Junction, near UPSA, Accra', carrier: 'Telecel Ghana 4G', plate: 'GR-6789-23' },
  '023-123-4567': { lat: 5.6050, lng: -0.2210, address: 'Achimota Mile 7, near New Achimota Station', carrier: 'Telecel Ghana 4G', plate: 'GW-0123-22' },
  '057-123-4567': { lat: 5.5780, lng: -0.1760, address: 'Cantonments Road, near US Embassy, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-4321-24' },
  '021-123-4567': { lat: 5.6420, lng: -0.0980, address: 'Tema Motorway Tollbooth area, Greater Accra', carrier: 'Telecel Ghana 4G', plate: 'GT-8765-23' },
  '058-123-4567': { lat: 5.5680, lng: -0.2450, address: 'Kaneshie First Light, Winneba Road', carrier: 'MTN Ghana 4G LTE', plate: 'GW-3210-21' },
  '059-123-4567': { lat: 5.6010, lng: -0.1920, address: 'Roman Ridge, near Airport West, Accra', carrier: 'MTN Ghana 4G LTE', plate: 'GR-7654-22' },
};

export default function GPSPage() {
  // Dynamic Fleet Drivers State (Hydrated from localStorage + demoDrivers)
  const [drivers, setDrivers] = useState<Driver[]>(demoDrivers);

  // Selected vehicle & Live Telemetry State
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('v1');
  const [vehicles, setVehicles] = useState<GpsVehiclePoint[]>(() =>
    demoLocations.map((loc, idx) => {
      const d = demoDrivers.find(drv => drv.name === loc.driverName);
      return {
        ...loc,
        driverPhone: d?.phone || ['024-419-8234', '055-892-1045', '027-314-9820', '020-562-3918', '054-712-4491', '026-883-2051', '050-619-3382', '023-441-9028'][idx] || '024-419-8234',
        speed: [48, 55, 32, 0, 62, 45, 18, 50][idx] || 35,
        heading: [45, 180, 270, 90, 135, 210, 30, 315][idx] || 0,
        altitude: 52 + idx * 4,
        battery: [96, 92, 88, 14, 98, 91, 74, 95][idx] || 90,
        ignition: loc.severity !== 'RED',
        imei: `86532104589211${idx}`,
        timestamp: new Date().toISOString()
      };
    })
  );

  // Geofencing & Anti-Theft Speed Alarms State
  const [geofences, setGeofences] = useState<GeofenceZone[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('byt-fleet-geofences');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_GEOFENCES;
  });
  const [showGeofences, setShowGeofences] = useState(true);
  const [immobilizedVehicles, setImmobilizedVehicles] = useState<Set<string>>(new Set());
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [showAlarmsDrawer, setShowAlarmsDrawer] = useState(false);
  const [alarmNotification, setAlarmNotification] = useState<string | null>(null);
  const [alarmFilter, setAlarmFilter] = useState<'ALL' | 'SPEEDING' | 'GEOFENCE' | 'IMMOBILIZED'>('ALL');
  const [dismissedAlarms, setDismissedAlarms] = useState<Set<string>>(new Set());

  // Save geofences to localStorage on update
  const updateGeofences = (updated: GeofenceZone[]) => {
    setGeofences(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('byt-fleet-geofences', JSON.stringify(updated));
    }
  };

  const handleToggleGeofence = (id: string) => {
    const updated = geofences.map(g => g.id === id ? { ...g, active: !g.active } : g);
    updateGeofences(updated);
  };

  // Derive Real-Time Security Alarms
  const activeAlarms = useMemo(() => {
    const alarms: SecurityAlarm[] = [];

    vehicles.forEach(v => {
      const vSpeed = v.speed || 0;

      // 1. High Speed Alarms (> 75 km/h)
      if (vSpeed > 75) {
        alarms.push({
          id: `speed-${v.vehicleId}`,
          vehicleId: v.vehicleId,
          plateNumber: v.plateNumber,
          driverName: v.driverName || 'Fleet Operator',
          driverPhone: v.driverPhone || '024-419-8234',
          type: 'SPEEDING',
          message: `Overspeeding Warning: ${Math.round(vSpeed)} km/h in urban sector (Limit: 75 km/h)`,
          severity: vSpeed > 85 ? 'CRITICAL' : 'HIGH',
          timestamp: 'Live Active Sensor',
          speed: vSpeed,
          limit: 75,
          lat: v.lat,
          lng: v.lng,
        });
      }

      // 2. Geofence Perimeter & Restricted Zone Breaches
      geofences.forEach(zone => {
        if (!zone.active) return;
        const dist = calculateDistanceMeters(v.lat, v.lng, zone.center[0], zone.center[1]);

        if (zone.type === 'RESTRICTED_ZONE' && dist <= zone.radiusMeters) {
          alarms.push({
            id: `restricted-${v.vehicleId}-${zone.id}`,
            vehicleId: v.vehicleId,
            plateNumber: v.plateNumber,
            driverName: v.driverName || 'Fleet Operator',
            driverPhone: v.driverPhone || '024-419-8234',
            type: 'RESTRICTED_ENTRY',
            message: `Breached restricted perimeter "${zone.name}"`,
            severity: 'CRITICAL',
            timestamp: 'Intrusion Alert',
            lat: v.lat,
            lng: v.lng,
          });
        }

        if (zone.type === 'SAFE_ZONE' && dist > zone.radiusMeters) {
          alarms.push({
            id: `perimeter-${v.vehicleId}-${zone.id}`,
            vehicleId: v.vehicleId,
            plateNumber: v.plateNumber,
            driverName: v.driverName || 'Fleet Operator',
            driverPhone: v.driverPhone || '024-419-8234',
            type: 'GEOFENCE_BREACH',
            message: `Exited authorized operational boundary "${zone.name}" (${(dist / 1000).toFixed(1)} km out)`,
            severity: 'HIGH',
            timestamp: 'Out of Bounds',
            lat: v.lat,
            lng: v.lng,
          });
        }
      });

      // 3. Immobilized Vehicles indicator
      if (immobilizedVehicles.has(v.vehicleId)) {
        alarms.push({
          id: `immob-${v.vehicleId}`,
          vehicleId: v.vehicleId,
          plateNumber: v.plateNumber,
          driverName: v.driverName || 'Fleet Operator',
          driverPhone: v.driverPhone || '024-419-8234',
          type: 'IMMOBILIZED',
          message: `Engine Fuel Relay Cut-Off Active (Vehicle Immobilized by Dispatch)`,
          severity: 'WARNING',
          timestamp: 'Secured',
          lat: v.lat,
          lng: v.lng,
        });
      }
    });

    return alarms;
  }, [vehicles, geofences, immobilizedVehicles]);

  const visibleAlarms = useMemo(() => {
    return activeAlarms.filter(a => {
      if (dismissedAlarms.has(a.id)) return false;
      if (alarmFilter === 'SPEEDING') return a.type === 'SPEEDING';
      if (alarmFilter === 'GEOFENCE') return a.type === 'GEOFENCE_BREACH' || a.type === 'RESTRICTED_ENTRY';
      if (alarmFilter === 'IMMOBILIZED') return a.type === 'IMMOBILIZED';
      return true;
    });
  }, [activeAlarms, dismissedAlarms, alarmFilter]);

  const speedingCount = activeAlarms.filter(a => a.type === 'SPEEDING' && !dismissedAlarms.has(a.id)).length;
  const geofenceCount = activeAlarms.filter(a => (a.type === 'GEOFENCE_BREACH' || a.type === 'RESTRICTED_ENTRY') && !dismissedAlarms.has(a.id)).length;
  const immobilizedCount = immobilizedVehicles.size;

  const handleDismissAlarm = (id: string) => {
    setDismissedAlarms(prev => new Set(prev).add(id));
  };

  // Remote Engine Cut-Off / Immobilizer Control
  const handleToggleImmobilize = (vehicleId: string, plate: string) => {
    const willImmobilize = !immobilizedVehicles.has(vehicleId);
    setImmobilizedVehicles(prev => {
      const next = new Set(prev);
      if (willImmobilize) {
        next.add(vehicleId);
      } else {
        next.delete(vehicleId);
      }
      return next;
    });

    setVehicles(prev => prev.map(v => {
      if (v.vehicleId === vehicleId) {
        return {
          ...v,
          ignition: !willImmobilize,
          speed: willImmobilize ? 0 : 35,
          severity: willImmobilize ? 'RED' : 'GREEN',
        };
      }
      return v;
    }));

    setAlarmNotification(
      willImmobilize
        ? `🚨 Remote Engine Cut-Off command dispatched via GNSS relay to ${plate}. Engine immobilized.`
        : `✅ Remote Engine Restored for ${plate}. Fuel relay reactivated.`
    );
    setTimeout(() => setAlarmNotification(null), 5000);
  };

  // Hydrate persistent drivers from localStorage and listen to cross-tab updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDrivers(getStoredDrivers());

      const handleUpdate = () => {
        setDrivers(getStoredDrivers());
      };

      window.addEventListener('storage', handleUpdate);
      window.addEventListener('byt-drivers-updated', handleUpdate);
      return () => {
        window.removeEventListener('storage', handleUpdate);
        window.removeEventListener('byt-drivers-updated', handleUpdate);
      };
    }
  }, []);

  // Synchronize newly added or assigned fleet drivers onto the live map
  useEffect(() => {
    if (!drivers || drivers.length === 0) return;

    setVehicles(prev => {
      const existingPlates = new Set(prev.map(v => v.plateNumber.toUpperCase()));
      const additions: GpsVehiclePoint[] = [];

      drivers.forEach((drv, i) => {
        const plate = drv.vehicle?.plateNumber ||
          demoVehicles.find(dv => dv.assignedDriverName === drv.name || dv.assignedDriver === drv.id)?.plateNumber ||
          null;

        if (plate && !existingPlates.has(plate.toUpperCase())) {
          existingPlates.add(plate.toUpperCase());
          // Coordinate spread across Accra
          const lat = 5.5600 + ((i * 0.015) % 0.08);
          const lng = -0.1900 + ((i * 0.018) % 0.10);
          additions.push({
            vehicleId: `veh-${drv.id}`,
            plateNumber: plate,
            driverName: drv.name,
            driverPhone: drv.phone,
            lat: Number(lat.toFixed(5)),
            lng: Number(lng.toFixed(5)),
            speed: 38,
            heading: (i * 45) % 360,
            altitude: 48 + i * 2,
            battery: 88,
            ignition: true,
            severity: 'GREEN',
            imei: `86532104599${i % 100}`,
            timestamp: new Date().toISOString()
          });
        } else {
          // Update driverPhone on existing entry
          const match = prev.find(v =>
            (v.driverName && v.driverName.toLowerCase() === drv.name.toLowerCase()) ||
            (plate && v.plateNumber.toUpperCase() === plate.toUpperCase())
          );
          if (match && drv.phone) {
            match.driverPhone = drv.phone;
          }
        }
      });

      return additions.length > 0 ? [...prev, ...additions] : prev;
    });
  }, [drivers]);

  // Direct Driver Phone Tracking State
  const [phoneSearchInput, setPhoneSearchInput] = useState('');
  const [selectedDriverQuickPhone, setSelectedDriverQuickPhone] = useState('');
  const [trackedPhone, setTrackedPhone] = useState<string | null>(null);
  const [trackedTarget, setTrackedTarget] = useState<(DriverPhoneTelemetry & {
    label: string;
    heading: number;
    lastPing: string;
  }) | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [pingStatusText, setPingStatusText] = useState<string | null>(null);

  // Phone & Device Telemetry Inspector Modal
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [inspectingPhoneData, setInspectingPhoneData] = useState<DriverPhoneTelemetry | null>(null);

  const openPhoneDetails = (phone: string, name?: string, plate?: string) => {
    let rName = name;
    let rPlate = plate;
    if (!rName || !rPlate) {
      const qClean = phone.replace(/\D/g, '').replace(/^233/, '').replace(/^0/, '');
      const d = drivers.find(drv => drv.phone.replace(/\D/g, '').replace(/^233/, '').replace(/^0/, '') === qClean);
      if (d) {
        if (!rName) rName = d.name;
        if (!rPlate && d.vehicle) rPlate = d.vehicle.plateNumber;
      }
    }
    const data = getDriverPhoneTelemetry(phone, rName, rPlate);
    setInspectingPhoneData(data);
    setShowPhoneModal(true);
  };

  const triggerTrackPhone = async (phoneRaw: string) => {
    if (!phoneRaw.trim()) return;
    const phone = phoneRaw.trim();
    setIsPinging(true);
    setPingStatusText(`📡 Connecting to Cellular Tower & Pinging GPS for ${phone}...`);

    setTimeout(() => {
      setPingStatusText(`🛰️ Locking onto GNSS Satellite Ephemeris for ${phone}...`);
    }, 350);

    try {
      // Clean phone query digits
      const cleanDigits = phone.replace(/\D/g, '');
      const queryCore = cleanDigits.replace(/^233/, '').replace(/^0/, '');

      // 1. Find matched driver in dynamic drivers list (localStorage + demoDrivers)
      const matchedDriver = drivers.find(d => {
        const dClean = d.phone.replace(/\D/g, '');
        const dCore = dClean.replace(/^233/, '').replace(/^0/, '');
        if (queryCore && dCore === queryCore) return true;
        if (queryCore.length >= 7 && (dClean.endsWith(queryCore) || queryCore.endsWith(dCore))) return true;
        return false;
      }) || demoDrivers.find(d => {
        const dClean = d.phone.replace(/\D/g, '');
        const dCore = dClean.replace(/^233/, '').replace(/^0/, '');
        return queryCore && dCore === queryCore;
      });

      // 2. Find matched vehicle
      let matchedVehicle = vehicles.find(v => {
        if (v.driverPhone) {
          const vClean = v.driverPhone.replace(/\D/g, '');
          const vCore = vClean.replace(/^233/, '').replace(/^0/, '');
          if (queryCore && vCore === queryCore) return true;
        }
        if (matchedDriver && v.driverName && v.driverName.toLowerCase() === matchedDriver.name.toLowerCase()) {
          return true;
        }
        return false;
      });

      // 3. Check live telemetry API for real-time mobile/hardware coordinates
      let liveCoords: { lat: number; lng: number; speed?: number; heading?: number } | undefined = undefined;
      try {
        const res = await fetch(`/api/gps/telemetry?phone=${encodeURIComponent(phone)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.telemetry) {
            liveCoords = {
              lat: json.telemetry.lat,
              lng: json.telemetry.lng,
              speed: json.telemetry.speed,
              heading: json.telemetry.heading
            };
          }
        }
      } catch {}

      // 4. Fallback to existing vehicle coordinates
      if (!liveCoords && matchedVehicle) {
        liveCoords = {
          lat: matchedVehicle.lat,
          lng: matchedVehicle.lng,
          speed: matchedVehicle.speed,
          heading: matchedVehicle.heading
        };
      }

      // 5. Determine resolved driver name and vehicle plate
      const driverName = matchedDriver?.name || matchedVehicle?.driverName || undefined;
      const vehiclePlate = matchedDriver?.vehicle?.plateNumber ||
        matchedVehicle?.plateNumber ||
        (matchedDriver ? demoVehicles.find(v => v.assignedDriverName === matchedDriver.name || v.assignedDriver === matchedDriver.id)?.plateNumber : undefined);

      // 6. Get rich cellular and GPS telemetry with real name, real plate, and real coordinates
      const telemetry = getDriverPhoneTelemetry(phone, driverName, vehiclePlate, liveCoords);

      // 7. Ensure vehicle exists in vehicles state and is selected on the map
      if (matchedVehicle) {
        setVehicles(prev => prev.map(v => v.vehicleId === matchedVehicle!.vehicleId ? {
          ...v,
          lat: telemetry.lat,
          lng: telemetry.lng,
          driverName: telemetry.driverName,
          driverPhone: telemetry.phone,
          plateNumber: telemetry.vehiclePlate,
          speed: telemetry.speed
        } : v));
        setSelectedVehicleId(matchedVehicle.vehicleId);
      } else {
        // Create new vehicle point on the map so the searched driver is immediately visible
        const newVehicleId = matchedDriver ? `veh-${matchedDriver.id}` : `phone-${queryCore || Date.now()}`;
        const newVehicle: GpsVehiclePoint = {
          vehicleId: newVehicleId,
          plateNumber: telemetry.vehiclePlate,
          driverName: telemetry.driverName,
          driverPhone: telemetry.phone,
          lat: telemetry.lat,
          lng: telemetry.lng,
          speed: telemetry.speed,
          heading: liveCoords?.heading || ((Math.abs(phone.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) * 43) % 360),
          altitude: 48,
          battery: telemetry.battery,
          ignition: true,
          severity: 'GREEN',
          timestamp: new Date().toISOString()
        };
        setVehicles(prev => [newVehicle, ...prev.filter(v => v.vehicleId !== newVehicleId)]);
        setSelectedVehicleId(newVehicleId);
        matchedVehicle = newVehicle;
      }

      setTrackedPhone(phone);
      setTrackedTarget({
        ...telemetry,
        label: `${telemetry.driverName} (${phone}) - ${telemetry.vehiclePlate}`,
        heading: matchedVehicle.heading || 0,
        lastPing: 'Live GNSS stream active'
      });
    } finally {
      setIsPinging(false);
      setPingStatusText(null);
    }
  };

  // URL Query param auto-tracking (?phone=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('phone');
      if (p) {
        setPhoneSearchInput(p);
        setSelectedDriverQuickPhone(p);
        triggerTrackPhone(p);
      }
    }
  }, []);

  // Map display controls
  const [mapLayer, setMapLayer] = useState<MapLayerType>('googleHybrid');
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
    const dInfo = drivers.find(d => d.name === selectedVehicle.driverName) || demoDrivers.find(d => d.name === selectedVehicle.driverName);
    return { vInfo, dInfo };
  }, [selectedVehicle, drivers]);

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

  // Synchronize Live Hardware & Mobile Client Telemetry from Server API
  const handleSyncLiveGps = async () => {
    try {
      const res = await fetch('/api/gps/telemetry');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setVehicles(prev => {
            return prev.map(v => {
              const incoming = json.data.find((item: { vehicleId: string; plateNumber: string; lat: number; lng: number; speed?: number; heading?: number; battery?: number; severity?: string; timestamp?: string }) =>
                item.vehicleId === v.vehicleId || item.plateNumber === v.plateNumber
              );
              if (incoming) {
                return {
                  ...v,
                  lat: incoming.lat,
                  lng: incoming.lng,
                  speed: incoming.speed !== undefined ? incoming.speed : v.speed,
                  heading: incoming.heading !== undefined ? incoming.heading : v.heading,
                  battery: incoming.battery !== undefined ? incoming.battery : v.battery,
                  severity: incoming.severity || v.severity,
                  timestamp: incoming.timestamp || new Date().toISOString()
                };
              }
              // Active road motion drift
              const latDelta = (Math.random() - 0.48) * 0.0006;
              const lngDelta = (Math.random() - 0.48) * 0.0006;
              return {
                ...v,
                lat: Number((v.lat + latDelta).toFixed(5)),
                lng: Number((v.lng + lngDelta).toFixed(5)),
                speed: v.severity === 'RED' ? 0 : v.speed,
                timestamp: new Date().toISOString()
              };
            });
          });
        }
      }
    } catch {
      // Offline fallback
    }

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

  // Acquire Real Physical Device GPS Location (Direct Hardware GNSS via browser/device)
  const handleAcquireRealDeviceLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('GNSS hardware is not accessible on this device.');
      return;
    }

    setIsPinging(true);
    setPingStatusText('📡 Interfacing with Device GNSS Hardware & Acquiring High-Accuracy Fix...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const acc = pos.coords.accuracy ? `±${pos.coords.accuracy.toFixed(1)}m` : '±1.8m';
        const speed = pos.coords.speed !== null ? Math.round(pos.coords.speed * 3.6) : 0;
        const heading = pos.coords.heading !== null ? Math.round(pos.coords.heading) : 0;

        // Transmit live station/device fix to telemetry server
        fetch('/api/gps/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicleId: 'station-live',
            plateNumber: 'DISPATCH-HQ',
            driverName: 'Real Hardware Operator',
            driverPhone: '024-419-8234',
            lat,
            lng,
            speed,
            heading,
            accuracy: pos.coords.accuracy || 2.1,
            source: 'LIVE_DEVICE_GPS',
            timestamp: new Date().toISOString()
          })
        }).catch(() => {});

        const address = `Live Hardware GPS Fix (${lat.toFixed(5)}° N, ${lng.toFixed(5)}° W) - Active GNSS Sensor`;

        setTrackedPhone('024-419-8234');
        setTrackedTarget({
          phone: '024-419-8234',
          internationalPhone: '+233 24 419 8234',
          driverName: 'Live Hardware Device (Active Operator Fix)',
          vehiclePlate: 'DISPATCH-HQ',
          carrier: 'Direct Hardware GNSS (Dual-Band L1+L5)',
          networkType: 'Real-Time Hardware Sensor Lock',
          simStatus: 'Active (Direct Physical Fix)',
          imsi: '620-01-DIRECTHARDWARE',
          iccid: '89233 01894 10294 8192A',
          deviceModel: navigator.userAgent.includes('Mac') ? 'Apple Mac / macOS Location Services' : navigator.userAgent.includes('Android') ? 'Android Hardware GPS' : 'Enterprise Terminal Device',
          osVersion: 'Hardware Sensor Interface (High-Accuracy)',
          imei: '358941029481924',
          signalDbm: -65,
          signalBars: 4,
          cellTower: 'ACC-DIRECT-HARDWARE-GNSS',
          ipAddress: '127.0.0.1 (Local Hardware Station)',
          apn: 'direct-gnss',
          battery: 100,
          isCharging: true,
          lat,
          lng,
          address,
          speed,
          satellites: 18,
          accuracy: `${acc} (Physical Sensor)`,
          label: `Live Hardware GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          heading,
          lastPing: 'Live hardware stream active'
        });

        setIsPinging(false);
        setPingStatusText(null);
      },
      (err) => {
        setIsPinging(false);
        setPingStatusText(null);
        alert(`Could not acquire device GPS: ${err.message}. Please enable location permissions.`);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  // Live polling interval querying enterprise telemetry API every 5 seconds
  useEffect(() => {
    handleSyncLiveGps();
    const timer = setInterval(() => {
      handleSyncLiveGps();
    }, 5000);
    return () => clearInterval(timer);
  }, [selectedVehicleId]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const q = searchQuery.toLowerCase().trim();
      const qClean = q.replace(/\D/g, '');
      const matchSearch = !q ||
        v.plateNumber.toLowerCase().includes(q) ||
        (v.driverName && v.driverName.toLowerCase().includes(q)) ||
        (v.driverPhone && (
          v.driverPhone.toLowerCase().includes(q) ||
          (qClean.length >= 3 && v.driverPhone.replace(/\D/g, '').includes(qClean))
        ));
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
            Enterprise Live Fleet GNSS & Cellular Telemetry System • {vehicles.length} active fleet trackers connected (Live Stream)
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
            gap: '2px',
            flexWrap: 'wrap'
          }}>
            <button
              type="button"
              className={`btn btn-sm ${mapLayer === 'googleHybrid' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMapLayer('googleHybrid')}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              title="Google Satellite Hybrid (Satellite imagery with road names & city labels)"
            >
              🛰️ Google Satellite
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mapLayer === 'googleRoads' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMapLayer('googleRoads')}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              title="Google Maps Standard Roadmap"
            >
              🗺️ Google Maps
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mapLayer === 'googleTraffic' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMapLayer('googleTraffic')}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              title="Google Maps Live Real-time Traffic Congestion"
            >
              🚦 Live Traffic
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mapLayer === 'googleTerrain' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMapLayer('googleTerrain')}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              title="Google Topographic Terrain"
            >
              ⛰️ Terrain
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mapLayer === 'dark' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setMapLayer('dark')}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              title="CartoDB Tactical Dark Matter"
            >
              🌙 Dark
            </button>
          </div>

          {/* Synchronize Live Fleet Telemetry */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleSyncLiveGps}
            style={{ fontSize: '0.75rem', gap: '6px' }}
            title="Query real-time GPS telemetry from active fleet devices"
          >
            <span>⚡</span>
            <span>Sync Live Telemetry</span>
          </button>

          {/* Hardware Device & API Configuration */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowSettingsModal(true)}
            style={{ fontSize: '0.75rem', gap: '6px' }}
          >
            <span>⚙️</span>
            <span>GPS Hardware & SIM Settings</span>
          </button>
        </div>
      </div>

      {/* DIRECT DRIVER PHONE TRACKING ENGINE (TRACK BY PHONE AT WILL) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid var(--byt-sea)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        boxShadow: '0 4px 20px rgba(8, 145, 178, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--byt-sea), #0284c7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', color: '#fff', boxShadow: '0 4px 12px rgba(8, 145, 178, 0.4)'
          }}>
            📡
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Direct Driver Phone Tracking Engine</span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(34, 211, 238, 0.2)', border: '1px solid #22d3ee', color: '#38bdf8', fontWeight: 700 }}>
                High Precision GPS & Cell Lock
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Track the exact real-time street coordinates of any driver by phone number at will.
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            triggerTrackPhone(phoneSearchInput);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 380px', maxWidth: '560px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', color: '#94a3b8' }}>
              📞
            </span>
            <input
              type="text"
              className="form-input"
              placeholder="Enter phone e.g. 024-419-8234, 055-892-1045, or any number..."
              value={phoneSearchInput}
              onChange={e => setPhoneSearchInput(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
            />
          </div>

          <select
            className="form-select"
            value={selectedDriverQuickPhone}
            onChange={e => {
              const val = e.target.value;
              setSelectedDriverQuickPhone(val);
              if (val) {
                setPhoneSearchInput(val);
                triggerTrackPhone(val);
              }
            }}
            style={{ width: '180px', fontSize: '0.8rem' }}
          >
            <option value="">Select fleet driver to pinpoint...</option>
            {drivers.map(d => (
              <option key={d.id} value={d.phone}>
                {d.name} ({d.phone})
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isPinging || !phoneSearchInput.trim()}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            {isPinging ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                <span>Pinging...</span>
              </>
            ) : (
              <>
                <span>🎯</span>
                <span>Locate Now</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleAcquireRealDeviceLocation}
            disabled={isPinging}
            className="btn btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
              color: '#fff',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
            title="Acquire live high-precision hardware GNSS coordinates from this device"
          >
            <span>📍</span>
            <span>Use Live Device GPS</span>
          </button>
        </form>
      </div>

      {/* Cellular Ping Progress Notice */}
      {pingStatusText && (
        <div style={{
          padding: '10px 16px',
          background: 'rgba(8, 145, 178, 0.15)',
          border: '1px solid #22d3ee',
          borderRadius: 'var(--radius-md)',
          color: '#22d3ee',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'pulse-glow 1.5s infinite'
        }}>
          <span style={{ animation: 'spin 1s linear infinite' }}>🛰️</span>
          <span>{pingStatusText}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLEET SECURITY COMMAND & REAL-TIME THREAT RADAR CENTER (REDESIGNED #2) */}
      {/* ========================================================================= */}
      <div
        style={{
          background: activeAlarms.length > 0
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.16) 0%, rgba(15, 23, 42, 0.98) 60%, rgba(30, 41, 59, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.96) 60%, rgba(10, 22, 40, 0.95) 100%)',
          border: activeAlarms.length > 0 ? '1.5px solid rgba(239, 68, 68, 0.65)' : '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: activeAlarms.length > 0
            ? '0 8px 30px rgba(239, 68, 68, 0.22), 0 0 20px rgba(239, 68, 68, 0.1)'
            : '0 4px 20px rgba(16, 185, 129, 0.12)',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Left: Indicator & Headline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: activeAlarms.length > 0
              ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
              : 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            color: '#fff',
            boxShadow: activeAlarms.length > 0 ? '0 0 16px rgba(239, 68, 68, 0.6)' : '0 0 14px rgba(16, 185, 129, 0.4)',
            animation: activeAlarms.length > 0 ? 'pulse 1.8s infinite' : 'none'
          }}>
            {activeAlarms.length > 0 ? '🚨' : '🛡️'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#fff' }}>
                Fleet Threat Radar & Speed Guardian
              </span>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                background: activeAlarms.length > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.2)',
                border: activeAlarms.length > 0 ? '1px solid #ef4444' : '1px solid #10b981',
                color: activeAlarms.length > 0 ? '#fca5a5' : '#6ee7b7',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {activeAlarms.length > 0 ? `${activeAlarms.length} Active Threat${activeAlarms.length > 1 ? 's' : ''}` : 'All Clear'}
              </span>
            </div>

            <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>
              {activeAlarms.length > 0 ? (
                <span>
                  Critical Alert: <strong style={{ color: '#fca5a5' }}>{activeAlarms[0].plateNumber}</strong> ({activeAlarms[0].driverName}) — {activeAlarms[0].message}
                </span>
              ) : (
                <span>All {vehicles.length} fleet vehicles operating strictly within speed thresholds & authorized Greater Accra boundaries.</span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Live Category Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setAlarmFilter('ALL');
              setShowAlarmsDrawer(true);
            }}
            style={{
              background: alarmFilter === 'ALL' && showAlarmsDrawer ? '#ef4444' : 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>🔥 All</span>
            <span style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '8px', fontSize: '0.68rem' }}>{activeAlarms.length}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAlarmFilter('SPEEDING');
              setShowAlarmsDrawer(true);
            }}
            style={{
              background: alarmFilter === 'SPEEDING' && showAlarmsDrawer ? '#ef4444' : 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: speedingCount > 0 ? '#fca5a5' : 'var(--color-text-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>⚡ Overspeeding</span>
            <span style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '8px', fontSize: '0.68rem' }}>{speedingCount}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAlarmFilter('GEOFENCE');
              setShowAlarmsDrawer(true);
            }}
            style={{
              background: alarmFilter === 'GEOFENCE' && showAlarmsDrawer ? '#ef4444' : 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: geofenceCount > 0 ? '#fca5a5' : 'var(--color-text-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>🚧 Geofence</span>
            <span style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '8px', fontSize: '0.68rem' }}>{geofenceCount}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAlarmFilter('IMMOBILIZED');
              setShowAlarmsDrawer(true);
            }}
            style={{
              background: alarmFilter === 'IMMOBILIZED' && showAlarmsDrawer ? '#f59e0b' : 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: immobilizedCount > 0 ? '#fbbf24' : 'var(--color-text-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '5px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>🛑 Immobilized</span>
            <span style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '8px', fontSize: '0.68rem' }}>{immobilizedCount}</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setShowAlarmsDrawer(prev => !prev)}
            className="btn btn-sm"
            style={{
              background: showAlarmsDrawer ? '#ef4444' : 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.78rem',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              boxShadow: activeAlarms.length > 0 ? '0 0 14px rgba(239, 68, 68, 0.6)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span>🚨</span>
            <span>{showAlarmsDrawer ? 'Close Threat Radar' : 'Open Threat Radar'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGeofenceModal(true)}
            className="btn btn-secondary btn-sm"
            style={{
              fontSize: '0.75rem',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Configure Geofences & Speed Thresholds"
          >
            <span>🛡️</span>
            <span>Geofence Zones</span>
          </button>
        </div>
      </div>

      {/* Main Map & Telemetry Dashboard */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', minHeight: 'calc(100vh - 270px)' }}>
        {/* Left Column: Vehicle List */}
        <div style={{ width: '310px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Search & Severity Filters */}
            <div style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search plate, driver, or phone..."
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
                      if (loc.driverPhone) {
                        setPhoneSearchInput(loc.driverPhone);
                      }
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '6px',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(8, 145, 178, 0.15)' : 'var(--color-bg-card)',
                      border: isSelected ? '1px solid var(--byt-sea)' : '1px solid var(--color-border)',
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
                      <span className="font-mono text-xs" style={{ color: 'var(--byt-sea-light)', fontWeight: 700 }}>
                        {loc.speed} km/h
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                      <span className="truncate" style={{ maxWidth: 140 }}>👤 {loc.driverName || 'Unassigned'}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>🔋 {loc.battery}%</span>
                    </div>

                    {/* Driver Phone quick track */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (loc.driverPhone) {
                            setPhoneSearchInput(loc.driverPhone);
                            setSelectedDriverQuickPhone(loc.driverPhone);
                            triggerTrackPhone(loc.driverPhone);
                          }
                        }}
                        style={{
                          background: 'none', border: 'none', padding: 0,
                          fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px'
                        }}
                        title="Pinpoint this driver by phone number"
                      >
                        <span>📞 {loc.driverPhone || '024-419-8234'}</span>
                        <span style={{ fontSize: '0.65rem' }}>📍</span>
                      </button>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                        {loc.heading}° {loc.heading! > 180 ? 'SW' : 'NE'}
                      </span>
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
          <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative', minHeight: 520 }}>
            <RealGpsMap
              vehicles={filteredVehicles}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
              mapLayer={mapLayer}
              onLayerChange={setMapLayer}
              followSelected={followSelected}
              historyTrail={selectedVehicleId ? trails[selectedVehicleId] || [] : []}
              trackedPhone={trackedPhone}
              trackedTarget={trackedTarget}
              geofences={geofences}
              showGeofences={showGeofences}
            />

            {/* Floating Top-Left Map Telemetry & Geofence Indicator */}
            <div style={{
              position: 'absolute',
              top: 14,
              left: 14,
              zIndex: 850,
              background: 'rgba(10, 22, 40, 0.94)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(8, 145, 178, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px',
              fontSize: '0.75rem',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 18px rgba(0,0,0,0.55)',
              maxWidth: 'calc(100% - 460px)',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 1.5s infinite' }} />
                <strong>Feed:</strong> {mapLayer === 'googleHybrid' ? '🛰️ Satellite' : mapLayer === 'googleRoads' ? '🗺️ Google' : mapLayer === 'googleTraffic' ? '🚦 Traffic' : mapLayer === 'googleTerrain' ? '⛰️ Terrain' : '🌙 Tactical'}
              </div>

              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

              <button
                type="button"
                onClick={() => setFollowSelected(prev => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: followSelected ? 'var(--byt-sea-light)' : 'var(--color-text-muted)',
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

              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

              {/* Geofence Toggle */}
              <button
                type="button"
                onClick={() => setShowGeofences(prev => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: showGeofences ? '#10b981' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
                title="Toggle Geofence Boundaries on Map"
              >
                <span>🛡️</span> Geofences: {showGeofences ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Non-colliding Floating Bottom-Right Threat Radar Pill on Map */}
            {activeAlarms.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAlarmsDrawer(true)}
                style={{
                  position: 'absolute',
                  bottom: 24,
                  right: 14,
                  zIndex: 850,
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  color: '#fff',
                  border: '1.5px solid #fff',
                  borderRadius: '24px',
                  padding: '7px 16px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.7), 0 0 16px rgba(239, 68, 68, 0.4)',
                  animation: 'pulse 1.8s infinite'
                }}
                title="Open Threat Radar Console"
              >
                <span>🚨</span>
                <span>{activeAlarms.length} Security Threats Active</span>
                <span style={{ background: '#fff', color: '#ef4444', padding: '1px 7px', borderRadius: '10px', fontSize: '0.7rem' }}>
                  VIEW →
                </span>
              </button>
            )}

            {/* Floating Notification Toast for Remote Immobilizer */}
            {alarmNotification && (
              <div style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1002,
                background: 'rgba(15, 23, 42, 0.96)',
                border: '1px solid var(--byt-gold)',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'fadeInUp 0.3s ease'
              }}>
                <span>{alarmNotification}</span>
                <button
                  type="button"
                  onClick={() => setAlarmNotification(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', marginLeft: 8 }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* REDESIGNED FULL-HEIGHT SLIDE-OVER THREAT CONSOLE DRAWER (#2 REDESIGN) */}
            {/* ========================================================================= */}
            {showAlarmsDrawer && (
              <>
                {/* Backdrop overlay */}
                <div
                  onClick={() => setShowAlarmsDrawer(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(5, 12, 24, 0.65)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 99998,
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                />

                {/* Slide-Over Command Drawer */}
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: 480,
                    maxWidth: '94vw',
                    background: 'linear-gradient(180deg, #0d192d 0%, #080f1e 100%)',
                    borderLeft: '2px solid rgba(239, 68, 68, 0.8)',
                    boxShadow: '-16px 0 45px rgba(0, 0, 0, 0.85), -4px 0 25px rgba(239, 68, 68, 0.35)',
                    zIndex: 99999,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {/* Drawer Header */}
                  <div style={{
                    padding: '20px 24px 16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.12) 0%, transparent 100%)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.2rem',
                          color: '#fff',
                          boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)'
                        }}>
                          🚨
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#fff', fontWeight: 800 }}>
                            Threat Radar & Speed Guardian
                          </h3>
                          <div style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '2px' }}>
                            Real-time GNSS overspeeding & geofence perimeter alarms
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAlarmsDrawer(false)}
                        className="btn btn-ghost btn-icon"
                        style={{ color: '#94a3b8', fontSize: '1.1rem' }}
                        title="Close Console"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
                      <button
                        type="button"
                        onClick={() => setAlarmFilter('ALL')}
                        style={{
                          flex: 1,
                          padding: '6px 4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-sm)',
                          border: alarmFilter === 'ALL' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
                          background: alarmFilter === 'ALL' ? '#ef4444' : 'rgba(255,255,255,0.04)',
                          color: '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        All ({activeAlarms.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setAlarmFilter('SPEEDING')}
                        style={{
                          flex: 1,
                          padding: '6px 4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-sm)',
                          border: alarmFilter === 'SPEEDING' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
                          background: alarmFilter === 'SPEEDING' ? '#ef4444' : 'rgba(255,255,255,0.04)',
                          color: speedingCount > 0 ? '#fca5a5' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        ⚡ Speed ({speedingCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setAlarmFilter('GEOFENCE')}
                        style={{
                          flex: 1,
                          padding: '6px 4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-sm)',
                          border: alarmFilter === 'GEOFENCE' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.08)',
                          background: alarmFilter === 'GEOFENCE' ? '#ef4444' : 'rgba(255,255,255,0.04)',
                          color: geofenceCount > 0 ? '#fca5a5' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        🚧 Geofence ({geofenceCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setAlarmFilter('IMMOBILIZED')}
                        style={{
                          flex: 1,
                          padding: '6px 4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-sm)',
                          border: alarmFilter === 'IMMOBILIZED' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                          background: alarmFilter === 'IMMOBILIZED' ? '#f59e0b' : 'rgba(255,255,255,0.04)',
                          color: immobilizedCount > 0 ? '#fbbf24' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        🛑 Engine Cut ({immobilizedCount})
                      </button>
                    </div>
                  </div>

                  {/* Drawer Scrollable Content */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {visibleAlarms.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '50px 20px', color: '#10b981' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛡️</div>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1.05rem', fontWeight: 700 }}>
                          Safe Perimeter Lock Maintained
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.4 }}>
                          {alarmFilter === 'ALL'
                            ? `All ${vehicles.length} tracked fleet units are currently driving within speed limits and inside designated zones.`
                            : `No active threats matching the "${alarmFilter}" filter.`}
                        </p>
                      </div>
                    ) : (
                      visibleAlarms.map(alarm => {
                        const isImmobilized = immobilizedVehicles.has(alarm.vehicleId);
                        const isSpeeding = alarm.type === 'SPEEDING';
                        const currentSpeed = alarm.speed || 0;
                        const speedLimit = alarm.limit || 75;
                        const excessSpeed = Math.max(0, currentSpeed - speedLimit);
                        const percentOver = Math.round((excessSpeed / speedLimit) * 100);

                        return (
                          <div
                            key={alarm.id}
                            style={{
                              background: 'rgba(15, 23, 42, 0.9)',
                              border: alarm.severity === 'CRITICAL' ? '1.5px solid rgba(239, 68, 68, 0.8)' : '1px solid rgba(245, 158, 11, 0.6)',
                              borderRadius: 'var(--radius-lg)',
                              padding: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px',
                              boxShadow: alarm.severity === 'CRITICAL'
                                ? '0 4px 20px rgba(239, 68, 68, 0.2)'
                                : '0 4px 15px rgba(0, 0, 0, 0.4)'
                            }}
                          >
                            {/* Card Header: Severity, Plate & Driver */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: 38,
                                  height: 38,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, var(--byt-sea), #0284c7)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.88rem',
                                  color: '#fff',
                                  border: '1.5px solid rgba(255,255,255,0.2)'
                                }}>
                                  {alarm.driverName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span className="font-mono font-bold" style={{ fontSize: '0.98rem', color: '#fff' }}>
                                      {alarm.plateNumber}
                                    </span>
                                    <span style={{
                                      fontSize: '0.62rem',
                                      fontWeight: 800,
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      background: alarm.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                                      color: '#fff',
                                      textTransform: 'uppercase'
                                    }}>
                                      {alarm.severity}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                    {alarm.driverName} • 📞 {alarm.driverPhone}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDismissAlarm(alarm.id)}
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
                                title="Dismiss Alert"
                              >
                                ✕
                              </button>
                            </div>

                            {/* Threat Detail / Speed Gauge Bar */}
                            <div style={{
                              background: 'rgba(0, 0, 0, 0.45)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: 'var(--radius-md)',
                              padding: '12px'
                            }}>
                              <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontWeight: 600, marginBottom: isSpeeding ? '8px' : '0' }}>
                                {alarm.message}
                              </div>

                              {isSpeeding && (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                                    <span>Current: <strong style={{ color: '#ef4444', fontSize: '0.85rem' }}>{Math.round(currentSpeed)} km/h</strong></span>
                                    <span>Limit: <strong>{speedLimit} km/h</strong></span>
                                    <span style={{ color: '#ef4444', fontWeight: 700 }}>+{percentOver}% OVER</span>
                                  </div>

                                  {/* Visual Progress Bar */}
                                  <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{
                                      width: `${Math.min(100, (currentSpeed / 100) * 100)}%`,
                                      height: '100%',
                                      background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                                      borderRadius: 3
                                    }} />
                                  </div>
                                </>
                              )}

                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', marginTop: '6px', fontFamily: 'monospace' }}>
                                <span>GPS Coordinates: {alarm.lat.toFixed(4)}° N, {alarm.lng.toFixed(4)}° W</span>
                                <span>{alarm.timestamp}</span>
                              </div>
                            </div>

                            {/* Tactical Action Matrix */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedVehicleId(alarm.vehicleId);
                                  setFollowSelected(true);
                                  setShowAlarmsDrawer(false);
                                }}
                                className="btn btn-sm btn-ghost"
                                style={{ flex: 1, minWidth: '100px', fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                              >
                                <span>📍 Pinpoint</span>
                              </button>

                              <a
                                href={getWhatsAppUrl(alarm.driverPhone, `DISPATCH RADAR NOTICE for vehicle ${alarm.plateNumber}: Please reduce speed immediately and return to designated sector.`)}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-ghost"
                                style={{ flex: 1, minWidth: '110px', fontSize: '0.72rem', background: 'rgba(34, 197, 94, 0.12)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <span>💬 WhatsApp</span>
                              </a>

                              <a
                                href={`tel:${alarm.driverPhone.replace(/\D/g, '')}`}
                                className="btn btn-sm btn-ghost"
                                style={{ flex: '0 0 auto', padding: '0 10px', fontSize: '0.72rem', color: '#94a3b8' }}
                                title="Call Driver"
                              >
                                <span>📞</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => handleToggleImmobilize(alarm.vehicleId, alarm.plateNumber)}
                                style={{
                                  flex: '1 1 100%',
                                  background: isImmobilized ? '#10b981' : '#dc2626',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '8px 12px',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  boxShadow: isImmobilized ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.4)'
                                }}
                              >
                                <span>{isImmobilized ? '🔓' : '🛑'}</span>
                                <span>{isImmobilized ? 'Restore Vehicle Engine (Re-engage Relay)' : 'Immobilize Vehicle (Cut Engine Fuel Relay)'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Drawer Footer */}
                  <div style={{
                    padding: '14px 24px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Radar Refresh: <strong>Continuous GNSS Stream</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => setShowAlarmsDrawer(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Close Console
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* FLOATING PRECISE DRIVER PHONE TELEMETRY CARD */}
            {trackedTarget && (
              <div style={{
                position: 'absolute',
                top: 54,
                left: 14,
                zIndex: 1000,
                width: '360px',
                maxWidth: 'calc(100% - 28px)',
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(8, 14, 26, 0.98) 100%)',
                backdropFilter: 'blur(16px)',
                border: '2px solid #06b6d4',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                color: '#fff',
                boxShadow: '0 12px 35px rgba(6, 182, 212, 0.35)'
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '10px', background: '#0891b2', color: '#fff', fontWeight: 800 }}>
                      🎯 PHONE LOCK ACTIVE
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#22d3ee', fontWeight: 700 }}>
                      {trackedTarget.carrier}
                    </span>
                  </div>
                  <button
                    onClick={() => { setTrackedPhone(null); setTrackedTarget(null); }}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer' }}
                    title="Close Pin"
                  >
                    ✕
                  </button>
                </div>

                {/* Driver Profile & Phone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--byt-sea), #0284c7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', fontWeight: 800, color: '#fff',
                    border: '2px solid #22d3ee'
                  }}>
                    {trackedTarget.driverName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#fff' }}>{trackedTarget.driverName}</div>
                    <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>📞 {trackedTarget.phone}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                      {trackedTarget.vehiclePlate}
                    </span>
                  </div>
                </div>

                {/* Precise Location & Landmark */}
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '10px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '3px' }}>📍 Precise Street & Landmark:</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                    {trackedTarget.address}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#38bdf8', marginTop: '6px', fontFamily: 'monospace' }}>
                    <span>Lat: {trackedTarget.lat.toFixed(5)}°</span>
                    <span>Lng: {trackedTarget.lng.toFixed(5)}°</span>
                  </div>
                </div>

                {/* Live GPS Telemetry Badges */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem', marginBottom: '14px' }}>
                  <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Speed:</span> <strong>{trackedTarget.speed} km/h</strong>
                  </div>
                  <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Accuracy:</span> <strong style={{ color: '#10b981' }}>{trackedTarget.accuracy}</strong>
                  </div>
                  <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Satellites:</span> <strong>{trackedTarget.satellites} (3D Fix)</strong>
                  </div>
                  <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Battery:</span> <strong style={{ color: '#10b981' }}>{trackedTarget.battery}%</strong>
                  </div>
                </div>

                {/* Google Maps Real Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  <a
                    href={getGoogleMapsUrl(trackedTarget.lat, trackedTarget.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{
                      background: '#0891b2',
                      color: '#fff',
                      fontSize: '0.74rem',
                      justifyContent: 'center',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <span>🗺️ Google Maps</span>
                  </a>
                  <a
                    href={getGoogleStreetViewUrl(trackedTarget.lat, trackedTarget.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{
                      background: 'rgba(234, 179, 8, 0.2)',
                      border: '1px solid rgba(234, 179, 8, 0.4)',
                      color: '#fde047',
                      fontSize: '0.74rem',
                      justifyContent: 'center',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <span>🚶 Street View</span>
                  </a>
                </div>

                {/* View Phone Details Inspector Button */}
                <button
                  type="button"
                  onClick={() => openPhoneDetails(trackedTarget.phone, trackedTarget.driverName, trackedTarget.vehiclePlate)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    width: '100%',
                    marginBottom: '8px',
                    fontSize: '0.76rem',
                    justifyContent: 'center',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    fontWeight: 700
                  }}
                >
                  <span>📱 Full Phone & SIM Telemetry</span>
                </button>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href={`/admin/drivers`}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, fontSize: '0.78rem', justifyContent: 'center' }}
                  >
                    <span>👤</span>
                    <span>View Dossier</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => triggerTrackPhone(trackedTarget.phone)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem' }}
                    title="Re-ping driver device"
                  >
                    <span>⚡ Re-Ping</span>
                  </button>
                </div>
              </div>
            )}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <a
                      href={getGoogleMapsUrl(selectedVehicle.lat, selectedVehicle.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                      title="Open vehicle in Google Maps"
                    >
                      <span>🗺️</span>
                      <span>Google Maps</span>
                    </a>
                    <a
                      href={getGoogleStreetViewUrl(selectedVehicle.lat, selectedVehicle.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                      title="Open Google Street View 360°"
                    >
                      <span>🚶</span>
                      <span>Street View</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => openPhoneDetails(selectedVehicle.driverPhone || '024-419-8234', selectedVehicle.driverName || undefined, selectedVehicle.plateNumber)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px', color: '#38bdf8' }}
                      title="View full phone and cellular device telemetry"
                    >
                      <span>📱</span>
                      <span>Phone Details</span>
                    </button>
                    {(() => {
                      const matchedId = drivers.find(d => d.name === selectedVehicle.driverName)?.id ||
                        demoDrivers.find(d => d.name === selectedVehicle.driverName)?.id || '1';
                      return (
                        <Link
                          href={`/admin/chat?driverId=${matchedId}`}
                          className="btn btn-secondary btn-sm"
                          style={{
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: 'var(--byt-sea-dark)',
                            borderColor: 'var(--byt-sea)',
                            background: 'rgba(8, 145, 178, 0.08)',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                          title={`Open dedicated dispatch chat with ${selectedVehicle.driverName}`}
                        >
                          <span>💬</span>
                          <span>Chat with Driver</span>
                        </Link>
                      );
                    })()}
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
      {/* COMPREHENSIVE PHONE & DEVICE TELEMETRY INSPECTOR MODAL */}
      {/* ========================================================= */}
      {showPhoneModal && inspectingPhoneData && (
        <div
          className="modal-overlay"
          onClick={() => setShowPhoneModal(false)}
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
              background: '#091322',
              border: '1.5px solid #06b6d4',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(6,182,212,0.3)',
              borderRadius: 'var(--radius-xl)',
              color: '#fff'
            }}
          >
            {/* Modal Header */}
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                  <span>📱 Driver Phone & Cellular Device Telemetry</span>
                  <span style={{ fontSize: '0.75rem', background: '#0891b2', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                    {inspectingPhoneData.carrier}
                  </span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Hardware specs, SIM subscriber identity, network signal diagnostics & live coordinates
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPhoneModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.3rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quick Driver Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.2) 0%, rgba(2, 132, 199, 0.1) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 18px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0891b2, #0284c7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: '#fff',
                    border: '2px solid #38bdf8'
                  }}>
                    {inspectingPhoneData.driverName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{inspectingPhoneData.driverName}</div>
                    <div style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 600 }}>📞 {inspectingPhoneData.phone} ({inspectingPhoneData.internationalPhone})</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`tel:${inspectingPhoneData.phone}`}
                    className="btn btn-sm"
                    style={{ background: '#10b981', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span>📞</span>
                    <span>Call Number</span>
                  </a>
                  <a
                    href={getWhatsAppUrl(inspectingPhoneData.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ background: '#25D366', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* 3-Column Telemetry Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                {/* SIM & Carrier Box */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '10px' }}>
                    📶 SIM & Cellular Network
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                    <div><span style={{ color: '#94a3b8' }}>Carrier:</span> <strong>{inspectingPhoneData.carrier}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Network Tech:</span> <strong>{inspectingPhoneData.networkType}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>SIM Status:</span> <span style={{ color: '#10b981', fontWeight: 700 }}>{inspectingPhoneData.simStatus}</span></div>
                    <div><span style={{ color: '#94a3b8' }}>IMSI:</span> <strong style={{ fontFamily: 'monospace' }}>{inspectingPhoneData.imsi}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>ICCID:</span> <strong style={{ fontFamily: 'monospace' }}>{inspectingPhoneData.iccid}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Cell Tower:</span> <strong>{inspectingPhoneData.cellTower}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Signal:</span> <strong style={{ color: '#10b981' }}>{inspectingPhoneData.signalDbm} dBm ({inspectingPhoneData.signalBars}/4 bars)</strong></div>
                  </div>
                </div>

                {/* Handset & Device Box */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '10px' }}>
                    📱 Handset & Diagnostics
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                    <div><span style={{ color: '#94a3b8' }}>Device Model:</span> <strong>{inspectingPhoneData.deviceModel}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>OS Version:</span> <strong>{inspectingPhoneData.osVersion}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>IMEI:</span> <strong style={{ fontFamily: 'monospace' }}>{inspectingPhoneData.imei}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Battery:</span> <strong style={{ color: '#10b981' }}>{inspectingPhoneData.battery}% {inspectingPhoneData.isCharging ? '⚡ (Charging)' : '🔋'}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>IP Address:</span> <strong style={{ fontFamily: 'monospace' }}>{inspectingPhoneData.ipAddress}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>APN:</span> <strong>{inspectingPhoneData.apn}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Assigned Vehicle:</span> <strong>{inspectingPhoneData.vehiclePlate}</strong></div>
                  </div>
                </div>

                {/* Location & GPS Fix Box */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '10px' }}>
                    🛰️ GNSS & Precise Location
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                    <div><span style={{ color: '#94a3b8' }}>Landmark:</span> <strong style={{ color: '#fff' }}>{inspectingPhoneData.address}</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Coordinates:</span> <strong style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{inspectingPhoneData.lat.toFixed(5)}°, {inspectingPhoneData.lng.toFixed(5)}°</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Speed:</span> <strong>{inspectingPhoneData.speed} km/h</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Satellites:</span> <strong>{inspectingPhoneData.satellites} (GPS+GLONASS 3D Fix)</strong></div>
                    <div><span style={{ color: '#94a3b8' }}>Accuracy:</span> <strong style={{ color: '#10b981' }}>{inspectingPhoneData.accuracy}</strong></div>
                  </div>
                </div>
              </div>

              {/* Real Google Maps Launchers */}
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>Google Maps Real Features:</div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Launch official Google navigation, Street View 360° or roadmap for this driver</div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <a
                    href={getGoogleMapsUrl(inspectingPhoneData.lat, inspectingPhoneData.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ background: '#0891b2', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                  >
                    <span>🗺️ Open in Google Maps</span>
                  </a>
                  <a
                    href={getGoogleStreetViewUrl(inspectingPhoneData.lat, inspectingPhoneData.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ background: 'rgba(234, 179, 8, 0.2)', border: '1px solid rgba(234, 179, 8, 0.5)', color: '#fde047', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                  >
                    <span>🚶 Street View 360°</span>
                  </a>
                  <a
                    href={getGoogleDirectionsUrl(inspectingPhoneData.lat, inspectingPhoneData.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ background: '#10b981', color: '#fff', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                  >
                    <span>🧭 Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* ========================================================= */}
      {/* FLEET GEOFENCING & OPERATING ZONES MANAGEMENT MODAL */}
      {/* ========================================================= */}
      {showGeofenceModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowGeofenceModal(false)}
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
              maxWidth: '800px',
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
                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                  <span>🛡️ Fleet Geofencing & Operating Perimeter Zones</span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Manage authorized operational boundaries, speed limits, and restricted anti-theft perimeters.
                </p>
              </div>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowGeofenceModal(false)}>✕</button>
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  Active Geofences Drawn on Map: <strong>{geofences.filter(g => g.active).length} of {geofences.length}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => updateGeofences(INITIAL_GEOFENCES)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.72rem', color: 'var(--byt-gold)' }}
                >
                  ↺ Reset to Standard Accra Zones
                </button>
              </div>

              {/* Zones List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {geofences.map(zone => {
                  const typeColors: Record<string, string> = {
                    SAFE_ZONE: '#10b981',
                    RESTRICTED_ZONE: '#ef4444',
                    AIRPORT_VIP: '#0891b2',
                    MAINTENANCE_HUB: '#d4a843',
                  };
                  const color = typeColors[zone.type] || '#d4a843';

                  return (
                    <div
                      key={zone.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${zone.active ? color : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: color,
                          boxShadow: zone.active ? `0 0 10px ${color}` : 'none'
                        }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                            {zone.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                            Type: <strong style={{ color }}>{zone.type.replace('_', ' ')}</strong> • Radius: <strong>{(zone.radiusMeters / 1000).toFixed(1)} km</strong> ({zone.radiusMeters}m) • Max Speed: <strong>{zone.speedLimitKmh ? `${zone.speedLimitKmh} km/h` : 'No limit'}</strong>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleGeofence(zone.id)}
                        style={{
                          background: zone.active ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255,255,255,0.05)',
                          color: zone.active ? '#10b981' : 'var(--color-text-muted)',
                          border: `1px solid ${zone.active ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 14px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {zone.active ? '✓ ACTIVE' : 'DISABLED'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Information Note */}
              <div style={{
                background: 'rgba(8, 145, 178, 0.1)',
                border: '1px solid rgba(8, 145, 178, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '0.75rem',
                color: '#bae6fd',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '1.1rem' }}>💡</span>
                <span>
                  Vehicles exceeding a zone&apos;s speed limit or venturing outside safe operational perimeters trigger instantaneous audible/visual alarms in dispatch and enable single-click GNSS engine immobilizer cut-offs.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowGeofenceModal(false)}
              >
                Close & View Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
