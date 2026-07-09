import PolicyLayout, { Section } from './PolicyLayout.jsx';

export default function RefundPolicy() {
  return (
    <PolicyLayout title="Refund &amp; Cancellation Policy" updated="9 July 2026">
      <p>
        We want you to be happy with your order. This policy explains how order cancellations,
        returns, and refunds work on vancito.co.
      </p>

      <Section heading="1. Order cancellation">
        <p>
          Orders can be cancelled free of charge only before they have been dispatched. To cancel
          an order, contact us at <span className="text-primary">[support email]</span> or{' '}
          <span className="text-primary">[support phone number]</span> as soon as possible after
          placing your order, quoting your order number. Once an order has been dispatched, it can
          no longer be cancelled — you may instead request a return once it is delivered (see
          Section 2).
        </p>
      </Section>

      <Section heading="2. Returns &amp; exchanges">
        <p>We accept returns in the following cases, within 7 days of delivery:</p>
        <ul className="list-disc pl-5 [&>li]:mt-2">
          <li>The item received is damaged or defective.</li>
          <li>The item received does not match what you ordered (wrong product, size, or colour).</li>
          <li>The item is unused, unworn, and returned in its original packaging with all tags attached.</li>
        </ul>
        <p>
          To request a return, email <span className="text-primary">[support email]</span> with
          your order number and photos of the item within 7 days of delivery. Once approved, we
          will share instructions for returning the item, including reverse pickup where
          available.
        </p>
        <p>
          Items that have been worn, washed, altered, or damaged after delivery, and items marked
          "final sale," are not eligible for return.
        </p>
      </Section>

      <Section heading="3. Refunds">
        <p>
          Once a returned item is received and inspected, or a cancellation is confirmed before
          dispatch, we will process your refund to the original payment method via Razorpay.
          Refunds are typically credited within 5–7 business days, though the exact time to reflect
          in your account depends on your bank or payment provider.
        </p>
        <p>
          If your order was cancelled or a return approved but payment was somehow not captured
          correctly on our end, we will not charge you again — no action is needed from you.
        </p>
      </Section>

      <Section heading="4. Non-refundable situations">
        <ul className="list-disc pl-5 [&>li]:mt-2">
          <li>Change of mind after the item has been used or the tags removed.</li>
          <li>Delay in delivery caused by incorrect address details provided at checkout.</li>
          <li>Items marked as "final sale" or purchased during clearance promotions, unless defective.</li>
        </ul>
      </Section>

      <Section heading="5. Contact us">
        <p>
          For any cancellation, return, or refund request, reach us at{' '}
          <span className="text-primary">[support email]</span> or{' '}
          <span className="text-primary">[support phone number]</span> with your order number.
        </p>
      </Section>
    </PolicyLayout>
  );
}
