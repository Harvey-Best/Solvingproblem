import type { Metadata } from "next";

import { HouseCallTemplate } from "@/components/landing/house-call";
import { PURPLE } from "@/components/landing/themes";

export const metadata: Metadata = { title: "Template: Purple gradient" };

export default function PurpleTemplate() {
  return <HouseCallTemplate theme={PURPLE} />;
}
