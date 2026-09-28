# Home Doctor

Point your phone at a household problem, get a structured diagnosis: what it is, how urgent, DIY or pro, steps, parts with prices, a fair pro price range, and what to say to the pro.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind v4 · shadcn/ui · Supabase (auth, Postgres, Storage) · Anthropic API · Stripe (Checkout, Customer Portal, webhooks) · Resend · PostHog (product analytics) · Vercel (hosting + cron).

## How it works

```
Browser                                Next.js (Vercel)                     Supabase / Anthropic
───────                                ────────────────                     ────────────────────
pick photo → compress (≤1568px, <1.5MB)
POST /api/uploads ───────────────────► mint signed upload URL (own prefix)
PUT photo ────────────────────────────────────────────────────────────────► Storage (private "uploads")
POST /api/diagnose {paths, text} ────► verify paths are caller's
                                       check free-use allowance
                                       insert diagnoses row (pending)
                                       download photos ◄──────────────────── Storage
                                       Claude + JSON schema ────────────────► Anthropic
                                       validate (zod), retry once
                                       safety guard (normalizeDiagnosis)
                                       update row (result + log) ──────────► Postgres
redirect /d/[id] ◄──────────────────── render result (owner only)
```

- **Follow-up threads.** Under each result, the homeowner answers the model's questions (or adds details). `POST /api/diagnose/[id]/followup` replays the whole conversation, re-runs the diagnosis, and stores both sides in `diagnosis_messages` (failures included). The photo turn carries a prompt-cache breakpoint, so follow-ups re-read the images at cache prices. The result page always shows the latest version.
- **Quote check.** `/quote` → `POST /api/quote-check` → `/q/[id]`. Photos of a contractor quote come back as line items, a checklist of what a solid quote includes (scope, materials, permit, cleanup, warranty, payment terms, timeline, license/insurance), red flags, a typical price range with where this quote lands, and questions to ask before signing. `src/lib/ai/quote-guard.ts` always flags deposits over 30% and missing license numbers, never lets the range collapse to one number, and keeps the above/within/below label consistent with the numbers (logged in `quote_checks.guard_flags`).
- **History.** `/history` lists a signed-in user's diagnoses and quote checks with thumbnails.
- **Sharing.** The Share button on a result (`POST /api/diagnose/[id]/share`, owner only) makes an unguessable link (`/s/<id>`, 16 random bytes) and opens the phone's share sheet with a square card image attached, or copies the link on desktop. The public page and the cards (`/og/share/<id>`, wide 1200x630 for link previews, `?format=square` 1080x1080 for stories) show only a safe summary of the latest version: title, severity, DIY verdict and time, likely cause, pro price, parts total and hazard types (`toPublicDiagnosis` in `src/lib/share.ts`). Never photos, the homeowner's words, follow-ups or who they are. The page is `noindex` but not blocked in `robots.txt`, so link previews work. "Stop sharing" clears `diagnoses.share_id`: the page 404s at once and the cached cards within 5 minutes.
- **Anonymous first diagnosis.** `src/proxy.ts` gives every visitor an `hd_anon` cookie. Diagnoses are keyed to it and moved to the account on sign-in (`src/lib/claim.ts`).
- **Free-use limits** (`src/lib/allowance.ts`): 1 free diagnosis and 1 free quote check per anonymous cookie, max 5 anonymous runs per IP per day, 25 runs/day fair use for signed-in users, and 2 (anonymous) / 6 (signed-in) follow-ups per diagnosis.
- **Paywall and trial** (`src/lib/access.ts`, `src/lib/billing.ts`):
  - The first diagnosis is free with no account. The second requires an account, and creating one starts a 7-day free trial with no card (`users.trial_ends_at`, started by `onSignedIn` in `src/lib/onboarding.ts`).
  - After the trial, new diagnoses, quote checks and follow-ups need a subscription: $9.99/month or $69.99/year (`src/lib/plans.ts`). History and past results stay readable.
  - Stripe statuses `active`, `trialing` and `past_due` (while Stripe retries the card) keep access on.
  - Subscribing during the trial with 48h+ left carries the rest of the trial into Stripe, so the first charge is when the free trial would have ended.
  - The paywall only turns on once `STRIPE_SECRET_KEY` and both price ids are set.
- **Stripe.**
  - `/pricing` → Checkout (server action in `src/app/(site)/billing/actions.ts`) → `/billing/success`, which syncs the subscription right away. `/account` opens the Customer Portal to change plan, update the card, see invoices or cancel.
  - `POST /api/stripe/webhook` verifies the signature, dedupes redeliveries in `stripe_events`, and mirrors subscription state into `subscriptions`, always re-fetching from Stripe so out-of-order events are harmless.
