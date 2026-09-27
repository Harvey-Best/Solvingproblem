import type { Metadata } from "next";

import { TemplateSwitcher } from "@/components/templates/switcher";

import "./templates.css";

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
