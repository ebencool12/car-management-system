'use client';

import { useEffect, useRef } from 'react';

interface UseDriverLocationOptions {
  driverId: string;
  driverName?: string;
  plateNumber?: string;
  enabled?: boolean;
}

export function useDriverLocation({
  driverId,
  driverName,
  plateNumber,
  enabled = true,
}: UseDriverLocationOptions) {
  const lastPingRef = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !navigator.geolocation) {
      return;
    }

    const sendTelemetry = async (pos: GeolocationPosition) => {
      const now = Date.now();
      // Rate-limit pings to at most once every 15 seconds
      if (now - lastPingRef.current < 15000) return;
      lastPingRef.current = now;

      try {
        await fetch('/api/gps/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            driverId,
            driverName: driverName || 'Driver',
            plateNumber: plateNumber || 'FLEET',
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            speed: pos.coords.speed !== null ? Math.round(pos.coords.speed * 3.6) : 0, // convert m/s to km/h
            heading: pos.coords.heading || 0,
            accuracy: pos.coords.accuracy || 5,
            source: 'LIVE_DEVICE_GPS',
          }),
        });
      } catch (err) {
        console.warn('Driver telemetry sync error:', err);
      }
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      sendTelemetry,
      (err) => {
        console.warn('Geolocation watchPosition error:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 20000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [driverId, driverName, plateNumber, enabled]);
}