- **Emails** (`src/lib/email/`, sent through Resend, each at most once via `email_log`):
  - **Welcome** after the first sign-in.
  - **Trial ends in 2 days** from a daily Vercel Cron (`vercel.json` → `/api/cron/trial-reminders`, protected by `CRON_SECRET`).
  - **Receipt** on every paid invoice (`invoice.paid`).
  - Without `RESEND_API_KEY`, emails are logged instead of sent.
- **Strict output.** `src/lib/ai/schema.ts` is sent as a structured-output JSON schema and re-validated with zod. One retry on a bad parse; a friendly error after two failures (it doesn't count against the user).
- **Safety.** The system prompt (`src/lib/ai/prompt.ts`) requires escalation for gas, sparking, water near electrical, sagging structure and CO. On top of that, `src/lib/ai/safety.ts` scans the homeowner's own words and forces "Stop and call a pro now" if the model under-called it. Every forced escalation is logged in `diagnoses.safety_overrides`.
- **Quality log.** Every request writes a `diagnoses` row with the prompt version, the text sent (no image bytes), raw response, tokens, latency, attempts and any error.
- **Guides.** `/guides` and `/guides/[slug]` are evergreen problem guides (water heater leaking, running toilet, tripping breaker, AC not cooling, ceiling water stain, drywall cracks), written from `src/lib/guides.ts`. Each one leads with a quick answer, then causes and how to tell them apart, safe first steps, when to call a pro, a cost table, a script for the pro, and FAQs. The CTAs open `/diagnose?category=…` with the category chip preselected.
- **Search and AI discoverability** (SEO + GEO):
  - Every public page has a canonical URL, Open Graph and Twitter tags (`pageMetadata` in `src/lib/seo.ts`). The canonical host is `NEXT_PUBLIC_SITE_URL`, falling back to Vercel's production domain, so previews never compete with production.
  - `robots.txt` (`src/app/robots.ts`) opens public pages to search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others) and keeps private and per-user pages out. Preview deployments disallow everything and are `noindex`.
  - `sitemap.xml`, `manifest.webmanifest`, the favicon, the app icons, and branded share images: `/opengraph-image` site-wide and `/og/guides/<slug>` per guide.
  - JSON-LD: Organization, WebSite, WebApplication and FAQPage on the landing page; Article, BreadcrumbList and FAQPage on guides.
  - `/llms.txt`: a markdown summary of the product, the guides and the FAQ for AI assistants, built from the same data as the pages.
  - The landing FAQ (`LANDING_FAQS`) and the guides' quick answers are written as short, self-contained answers that can be quoted directly.
