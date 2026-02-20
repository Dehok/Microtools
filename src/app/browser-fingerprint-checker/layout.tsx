import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Browser Fingerprint Checker",
  description:
    "Inspect browser fingerprint signals like canvas hash, WebGL renderer, timezone, and device info locally in your browser.",
  keywords: ["browser fingerprint checker", "fingerprint test", "browser privacy test", "canvas fingerprint"],
  openGraph: {
    title: "Browser Fingerprint Checker | CodeUtilo",
    description:
      "Inspect browser fingerprint signals like canvas hash, WebGL renderer, timezone, and device info locally in your browser.",
    url: "https://codeutilo.com/browser-fingerprint-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Browser Fingerprint Checker | CodeUtilo",
    description:
      "Inspect browser fingerprint signals like canvas hash, WebGL renderer, timezone, and device info locally in your browser.",
  },
  alternates: {
    canonical: "https://codeutilo.com/browser-fingerprint-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Browser Fingerprint Checker"
        description="Analyze fingerprint-related browser signals locally without uploading data."
        slug="browser-fingerprint-checker"
      />
      {children}
    </>
  );
}
