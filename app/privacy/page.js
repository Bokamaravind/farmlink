import LegalLayout from "@/components/legallayout"

export const metadata = { title: "Privacy Policy — Kisavi" }

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="September 26, 2026">

      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy explains how Kisavi ("Kisavi", "we", "us", "our")
        collects, uses, shares, and protects information when you use our
        website, mobile application, and related services (the "Platform").
      </p>

      <h2>2. Information We Collect</h2>
      <h3>a. Information you provide</h3>
      <ul>
        <li>Name, phone number, email address, and delivery address</li>
        <li>Account credentials (e.g. via Google sign-in or phone OTP)</li>
        <li>Order history and payment transaction details (not full card numbers)</li>
        <li>For Farmer Partners: farm location, produce listings, and payout bank details</li>
        <li>Messages you send us via email, WhatsApp, or support channels</li>
      </ul>
      <h3>b. Information collected automatically</h3>
      <ul>
        <li>Device information, IP address, and browser type</li>
        <li>App usage data (pages visited, features used, crash logs)</li>
        <li>Approximate location, where permitted, to show nearby farmers and estimate delivery time</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>To process and deliver your Orders</li>
        <li>To communicate order updates, delivery status, and support responses</li>
        <li>To connect Customers with nearby Farmer Partners and Delivery Partners</li>
        <li>To process payments securely through our payment gateway</li>
        <li>To improve the Platform, troubleshoot issues, and prevent fraud</li>
        <li>To send service-related notifications (and promotional messages, only with your consent)</li>
      </ul>

      <h2>4. Sharing of Information</h2>
      <p>We share information only as necessary to operate the Platform:</p>
      <ul>
        <li><strong>Farmer Partners</strong> — receive Order details needed to fulfil produce (item, quantity, pickup schedule).</li>
        <li><strong>Delivery Partners</strong> — receive the delivery address and contact number needed to complete delivery.</li>
        <li><strong>Payment gateway providers</strong> — process your payment; Kisavi does not store full card or UPI credentials.</li>
        <li><strong>Legal authorities</strong> — where required by law, court order, or to protect the rights and safety of Kisavi, our users, or the public.</li>
      </ul>
      <p>We do not sell your personal information to third parties.</p>

      <h2>5. Cookies & Tracking</h2>
      <p>
        We use cookies and similar technologies to keep you signed in, remember
        preferences, and understand how the Platform is used. You can control
        cookies through your browser settings, though disabling them may affect
        some features.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We use reasonable technical and organizational measures — including
        encrypted connections and access controls — to protect your
        information. However, no method of transmission or storage is 100%
        secure, and we cannot guarantee absolute security.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We retain your information for as long as your account is active or as
        needed to provide services, comply with legal obligations, resolve
        disputes, and enforce our agreements. You may request deletion of your
        account and associated data, subject to legal retention requirements
        (e.g. transaction records for tax purposes).
      </p>

      <h2>8. Your Rights & Choices</h2>
      <ul>
        <li>You may access, update, or correct your account information at any time.</li>
        <li>You may request deletion of your account by contacting us.</li>
        <li>You may opt out of promotional communications while still receiving essential order-related messages.</li>
      </ul>

      <h2>9. Children's Privacy</h2>
      <p>
        The Platform is not intended for individuals under 18 years of age, and
        we do not knowingly collect personal information from children.
      </p>

      <h2>10. Third-Party Links</h2>
      <p>
        The Platform may contain links to third-party services (e.g. payment
        gateways, maps). We are not responsible for the privacy practices of
        these third parties, and we encourage you to review their policies
        separately.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last updated"
        date at the top of this page reflects the most recent revision.
        Continued use of the Platform after changes are posted constitutes
        acceptance of the revised policy.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        For questions about this Privacy Policy or to exercise your rights over
        your data, contact us at{" "}
        <a href="mailto:kisaviofficial@gmail.com">kisaviofficial@gmail.com</a> or
        WhatsApp +91 7075330899.
      </p>

    </LegalLayout>
  )
}