import PolicyLayout, { Section } from './PolicyLayout.jsx';

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" updated="9 July 2026">
      <p>
        Vancito.co ("Vancito.co", "we", "us", or "our") respects your privacy and is committed to
        protecting the personal information you share with us. This Privacy Policy explains what
        information we collect when you use vancito.co (the "Site"), how we use it, and the
        choices you have. By using the Site, you agree to the practices described here.
      </p>

      <Section heading="1. Information we collect">
        <p>We collect information in the following ways:</p>
        <ul className="list-disc pl-5 [&>li]:mt-2">
          <li>
            <strong className="text-primary">Information you provide.</strong> When you place an
            order or create an account, we collect your name, email address, phone number,
            shipping address, and any discount codes you apply. We do not collect or store your
            card, UPI, or bank details — payments are processed directly by our payment partner,
            Razorpay (see Section 4).
          </li>
          <li>
            <strong className="text-primary">Order and browsing information.</strong> We record
            what you view, add to your bag, and purchase, so we can process orders, show you
            relevant products, and troubleshoot issues.
          </li>
          <li>
            <strong className="text-primary">Automatically collected information.</strong> Like
            most websites, we use cookies and similar technologies to keep your bag and checkout
            session working across page loads, and basic analytics (page views, product views) to
            understand how the Site is used.
          </li>
        </ul>
      </Section>

      <Section heading="2. How we use your information">
        <ul className="list-disc pl-5 [&>li]:mt-2">
          <li>To process and fulfil your orders, including shipping and order-confirmation emails.</li>
          <li>To communicate with you about your order, including delivery and payment status.</li>
          <li>To respond to customer support requests.</li>
          <li>To improve the Site, our products, and the shopping experience.</li>
          <li>To detect and prevent fraud or abuse of the Site or checkout process.</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </Section>

      <Section heading="3. Order fulfilment via Shopify">
        <p>
          Product data, inventory, and order records for the Site are managed through Shopify.
          When you place an order, your name, contact details, shipping address, and order
          contents are stored in our Shopify store in order to fulfil and track your purchase.
          Shopify processes this data on our behalf as our service provider.
        </p>
      </Section>

      <Section heading="4. Payments via Razorpay">
        <p>
          All payments on the Site are processed by Razorpay, a licensed and RBI-regulated
          payment gateway. When you check out, your payment details (card, UPI, netbanking, or
          wallet information) are entered directly into Razorpay's secure payment interface — they
          are never transmitted to or stored on our servers. Razorpay's use of your payment
          information is governed by
          {' '}
          <a
            href="https://razorpay.com/privacy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-acid"
          >
            Razorpay's own privacy policy
          </a>
          .
        </p>
      </Section>

      <Section heading="5. Cookies">
        <p>
          We use essential cookies and browser storage to keep your shopping bag and checkout
          session intact as you browse. Disabling cookies may prevent parts of the Site — such as
          checkout — from working correctly.
        </p>
      </Section>

      <Section heading="6. Data sharing">
        <p>We share your information only with:</p>
        <ul className="list-disc pl-5 [&>li]:mt-2">
          <li>Shopify, to store and fulfil your order.</li>
          <li>Razorpay, to process your payment.</li>
          <li>Courier/logistics partners, to deliver your order.</li>
          <li>Authorities, where required by law.</li>
        </ul>
        <p>We do not share your data with third parties for their own marketing purposes.</p>
      </Section>

      <Section heading="7. Data retention">
        <p>
          We retain order and account information for as long as necessary to fulfil orders,
          comply with tax and accounting obligations, and resolve disputes.
        </p>
      </Section>

      <Section heading="8. Your rights">
        <p>
          You may request access to, correction of, or deletion of your personal information by
          contacting us at the details below. We will respond within a reasonable time, subject to
          any legal or contractual obligations that require us to retain certain records (such as
          order history for tax purposes).
        </p>
      </Section>

      <Section heading="9. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this
          page with an updated "Last updated" date.
        </p>
      </Section>

      <Section heading="10. Contact us">
        <p>
          Questions about this Privacy Policy or how your data is handled? Reach us at{' '}
          <span className="text-primary">help.vancitoco@gmail.com</span> or{' '}
          <span className="text-primary">+91 78748 41121</span>.
        </p>
      </Section>
    </PolicyLayout>
  );
}
