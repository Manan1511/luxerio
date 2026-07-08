import crypto from 'node:crypto';

const RZP_BASE = 'https://api.razorpay.com/v1';

function authHeader() {
  const creds = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString('base64');
  return `Basic ${creds}`;
}

export async function createRazorpayOrder({ amountPaise, receipt, notes }) {
  const res = await fetch(`${RZP_BASE}/orders`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
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
