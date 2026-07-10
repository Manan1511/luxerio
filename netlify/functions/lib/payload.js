// Shared checkout payload validation + Razorpay-notes encode/decode.
// Notes constraints: ≤15 keys, ≤512 chars per value.

const REQUIRED_ADDRESS = ['firstName', 'lastName', 'address1', 'city', 'provinceCode', 'zip', 'phone'];

// RFC 5321 caps the full email path at 254 chars. Discount codes have no
// Shopify-documented max; 255 is a generous, safely-under-Razorpay's-512 cap.
const MAX_EMAIL_LEN = 254;
const MAX_DISCOUNT_CODE_LEN = 255;

export function validatePayload(body) {
  const { lines, email, address, discountCode, paymentMethod } = body ?? {};
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 50) return null;
  const seenVariants = new Set();
  for (const l of lines) {
    if (typeof l.variantId !== 'string' || !l.variantId.startsWith('gid://shopify/ProductVariant/')) return null;
    if (!Number.isInteger(l.quantity) || l.quantity < 1 || l.quantity > 99) return null;
    // Reject duplicate variant lines rather than relying on downstream merge
    // behavior — forces the client to send one line per variant with a summed
    // quantity, which is what the rest of this pipeline assumes.
    if (seenVariants.has(l.variantId)) return null;
    seenVariants.add(l.variantId);
  }
  if (typeof email !== 'string' || email.length > MAX_EMAIL_LEN || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return null;
  if (!address || REQUIRED_ADDRESS.some((k) => typeof address[k] !== 'string' || !address[k].trim())) return null;
  if (typeof discountCode === 'string' && discountCode.length > MAX_DISCOUNT_CODE_LEN) return null;
  // Absent means the pre-COD client shape — treat as full prepay. Any other
  // value must be exactly 'full' or 'cod'; never silently default an
  // unrecognized value to 'full' and charge more than the client asked for.
  const method = paymentMethod === undefined ? 'full' : paymentMethod;
  if (method !== 'full' && method !== 'cod') return null;
  return {
    lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
    email: email.trim(),
    address: {
      firstName: address.firstName.trim(), lastName: address.lastName.trim(),
      address1: address.address1.trim(), address2: (address.address2 || '').trim(),
      city: address.city.trim(), provinceCode: address.provinceCode.trim(),
      zip: address.zip.trim(), phone: address.phone.trim(),
    },
    discountCode: typeof discountCode === 'string' && discountCode.trim() ? discountCode.trim() : null,
    paymentMethod: method,
  };
}

// Compact: lines as "numericId:qty,numericId:qty"
export function encodeNotes(payload) {
  const items = payload.lines
    .map((l) => `${l.variantId.split('/').pop()}:${l.quantity}`)
    .join(',');
  const addr = JSON.stringify(payload.address);
  const notes = {
    items,
    // Defensive slicing even though validatePayload already caps these — this
    // function has one job (stay inside Razorpay's ≤512-chars-per-value limit)
    // and shouldn't rely on every caller having validated first.
    email: (payload.email || '').slice(0, 254),
    addr1: addr.slice(0, 500),
    addr2: addr.slice(500, 1000),
    code: (payload.discountCode || '').slice(0, 255),
    // Single-char so it never threatens the notes size limit. 'c' = cod,
    // 'f' = full. The webhook fallback path needs this to know whether an
    // order it's recovering was ever meant to be a partial charge.
    m: payload.paymentMethod === 'cod' ? 'c' : 'f',
  };
  if (items.length > 500 || addr.length > 1000) return { recovery: 'partial', email: payload.email };
  return notes;
}

export function decodeNotes(notes) {
  if (!notes || notes.recovery === 'partial' || !notes.items) return null;
  const lines = notes.items.split(',').map((pair) => {
    const [id, qty] = pair.split(':');
    return { variantId: `gid://shopify/ProductVariant/${id}`, quantity: parseInt(qty, 10) };
  });
  const address = JSON.parse((notes.addr1 || '') + (notes.addr2 || ''));
  return {
    lines,
    email: notes.email,
    address,
    discountCode: notes.code || null,
    // Orders created before this feature shipped have no 'm' key — treat
    // as full prepay, which is what they always were.
    paymentMethod: notes.m === 'c' ? 'cod' : 'full',
  };
}
