import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ── Browser Client (for client components) ──
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Server Client (for API routes / Server Actions — uses service role key) ──
let serverClient: SupabaseClient | null = null;

export function createSupabaseServerClient(): SupabaseClient {
  if (serverClient) return serverClient;
  serverClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  return serverClient;
}

// ── Database types (mirrors our Supabase schema) ──
export interface DbDriver {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  status: 'ACTIVE' | 'PENDING' | 'REMOVED';
  operational_status: 'ACTIVE' | 'ON_TRIP' | 'MAINTENANCE' | 'OFFLINE' | 'ON_LEAVE' | null;
  balance: number;
  profile_picture: string | null;
  driver_score: number | null;
  trips_completed: number | null;
  on_time_rate: number | null;
  total_earnings: number | null;
  harsh_braking_count: number | null;
  speeding_events: number | null;
  idling_minutes: number | null;
  daily_target: number | null;
  weekly_target: number | null;
  leave_reason: string | null;
  leave_start_date: string | null;
  leave_end_date: string | null;
  assigned_vehicle_id: string | null;
  auth_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbVehicle {
  id: string;
  plate_number: string;
  make: string;
  model: string;
  year: number;
  severity_status: 'RED' | 'YELLOW' | 'GREEN';
  gps_device_id: string | null;
  assigned_driver_id: string | null;
  assigned_driver_name: string | null;
  images: string[] | null;
  mileage: number | null;
  last_service_date: string | null;
  next_service_due: string | null;
  next_service_mileage: number | null;
  fuel_type: 'PETROL' | 'DIESEL' | 'HYBRID' | null;
  insurance_expiry: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbApplication {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  reason: string;
  license_doc_url: string | null;
  ghana_card_url: string | null;
  selfie_url: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
}

export interface DbChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'admin' | 'driver';
  content: string;
  media_url: string | null;
  media_type: string | null;
  is_read: boolean;
  created_at: string;
}

export interface DbChatConversation {
  id: string;
  driver_id: string;
  driver_name: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
}

export interface DbSalesRecord {
  id: string;
  driver_id: string;
  amount: number;
  payment_method: string;
  reference: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  week_label: string | null;
  paystack_reference: string | null;
  created_at: string;
}

export interface DbLocationPing {
  id: string;
  driver_id: string;
  vehicle_id: string | null;
  plate_number: string | null;
  driver_name: string | null;
  lat: number;
  lng: number;
  speed: number | null;
  heading: number | null;
  accuracy: number | null;
  battery: number | null;
  created_at: string;
}

export interface DbLedgerEntry {
  id: string;
  driver_id: string;
  amount: number;
  direction: 'CREDIT' | 'DEBIT';
  description: string;
  reference: string | null;
  created_at: string;
}

export interface DbMaintenanceSchedule {
  id: string;
  vehicle_id: string;
  vehicle_plate: string;
  driver_name: string | null;
  service_type: string;
  due_mileage: number | null;
  current_mileage: number | null;
  due_date: string | null;
  status: 'UPCOMING' | 'OVERDUE' | 'COMPLETED';
  cost: number | null;
  created_at: string;
}
