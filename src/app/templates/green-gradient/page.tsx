import type { Metadata } from "next";

import { HouseCallTemplate } from "@/components/landing/house-call";
import { GREEN_GRADIENT } from "@/components/landing/themes";

export const metadata: Metadata = { title: "Template: Green gradient" };

export default function GreenGradientTemplate() {
  return <HouseCallTemplate theme={GREEN_GRADIENT} />;
}
