import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSP Header Builder",
  description:
    "Generate Content-Security-Policy headers with practical defaults and common risk warnings.",
  keywords: ["csp header builder", "content-security-policy generator", "csp policy", "security headers"],
  openGraph: {
    title: "CSP Header Builder | CodeUtilo",
    description:
      "Generate Content-Security-Policy headers with practical defaults and common risk warnings.",
    url: "https://codeutilo.com/csp-header-builder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSP Header Builder | CodeUtilo",
    description:
      "Generate Content-Security-Policy headers with practical defaults and common risk warnings.",
  },
  alternates: {
    canonical: "https://codeutilo.com/csp-header-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSP Header Builder"
        description="Build and review Content-Security-Policy headers in your browser."
        slug="csp-header-builder"
      />
      {children}
    </>
  );
}
