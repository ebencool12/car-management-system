import { NextRequest, NextResponse } from 'next/server';
import { demoLocations } from '@/lib/demo-data';

interface TelemetryPoint {
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

// In-memory telemetry cache initialized with demo locations
const activeTelemetry: TelemetryPoint[] = demoLocations.map(loc => ({
  ...loc,
  speed: Math.floor(Math.random() * 45) + 20,
  heading: Math.floor(Math.random() * 360),
  altitude: 48,
  battery: 92,
  ignition: true,
  imei: `8650000${loc.vehicleId.replace(/\D/g, '').padStart(3, '0')}`
}));

export async function GET() {
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

    // Support single telemetry packet or array of packets from hardware GPS
    const packets = Array.isArray(body) ? body : [body];

    for (const packet of packets) {
      if (!packet.lat || !packet.lng) continue;

      const vehicleId = packet.vehicleId || `v-${packet.imei || 'unknown'}`;
      const existingIdx = activeTelemetry.findIndex(t => t.vehicleId === vehicleId || (packet.imei && t.imei === packet.imei));

      const updatedPoint: TelemetryPoint = {
        vehicleId: existingIdx >= 0 ? activeTelemetry[existingIdx].vehicleId : vehicleId,
        plateNumber: packet.plateNumber || (existingIdx >= 0 ? activeTelemetry[existingIdx].plateNumber : 'GPS-DEVICE'),
        driverName: packet.driverName || (existingIdx >= 0 ? activeTelemetry[existingIdx].driverName : 'Unassigned Driver'),
        severity: packet.severity || (existingIdx >= 0 ? activeTelemetry[existingIdx].severity : 'GREEN'),
        lat: Number(packet.lat),
        lng: Number(packet.lng),
        speed: packet.speed !== undefined ? Number(packet.speed) : 0,
        heading: packet.heading !== undefined ? Number(packet.heading) : 0,
        altitude: packet.altitude !== undefined ? Number(packet.altitude) : 45,
        battery: packet.battery !== undefined ? Number(packet.battery) : 95,
        ignition: packet.ignition !== undefined ? Boolean(packet.ignition) : true,
        imei: packet.imei || (existingIdx >= 0 ? activeTelemetry[existingIdx].imei : undefined),
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
      message: 'Telemetry received successfully',
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
