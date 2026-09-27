import { PLANS } from "@/lib/plans";
import { receiptEmail, trialEndingEmail, welcomeEmail } from "@/lib/email/templates";

const DAY = 24 * 60 * 60 * 1000;

/** Dev-only email previews: /dev/email/welcome, /dev/email/trial-ending, /dev/email/receipt (?format=text). */
export async function GET(request: Request, ctx: RouteContext<"/dev/email/[kind]">) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const { kind } = await ctx.params;
  const siteUrl = new URL(request.url).origin;
  const now = new Date();
  const email =
    kind === "welcome"
      ? welcomeEmail({ name: "Sam Rivera", trialEndsAt: new Date(now.getTime() + 7 * DAY), siteUrl })
      : kind === "trial-ending"
        ? trialEndingEmail({ trialEndsAt: new Date(now.getTime() + 44 * 60 * 60 * 1000), siteUrl, now })
        : kind === "receipt"
          ? receiptEmail({
              amountCents: 6999,
              currency: "usd",
              plan: PLANS.yearly,
              paidAt: now,
              invoiceNumber: "HD-00042",
              invoiceUrl: "https://invoice.stripe.com/i/example",
              renewsAt: new Date(now.getTime() + 365 * DAY),
              siteUrl,
            })
          : null;
  if (!email) return new Response("Unknown email", { status: 404 });
  const asText = new URL(request.url).searchParams.get("format") === "text";
  return new Response(asText ? `Subject: ${email.subject}\n\n${email.text}` : email.html, {
    headers: { "content-type": asText ? "text/plain; charset=utf-8" : "text/html; charset=utf-8" },
  });
}
