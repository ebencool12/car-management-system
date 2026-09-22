import crypto from 'crypto';

export interface PaystackInitParams {
  email: string;
  amountInGhs: number; // in GHS (e.g. 100.50)
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  channels?: ('card' | 'mobile_money' | 'bank' | 'qr')[];
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    domain: string;
    status: 'success' | 'failed' | 'abandoned';
    reference: string;
    amount: number; // in pesewas
    currency: string;
    channel: string;
    paid_at: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
      phone?: string;
    };
    metadata?: Record<string, unknown>;
  };
}

interface SimulatedTx {
  reference: string;
  status: 'pending' | 'success' | 'failed' | 'abandoned';
  amountInGhs: number;
  email: string;
  channel: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  paidAt?: string;
}

// Global in-memory storage for sandbox simulations
const globalSimulatedTxs = new Map<string, SimulatedTx>();

export function recordSimulatedTransaction(tx: SimulatedTx) {
  globalSimulatedTxs.set(tx.reference, tx);
}

export function updateSimulatedTransactionStatus(
  reference: string,
  status: 'success' | 'failed' | 'abandoned'
) {
  const tx = globalSimulatedTxs.get(reference);
  if (tx) {
    tx.status = status;
    if (status === 'success') {
      tx.paidAt = new Date().toISOString();
    }
    globalSimulatedTxs.set(reference, tx);
  }
}

export function getPaystackSecretKey(): string {
  if (typeof process !== 'undefined' && process.env.PAYSTACK_SECRET_KEY) {
    return process.env.PAYSTACK_SECRET_KEY.trim();
  }
  return '';
}

export function getPaystackPublicKey(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
    return process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.trim();
  }
  return '';
}

/**
 * Initializes a transaction with Paystack API.
 * Converts amount from GHS to pesewas (x100).
 */
export async function initializePaystackTransaction(
  params: PaystackInitParams
): Promise<PaystackInitResponse> {
  const secretKey = getPaystackSecretKey();
  const ref = params.reference || `byt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const amountInPesewas = Math.round(params.amountInGhs * 100);

  // If no secret key is configured, register as pending simulation
  if (!secretKey) {
    recordSimulatedTransaction({
      reference: ref,
      status: 'pending',
      amountInGhs: params.amountInGhs,
      email: params.email,
      channel: 'mobile_money',
      metadata: params.metadata,
      createdAt: new Date().toISOString()
    });

    return {
      status: true,
      message: 'Paystack Checkout Initialized (Sandbox Simulation Mode)',
      data: {
        authorization_url: `/driver?simulated_paystack=true&ref=${encodeURIComponent(ref)}&amt=${params.amountInGhs}&drv=${encodeURIComponent(String(params.metadata?.driverId ?? '1'))}`,
        access_code: `mock-acc-${ref}`,
        reference: ref
      }
    };
  }

  try {
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: params.email,
        amount: amountInPesewas,
        currency: 'GHS',
        reference: ref,
        callback_url: params.callbackUrl,
        metadata: params.metadata || {},
        channels: params.channels || ['card', 'mobile_money']
      })
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Paystack initialization error:', err);
    return {
      status: false,
      message: err instanceof Error ? err.message : 'Failed to initialize Paystack transaction'
    };
  }
}

/**
 * Verifies transaction reference with Paystack API.
 * Returns authoritative status from Paystack.
 */
export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  const secretKey = getPaystackSecretKey();

  // If running in sandbox simulator mode (no live secret key configured)
  if (!secretKey || reference.startsWith('sim-') || globalSimulatedTxs.has(reference)) {
    const sim = globalSimulatedTxs.get(reference);

    if (!sim) {
      return {
        status: false,
        message: 'Transaction reference not found on Paystack or simulation register'
      };
    }

    if (sim.status !== 'success') {
      return {
        status: true,
        message: `Transaction was not successful (Paystack Status: ${sim.status})`,
        data: {
          id: 999999,
          domain: 'test',
          status: sim.status as 'failed' | 'abandoned',
          reference,
          amount: Math.round(sim.amountInGhs * 100),
          currency: 'GHS',
          channel: sim.channel,
          paid_at: '',
          customer: {
            id: 1,
            email: sim.email,
            customer_code: 'CUS_MOCK123'
          },
          metadata: sim.metadata
        }
      };
    }

    return {
      status: true,
      message: 'Transaction verified successfully via Paystack',
      data: {
        id: 999999,
        domain: 'test',
        status: 'success',
        reference,
        amount: Math.round(sim.amountInGhs * 100),
        currency: 'GHS',
        channel: sim.channel,
        paid_at: sim.paidAt || new Date().toISOString(),
        customer: {
          id: 1,
          email: sim.email,
          customer_code: 'CUS_MOCK123'
        },
        metadata: sim.metadata
      }
    };
  }

  // Real Paystack API call
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Paystack verification error:', err);
    return {
      status: false,
      message: err instanceof Error ? err.message : 'Failed to verify Paystack transaction'
    };
  }
}

/**
 * Validates Paystack Webhook HMAC SHA512 signature.
 */
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signature: string | null | undefined
): boolean {
  const secretKey = getPaystackSecretKey();
  if (!secretKey) {
    return true; // dev sandbox mode
  }
  if (!signature) return false;

  try {
    const hash = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');
    return hash === signature;
  } catch (err) {
    console.error('Webhook signature validation error:', err);
    return false;
  }
}
