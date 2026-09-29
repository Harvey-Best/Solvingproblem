import { ContactLine, LegalPage, LegalSection } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What Home Doctor collects, how your photos and results are used and stored, who helps us run the service, and how to delete your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Home Doctor looks at photos of your home to tell you what's wrong. That's personal, so here's plainly what we collect, what we do with it, and what we never do."
    >
      <LegalSection id="short-version" title="The short version">
        <ul>
          <li>We collect what you give us (photos, descriptions, quotes, your email) to diagnose problems and run your account.</li>
          <li>We don&apos;t sell your data, and we don&apos;t use it for advertising.</li>
          <li>Your photos stay private. Nobody else sees a result unless you create a share link, and even then photos aren&apos;t included.</li>
          <li>You can ask us to delete your account and data at any time.</li>
        </ul>
      </LegalSection>

      <LegalSection id="what-we-collect" title="What we collect">
        <ul>
          <li>
            <strong>Account details.</strong> Your email address. If you sign in with Google, also the name and
            profile photo Google shares with us.
          </li>
          <li>
            <strong>What you submit.</strong> Photos of household problems and contractor quotes, anything you type
            (descriptions and follow-up answers), and the results we generate. Quotes often show names, addresses
            and prices, so only upload what you&apos;re comfortable sharing with us.
          </li>
          <li>
            <strong>Billing.</strong> Payments are handled by Stripe. We receive your plan, subscription status and a
            Stripe customer ID. We never see or store your full card number.
          </li>
          <li>
            <strong>Usage.</strong> Pages you visit and actions in the app (for example, &quot;diagnosis
            completed&quot;), linked to a random account ID rather than your email, so we can see what works and fix
            what doesn&apos;t.
          </li>
          <li>
            <strong>Technical data.</strong> Our hosting provider records standard request details (such as IP
            address and browser) for security and troubleshooting. To enforce the free-use limits we keep a salted,
            one-way hash of your IP address, not the address itself.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="photos" title="Your photos">
        <p>
          Photos are resized and re-encoded on your phone before they&apos;re uploaded, which removes location and
          camera data. They&apos;re stored in private storage and are only shown through short-lived links to you
          (or, before you create an account, to the browser you used).
        </p>
      </LegalSection>

      <LegalSection id="how-we-use-it" title="How we use it">
        <ul>
          <li>To produce your diagnoses and quote checks, and to answer follow-up questions.</li>
          <li>To run your account, free trial and subscription.</li>
          <li>
            To send service emails: a welcome email, a reminder before your trial ends, and receipts. We don&apos;t
            send marketing emails.
          </li>
          <li>To prevent abuse, such as people getting around the free-use limits.</li>
          <li>
            To improve accuracy and safety. We may review results, especially failed or safety-flagged ones, to find
            and fix mistakes.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="ai" title="How the AI works with your data">
        <p>
          Your photos and text are sent to Anthropic, which provides the AI model (Claude) that produces each result.
          Under its commercial terms, Anthropic doesn&apos;t use this data to train its models.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="Who we share it with">
        <p>
          We don&apos;t sell your personal information or share it for advertising. We use these companies to run
          Home Doctor, and they only get what they need to do their part:
        </p>
        <ul>
          <li><strong>Supabase:</strong> database, sign-in and photo storage.</li>
          <li><strong>Vercel:</strong> website hosting.</li>
          <li><strong>Anthropic:</strong> the AI that produces results.</li>
          <li><strong>Stripe:</strong> payments and subscriptions.</li>
          <li><strong>Resend:</strong> sending our service emails.</li>
          <li><strong>PostHog:</strong> product analytics.</li>
          <li>
            <strong>Google:</strong> Google Analytics, to count visits and see how people find us, and sign-in if you
            choose to sign in with Google.
          </li>
        </ul>
        <p>We may also disclose information if the law requires it.</p>
      </LegalSection>

      <LegalSection id="share-links" title="Share links">
        <p>
          If you share a result, anyone with the link can see a summary: the problem, how urgent it is, the likely
          cause, whether it&apos;s a DIY job, and the price ranges. Share pages never include your photos, what you typed, or who you are. You can
          stop sharing at any time, and the link stops working right away.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies">
        <ul>
          <li><strong>Sign-in cookies</strong> keep you signed in.</li>
          <li>
            <strong>An anonymous ID</strong> (kept for up to a year) remembers your free result before you create an
            account, so it can be saved to your account when you sign up.
          </li>
          <li><strong>A sign-in check</strong> (one hour) makes sure sign-in links come back to the browser that asked for them.</li>
          <li><strong>A referral note</strong> (90 days) records how you found us, such as a link or an ad.</li>
          <li><strong>Analytics cookies</strong> from Google Analytics and PostHog, as described above.</li>
        </ul>
        <p>We don&apos;t use advertising cookies.</p>
      </LegalSection>

      <LegalSection id="retention" title="Keeping and deleting your data">
        <p>
          We keep your account, photos and results while your account is open, so your history stays available.
          Ask us to delete your account and we&apos;ll delete your data within 30 days, except records we&apos;re
          required to keep, such as payment records for tax purposes.
        </p>
      </LegalSection>

      <LegalSection id="security" title="Security">
        <p>
          Everything is encrypted in transit, photos are stored privately, and access to your data is limited to
          what&apos;s needed to run the service. No system is perfect, but we take reasonable steps to protect your
          information.
        </p>
      </LegalSection>

      <LegalSection id="your-rights" title="Your choices and rights">
        <p>
          You can ask us for a copy of your data, to correct it, or to delete it. Depending on where you live (for
          example, California or the EU), you may have additional rights, and we&apos;ll honor them. We don&apos;t
          sell or share personal information as those laws define it.
        </p>
      </LegalSection>

      <LegalSection id="children" title="Children">
        <p>Home Doctor isn&apos;t meant for children under 13, and we don&apos;t knowingly collect their information.</p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to this policy">
        <p>
          If we change this policy, we&apos;ll update the date at the top. For significant changes, we&apos;ll also
          let account holders know by email.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <ContactLine purpose="For privacy questions or to delete your data," />
      </LegalSection>
    </LegalPage>
  );
}
