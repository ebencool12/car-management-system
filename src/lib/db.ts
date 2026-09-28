import { createSupabaseServerClient, DbDriver, DbVehicle, DbApplication, DbChatMessage, DbChatConversation, DbSalesRecord, DbLocationPing } from './supabase';
import { demoDrivers, demoVehicles } from './demo-data';

// Helper to check if Supabase query succeeded or if table needs initialization
export async function getDrivers(): Promise<DbDriver[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Return mapped initial drivers if DB is not populated yet
      return demoDrivers.map(d => ({
        id: d.id,
        name: d.name,
        phone: d.phone,
        email: d.email || null,
        status: d.status,
        operational_status: (d.operationalStatus as any) || 'ACTIVE',
        balance: d.balance,
        profile_picture: d.profilePicture || null,
        driver_score: d.driverScore || 85,
        trips_completed: d.tripsCompleted || 0,
        on_time_rate: d.onTimeRate || 95,
        total_earnings: d.totalEarnings || 0,
        harsh_braking_count: d.harshBrakingCount || 0,
        speeding_events: d.speedingEvents || 0,
        idling_minutes: d.idlingMinutes || 0,
        daily_target: d.dailyTarget || 150,
        weekly_target: d.weeklyTarget || 900,
        leave_reason: d.leaveReason || null,
        leave_start_date: d.leaveStartDate || null,
        leave_end_date: d.leaveEndDate || null,
        assigned_vehicle_id: d.vehicle?.id || null,
        auth_user_id: null,
        created_at: d.createdAt,
        updated_at: d.createdAt,
      }));
    }
    return data as DbDriver[];
  } catch (err) {
    console.error('getDrivers error:', err);
    return [];
  }
}

export async function getDriverById(id: string): Promise<DbDriver | null> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      const fallback = demoDrivers.find(d => d.id === id);
      if (!fallback) return null;
      return {
        id: fallback.id,
        name: fallback.name,
        phone: fallback.phone,
        email: fallback.email || null,
        status: fallback.status,
        operational_status: (fallback.operationalStatus as any) || 'ACTIVE',
        balance: fallback.balance,
        profile_picture: fallback.profilePicture || null,
        driver_score: fallback.driverScore || 85,
        trips_completed: fallback.tripsCompleted || 0,
        on_time_rate: fallback.onTimeRate || 95,
        total_earnings: fallback.totalEarnings || 0,
        harsh_braking_count: fallback.harshBrakingCount || 0,
        speeding_events: fallback.speedingEvents || 0,
        idling_minutes: fallback.idlingMinutes || 0,
        daily_target: fallback.dailyTarget || 150,
        weekly_target: fallback.weeklyTarget || 900,
        leave_reason: fallback.leaveReason || null,
        leave_start_date: fallback.leaveStartDate || null,
        leave_end_date: fallback.leaveEndDate || null,
        assigned_vehicle_id: fallback.vehicle?.id || null,
        auth_user_id: null,
        created_at: fallback.createdAt,
        updated_at: fallback.createdAt,
      };
    }
    return data as DbDriver;
  } catch (err) {
    console.error('getDriverById error:', err);
    return null;
  }
}

export async function updateDriverBalance(driverId: string, deltaAmount: number, reference?: string) {
  try {
    const supabase = createSupabaseServerClient();
    const current = await getDriverById(driverId);
    if (!current) return null;

    const newBalance = (Number(current.balance) || 0) + deltaAmount;

    // 1. Update driver balance
    const { data, error } = await supabase
      .from('drivers')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', driverId)
      .select()
      .single();

    // 2. Insert ledger entry
    await supabase.from('ledger_entries').insert({
      driver_id: driverId,
      amount: Math.abs(deltaAmount),
      direction: deltaAmount >= 0 ? 'CREDIT' : 'DEBIT',
      description: reference ? `Payment Ref: ${reference}` : 'Account adjustment',
      reference: reference || null,
      created_at: new Date().toISOString(),
    });

    return data || { ...current, balance: newBalance };
  } catch (err) {
    console.error('updateDriverBalance error:', err);
    return null;
  }
}

export async function getVehicles(): Promise<DbVehicle[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('plate_number', { ascending: true });

    if (error || !data || data.length === 0) {
      return demoVehicles.map(v => ({
        id: v.id,
        plate_number: v.plateNumber,
        make: v.make,
        model: v.model,
        year: v.year,
        severity_status: v.severityStatus,
        gps_device_id: v.gpsDeviceId || null,
        assigned_driver_id: v.assignedDriver || null,
        assigned_driver_name: v.assignedDriverName || null,
        images: v.images || [],
        mileage: v.mileage || 0,
        last_service_date: v.lastServiceDate || null,
        next_service_due: v.nextServiceDue || null,
        next_service_mileage: v.nextServiceMileage || null,
        fuel_type: v.fuelType || 'PETROL',
        insurance_expiry: v.insuranceExpiry || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
    }
    return data as DbVehicle[];
  } catch (err) {
    console.error('getVehicles error:', err);
    return [];
  }
}

export async function saveLocationPing(ping: {
  driver_id: string;
  vehicle_id?: string | null;
  driver_name?: string | null;
  plate_number?: string | null;
  lat: number;
  lng: number;
  speed?: number | null;
  heading?: number | null;
  accuracy?: number | null;
  battery?: number | null;
}) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('location_pings')
      .insert({
        ...ping,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { data, error };
  } catch (err) {
    console.error('saveLocationPing error:', err);
    return { data: null, error: err };
  }
}

export async function getLatestFleetLocations(): Promise<DbLocationPing[]> {
  try {
    const supabase = createSupabaseServerClient();
    // Fetch recent pings from the last 2 hours
    const { data, error } = await supabase
      .from('location_pings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) return [];
    
    // Group by driver_id and keep only the newest ping for each driver
    const latestMap = new Map<string, DbLocationPing>();
    for (const p of data as DbLocationPing[]) {
      if (!latestMap.has(p.driver_id)) {
        latestMap.set(p.driver_id, p);
      }
    }
    return Array.from(latestMap.values());
  } catch (err) {
    console.error('getLatestFleetLocations error:', err);
    return [];
  }
}

export async function getChatMessages(conversationId: string): Promise<DbChatMessage[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];
    return data as DbChatMessage[];
  } catch (err) {
    console.error('getChatMessages error:', err);
    return [];
  }
}

export async function sendChatMessage(msg: {
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  sender_type: 'admin' | 'driver';
  content: string;
  media_url?: string | null;
  media_type?: string | null;
}) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: msg.conversation_id,
        sender_id: msg.sender_id,
        sender_name: msg.sender_name || null,
        sender_type: msg.sender_type,
        content: msg.content,
        media_url: msg.media_url || null,
        media_type: msg.media_type || null,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    // Update conversation last message
    await supabase
      .from('chat_conversations')
      .update({
        last_message: msg.content,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', msg.conversation_id);

    return { data, error };
  } catch (err) {
    console.error('sendChatMessage error:', err);
    return { data: null, error: err };
  }
}
