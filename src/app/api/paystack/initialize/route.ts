import { NextResponse } from 'next/server';
import { initializePaystackTransaction } from '@/lib/paystack';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, driverId, driverName, purpose, callbackUrl } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { status: false, message: 'Invalid payment amount specified.' },
        { status: 400 }
      );
    }

    const payerEmail = email || `${(driverName || 'driver').toLowerCase().replace(/\s+/g, '')}@byt.com`;

    const result = await initializePaystackTransaction({
      email: payerEmail,
      amountInGhs: parseFloat(amount),
      callbackUrl: callbackUrl || undefined,
      metadata: {
        driverId: driverId || '1',
        driverName: driverName || 'Kwame Asante',
        purpose: purpose || 'Daily Sales Remittance',
        system: 'BYT_FLEET_MANAGEMENT',
        timestamp: new Date().toISOString()
      },
      channels: body.channels || (body.channel === 'card' ? ['card'] : ['mobile_money', 'card'])
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Paystack initialization API route error:', error);
    return NextResponse.json(
      { status: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
