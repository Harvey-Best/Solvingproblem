import { OG_CONTENT_TYPE, OG_SIZE, renderHomeOgImage } from "@/lib/og/render";

export const alt = "Home Doctor: point your phone at the problem, know what's wrong in 30 seconds.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderHomeOgImage();
}
