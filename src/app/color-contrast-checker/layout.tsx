import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Contrast Checker — WCAG Accessibility Validator",
  description: "Check color contrast ratios for WCAG 2.1 compliance. Test text and background colors for AA and AAA accessibility standards.",
  keywords: ["color contrast checker","wcag contrast","accessibility checker","contrast ratio","color accessibility"],
  openGraph: {
    title: "Color Contrast Checker — WCAG Accessibility Validator | CodeUtilo",
    description: "Check color contrast ratios for WCAG 2.1 compliance. Test text and background colors for AA and AAA accessibility standards.",
    url: "https://codeutilo.com/color-contrast-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Contrast Checker — WCAG Accessibility Validator | CodeUtilo",
    description: "Check color contrast ratios for WCAG 2.1 compliance. Test text and background colors for AA and AAA accessibility standards.",
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
        description="Check color contrast ratios for WCAG 2.1 compliance. Test text and background colors for AA and AAA accessibility standards."
        slug="color-contrast-checker"
      />
      {children}
    </>
  );
}
