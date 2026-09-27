import { PLANS, TRIAL_DAYS, type Plan } from "@/lib/plans";

import type { EmailContent } from "./send";

/**
 * Transactional email templates: table layout and inline styles so they
 * render in Gmail, Apple Mail and Outlook. Pure functions, no I/O.
 */

const C = {
  paper: "#f4f2ec",
  card: "#ffffff",
  ink: "#0e1b2c",
  muted: "#4b5563",
  line: "#e3e1da",
  brand: "#1d4ed8",
  soft: "#dde8fd",
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "Friday, October 3". US Eastern, since there's no per-user time zone yet. */
export function formatEmailDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/New_York" });
}

/** "October 3, 2026", for receipts, where a yearly renewal needs the year. */
export function formatReceiptDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });
}

/** Calendar days from `from` to `to` in US Eastern, so "tomorrow" matches the date the email names. */
export function easternDaysBetween(from: Date, to: Date): number {
  const day = (d: Date) => {
    const [y, m, dd] = d.toLocaleDateString("en-CA", { timeZone: "America/New_York" }).split("-").map(Number);
    return Date.UTC(y, m - 1, dd) / 86_400_000;
  };
  return day(to) - day(from);
}

export function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

function button(label: string, href: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 8px"><tr><td style="border-radius:999px;background:${C.brand};background-image:linear-gradient(120deg,#1d4ed8,#0369a1,#0e7490)">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px">${escapeHtml(label)}</a>
</td></tr></table>`;
}

function layout({ preheader, heading, body, siteUrl }: { preheader: string; heading: string; body: string; siteUrl: string }): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;background:${C.paper}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${C.paper}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px">
<tr><td style="padding:0 4px 20px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:bold;color:${C.ink}">
<span style="display:inline-block;width:28px;height:28px;border-radius:8px;background:${C.brand};color:#fff;text-align:center;line-height:28px;font-family:Helvetica,Arial,sans-serif;font-size:20px;vertical-align:middle">+</span>
<span style="vertical-align:middle;margin-left:8px">Home Doctor</span></td></tr>
<tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:20px;padding:32px 28px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:${C.ink}">
<h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:${C.ink}">${escapeHtml(heading)}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:${C.muted}">
Home Doctor gives general guidance, not a substitute for a licensed professional. If you smell gas, see sparks or smoke, or anyone is hurt, leave the area and call 911.<br><br>
You're getting this because you have a Home Doctor account. <a href="${escapeHtml(siteUrl)}/account" style="color:${C.muted}">Your account</a>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

function p(html: string): string {
  return `<p style="margin:0 0 14px">${html}</p>`;
}

const TIPS = [
  ["Get close, and get light.", "One close-up plus one wider shot works best."],
  ["Say what you've noticed.", "When it started, what it sounds or smells like, what you've tried."],
  ["Answer the follow-up questions.", "Each answer sharpens the diagnosis."],
];

export function welcomeEmail({ name, trialEndsAt, siteUrl }: { name: string | null; trialEndsAt: Date; siteUrl: string }): EmailContent {
  const first = name?.trim().split(/\s+/)[0];
  const ends = formatEmailDate(trialEndsAt);
  const heading = first ? `Welcome, ${first}. Your free trial is on.` : "Welcome. Your free trial is on.";
  const tips = TIPS.map(
    ([t, d]) => `<tr><td style="padding:6px 0;vertical-align:top;width:22px;color:${C.brand};font-weight:bold">&#10003;</td><td style="padding:6px 0"><strong>${t}</strong> ${d}</td></tr>`
  ).join("");
  const body = [
    p(
      `For the next ${TRIAL_DAYS} days, until <strong>${ends}</strong>, you can diagnose anything in the house, check contractor quotes before you sign, and ask follow-up questions. No card needed.`
    ),
    `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 0;font-size:15px">${tips}</table>`,
    button("Diagnose a problem", `${siteUrl}/diagnose`),
    `<p style="margin:12px 0 0;font-size:14px;color:${C.muted}">Your diagnoses are saved in <a href="${escapeHtml(siteUrl)}/history" style="color:${C.brand}">History</a>.</p>`,
  ].join("\n");
  return {
    subject: `Welcome to Home Doctor: your ${TRIAL_DAYS}-day free trial is on`,
    html: layout({ preheader: `Diagnose as much as you need until ${ends}. No card needed.`, heading, body, siteUrl }),
    text: [
      heading,
      "",
      `For the next ${TRIAL_DAYS} days, until ${ends}, you can diagnose anything in the house, check contractor quotes before you sign, and ask follow-up questions. No card needed.`,
      "",
      ...TIPS.map(([t, d]) => `- ${t} ${d}`),
      "",
      `Diagnose a problem: ${siteUrl}/diagnose`,
    ].join("\n"),
  };
}

