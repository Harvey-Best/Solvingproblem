import Link from "next/link";

import { signOut } from "@/app/(site)/login/actions";
import { HouseCallTemplate } from "@/components/landing/house-call";
import { BLUE } from "@/components/landing/themes";
import { TrackOnMount } from "@/components/track-on-mount";
import { getViewer } from "@/lib/viewer";

const navLink =
  "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-(--accent-soft)";

async function LandingNav() {
  const { userId } = await getViewer();
  if (!userId) {
    return (
      <Link href="/login" className={navLink}>
        Sign in
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <Link href="/history" className={navLink}>
        History
      </Link>
      <form action={signOut}>
        <button type="submit" className={navLink}>
          Sign out
        </button>
      </form>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <TrackOnMount event="landing_view" />
      <HouseCallTemplate theme={BLUE} homeHref="/" nav={<LandingNav />} preview={false} />
    </>
  );
}
