import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Contrast Checker — WCAG AA & AAA Validator",
  description: "Check WCAG 2.1 color contrast ratios. Validate AA and AAA accessibility standards. Free tool.",
  keywords: ["color contrast checker","wcag contrast","contrast ratio checker","accessibility color","aa aaa contrast"],
  openGraph: {
    title: "Color Contrast Checker — WCAG AA & AAA Validator | CodeUtilo",
    description: "Check WCAG 2.1 color contrast ratios. Validate AA and AAA accessibility standards. Free tool.",
    url: "https://codeutilo.com/color-contrast-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Contrast Checker — WCAG AA & AAA Validator | CodeUtilo",
    description: "Check WCAG 2.1 color contrast ratios. Validate AA and AAA accessibility standards. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/color-contrast-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Color Contrast Checker"
        description="Check WCAG 2.1 color contrast ratios. Validate AA and AAA accessibility standards. Free tool."
        slug="color-contrast-checker"
      />
      {children}
    </>
  );
}
