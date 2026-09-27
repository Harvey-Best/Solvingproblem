# Home Doctor

Point your phone at a household problem, get a structured diagnosis: what it is, how urgent, DIY or pro, steps, parts with prices, a fair pro price range, and what to say to the pro.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind v4 · shadcn/ui · Supabase (auth, Postgres, Storage) · Anthropic API · Vercel. Stripe, Resend and PostHog land in later phases.

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
- **Anonymous first diagnosis.** `src/proxy.ts` gives every visitor an `hd_anon` cookie. Diagnoses are keyed to it and moved to the account on sign-in (`src/lib/claim.ts`).
- **Free-use limits** (`src/lib/allowance.ts`): 1 free diagnosis and 1 free quote check per anonymous cookie, max 5 anonymous runs per IP per day, 25 runs/day for signed-in users, and 2 (anonymous) / 6 (signed-in) follow-ups per diagnosis. Stripe replaces the signed-in cap in Phase 3.
- **Strict output.** `src/lib/ai/schema.ts` is sent as a structured-output JSON schema and re-validated with zod. One retry on a bad parse; a friendly error after two failures (it doesn't count against the user).
- **Safety.** The system prompt (`src/lib/ai/prompt.ts`) requires escalation for gas, sparking, water near electrical, sagging structure and CO. On top of that, `src/lib/ai/safety.ts` scans the homeowner's own words and forces "Stop and call a pro now" if the model under-called it. Every forced escalation is logged in `diagnoses.safety_overrides`.
- **Quality log.** Every request writes a `diagnoses` row with the prompt version, the text sent (no image bytes), raw response, tokens, latency, attempts and any error.
- **Attribution.** First-touch `utm_*` and click ids (`fbclid`, `ttclid`, `gclid`, `rdt_cid`) are stored in the `hd_utm` cookie on landing. At sign-in they're copied to `users.utm`, and to `diagnoses.utm` for anonymous runs.

## Setup

### 1. Supabase

1. Create a project and run the migration in `supabase/migrations/` (paste it into the SQL editor, or `supabase db push`). It creates the tables, RLS policies, the new-user trigger and the private `uploads` bucket.
2. **Authentication → URL Configuration**
   - Site URL: your production URL, e.g. `https://homedoctor.app`
   - Redirect URLs: add `https://homedoctor.app/auth/callback**` and `http://localhost:3000/auth/callback**`
3. **Authentication → Emails → Magic Link** (and **Confirm signup**): paste `supabase/templates/magic_link.html`. It includes both a tap-to-sign-in link and the 6-digit code. The link works even when it opens in the mail app's own browser.
4. **Authentication → Providers → Google**: enable it and add the client ID and secret from Google Cloud Console. The authorized redirect URI is `https://<project-ref>.supabase.co/auth/v1/callback`.
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

### 3. Deploy (Vercel)

Import the repo in Vercel and add the env vars from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to the production URL), then deploy. `/api/diagnose` sets `maxDuration = 300`, which fits within Vercel's default function limit.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Route type generation + `tsc` |
| `npm test` | Unit tests (safety guard, retry logic, path ownership, UTM) |

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
- [ ] **Phase 3:** Stripe (trial, checkout, portal, webhooks), paywall, emails
- [ ] **Phase 4:** mobile polish, loading states, share card, PostHog
