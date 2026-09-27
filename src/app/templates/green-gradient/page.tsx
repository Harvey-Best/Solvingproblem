import type { Metadata } from "next";

import { HouseCallTemplate } from "@/components/templates/house-call";
import { GREEN_GRADIENT } from "@/components/templates/house-call-themes";

export const metadata: Metadata = { title: "Template: Green gradient" };

export default function GreenGradientTemplate() {
  return <HouseCallTemplate theme={GREEN_GRADIENT} />;
}
