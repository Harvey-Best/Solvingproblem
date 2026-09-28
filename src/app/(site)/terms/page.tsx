import Link from "next/link";

import { ContactLine, LegalPage, LegalSection } from "@/components/legal/legal-page";
import { USER_PER_DAY } from "@/lib/allowance";
import { PLANS, TRIAL_DAYS } from "@/lib/plans";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms for using Home Doctor: what the service is and isn't, free use, the free trial, subscriptions and cancellation, and your content.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms cover your use of Home Doctor. By using the site, you agree to them. We've kept them as plain as we can."
    >
      <LegalSection id="what-it-is" title="What Home Doctor is, and isn't">
        <p>
          Home Doctor uses AI to give general guidance about household problems, based on the photos and details you
          provide. It is <strong>not</strong> a licensed contractor, electrician, plumber, engineer or inspector, and
          it can&apos;t see everything a professional would see in person. Results can be wrong or incomplete.
        </p>
        <ul>
          <li>
            <strong>In an emergency, don&apos;t use the app.</strong> If you smell gas, see sparks or smoke, or anyone
            is hurt, leave the area and call 911 or your utility.
          </li>
          <li>
            You&apos;re responsible for your decisions, including following local codes, permits, manufacturer
            instructions and safe practices. If a result tells you to stop and call a pro, do that.
          </li>
          <li>
            Price ranges and quote checks are estimates for your information, not offers, guarantees or endorsements
            of any contractor.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="accounts" title="Your account">
        <p>
          You need to be at least 18, or the age of majority where you live, to create an account or subscribe. Keep
          access to your email secure, since sign-in links and codes are sent there. You&apos;re responsible for
          activity on your account.
        </p>
      </LegalSection>

      <LegalSection id="plans" title="Free use, the free trial and subscriptions">
        <ul>
          <li>Your first diagnosis and first quote check are free, with no account needed.</li>
          <li>
            Creating an account starts a {TRIAL_DAYS}-day free trial with full access. No card is needed, and nothing
            is charged unless you choose a plan.
          </li>
          <li>
            After the trial, a subscription costs {PLANS.monthly.priceLabel} or {PLANS.yearly.priceLabel}, plus any
            applicable tax. Subscriptions renew automatically at the end of each period until you cancel.
          </li>
          <li>
            You can cancel anytime from your{" "}
            <Link href="/account" className="font-medium text-foreground underline underline-offset-2">
              account
            </Link>
            . You keep access until the end of the period you&apos;ve paid for. We don&apos;t refund partial periods,
            except where the law requires it, but if something went wrong, contact us and we&apos;ll look at it.
          </li>
          <li>If we change prices, we&apos;ll tell you in advance, and the new price applies from your next renewal.</li>
          <li>
            Fair-use limits apply to keep the service reliable for everyone: currently up to {USER_PER_DAY} diagnoses
            and quote checks a day.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="your-content" title="Your content">
        <p>
          You own the photos and text you submit. You give us permission to store and process them, including with
          the service providers listed in our{" "}
          <Link href="/privacy" className="font-medium text-foreground underline underline-offset-2">
            Privacy Policy
          </Link>
          , to provide Home Doctor to you. Only upload content you have the right to share. If you create a share
          link, the summary it shows is public until you stop sharing.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="Acceptable use">
        <p>Please don&apos;t:</p>
        <ul>
          <li>use Home Doctor for anything illegal, or to harass or harm anyone;</li>
          <li>try to get around the free-use or fair-use limits, or access the service with bots or scrapers;</li>
          <li>try to break into, overload or reverse engineer the service;</li>
          <li>upload content that isn&apos;t yours to share, or that contains other people&apos;s private information beyond what&apos;s needed.</li>
        </ul>
        <p>We may suspend or close accounts that break these rules.</p>
      </LegalSection>

      <LegalSection id="our-content" title="Our content">
        <p>
          The site, our guides and the design of Home Doctor belong to us. You&apos;re welcome to read, use and share
          them for personal, non-commercial purposes.
        </p>
      </LegalSection>

      <LegalSection id="disclaimers" title="Disclaimers">
        <p>
          Home Doctor is provided &quot;as is&quot; and &quot;as available&quot;. To the extent the law allows, we
          make no warranties that results will be accurate, complete or suitable for your situation, or that the
          service will always be available.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="Limitation of liability">
        <p>
          To the extent the law allows, we aren&apos;t liable for indirect or consequential losses, or for injury,
          property damage or costs that result from acting on a result, and our total liability to you is limited to
          the greater of what you paid us in the 12 months before the claim or $50. Some places don&apos;t allow
          these limits, so they may not all apply to you.
        </p>
      </LegalSection>

      <LegalSection id="ending" title="Ending your use">
        <p>
          You can stop using Home Doctor at any time and ask us to delete your account. If we ever shut the service
          down, we&apos;ll give account holders reasonable notice and stop charging subscriptions.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to these terms">
        <p>
          If we change these terms, we&apos;ll update the date at the top, and for significant changes we&apos;ll let
          account holders know by email. Continuing to use Home Doctor after a change means you accept the new terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact us">
        <ContactLine purpose="Questions about these terms or your subscription?" />
      </LegalSection>
    </LegalPage>
  );
}
