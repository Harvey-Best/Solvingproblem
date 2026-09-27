import type { Metadata } from "next";

import { TemplateSwitcher } from "@/components/templates/switcher";

export const metadata: Metadata = {
  title: "Design templates",
  robots: { index: false },
};

export default function TemplatesLayout({ children }: LayoutProps<"/templates">) {
  return (
    <>
      {children}
      <TemplateSwitcher />
    </>
  );
}
