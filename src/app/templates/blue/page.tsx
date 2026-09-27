import type { Metadata } from "next";

import { HouseCallTemplate } from "@/components/templates/house-call";
import { BLUE } from "@/components/templates/house-call-themes";

export const metadata: Metadata = { title: "Template: Blue gradient" };

export default function BlueTemplate() {
  return <HouseCallTemplate theme={BLUE} />;
}
