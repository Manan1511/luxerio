import PolicyLayout, { Section } from './PolicyLayout.jsx';

export default function TermsAndConditions() {
  return (
    <PolicyLayout title="Terms &amp; Conditions" updated="9 July 2026">
      <p>
        These Terms &amp; Conditions ("Terms") govern your use of vancito.co (the "Site") and any
        purchase you make through it. By accessing the Site or placing an order, you agree to be
        bound by these Terms. If you do not agree, please do not use the Site.
      </p>

      <Section heading="1. About us">
        <p>
          Vancito.co is an online store selling apparel, footwear, and accessories, operated by{' '}
          <span className="text-primary">[legal business name]</span>, registered at{' '}
          <span className="text-primary">[registered business address]</span>. For any queries,
          contact us at <span className="text-primary">help.vancitoco@gmail.com</span>.
        </p>
      </Section>

      <Section heading="2. Eligibility">
        <p>
          To place an order on the Site, you must be at least 18 years old, or place the order
          under the supervision of a parent or legal guardian. By ordering, you confirm that the
          shipping details and payment information you provide are accurate and that you are
          authorised to use the payment method selected.
        </p>
      </Section>

      <Section heading="3. Products, pricing &amp; availability">
        <ul className="list-disc pl-5 [&>li]:mt-2">
          <li>All prices on the Site are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.</li>
          <li>We make every effort to display product colours and details accurately, but slight variations may occur due to screen settings.</li>
          <li>Product availability is not guaranteed until your order is confirmed and payment is captured. If an item becomes unavailable after you order, we will notify you and issue a full refund for that item.</li>
          <li>We reserve the right to correct pricing or listing errors and to cancel orders placed on the basis of an incorrect price, with a full refund.</li>
        </ul>
      </Section>

      <Section heading="4. Orders &amp; payment">
        <p>
          All orders are prepaid — payment is collected online at checkout through Razorpay,
          supporting UPI, cards, netbanking, and wallets. Your order is confirmed only once
          payment is successfully captured and verified. Order confirmation is sent to the email
          address you provide at checkout.
        </p>
        <p>
          We reserve the right to refuse or cancel any order at our discretion — for example, in
          cases of suspected fraud, pricing errors, or inability to fulfil the order — in which
          case any amount charged will be refunded in full.
        </p>
      </Section>

      <Section heading="5. Shipping &amp; delivery">
        <p>
          Shipping timelines, charges, and coverage are described in our{' '}
          <a href="/shipping-policy" className="text-primary underline underline-offset-2 hover:text-acid">
            Shipping Policy
          </a>.
        </p>
      </Section>

      <Section heading="6. Cancellations &amp; refunds">
        <p>
          Order cancellation and refund terms are described in our{' '}
          <a href="/refund-policy" className="text-primary underline underline-offset-2 hover:text-acid">
            Refund &amp; Cancellation Policy
          </a>.
        </p>
      </Section>

      <Section heading="7. Intellectual property">
        <p>
          All content on the Site — including the Vancito.co name, logo, product photography, and
          page design — is owned by us or our licensors and may not be reproduced, copied, or used
          without prior written permission.
        </p>
      </Section>

      <Section heading="8. Limitation of liability">
        <p>
          To the maximum extent permitted by law, Vancito.co is not liable for indirect,
          incidental, or consequential damages arising from your use of the Site, delays in
          delivery caused by our logistics partners, or events beyond our reasonable control. Our
          total liability for any claim relating to an order is limited to the amount you paid for
          that order.
        </p>
      </Section>

      <Section heading="9. Governing law">
        <p>
          These Terms are governed by the laws of India. Any disputes arising from your use of the
          Site or an order shall be subject to the exclusive jurisdiction of the courts of{' '}
          <span className="text-primary">[city, state]</span>.
        </p>
      </Section>

      <Section heading="10. Changes to these Terms">
        <p>
          We may update these Terms from time to time. Continued use of the Site after changes are
          posted constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section heading="11. Contact us">
        <p>
          Questions about these Terms? Reach us at{' '}
          <span className="text-primary">help.vancitoco@gmail.com</span> or{' '}
          <span className="text-primary">+91 78748 41121</span>.
        </p>
      </Section>
    </PolicyLayout>
  );
}
