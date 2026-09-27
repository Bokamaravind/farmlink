import LegalLayout from "@/components/legallayout"

export const metadata = { title: "Terms & Conditions — Kisavi" }

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" lastUpdated="September 26, 2026">

      <h2>1. Introduction</h2>
      <p>
        Welcome to Kisavi ("Kisavi", "we", "us", "our"). These Terms & Conditions
        ("Terms") govern your access to and use of the Kisavi website, mobile
        application, and related services (collectively, the "Platform"), which
        connects local farmers with households for farm-to-home vegetable and
        fruit delivery in Andhra Pradesh, India.
      </p>
      <p>
        By creating an account, placing an order, registering as a farmer partner,
        or otherwise using the Platform, you agree to be bound by these Terms and
        our <a href="/privacy">Privacy Policy</a>. If you do not agree, please do
        not use the Platform.
      </p>

      <h2>2. Definitions</h2>
      <ul>
        <li><strong>"User" / "Customer"</strong> — any person who browses, registers, or places an order on the Platform.</li>
        <li><strong>"Farmer Partner"</strong> — any farmer or grower registered on the Platform to list and sell produce.</li>
        <li><strong>"Delivery Partner"</strong> — any individual or entity responsible for collecting produce from Farmer Partners and delivering it to Customers.</li>
        <li><strong>"Order"</strong> — a request placed by a Customer for produce listed on the Platform.</li>
      </ul>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 18 years old and capable of entering into a legally
        binding contract under the Indian Contract Act, 1872, to use the Platform.
        By using the Platform, you represent that you meet this requirement.
      </p>

      <h2>4. Account Registration</h2>
      <p>
        To place an Order or register as a Farmer Partner, you must create an
        account with accurate, current, and complete information. You are
        responsible for maintaining the confidentiality of your account
        credentials and for all activity that occurs under your account.
      </p>

      <h2>5. Orders & Pricing</h2>
      <p>
        Prices displayed on the Platform are set by Farmer Partners and are
        subject to change based on seasonal availability and market conditions.
        Kisavi charges a service fee on each Order, disclosed at checkout before
        payment is made. All prices are inclusive of applicable taxes unless
        stated otherwise.
      </p>
      <p>
        Kisavi reserves the right to refuse or cancel any Order at its
        discretion, including in cases of suspected fraud, pricing errors, or
        unavailability of stock, in which case any amount paid will be refunded.
      </p>

      <h2>6. Payments</h2>
      <p>
        Payments may be made via UPI, debit/credit card, or other methods made
        available at checkout, processed through a third-party payment gateway.
        Kisavi does not store your full payment card details. By making a
        payment, you agree to the terms of our payment gateway provider.
      </p>

      <h2>7. Delivery</h2>
      <p>
        Kisavi aims to deliver Orders within the estimated delivery window shown
        at checkout (typically within 2 hours), but delivery times are estimates
        and not guaranteed, and may be affected by weather, traffic, farm
        availability, or other factors beyond our control.
      </p>
      <p>
        You are responsible for providing an accurate delivery address and being
        reasonably available to receive the Order. Kisavi is not liable for
        failed deliveries caused by incorrect address details or unavailability
        of the Customer.
      </p>

      <h2>8. Cancellations & Refunds</h2>
      <p>
        Orders may be cancelled free of charge before the Farmer Partner begins
        preparing the Order. Once preparation or dispatch has begun, cancellation
        may not be possible or may incur a partial charge.
      </p>
      <p>
        If produce delivered is damaged, spoiled, or materially different from
        what was ordered, Customers may request a refund or replacement within
        24 hours of delivery by contacting <a href="mailto:kisaviofficial@gmail.com">kisaviofficial@gmail.com</a> or
        WhatsApp +91 7075330899, along with photographic evidence where possible.
      </p>

      <h2>9. Farmer Partner Terms</h2>
      <p>
        Farmer Partners are independent sellers responsible for the quality,
        freshness, and accuracy of the produce and pricing they list. Kisavi
        acts as a facilitating platform and is not the seller of record for
        produce listed by Farmer Partners. Farmer Partners receive payouts as
        per the fee structure disclosed at the time of onboarding.
      </p>

      <h2>10. Delivery Partner Terms</h2>
      <p>
        Delivery Partners engaged through the Platform are independent
        contractors and not employees of Kisavi. Delivery Partners are
        responsible for handling produce with care and complying with
        applicable road safety and local regulations.
      </p>

      <h2>11. Prohibited Activities</h2>
      <ul>
        <li>Using the Platform for any unlawful purpose or in violation of these Terms.</li>
        <li>Attempting to interfere with the security or proper functioning of the Platform.</li>
        <li>Impersonating any person or entity, or misrepresenting your affiliation.</li>
        <li>Circumventing the Platform to transact directly with a Farmer Partner or Delivery Partner to avoid fees.</li>
      </ul>

      <h2>12. Intellectual Property</h2>
      <p>
        All content on the Platform, including the Kisavi name, logo, design,
        and text, is the property of Kisavi or its licensors and may not be
        copied, reproduced, or used without prior written consent.
      </p>

      <h2>13. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Kisavi shall not be liable for
        any indirect, incidental, or consequential damages arising from your use
        of the Platform, including but not limited to loss of produce quality
        after delivery, delays, or third-party payment or delivery failures.
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You agree to indemnify and hold Kisavi harmless from any claims,
        damages, or expenses arising from your violation of these Terms or
        misuse of the Platform.
      </p>

      <h2>15. Termination</h2>
      <p>
        Kisavi may suspend or terminate your account at its discretion,
        including for violation of these Terms, without prior notice.
      </p>

      <h2>16. Governing Law & Jurisdiction</h2>
      <p>
        These Terms are governed by the laws of India. Any disputes arising out
        of these Terms shall be subject to the exclusive jurisdiction of the
        courts of Andhra Pradesh, India.
      </p>

      <h2>17. Changes to These Terms</h2>
      <p>
        Kisavi may update these Terms from time to time. Continued use of the
        Platform after changes are posted constitutes acceptance of the revised
        Terms. The "Last updated" date at the top of this page reflects the most
        recent revision.
      </p>

      <h2>18. Contact Us</h2>
      <p>
        For questions about these Terms, contact us at{" "}
        <a href="mailto:kisaviofficial@gmail.com">kisaviofficial@gmail.com</a> or
        WhatsApp +91 7075330899.
      </p>

    </LegalLayout>
  )
}