import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { safeNextPath } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

const REASONS: Record<string, { title: string; description: string }> = {
  more: {
    title: "Your free diagnosis is used up",
    description:
      "Create a free account to keep going. We'll save the diagnosis you already ran to your account.",
  },
  save: {
    title: "Save your diagnosis",
    description: "Create a free account to keep this diagnosis and come back to it later.",
  },
};

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const next = safeNextPath(typeof searchParams.next === "string" ? searchParams.next : null, "/diagnose");
  const reason = typeof searchParams.reason === "string" ? REASONS[searchParams.reason] : undefined;

  const { userId } = await getViewer();
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
          <LoginForm next={next} linkError={searchParams.error === "link"} />
        </CardContent>
      </Card>
    </main>
  );
}
