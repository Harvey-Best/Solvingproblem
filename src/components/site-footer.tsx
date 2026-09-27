import Link from "next/link";

export const FOOTER_LINKS = [
  { href: "/diagnose", label: "Diagnose a problem" },
  { href: "/quote", label: "Check a quote" },
  { href: "/guides", label: "Repair guides" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/60">
      <div className="mx-auto w-full max-w-3xl space-y-3 px-4 py-6 text-xs leading-relaxed text-muted-foreground">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium text-foreground">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p>
          <strong className="text-foreground">Home Doctor gives general guidance, not a substitute for a licensed professional.</strong>{" "}
          It can&apos;t see everything a pro would see in person. Safety escalations are there for a reason: if
          we tell you to stop and call a pro, do that first.
        </p>
        <p>If you smell gas, see sparks or smoke, or anyone is hurt, leave the area and call 911.</p>
        <p>© {new Date().getFullYear()} Home Doctor</p>
      </div>
    </footer>
  );
}
