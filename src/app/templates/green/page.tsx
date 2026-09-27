import type { Metadata } from "next";

import { HouseCallTemplate } from "@/components/landing/house-call";
import { GREEN } from "@/components/landing/themes";

export const metadata: Metadata = { title: "Template: Green" };

export default function GreenTemplate() {
  return <HouseCallTemplate theme={GREEN} />;
}
