import PolicyLayout, { Section } from './PolicyLayout.jsx';

export default function ShippingPolicy() {
  return (
    <PolicyLayout title="Shipping Policy" updated="9 July 2026">
      <p>
        This policy explains how we ship orders placed on vancito.co, our delivery timelines,
        and what to do if something goes wrong in transit.
      </p>

      <Section heading="1. Shipping coverage">
        <p>We currently ship across India. We do not offer international shipping at this time.</p>
      </Section>

      <Section heading="2. Shipping charges">
        <p>Shipping is free on all orders across India — the price you see at checkout is the price you pay.</p>
      </Section>

      <Section heading="3. Processing time">
        <p>
          Orders are processed and handed to our courier partner within 1–2 business days of
          payment confirmation. You will receive an order confirmation email as soon as your
          payment is verified.
        </p>
      </Section>

      <Section heading="4. Delivery timelines">
        <ul className="list-disc pl-5 [&>li]:mt-2">
          <li>State capitals and metro cities: 2–5 working days from dispatch.</li>
          <li>Other locations: 3–7 working days from dispatch.</li>
        </ul>
        <p>
          These timelines are estimates provided by our courier partners and are not guaranteed —
          delivery may occasionally take longer due to weather, regional restrictions, or courier
          delays outside our control.
        </p>
      </Section>

      <Section heading="5. Order tracking">
        <p>
          Once your order is dispatched, we will share tracking details by email so you can follow
          its progress to your doorstep.
        </p>
      </Section>

      <Section heading="6. Delivery address">
        <p>
          Please double-check your shipping address at checkout — we are not responsible for
          delays or non-delivery caused by an incorrect or incomplete address. If you notice an
          error shortly after placing your order, contact us immediately at{' '}
          <span className="text-primary">[support email]</span> and we will do our best to update
          it before dispatch.
        </p>
      </Section>

      <Section heading="7. Damaged or missing items">
        <p>
          If your order arrives damaged, is missing items, or doesn't arrive at all within the
          expected window, contact us at <span className="text-primary">[support email]</span>{' '}
          within 48 hours of the expected delivery date, along with your order number, so we can
          investigate with our courier partner and make it right.
        </p>
      </Section>

      <Section heading="8. Contact us">
        <p>
          Questions about a shipment? Reach us at{' '}
          <span className="text-primary">[support email]</span> or{' '}
          <span className="text-primary">[support phone number]</span> with your order number.
        </p>
      </Section>
    </PolicyLayout>
  );
}
