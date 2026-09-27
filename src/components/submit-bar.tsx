/**
 * Fixed bottom action bar for the photo forms, clear of the iPhone home indicator
 * and the notch in landscape. globals.css pads the body by its height while it's
 * on the page, so nothing ends up hidden behind it.
 */
export function SubmitBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="submit-bar"
      className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-3 backdrop-blur"
    >
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  );
}
