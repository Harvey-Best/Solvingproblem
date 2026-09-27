import { NotFoundContent } from "@/components/not-found-content";

/** notFound() inside the site renders within (site)/layout, which already has the header. */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
