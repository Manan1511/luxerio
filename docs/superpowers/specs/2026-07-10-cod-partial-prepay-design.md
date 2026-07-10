# Cash on Delivery with Partial Prepayment — Design

## Problem

The current checkout only supports paying the full order total upfront via
Razorpay. We want a Cash on Delivery option too, but a pure-COD flow (₹0
upfront) has a well-known abandonment/no-show problem for D2C brands in
India. The mitigation is a small non-refundable advance charged online, with
the remainder collected as cash at delivery.

Razorpay cannot process the COD leg itself — that's literal cash handed to a
courier, outside any gateway. The advance is a normal Razorpay charge; "the
rest is COD" is purely data attached to the Shopify order for fulfillment
staff to act on.

## Advance tiers

Computed by `create-payment` from the server-side re-priced total
(post-discount, the same authoritative total `priceCart` already produces) —
never from the client-displayed subtotal, so a discount code can't be used
to dodge the tier:

- Total < ₹1000 → ₹200 advance
- Total ≥ ₹1000 → ₹300 advance (exactly ₹1000 pays ₹300)

No eligibility restrictions (PIN code, product type, cart contents) and no
cap on balance size — a ₹50,000 order still only needs ₹300 upfront.

## Single source of truth for the advance

The tier is computed **once**, in `create-payment`, and baked into the
Razorpay order amount. Every later step derives the advance from **what was
actually charged**, never by re-running the tier logic:

- `confirm-order` fetches the Razorpay order (`fetchRazorpayOrder`, already
  exists) and reads its `amount` — that is the advance in paise.
- `razorpay-webhook` reads `payment.entity.amount` from the event payload.

Balance recorded on the Shopify order = re-priced total − actually-charged
advance. This makes the recorded balance immune to tier drift: if a price or
discount changes between charge and a delayed webhook retry, the balance
stays consistent with the money that actually moved. (For `'full'` orders
the charged amount equals the total and the balance is 0 — same code path.)

## UI (`src/pages/Checkout.jsx`)

A payment-method toggle above the Pay button: **Pay in Full** (existing
behavior, default) vs **Cash on Delivery**. Selecting COD updates the order
summary to show:

- Advance to pay now: ₹200 / ₹300 — labelled as an estimate, computed
  client-side from the displayed subtotal for immediate feedback
- Balance due on delivery: ₹(total − advance)

The estimate can differ from the actual charge in one case: a discount code
that moves the total across the ₹1000 boundary (e.g. ₹1050 cart with ₹100
off → server charges ₹200, client estimated ₹300). The Razorpay modal always
shows the real amount before the customer pays, and the summary re-renders
from the `create-payment` response (`advancePaise`, `codBalance`) once it
arrives, so the customer never pays an amount they haven't seen.

The Razorpay Checkout.js modal flow is otherwise unchanged — it just charges
a smaller amount for COD orders.

## `create-payment` function

Request payload gains `paymentMethod`:

- absent → `'full'` (backward compatible with in-flight sessions)
- `'full'` or `'cod'` → as given
- any other value → 400, same as other payload validation failures. Never
  silently fall back to charging the full amount when the client asked for
  something unrecognized.

After `priceCart` computes the authoritative `total`: `'full'` charges
`total`; `'cod'` computes the tier and charges only the advance.

Response gains `advancePaise` and `codBalance` (rupees; 0 for `'full'`) so
the frontend can re-render the summary from authoritative numbers.

**Idempotency note:** the existing `attemptId` hook is not yet sent by the
frontend. If it ever is, the key must incorporate the payment method (or be
re-minted when the method toggles) — otherwise switching Full → COD and
retrying would make Razorpay return the original full-amount order.

## `confirm-order` function

After signature verification and re-pricing, fetches the Razorpay order to
get the charged amount, computes `codBalance = total − charged`, and passes
it to `createPaidOrder`. Passes `codBalance` through to its 200 response so
the frontend can surface it on the confirmation page.

## `razorpay-webhook` function

Mirrors `confirm-order` (it's the fallback path if `confirm-order` fails
after a real charge), except the charged amount comes free with the event
(`payment.entity.amount`) — no extra Razorpay fetch needed.

## `src/pages/OrderConfirmed.jsx`

A COD customer must leave the flow knowing they still owe money. The
checkout page appends `bal=<rupees>` to the confirmation navigation when
`codBalance > 0`; OrderConfirmed renders a prominent line:
"Balance due on delivery: ₹X — please keep it ready in cash." Absent or zero
`bal` renders nothing new (full-prepay orders unchanged).

## `lib/shopify.js` — `createPaidOrder`

New parameter `codBalance` (rupees, 0 for full-prepay orders) and
`chargedRupees` (what the transaction actually captured). When
`codBalance > 0`:

- `financialStatus: 'PARTIALLY_PAID'` instead of `'PAID'` — verify this enum
  value against the live 2024-10 schema via introspection during
  implementation, same as was done for `'PAID'`
- `transactions[0].amountSet` reflects `chargedRupees`, not the order total
- `tags` gains `'COD'` alongside the existing `rzp_<id>` tag
- `note` gains a line: `Balance due on delivery: ₹<amount>`

## `lib/payload.js`

- `validatePayload`: validates and passes through `paymentMethod` per the
  rules above (absent → `'full'`, invalid → reject).
- `encodeNotes`: adds a single `m` key (`'c'` for cod, `'f'` for full) so
  the webhook's notes-recovery path knows the mode. Stays well inside
  Razorpay's ≤15-keys / ≤512-chars-per-value limits. The degraded
  `recovery: 'partial'` path already means manual reconciliation; no change
  there.
- `decodeNotes`: recovers `paymentMethod` from `m`, defaulting to `'full'`
  for orders created before this feature.

## Manual follow-up (not code)

The Refund Policy page states the terms for returns; it should gain a line
that the COD advance is non-refundable on refused/undelivered orders. Flag
for the user to approve wording — legal copy, not a code change.

## Out of scope

- No PIN-code/product/cart-content eligibility restrictions on COD.
- No cap on balance size.
- No new email template — Shopify's native order-confirmation email already
  reflects "Partially paid" financial status.
- No admin-configurable tier thresholds — the ₹1000 cutoff and ₹200/₹300
  amounts are hardcoded constants, consistent with how config lives in code
  elsewhere in this project.
