import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isGoogleSignInEnabled } from "@/lib/auth-providers";
import { safeNextPath } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: true } };

const REASONS: Record<string, { title: string; description: string }> = {
  more: {
    title: "Your free diagnosis is used up",
    description:
      "Create an account to start your 7-day free trial, no card needed. We'll save the diagnosis you already ran.",
  },
  trial: {
    title: "Start your 7-day free trial",
    description: "Create an account in a few seconds. No card needed.",
  },
  subscribe: {
    title: "Sign in to choose a plan",
    description: "New here? Creating an account starts your 7-day free trial first. No card needed.",
  },
  save: {
    title: "Save your results",
    description: "Create a free account to keep this and come back to it later.",
  },
  quote: {
    title: "Your free quote check is used up",
    description:
      "Create an account to start your 7-day free trial, no card needed. We'll save the quote you already checked.",
  },
  history: {
    title: "Sign in to see your history",
    description: "Your diagnoses and quote checks are saved to your account.",
  },
};

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const next = safeNextPath(typeof searchParams.next === "string" ? searchParams.next : null, "/diagnose");
  const reason = typeof searchParams.reason === "string" ? REASONS[searchParams.reason] : undefined;

  const [{ userId }, googleEnabled] = await Promise.all([getViewer(), isGoogleSignInEnabled()]);
  if (userId) redirect(next);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-[1.75rem] font-semibold">{reason?.title ?? "Sign in to Home Doctor"}</CardTitle>
          <CardDescription>
            {reason?.description ?? "No password needed. We'll email you a link and a code."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm next={next} linkError={searchParams.error === "link"} googleEnabled={googleEnabled} />
        </CardContent>
      </Card>
    </main>
  );
}
