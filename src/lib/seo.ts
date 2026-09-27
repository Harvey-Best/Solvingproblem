import type { Metadata } from "next";

import type { Guide } from "@/lib/guides";
import { PLANS, TRIAL_DAYS } from "@/lib/plans";
import { SITE, absoluteUrl } from "@/lib/site";

/** The site-wide share image (src/app/opengraph-image.tsx). */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  alt: "Home Doctor: point your phone at the problem, know what's wrong in 30 seconds.",
};

export const guideOgImagePath = (slug: string) => `/og/guides/${slug}`;

/**
 * Metadata for an indexable page. Sets the canonical URL and restates the
 * Open Graph fields, because a page-level `openGraph` replaces the parent's
 * instead of merging with it.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
  absoluteTitle = false,
  image = DEFAULT_OG_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  /** Use the title as-is instead of appending " · Home Doctor". */
  absoluteTitle?: boolean;
  image?: { url: string; alt: string };
}): Metadata {
  const images = [{ ...image, width: 1200, height: 630 }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      siteName: SITE.name,
      locale: SITE.locale,
      url: path,
      title,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

/** Questions answered on the landing page, and in its FAQPage structured data. */
export const LANDING_FAQS: { q: string; a: string }[] = [
  {
    q: "What is Home Doctor?",
    a: `${SITE.description} Take or upload up to three photos, add a sentence about what's going on, and get a structured answer in about 30 seconds.`,
  },
  {
    q: "What kinds of problems can it diagnose?",
    a: "Plumbing, electrical, heating and cooling, walls and paint, roofs and gutters, appliances, doors and windows, and outdoor problems: leaks, drips, cracks, stains, strange noises, dead outlets, tripping breakers and more.",
  },
  {
    q: "Is Home Doctor free?",
    a: `Your first diagnosis and your first quote check are free and don't need an account. Creating an account starts a ${TRIAL_DAYS}-day free trial, no card needed. After that it's ${PLANS.monthly.priceLabel} or ${PLANS.yearly.priceLabel}, and you can cancel anytime.`,
  },
  {
    q: "How accurate is a diagnosis from a photo?",
    a: "It's a well-informed starting point, not a guarantee. Each diagnosis comes with a confidence level, other possible causes and how to tell them apart, and follow-up questions when a photo isn't enough. It tells you plainly when something needs a professional to see it in person.",
  },
  {
    q: "Will it tell me if something is dangerous?",
    a: "Yes. A gas smell, sparking or burning, water near electrical, a sagging ceiling or structure, and carbon monoxide alarms always get \"Stop and call a pro now\", with the safety steps to take first. If you smell gas or see smoke, leave and call 911 or your gas utility before anything else.",
  },
  {
    q: "Does it tell me what a repair should cost?",
    a: "Yes. You get the parts with price ranges and store search links for DIY, and a typical price range for hiring a pro, so you know what's fair before you call anyone.",
  },
  {
    q: "Can Home Doctor check a contractor's quote?",
    a: "Yes. Photograph the quote and Home Doctor lists what it covers and what's missing, flags things like a deposit over 30% or no license number, and tells you whether the price falls within a typical range.",
  },
  {
    q: "What happens to my photos?",
    a: "Photos are resized and re-encoded on your phone before upload, which strips location data. They're stored privately and only your account, or your browser before you sign up, can open them.",
  },
];

type JsonLd = Record<string, unknown>;

const ORG_ID = () => `${absoluteUrl("/")}#organization`;
const SITE_ID = () => `${absoluteUrl("/")}#website`;

export function organizationJsonLd(): JsonLd {
  return {
    "@type": "Organization",
    "@id": ORG_ID(),
    name: SITE.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icons/icon-512.png"),
    description: SITE.description,
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": SITE_ID(),
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SITE.description,
    inLanguage: "en-US",
    publisher: { "@id": ORG_ID() },
  };
}

export function webApplicationJsonLd(): JsonLd {
  return {
    "@type": "WebApplication",
    "@id": `${absoluteUrl("/")}#app`,
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SITE.description,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires a modern web browser. Works best on a phone camera.",
    featureList: [
      "Diagnose household problems from 1 to 3 photos",
      "Severity triage from cosmetic to stop-and-call-a-pro",
      "DIY or call-a-pro verdict with step-by-step instructions",
      "Parts list with price ranges and store search links",
      "Typical professional price range",
      "What to tell the pro when you call",
      "Follow-up questions that refine the diagnosis",
      "Contractor quote review: missing items, red flags and price check",
    ],
    offers: [
      {
        "@type": "Offer",
        name: "Free diagnosis",
        price: "0",
        priceCurrency: "USD",
        description: `First diagnosis free with no account, then a ${TRIAL_DAYS}-day free trial with no card.`,
      },
      ...Object.values(PLANS).map((plan) => ({
        "@type": "Offer",
        name: `Home Doctor ${plan.label}`,
        price: plan.price.toFixed(2),
        priceCurrency: "USD",
        url: absoluteUrl("/pricing"),
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: plan.price.toFixed(2),
          priceCurrency: "USD",
          billingDuration: 1,
          unitCode: plan.interval === "month" ? "MON" : "ANN",
        },
      })),
    ],
    publisher: { "@id": ORG_ID() },
  };
}

export function faqPageJsonLd(faqs: { q: string; a: string }[], url: string): JsonLd {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function guideArticleJsonLd(guide: Guide): JsonLd {
  const url = absoluteUrl(`/guides/${guide.slug}`);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: guide.title,
    description: guide.metaDescription,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(guideOgImagePath(guide.slug)),
    datePublished: guide.reviewed,
    dateModified: guide.reviewed,
    inLanguage: "en-US",
    author: { "@id": ORG_ID() },
    publisher: { "@id": ORG_ID() },
    isPartOf: { "@id": SITE_ID() },
    about: guide.symptom,
  };
}

/** Wraps nodes in one @graph so they can reference each other by @id. */
export function graph(...nodes: JsonLd[]): JsonLd {
  return { "@context": "https://schema.org", "@graph": nodes };
}
