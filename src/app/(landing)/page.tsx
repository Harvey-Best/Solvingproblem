import Link from "next/link";
import { Camera } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { HouseCallTemplate } from "@/components/landing/house-call";
import { Faq, GuidesTeaser, HowItWorks } from "@/components/landing/landing-sections";
import { BLUE } from "@/components/landing/themes";
import { FOOTER_LINKS, LEGAL_LINKS } from "@/components/site-footer";
import { TrackOnMount } from "@/components/track-on-mount";
import { ViewerLinks } from "@/components/viewer-links";
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

export const metadata = pageMetadata({
  title: "Home Doctor: know what's wrong in 30 seconds",
  description: SITE.shortDescription,
  path: "/",
  absoluteTitle: true,
});

// 44px tall on phones, with tight padding so the logo, a link and the Diagnose button fit on one row at 360px.
const navLink =
  "inline-flex h-11 cursor-pointer items-center rounded-full px-2 text-sm font-medium transition-colors hover:bg-(--accent-soft) sm:h-9 sm:px-4";

function LandingNav() {
  return (
    <nav aria-label="Main" className="flex items-center gap-1">
      {/* Phones get the guides from the page body instead; the header stays one row. */}
      <Link href="/guides" className={`${navLink} max-sm:hidden`}>
        Guides
      </Link>
      <ViewerLinks linkClassName={navLink} pricingClassName="max-sm:hidden" historyClassName="max-sm:hidden" />
      <Link
        href="/diagnose"
        className="ml-1 inline-flex h-11 items-center gap-1.5 rounded-full bg-(image:--grad) bg-left px-4 text-sm font-semibold text-(--accent-ink) shadow-[0_10px_20px_-12px_var(--accent)] transition-all duration-500 hover:bg-right active:scale-[0.97] sm:h-9 sm:px-4"
        style={{ backgroundSize: "200% 100%" }}
      >
        <Camera className="size-4 max-sm:hidden" aria-hidden /> Diagnose
      </Link>
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
