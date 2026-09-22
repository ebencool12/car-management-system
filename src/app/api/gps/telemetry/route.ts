import { NextRequest, NextResponse } from 'next/server';
import { demoLocations, demoDrivers } from '@/lib/demo-data';

export interface TelemetryPoint {
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
  accuracy?: number;
  source?: 'LIVE_DEVICE_GPS' | 'OBD2_HARDWARE' | 'CARRIER_CELL_TOWER' | 'TELTONIKA_CODEC8';
  timestamp: string;
}

// Enterprise Active Telemetry Server Cache
const activeTelemetry: TelemetryPoint[] = demoLocations.map((loc, idx) => {
  const matchedDriver = demoDrivers.find(d => d.name === loc.driverName);
  return {
    ...loc,
    driverPhone: matchedDriver?.phone,
    speed: [48, 55, 32, 0, 62, 45, 18, 50][idx] || 38,
    heading: [45, 180, 270, 90, 135, 210, 30, 315][idx] || 0,
    altitude: 52 + idx * 4,
    battery: [96, 92, 88, 14, 98, 91, 74, 95][idx] || 90,
    ignition: loc.severity !== 'RED',
    imei: `86532104589211${idx}`,
    accuracy: 2.1,
    source: 'LIVE_DEVICE_GPS',
    timestamp: new Date().toISOString()
  };
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  const plate = searchParams.get('plate');

  if (phone) {
    const cleanPhone = phone.replace(/\D/g, '').replace(/^233/, '').replace(/^0/, '');
    const found = activeTelemetry.find(t => {
      const p = (t.driverPhone || '').replace(/\D/g, '').replace(/^233/, '').replace(/^0/, '');
      return p === cleanPhone;
    });
    if (found) {
      return NextResponse.json({ success: true, telemetry: found });
    }
  }

  if (plate) {
    const found = activeTelemetry.find(t => t.plateNumber.toLowerCase() === plate.toLowerCase());
    if (found) {
      return NextResponse.json({ success: true, telemetry: found });
    }
  }

  return NextResponse.json({
    success: true,
    count: activeTelemetry.length,
    timestamp: new Date().toISOString(),
    data: activeTelemetry
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support single telemetry packet or array of packets from hardware GPS / mobile client
    const packets = Array.isArray(body) ? body : [body];

    for (const packet of packets) {
      if (!packet.lat || !packet.lng) continue;

      const cleanPhone = packet.driverPhone ? packet.driverPhone.replace(/\D/g, '').replace(/^233/, '').replace(/^0/, '') : null;
      const vehicleId = packet.vehicleId || (packet.imei ? `v-${packet.imei}` : `v-${Date.now()}`);

      const existingIdx = activeTelemetry.findIndex(t => {
        if (packet.vehicleId && t.vehicleId === packet.vehicleId) return true;
        if (packet.plateNumber && t.plateNumber === packet.plateNumber) return true;
        if (packet.imei && t.imei === packet.imei) return true;
        if (cleanPhone && t.driverPhone) {
          const tp = t.driverPhone.replace(/\D/g, '').replace(/^233/, '').replace(/^0/, '');
          if (tp === cleanPhone) return true;
        }
        return false;
      });

      const updatedPoint: TelemetryPoint = {
        vehicleId: existingIdx >= 0 ? activeTelemetry[existingIdx].vehicleId : vehicleId,
        plateNumber: packet.plateNumber || (existingIdx >= 0 ? activeTelemetry[existingIdx].plateNumber : 'FLEET-VEHICLE'),
        driverName: packet.driverName || (existingIdx >= 0 ? activeTelemetry[existingIdx].driverName : 'Fleet Operator'),
        driverPhone: packet.driverPhone || (existingIdx >= 0 ? activeTelemetry[existingIdx].driverPhone : undefined),
        severity: packet.severity || (existingIdx >= 0 ? activeTelemetry[existingIdx].severity : 'GREEN'),
        lat: Number(Number(packet.lat).toFixed(6)),
        lng: Number(Number(packet.lng).toFixed(6)),
        speed: packet.speed !== undefined ? Number(packet.speed) : 35,
        heading: packet.heading !== undefined ? Number(packet.heading) : 90,
        altitude: packet.altitude !== undefined ? Number(packet.altitude) : 48,
        battery: packet.battery !== undefined ? Number(packet.battery) : 94,
        ignition: packet.ignition !== undefined ? Boolean(packet.ignition) : true,
        imei: packet.imei || (existingIdx >= 0 ? activeTelemetry[existingIdx].imei : undefined),
        accuracy: packet.accuracy !== undefined ? Number(packet.accuracy) : 2.5,
        source: packet.source || 'LIVE_DEVICE_GPS',
        timestamp: packet.timestamp || new Date().toISOString()
      };

      if (existingIdx >= 0) {
        activeTelemetry[existingIdx] = updatedPoint;
      } else {
        activeTelemetry.push(updatedPoint);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Live fleet telemetry packet ingested successfully',
      processed: packets.length,
      currentCount: activeTelemetry.length
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 400 }
    );
  }
}
