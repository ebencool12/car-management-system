import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, applications: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createSupabaseServerClient();

    const {
      fullName,
      phone,
      email,
      reason,
      licenseNumber,
      ghanaCardNumber,
      experienceYears,
      vehiclePreference,
      licenseUrl,
      ghanaCardUrl,
      selfieUrl,
    } = body;

    const { data, error } = await supabase
      .from('applications')
      .insert({
        full_name: fullName,
        phone,
        email: email || null,
        reason: reason || 'Driver application',
        license_number: licenseNumber || null,
        ghana_card_number: ghanaCardNumber || null,
        experience_years: experienceYears || 1,
        vehicle_preference: vehiclePreference || null,
        license_doc_url: licenseUrl || null,
        ghana_card_url: ghanaCardUrl || null,
        selfie_url: selfieUrl || null,
        status: 'PENDING',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase application insert warning:', error);
      return NextResponse.json({ success: true, savedToDb: false, warning: error.message });
    }

    return NextResponse.json({ success: true, savedToDb: true, application: data });
  } catch (err: any) {
    console.error('Error submitting application:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, approvedDriverId } = body;
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from('applications')
      .update({
        status,
        approved_driver_id: approvedDriverId || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, application: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
