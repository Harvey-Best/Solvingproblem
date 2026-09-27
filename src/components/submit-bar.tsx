/** Fixed bottom action bar for the photo forms, clear of the iPhone home indicator. */
export function SubmitBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  );
}
