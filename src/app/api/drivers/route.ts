import { NextRequest, NextResponse } from 'next/server';
import { getDrivers, updateDriverBalance } from '@/lib/db';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const drivers = await getDrivers();
    return NextResponse.json({ success: true, drivers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('drivers')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, driver: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, deltaBalance, ...updates } = body;

    if (deltaBalance !== undefined && id) {
      const updated = await updateDriverBalance(id, Number(deltaBalance), body.reference);
      return NextResponse.json({ success: true, driver: updated });
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('drivers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, driver: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