export function trialEndingEmail({ trialEndsAt, siteUrl, now = new Date() }: { trialEndsAt: Date; siteUrl: string; now?: Date }): EmailContent {
  const ends = formatEmailDate(trialEndsAt);
  const days = easternDaysBetween(now, trialEndsAt);
  const when = days <= 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;
  const heading = `Your free trial ends ${when}`;
  const { monthly, yearly } = PLANS;
  const body = [
    p(`Your Home Doctor trial ends on <strong>${ends}</strong>. To keep diagnosing and checking quotes after that, pick a plan:`),
    `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:4px 0 0;border:1px solid ${C.line};border-radius:14px">
<tr><td style="padding:14px 16px;border-bottom:1px solid ${C.line}"><strong>${monthly.label}</strong><br><span style="color:${C.muted};font-size:14px">${monthly.note}</span></td><td align="right" style="padding:14px 16px;border-bottom:1px solid ${C.line};font-weight:bold">${monthly.priceLabel}</td></tr>
<tr><td style="padding:14px 16px"><strong>${yearly.label}</strong><br><span style="color:${C.muted};font-size:14px">${yearly.note}</span></td><td align="right" style="padding:14px 16px;font-weight:bold">${yearly.priceLabel}</td></tr>
</table>`,
    button("Choose a plan", `${siteUrl}/pricing`),
    `<p style="margin:12px 0 0;font-size:14px;color:${C.muted}">There's no card on file, so nothing is charged unless you subscribe. Your diagnoses stay in History either way.</p>`,
  ].join("\n");
  return {
    subject: `Your Home Doctor trial ends ${when}`,
    html: layout({ preheader: `Keep diagnosing for ${monthly.priceLabel} or ${yearly.priceLabel}.`, heading, body, siteUrl }),
    text: [
      heading,
      "",
      `Your Home Doctor trial ends on ${ends}. To keep diagnosing and checking quotes after that, pick a plan:`,
      `- ${monthly.label}: ${monthly.priceLabel}. ${monthly.note}`,
      `- ${yearly.label}: ${yearly.priceLabel}. ${yearly.note}`,
      "",
      `Choose a plan: ${siteUrl}/pricing`,
      "",
      "There's no card on file, so nothing is charged unless you subscribe. Your diagnoses stay in History either way.",
    ].join("\n"),
  };
}

export function receiptEmail({
  amountCents,
  currency,
  plan,
  paidAt,
  invoiceNumber,
  invoiceUrl,
  renewsAt,
  siteUrl,
}: {
  amountCents: number;
  currency: string;
  plan: Plan | null;
  paidAt: Date;
  invoiceNumber: string | null;
  invoiceUrl: string | null;
  renewsAt: Date | null;
  siteUrl: string;
}): EmailContent {
  const amount = formatMoney(amountCents, currency);
  const rows: [string, string][] = [
    ["Amount paid", amount],
    ["Plan", plan ? `Home Doctor ${plan.label}` : "Home Doctor"],
    ["Date", formatReceiptDate(paidAt)],
  ];
  if (invoiceNumber) rows.push(["Invoice", invoiceNumber]);
  if (renewsAt) rows.push(["Renews", formatReceiptDate(renewsAt)]);
  const table = rows
    .map(
      ([k, v], i) =>
        `<tr><td style="padding:12px 16px;white-space:nowrap;color:${C.muted};${i < rows.length - 1 ? `border-bottom:1px solid ${C.line};` : ""}">${k}</td><td align="right" style="padding:12px 16px;font-weight:bold;${i < rows.length - 1 ? `border-bottom:1px solid ${C.line};` : ""}">${escapeHtml(v)}</td></tr>`
    )
    .join("");
  const body = [
    p("Thanks for subscribing to Home Doctor. Here's your receipt."),
    `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:4px 0 0;border:1px solid ${C.line};border-radius:14px">${table}</table>`,
    invoiceUrl ? button("View invoice", invoiceUrl) : "",
    `<p style="margin:12px 0 0;font-size:14px;color:${C.muted}">Change plans, update your card or cancel anytime from <a href="${escapeHtml(siteUrl)}/account" style="color:${C.brand}">your account</a>.</p>`,
  ].join("\n");
  return {
    subject: `Your Home Doctor receipt (${amount})`,
    html: layout({ preheader: `${amount} paid. Thanks for subscribing.`, heading: "Thanks, you're all set", body, siteUrl }),
    text: [
      "Thanks, you're all set",
      "",
      "Thanks for subscribing to Home Doctor. Here's your receipt.",
      ...rows.map(([k, v]) => `${k}: ${v}`),
      ...(invoiceUrl ? ["", `View invoice: ${invoiceUrl}`] : []),
      "",
      `Manage your subscription: ${siteUrl}/account`,
    ].join("\n"),
  };
}
