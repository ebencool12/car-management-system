-- ============================================================
-- BYT FLEET MANAGEMENT PLATFORM — ENTERPRISE DATABASE SCHEMA
-- Target: Supabase (PostgreSQL 15+)
-- Safe to re-run multiple times (Idempotent)
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. VEHICLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    plate_number TEXT NOT NULL UNIQUE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INT NOT NULL,
    severity_status TEXT NOT NULL DEFAULT 'GREEN' CHECK (severity_status IN ('RED', 'YELLOW', 'GREEN')),
    gps_device_id TEXT,
    assigned_driver_id TEXT,
    assigned_driver_name TEXT,
    images TEXT[] DEFAULT '{}',
    mileage NUMERIC DEFAULT 0,
    last_service_date TIMESTAMPTZ,
    next_service_due TIMESTAMPTZ,
    next_service_mileage NUMERIC,
    fuel_type TEXT DEFAULT 'PETROL' CHECK (fuel_type IN ('PETROL', 'DIESEL', 'HYBRID')),
    insurance_expiry TIMESTAMPTZ,
    condition_log JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. DRIVERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.drivers (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING', 'REMOVED')),
    operational_status TEXT DEFAULT 'ACTIVE' CHECK (operational_status IN ('ACTIVE', 'ON_TRIP', 'MAINTENANCE', 'OFFLINE', 'ON_LEAVE')),
    balance NUMERIC DEFAULT 0,
    profile_picture TEXT,
    driver_score NUMERIC DEFAULT 85,
    trips_completed INT DEFAULT 0,
    on_time_rate NUMERIC DEFAULT 95,
    total_earnings NUMERIC DEFAULT 0,
    harsh_braking_count INT DEFAULT 0,
    speeding_events INT DEFAULT 0,
    idling_minutes INT DEFAULT 0,
    daily_target NUMERIC DEFAULT 150,
    weekly_target NUMERIC DEFAULT 900,
    leave_reason TEXT,
    leave_start_date TIMESTAMPTZ,
    leave_end_date TIMESTAMPTZ,
    assigned_vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE SET NULL,
    auth_user_id UUID,
    password_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Circular foreign key from vehicles to drivers
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_vehicles_assigned_driver'
    ) THEN
        ALTER TABLE public.vehicles
        ADD CONSTRAINT fk_vehicles_assigned_driver
        FOREIGN KEY (assigned_driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================================
-- 3. APPLICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    reason TEXT,
    license_number TEXT,
    ghana_card_number TEXT,
    experience_years INT DEFAULT 1,
    vehicle_preference TEXT,
    license_doc_url TEXT,
    ghana_card_url TEXT,
    selfie_url TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_driver_id TEXT REFERENCES public.drivers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. SALES RECORDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sales_records (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    driver_id TEXT NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
    driver_name TEXT,
    amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'ONLINE',
    momo_reference TEXT,
    paystack_reference TEXT,
    confirmation_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (confirmation_status IN ('PENDING', 'CONFIRMED', 'DISPUTED')),
    week_label TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. LEDGER ENTRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ledger_entries (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    driver_id TEXT NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('CREDIT', 'DEBIT')),
    description TEXT NOT NULL,
    reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. LOCATION PINGS (LIVE GPS TELEMETRY)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.location_pings (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    driver_id TEXT NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
    vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE SET NULL,
    driver_name TEXT,
    plate_number TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    speed NUMERIC,
    heading NUMERIC,
    accuracy NUMERIC,
    battery NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_location_pings_driver_created ON public.location_pings(driver_id, created_at DESC);

-- ============================================================
-- 7. CHAT CONVERSATIONS & MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    driver_id TEXT NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE UNIQUE,
    driver_name TEXT NOT NULL,
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    unread_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    conversation_id TEXT NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_name TEXT,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('admin', 'driver')),
    content TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conv_created ON public.chat_messages(conversation_id, created_at ASC);

-- ============================================================
-- 8. DRIVER REPORTS (INCIDENTS / ABSENCE)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.driver_reports (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    driver_id TEXT NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
    driver_name TEXT NOT NULL,
    vehicle_plate TEXT,
    type TEXT NOT NULL CHECK (type IN ('ISSUE', 'ABSENCE')),
    description TEXT NOT NULL,
    suggested_severity TEXT DEFAULT 'GREEN',
    media_url TEXT,
    media_type TEXT,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'ACKNOWLEDGED', 'RESOLVED')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. PARTS EXCHANGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.parts_exchanges (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    driver_id TEXT NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
    driver_name TEXT NOT NULL,
    vehicle_plate TEXT NOT NULL,
    part_name TEXT NOT NULL,
    cost NUMERIC NOT NULL DEFAULT 0,
    date TIMESTAMPTZ DEFAULT NOW(),
    photo_url TEXT,
    receipt_url TEXT,
    doc_url TEXT,
    notes TEXT,
    reimbursement_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (reimbursement_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    inventory_deducted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. MAINTENANCE SCHEDULES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.maintenance_schedules (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    vehicle_id TEXT NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    vehicle_plate TEXT NOT NULL,
    driver_name TEXT,
    service_type TEXT NOT NULL,
    due_mileage NUMERIC,
    current_mileage NUMERIC,
    due_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'OVERDUE', 'COMPLETED')),
    cost NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. ENABLE REALTIME (SAFELY CHECK BEFORE ADDING)
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'location_pings'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.location_pings;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'sales_records'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_records;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'chat_conversations'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
    END IF;
END $$;

-- ============================================================
-- 12. STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('driver-selfies', 'driver-selfies', true),
    ('documents', 'documents', true),
    ('fleet-images', 'fleet-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage public policies (safely drop before create)
DROP POLICY IF EXISTS "Public Access to Driver Selfies" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload to Driver Selfies" ON storage.objects;
CREATE POLICY "Public Access to Driver Selfies" ON storage.objects
    FOR SELECT USING (bucket_id = 'driver-selfies');
CREATE POLICY "Public Upload to Driver Selfies" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'driver-selfies');

DROP POLICY IF EXISTS "Public Access to Documents" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload to Documents" ON storage.objects;
CREATE POLICY "Public Access to Documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Public Upload to Documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Public Access to Fleet Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload to Fleet Images" ON storage.objects;
CREATE POLICY "Public Access to Fleet Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'fleet-images');
CREATE POLICY "Public Upload to Fleet Images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'fleet-images');

-- ============================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;

-- Allow read/write for all users (service role, anon, auth users) safely
DROP POLICY IF EXISTS "Full access to vehicles" ON public.vehicles;
CREATE POLICY "Full access to vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to drivers" ON public.drivers;
CREATE POLICY "Full access to drivers" ON public.drivers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to applications" ON public.applications;
CREATE POLICY "Full access to applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to sales_records" ON public.sales_records;
CREATE POLICY "Full access to sales_records" ON public.sales_records FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to ledger_entries" ON public.ledger_entries;
CREATE POLICY "Full access to ledger_entries" ON public.ledger_entries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to location_pings" ON public.location_pings;
CREATE POLICY "Full access to location_pings" ON public.location_pings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to chat_conversations" ON public.chat_conversations;
CREATE POLICY "Full access to chat_conversations" ON public.chat_conversations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to chat_messages" ON public.chat_messages;
CREATE POLICY "Full access to chat_messages" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to driver_reports" ON public.driver_reports;
CREATE POLICY "Full access to driver_reports" ON public.driver_reports FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to parts_exchanges" ON public.parts_exchanges;
CREATE POLICY "Full access to parts_exchanges" ON public.parts_exchanges FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Full access to maintenance_schedules" ON public.maintenance_schedules;
CREATE POLICY "Full access to maintenance_schedules" ON public.maintenance_schedules FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 14. SEED DATA (FLEET VEHICLES + DRIVERS)
-- ============================================================
INSERT INTO public.vehicles (id, plate_number, make, model, year, severity_status, gps_device_id, mileage, fuel_type, images)
VALUES
    ('v1', 'GN-4521-20', 'Toyota', 'Corolla', 2020, 'GREEN', 'GPS-001', 45200, 'PETROL', ARRAY['https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&auto=format&fit=crop']),
    ('v2', 'GS-8834-21', 'Hyundai', 'Elantra', 2021, 'GREEN', 'GPS-002', 38400, 'PETROL', ARRAY['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop']),
    ('v3', 'GT-1209-19', 'Honda', 'Civic', 2019, 'YELLOW', 'GPS-003', 62100, 'PETROL', ARRAY['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop']),
    ('v4', 'GE-7743-22', 'Kia', 'Forte', 2022, 'GREEN', 'GPS-004', 21500, 'PETROL', ARRAY['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop']),
    ('v5', 'GW-3312-18', 'Nissan', 'Sentra', 2018, 'RED', 'GPS-005', 89000, 'PETROL', ARRAY['https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop']),
    ('v6', 'GR-5561-23', 'Toyota', 'Yaris', 2023, 'GREEN', 'GPS-006', 12300, 'HYBRID', ARRAY['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop']),
    ('v7', 'GX-9023-20', 'Suzuki', 'Dzire', 2020, 'YELLOW', 'GPS-007', 53800, 'PETROL', ARRAY['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop']),
    ('v8', 'GA-1144-21', 'Hyundai', 'Accent', 2021, 'GREEN', 'GPS-008', 34200, 'PETROL', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop']),
    ('v9', 'GB-6678-22', 'Toyota', 'Vitz', 2022, 'GREEN', 'GPS-009', 19800, 'HYBRID', ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop']),
    ('v10', 'GC-2290-19', 'Chevrolet', 'Cruze', 2019, 'GREEN', 'GPS-010', 71400, 'PETROL', ARRAY['https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop']),
    ('v11', 'GD-8812-23', 'Volkswagen', 'Polo', 2023, 'GREEN', 'GPS-011', 8900, 'PETROL', ARRAY['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.drivers (id, name, phone, email, status, operational_status, balance, profile_picture, driver_score, trips_completed, on_time_rate, total_earnings, assigned_vehicle_id)
VALUES
    ('d1', 'Kwame Mensah', '+233 24 123 4567', 'kwame.mensah@gmail.com', 'ACTIVE', 'ON_TRIP', 450.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop', 94, 342, 97, 8550.00, 'v1'),
    ('d2', 'Kofi Annan Jr.', '+233 20 234 5678', 'kofi.annan@gmail.com', 'ACTIVE', 'ACTIVE', -120.00, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop', 88, 289, 93, 7225.00, 'v2'),
    ('d3', 'Yaw Boateng', '+233 27 345 6789', 'yaw.boateng@gmail.com', 'ACTIVE', 'ON_TRIP', 300.00, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop', 91, 315, 96, 7875.00, 'v3'),
    ('d4', 'Emmanuel Osei', '+233 26 456 7890', 'emmanuel.osei@gmail.com', 'ACTIVE', 'MAINTENANCE', 0.00, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop', 82, 198, 89, 4950.00, 'v4'),
    ('d5', 'Samuel Appiah', '+233 24 567 8901', 'samuel.appiah@gmail.com', 'ACTIVE', 'ACTIVE', -350.00, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop', 76, 156, 85, 3900.00, 'v5'),
    ('d6', 'Isaac Tetteh', '+233 50 678 9012', 'isaac.tetteh@gmail.com', 'ACTIVE', 'ON_LEAVE', 620.00, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop', 96, 412, 98, 10300.00, 'v6'),
    ('d7', 'Francis Addo', '+233 23 789 0123', 'francis.addo@gmail.com', 'ACTIVE', 'ON_TRIP', 180.00, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop', 89, 267, 94, 6675.00, 'v7'),
    ('d8', 'Daniel Kwarteng', '+233 24 890 1234', 'daniel.kwarteng@gmail.com', 'ACTIVE', 'ACTIVE', 50.00, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop', 85, 223, 91, 5575.00, 'v8'),
    ('d9', 'Joseph Mensah', '+233 20 901 2345', 'joseph.mensah@gmail.com', 'ACTIVE', 'OFFLINE', -80.00, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop', 79, 178, 88, 4450.00, 'v9')
ON CONFLICT (id) DO NOTHING;

-- Link vehicles to drivers
UPDATE public.vehicles SET assigned_driver_id = 'd1', assigned_driver_name = 'Kwame Mensah' WHERE id = 'v1';
UPDATE public.vehicles SET assigned_driver_id = 'd2', assigned_driver_name = 'Kofi Annan Jr.' WHERE id = 'v2';
UPDATE public.vehicles SET assigned_driver_id = 'd3', assigned_driver_name = 'Yaw Boateng' WHERE id = 'v3';
UPDATE public.vehicles SET assigned_driver_id = 'd4', assigned_driver_name = 'Emmanuel Osei' WHERE id = 'v4';
UPDATE public.vehicles SET assigned_driver_id = 'd5', assigned_driver_name = 'Samuel Appiah' WHERE id = 'v5';
UPDATE public.vehicles SET assigned_driver_id = 'd6', assigned_driver_name = 'Isaac Tetteh' WHERE id = 'v6';
UPDATE public.vehicles SET assigned_driver_id = 'd7', assigned_driver_name = 'Francis Addo' WHERE id = 'v7';
UPDATE public.vehicles SET assigned_driver_id = 'd8', assigned_driver_name = 'Daniel Kwarteng' WHERE id = 'v8';
UPDATE public.vehicles SET assigned_driver_id = 'd9', assigned_driver_name = 'Joseph Mensah' WHERE id = 'v9';

-- Seed Chat Conversations
INSERT INTO public.chat_conversations (id, driver_id, driver_name, last_message, last_message_at, unread_count)
VALUES
    ('c1', 'd1', 'Kwame Mensah', 'All set for today’s shift, vehicle inspected.', NOW() - INTERVAL '15 minutes', 0),
    ('c2', 'd2', 'Kofi Annan Jr.', 'Remittance of GHS 450 sent via MoMo.', NOW() - INTERVAL '45 minutes', 1),
    ('c3', 'd3', 'Yaw Boateng', 'Oil change needed before Friday.', NOW() - INTERVAL '2 hours', 0),
    ('c4', 'd4', 'Emmanuel Osei', 'Tire pressure sensor light came on.', NOW() - INTERVAL '4 hours', 2)
ON CONFLICT (id) DO NOTHING;

-- Seed Chat Messages
INSERT INTO public.chat_messages (id, conversation_id, sender_id, sender_name, sender_type, content, is_read, created_at)
VALUES
    ('m1', 'c1', 'd1', 'Kwame Mensah', 'driver', 'Good morning admin, heading to Circle terminal now.', true, NOW() - INTERVAL '30 minutes'),
    ('m2', 'c1', 'admin', 'BYT Admin', 'admin', 'Noted Kwame, have a safe trip. Drive safely!', true, NOW() - INTERVAL '25 minutes'),
    ('m3', 'c1', 'd1', 'Kwame Mensah', 'driver', 'All set for today’s shift, vehicle inspected.', true, NOW() - INTERVAL '15 minutes'),
    ('m4', 'c2', 'd2', 'Kofi Annan Jr.', 'driver', 'Remittance of GHS 450 sent via MoMo.', false, NOW() - INTERVAL '45 minutes')
ON CONFLICT (id) DO NOTHING;
