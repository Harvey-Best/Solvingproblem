import { NextResponse } from "next/server";

import { sendTrialEndingEmails } from "@/lib/email/transactional";
import { env } from "@/lib/env";

/**
 * Daily (vercel.json): emails everyone whose free trial ends in the next two
 * days. Vercel Cron sends `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: Request) {
  const secret = env.cronSecret;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tally = await sendTrialEndingEmails();
  console.info(JSON.stringify({ cron: "trial-reminders", ...tally }));
  return NextResponse.json(tally);
}
