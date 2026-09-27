export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/60">
      <div className="mx-auto w-full max-w-3xl space-y-2 px-4 py-6 text-xs leading-relaxed text-muted-foreground">
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
