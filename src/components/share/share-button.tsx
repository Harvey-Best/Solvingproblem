"use client";

import { useRef, useState } from "react";
import { DropdownMenu } from "radix-ui";
import { Download, Link2, Link2Off, Loader2, MoreHorizontal, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

/** A share link as the server hands it over: the page URL and the square card image. */
export type ShareLinkState = { url: string; imageUrl: string };

const PRIVACY_NOTE = "Anyone with the link sees a summary. Photos and notes stay private.";

const absolute = (url: string) => new URL(url, window.location.origin).toString();

function imageFileName(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `home-doctor-${slug || "diagnosis"}.png`;
}

async function fetchImageFile(imageUrl: string, name: string): Promise<File | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    return new File([await res.blob()], name, { type: "image/png" });
  } catch {
    return null;
  }
}

/** Resolves to the fallback if the promise takes longer than `ms`. */
function within<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);
}

const errorName = (err: unknown) => (err instanceof Error ? err.name : "");

/**
 * Share button for the owner's result page. The first tap creates the link,
 * then opens the phone's share sheet (with the square card image attached
 * where the browser allows files), or copies the link on desktop.
 */
export function ShareButton({
  diagnosisId,
  title,
  initialLink,
}: {
  diagnosisId: string;
  title: string;
  initialLink: ShareLinkState | null;
}) {
  const [link, setLink] = useState<ShareLinkState | null>(initialLink);
  const [busy, setBusy] = useState<"share" | "stop" | null>(null);
  const image = useRef<{ url: string; file: Promise<File | null> } | null>(null);

  function imageFile(current: ShareLinkState) {
    if (image.current?.url !== current.imageUrl) {
      image.current = { url: current.imageUrl, file: fetchImageFile(current.imageUrl, imageFileName(title)) };
    }
    return image.current.file;
  }

  async function createLink(): Promise<ShareLinkState | null> {
    try {
      const res = await fetch(`/api/diagnose/${diagnosisId}/share`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && typeof data.url === "string" && typeof data.imageUrl === "string") {
        const created = { url: data.url, imageUrl: data.imageUrl };
        setLink(created);
        return created;
      }
      toast.error(data.message ?? "We couldn't make a link. Please try again.");
    } catch {
      toast.error("We lost the connection. Check your signal and try again.");
    }
    return null;
  }

  async function copyLink(current: ShareLinkState) {
    const url = absolute(current.url);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", { description: PRIVACY_NOTE });
      track("result_shared", { method: "copy_link" });
    } catch {
      // Some browsers only allow copying straight from a tap: offer one.
      toast("Your link is ready", {
        description: url,
        action: { label: "Copy", onClick: () => void copyLink(current) },
      });
    }
  }

  async function openShareSheet(current: ShareLinkState, file: File | null) {
    const data: ShareData = {
      title,
      text: `${title}, diagnosed from a photo with Home Doctor`,
      url: absolute(current.url),
    };
    if (file && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
      data.files = [file];
    }
    await navigator.share(data);
    track("result_shared", { method: "share_sheet", with_image: Boolean(data.files) });
  }

  async function share() {
    if (busy) return;
    setBusy("share");
    try {
      const current = link ?? (await createLink());
      if (!current) return;
      if (typeof navigator.share !== "function") {
        await copyLink(current);
        return;
      }
      // Don't hold the share sheet for long: browsers only open it shortly after a tap.
      const file = await within(imageFile(current), 2000, null);
      try {
        await openShareSheet(current, file);
      } catch (err) {
        const name = errorName(err);
        if (name === "AbortError") return; // closed the share sheet
        if (name === "NotAllowedError") {
          // Too long since the tap (slow network): a second tap opens it.
          toast("Your link is ready", {
            description: PRIVACY_NOTE,
            action: {
              label: "Share",
              onClick: () => {
                void imageFile(current).then((f) => openShareSheet(current, f).catch(() => copyLink(current)));
              },
            },
          });
          return;
        }
        await copyLink(current);
      }
    } finally {
      setBusy(null);
    }
  }

  async function stopSharing() {
    if (busy || !link) return;
    setBusy("stop");
    try {
      const res = await fetch(`/api/diagnose/${diagnosisId}/share`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setLink(null);
        image.current = null;
        toast.success("Sharing stopped", { description: "The link no longer works." });
      } else {
        toast.error(data.message ?? "We couldn't stop sharing. Please try again.");
      }
    } catch {
      toast.error("We lost the connection. Check your signal and try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {link && (
        <span className="mr-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" /> Public link
        </span>
      )}
      <Button type="button" variant="outline" size="sm" onClick={share} disabled={busy !== null}>
        {busy === "share" ? <Loader2 className="animate-spin" /> : <Share2 className="text-primary" />}
        {link ? "Share" : "Share result"}
      </Button>
      {link && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button type="button" variant="outline" size="sm" className="w-8 px-0" aria-label="More sharing options" disabled={busy !== null}>
              {busy === "stop" ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={6}
              className="z-50 min-w-48 rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
            >
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-accent [&_svg]:size-4"
                onSelect={() => void copyLink(link)}
              >
                <Link2 /> Copy link
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-highlighted:bg-accent [&_svg]:size-4">
                <a
                  href={link.imageUrl}
                  download={imageFileName(title)}
                  onClick={() => track("result_shared", { method: "download_image" })}
                >
                  <Download /> Download image
                </a>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive outline-none data-highlighted:bg-red-50 [&_svg]:size-4"
                onSelect={() => void stopSharing()}
              >
                <Link2Off /> Stop sharing
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </div>
  );
}
