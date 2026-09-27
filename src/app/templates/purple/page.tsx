import type { Metadata } from "next";

import { HouseCallTemplate } from "@/components/templates/house-call";
import { PURPLE } from "@/components/templates/house-call-themes";

export const metadata: Metadata = { title: "Template: Purple gradient" };

export default function PurpleTemplate() {
  return <HouseCallTemplate theme={PURPLE} />;
}
