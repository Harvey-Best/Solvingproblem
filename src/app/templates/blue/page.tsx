import type { Metadata } from "next";

import { HouseCallTemplate } from "@/components/landing/house-call";
import { BLUE } from "@/components/landing/themes";

export const metadata: Metadata = { title: "Template: Blue gradient" };

export default function BlueTemplate() {
  return <HouseCallTemplate theme={BLUE} />;
}
