import { NextResponse } from 'next/server';
import { verifyPaystackTransaction, updateSimulatedTransactionStatus } from '@/lib/paystack';
import { demoDrivers, demoSales, SalesRecord } from '@/lib/demo-data';
import { prisma } from '@/lib/prisma';

// Keep track of verified references to prevent duplicate processing
const processedReferences = new Set<string>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reference, driverId, driverName, simulatedOutcome } = body;

    if (!reference) {
      return NextResponse.json(
        { status: false, verified: false, message: 'Transaction reference is required for verification.' },
        { status: 400 }
      );
    }

    // If sandbox simulation specifies an outcome (e.g. test button clicked 'decline' or 'success')
    if (simulatedOutcome && (simulatedOutcome === 'success' || simulatedOutcome === 'failed' || simulatedOutcome === 'abandoned')) {
      updateSimulatedTransactionStatus(reference, simulatedOutcome);
    }

    // Call Paystack verification (live Paystack API or simulated register)
    const verifyRes = await verifyPaystackTransaction(reference);

    // CRITICAL CHECK: Verify Paystack explicitly reports 'success'
    const isPaystackSuccess = verifyRes.status === true && verifyRes.data?.status === 'success';

    if (!isPaystackSuccess) {
      const failureReason = verifyRes.data?.status === 'failed'
        ? 'Payment was declined or failed (e.g. insufficient funds, incorrect PIN, or gateway decline).'
        : verifyRes.data?.status === 'abandoned'
        ? 'Payment session was closed or abandoned by customer before completing authorization.'
        : verifyRes.message || 'Payment not verified by Paystack.';

      return NextResponse.json({
        status: false,
        verified: false,
        paystackStatus: verifyRes.data?.status || 'failed',
        message: `Transaction Unsuccessful: ${failureReason} No funds were credited, and no balance has been deducted.`
      }, { status: 400 });
    }

    // Paystack confirmed SUCCESS!
    const data = verifyRes.data!;
    const amountGhs = (data.amount || 0) / 100;
    const targetDriverId = driverId || data.metadata?.driverId || '1';
    const targetDriverName = driverName || data.metadata?.driverName || 'Kwame Asante';

    // Prevent double crediting for the same reference
    if (!processedReferences.has(reference)) {
      processedReferences.add(reference);

      // Deduct balance from driver
      const driver = demoDrivers.find(d => d.id === targetDriverId || d.name === targetDriverName);
      if (driver) {
        driver.balance = Math.max(0, driver.balance - amountGhs);
      }

      // Add verified record to sales ledger
      const newSale: SalesRecord = {
        id: `paystack-${reference}`,
        driverName: driver ? driver.name : targetDriverName,
        weekLabel: '2026-W38',
        amount: amountGhs,
        paymentMethod: `PAYSTACK (${data.channel?.toUpperCase() || 'ONLINE'})`,
        status: 'VERIFIED',
        momoReference: reference,
        date: new Date().toISOString().split('T')[0]
      };
      demoSales.unshift(newSale);

      // Persist to Prisma Database
      try {
        const dbDriver = await prisma.driver.findFirst({
          where: {
            OR: [
              { id: targetDriverId },
              { name: { contains: targetDriverName } },
            ]
          }
        });

        if (dbDriver) {
          const newBalance = Math.max(0, dbDriver.balance - amountGhs);
          await prisma.driver.update({
            where: { id: dbDriver.id },
            data: { balance: newBalance }
          });

          await prisma.salesRecord.create({
            data: {
              weekLabel: '2026-W38',
              amount: amountGhs,
              paymentMethod: `PAYSTACK_${data.channel?.toUpperCase() || 'ONLINE'}`,
              momoReference: reference,
              confirmationStatus: 'VERIFIED',
              driverId: dbDriver.id,
            }
          });

          await prisma.ledgerEntry.create({
            data: {
              amount: amountGhs,
              direction: 'INFLOW',
              description: `Paystack Verified Remittance (Ref: ${reference})`,
              driverId: dbDriver.id,
            }
          });
        }
      } catch (dbErr) {
        console.warn('[PAYSTACK VERIFY] Database write skipped or warned:', dbErr);
      }
    }

    return NextResponse.json({
      status: true,
      verified: true,
      paystackStatus: 'success',
      amount: amountGhs,
      reference: data.reference,
      paidAt: data.paid_at,
      channel: data.channel,
      customer: data.customer,
      message: `Transaction of GHS ${amountGhs.toFixed(2)} verified successfully via Paystack!`
    });
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    return NextResponse.json(
      { status: false, verified: false, message: error.message || 'Verification endpoint failed.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  if (!reference) {
    return NextResponse.json({ status: false, verified: false, message: 'Missing reference parameter.' }, { status: 400 });
  }

  const verifyRes = await verifyPaystackTransaction(reference);
  const isPaystackSuccess = verifyRes.status === true && verifyRes.data?.status === 'success';

  return NextResponse.json({
    status: isPaystackSuccess,
    verified: isPaystackSuccess,
    paystackStatus: verifyRes.data?.status || 'unverified',
    data: verifyRes.data
  });
}