- **Attribution.** First-touch `utm_*` and click ids (`fbclid`, `ttclid`, `gclid`, `rdt_cid`) are stored in the `hd_utm` cookie on landing. At sign-in they're copied to `users.utm`, and to `diagnoses.utm` for anonymous runs.
- **Analytics** (PostHog, off until `NEXT_PUBLIC_POSTHOG_KEY` is set; events are only logged without it):
  - Browser events go through `/ingest` on our own domain (rewritten to PostHog in `next.config.ts`), so ad blockers don't drop them. `src/instrumentation-client.ts` starts PostHog before hydration: pageviews on every navigation, no session replay, no click autocapture.
  - Events: `landing_view`, `diagnose_start`, `image_uploaded`, `diagnosis_complete`, `followup_sent` and `quote_check_complete` from the browser (`track()` in `src/lib/analytics.ts`); `signup`, `trial_start`, `subscribe` and `cancel` from the server (`trackServer()` in `src/lib/analytics-server.ts`, sent right away and awaited with `after()` so serverless functions don't drop them).
  - Signed-in users are identified by their Supabase user id, never the email, so their anonymous events from before sign-up join the same person. Sign-out resets it. Event properties never carry emails or free text.

## Setup

### 1. Supabase

1. Create a project and run the migration in `supabase/migrations/` (paste it into the SQL editor, or `supabase db push`). It creates the tables, RLS policies, the new-user trigger and the private `uploads` bucket.
2. **Authentication → URL Configuration**
   - Site URL: your production URL, e.g. `https://homedoctor.app`
   - Redirect URLs: add `https://homedoctor.app/auth/callback**` and `http://localhost:3000/auth/callback**`
3. **Authentication → Emails → Magic Link** (and **Confirm signup**): paste `supabase/templates/magic_link.html`. It includes both a tap-to-sign-in link and the 6-digit code. The link works even when it opens in the mail app's own browser.
4. **Authentication → Providers → Google**: enable it and add the client ID and secret from Google Cloud Console (a **Web application** client). The authorized redirect URI is `https://<project-ref>.supabase.co/auth/v1/callback`; add the site's main address (and any other address people sign in on) as an authorized JavaScript origin. On the main address the login page uses Google's own "Sign in with Google" button, so Google's screen names the site instead of `<project-ref>.supabase.co`; everywhere else it falls back to Supabase's redirect flow. The login button only appears once the provider is enabled.
5. For real email volume, set up custom SMTP (Resend works) under **Authentication → Emails → SMTP**. The built-in sender is heavily rate-limited.

### 2. Environment

```bash
cp .env.example .env.local   # fill in Supabase + Anthropic keys
npm install
npm run dev
```

Set `AI_MOCK=1` to get a canned diagnosis without spending tokens.

Dev-only previews that need no keys:
- `/dev/result`: the result screen.
- `/dev/result?text=I+smell+gas`: the result screen with the safety escalation.
- `/dev/diagnose`: the diagnose form.
- `/dev/result?thread=1`: the result screen with a follow-up exchange.
- `/dev/quote` and `/dev/quote-result`: the quote form and a sample quote review.
- `/dev/history`: the history list with sample rows.
- `/dev/share`: the public share page (add `?text=I+smell+gas` for the safety version). `/dev/share?view=owner`: the share button on the result page, before and after sharing.
- `/dev/share/card` and `/dev/share/card?format=square`: the share images (same `?text=` and `?title=` options).
- `/dev/billing?state=trial|expired|canceled|subscribed|canceling|pastdue`: trial status, paywall and account plan card.
- `/dev/email/welcome`, `/dev/email/trial-ending`, `/dev/email/receipt` (add `?format=text` for the plain-text version).

### 3. Stripe

1. **Product and prices.** Create a product "Home Doctor" with two recurring prices, $9.99/month and $69.99/year. Put their ids in `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_YEARLY`. If Managed Payments is on (Stripe as merchant of record), the product needs an eligible tax code; we use `txcd_10105001` (AI as a Service, cloud based, personal use).
2. **Webhook.** Developers → Webhooks → add endpoint `https://<your-domain>/api/stripe/webhook` with these events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`, `invoice.paid`. Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
3. **Customer Portal.** Settings → Billing → Customer portal: allow cancellations, payment method updates, invoice history, and switching between the two prices.
4. **Live mode.** Set up the same product, prices, portal and webhook in live mode and put them in `STRIPE_LIVE_PRICE_MONTHLY`, `STRIPE_LIVE_PRICE_YEARLY` and `STRIPE_LIVE_WEBHOOK_SECRET` next to the test ones. The app picks the set that matches `STRIPE_SECRET_KEY` (`sk_test_` or `sk_live_`), so going live is swapping that one key and redeploying.
5. **Local testing.** Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` and use its `whsec_` secret. Test card `4242 4242 4242 4242`.

### 4. Email (Resend)

Verify your sending domain in Resend, then set `RESEND_API_KEY` and `EMAIL_FROM`. Set `CRON_SECRET` in Vercel too: the daily trial reminder cron is declared in `vercel.json`.

### 5. Deploy (Vercel)

Import the repo in Vercel and add the env vars from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to the production URL, and update it when you add a custom domain: canonicals, the sitemap and `llms.txt` use it), then deploy.

A dashboard **Redeploy** rebuilds the same commit as the deployment you click it on. To ship new code, deploy the branch's latest commit (or merge it into the production branch). `/api/diagnose` sets `maxDuration = 300`, which fits within Vercel's default function limit.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Route type generation + `tsc` |
| `npm test` | Unit tests (safety guard, retry logic, path ownership, UTM, quote guard, threads, SEO, billing, webhook, emails, analytics, sharing) |

## Quality review

Useful queries in the Supabase SQL editor:

```sql
-- failures and why
select created_at, error, attempts, left(raw_response, 300) from diagnoses where status = 'failed' order by created_at desc;

-- where the safety guard overrode the model
select created_at, description, safety_overrides, result_json->>'title' from diagnoses where cardinality(safety_overrides) > 0;

-- cost/latency by prompt version
select prompt_version, model, count(*), avg(latency_ms)::int, avg(input_tokens)::int, avg(output_tokens)::int
from diagnoses where status = 'complete' group by 1, 2;
```

## Roadmap

- [x] **Phase 1:** scaffold, auth (magic link + code + Google), diagnose flow with the model, result screen
- [x] **Phase 2:** quote check, history, follow-up threads
- [x] **Phase 3:** Stripe (trial, checkout, portal, webhooks), paywall, emails
- [ ] **Phase 4:** mobile polish, loading states, share card, PostHog
  - [x] PostHog: client and server events, first-party `/ingest` proxy, identify by user id
