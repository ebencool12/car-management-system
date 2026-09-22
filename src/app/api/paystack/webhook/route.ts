import { NextResponse } from 'next/server';
import { verifyPaystackWebhookSignature } from '@/lib/paystack';
import { demoDrivers, demoSales, SalesRecord } from '@/lib/demo-data';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify cryptographic signature from Paystack
    const isValid = verifyPaystackWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid Paystack signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    if (event === 'charge.success') {
      const amountGhs = (data.amount || 0) / 100;
      const ref = data.reference;
      const metadata = data.metadata || {};
      const driverId = String(metadata.driverId || '1');
      const driverName = String(metadata.driverName || 'Kwame Asante');

      console.log(`[PAYSTACK WEBHOOK] charge.success: GHS ${amountGhs} for driver ${driverName} (${driverId}), Ref: ${ref}`);

      // 1. Update in-memory driver balance for active UI reactivity
      const driver = demoDrivers.find(d => d.id === driverId || d.name === driverName);
      if (driver) {
        driver.balance = Math.max(0, driver.balance - amountGhs);
      }

      // 2. Append new sales remittance entry to memory
      const newSale: SalesRecord = {
        id: `paystack-${ref || Date.now()}`,
        driverName: driver ? driver.name : driverName,
        weekLabel: '2026-W38',
        amount: amountGhs,
        paymentMethod: 'PAYSTACK' as any,
        status: 'VERIFIED',
        date: new Date().toISOString().split('T')[0]
      };
      demoSales.unshift(newSale);

      // 3. Persist transaction and balance directly into Prisma Database
      try {
        const dbDriver = await prisma.driver.findFirst({
          where: {
            OR: [
              { id: driverId },
              { name: { contains: driverName } },
            ]
          }
        });

        if (dbDriver) {
          const newDbBalance = Math.max(0, dbDriver.balance - amountGhs);
          await prisma.driver.update({
            where: { id: dbDriver.id },
            data: { balance: newDbBalance }
          });

          await prisma.salesRecord.create({
            data: {
              weekLabel: '2026-W38',
              amount: amountGhs,
              paymentMethod: 'PAYSTACK',
              momoReference: ref || `PAYSTACK-${Date.now()}`,
              confirmationStatus: 'VERIFIED',
              driverId: dbDriver.id,
            }
          });

          await prisma.ledgerEntry.create({
            data: {
              amount: amountGhs,
              direction: 'INFLOW',
              description: `Paystack Online Remittance (Ref: ${ref || 'N/A'})`,
              driverId: dbDriver.id,
            }
          });
        }
      } catch (dbErr) {
        console.warn('[PAYSTACK WEBHOOK] Database write skipped or warned:', dbErr);
      }

      return NextResponse.json({
        status: 'success',
        message: `Payment of GHS ${amountGhs} credited to driver ${driverName}`,
        reference: ref
      });
    }

    return NextResponse.json({ status: 'ignored', event });
  } catch (error: any) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
