import Link from "next/link";

import { IdentifyViewer } from "@/components/analytics/identify-viewer";
import { JsonLd } from "@/components/json-ld";
import { HouseCallTemplate } from "@/components/landing/house-call";
import { Faq, GuidesTeaser, HowItWorks } from "@/components/landing/landing-sections";
import { BLUE } from "@/components/landing/themes";
import { FOOTER_LINKS, LEGAL_LINKS } from "@/components/site-footer";
import { TrackOnMount } from "@/components/track-on-mount";
import {
  LANDING_FAQS,
  faqPageJsonLd,
  graph,
  organizationJsonLd,
  pageMetadata,
  webApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { getViewer } from "@/lib/viewer";

export const metadata = pageMetadata({
  title: "Home Doctor: know what's wrong in 30 seconds",
  description: SITE.shortDescription,
  path: "/",
  absoluteTitle: true,
});

// 44px tall on phones, with tight padding so the logo and two links fit on one row at 360px.
const navLink =
  "inline-flex h-11 cursor-pointer items-center rounded-full px-3 text-sm font-medium transition-colors hover:bg-(--accent-soft) sm:h-9 sm:px-4";

async function LandingNav() {
  const { userId } = await getViewer();
  return (
    <nav aria-label="Main" className="flex items-center gap-1">
      <IdentifyViewer userId={userId} />
      {/* Phones get the guides from the page body instead; the header stays one row. */}
      <Link href="/guides" className={`${navLink} max-sm:hidden`}>
        Guides
      </Link>
      {userId ? (
        <>
          <Link href="/history" className={navLink}>
            History
          </Link>
          <Link href="/account" className={navLink}>
            Account
          </Link>
        </>
      ) : (
        <>
          <Link href="/pricing" className={`${navLink} max-sm:hidden`}>
            Pricing
          </Link>
          <Link href="/login" className={navLink}>
            Sign in
          </Link>
        </>
      )}
    </nav>
  );
}

export default function LandingPage() {
  return (
    <>
      <TrackOnMount event="landing_view" />
      <JsonLd
        data={graph(
          organizationJsonLd(),
          websiteJsonLd(),
          webApplicationJsonLd(),
          faqPageJsonLd(LANDING_FAQS, absoluteUrl("/"))
        )}
      />
      <HouseCallTemplate
        theme={BLUE}
        homeHref="/"
        nav={<LandingNav />}
        preview={false}
        afterHero={<HowItWorks />}
        beforeClosing={
          <>
            <GuidesTeaser />
            <Faq />
          </>
        }
        footerLinks={FOOTER_LINKS}
        legalLinks={LEGAL_LINKS}
      />
    </>
  );
}
