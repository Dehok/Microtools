import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Contrast Checker — WCAG Accessibility Validator",
  description:
    "Check color contrast ratios for WCAG 2.1 compliance. Test text and background colors for AA and AAA accessibility standards.",
  keywords: ["color contrast checker", "wcag contrast", "accessibility checker", "contrast ratio", "color accessibility"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
