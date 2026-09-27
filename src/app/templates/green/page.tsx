import type { Metadata } from "next";

import { HouseCallTemplate } from "@/components/templates/house-call";
import { GREEN } from "@/components/templates/house-call-themes";

export const metadata: Metadata = { title: "Template: Green" };

export default function GreenTemplate() {
  return <HouseCallTemplate theme={GREEN} />;
}
