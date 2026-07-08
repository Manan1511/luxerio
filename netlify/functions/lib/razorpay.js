import crypto from 'node:crypto';

const RZP_BASE = 'https://api.razorpay.com/v1';

function authHeader() {
  const creds = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString('base64');
  return `Basic ${creds}`;
}

// `idempotencyKey`, when provided, stops a client retry/double-click from
// creating two Razorpay orders for the same checkout attempt (Razorpay returns
// the original order instead). It must be the SAME value across retries of one
// attempt and a NEW value for a genuinely new checkout — that requires the
// frontend to mint one key per attempt and resend it on retry, which is wired
// up in the /checkout page (later task), not here. Safe to omit for now: each
// call just creates a fresh order, same as today.
export async function createRazorpayOrder({ amountPaise, receipt, notes, idempotencyKey }) {
  const headers = { Authorization: authHeader(), 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['X-Razorpay-Idempotency-Key'] = idempotencyKey;
  const res = await fetch(`${RZP_BASE}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt, notes }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Razorpay order create failed: ${JSON.stringify(data.error ?? data)}`);
  return data; // { id, amount, currency, notes, ... }
}

export async function fetchRazorpayOrder(orderId) {
  const res = await fetch(`${RZP_BASE}/orders/${orderId}`, {
    headers: { Authorization: authHeader() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Razorpay order fetch failed: ${JSON.stringify(data.error ?? data)}`);
  return data;
}

// Checkout.js success payload signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  try {
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

// Webhook signature: HMAC_SHA256(rawBody, webhook_secret) in X-Razorpay-Signature
export function verifyWebhookSignature(rawBody, signature) {
  try {
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
