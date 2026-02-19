import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: ".htaccess Generator — Redirects, SSL & Caching",
  description: "Generate .htaccess rules for redirects, HTTPS, caching, and security headers. Free online tool.",
  keywords: ["htaccess generator",".htaccess","htaccess redirect","htaccess ssl","apache htaccess"],
  openGraph: {
    title: ".htaccess Generator — Redirects, SSL & Caching | CodeUtilo",
    description: "Generate .htaccess rules for redirects, HTTPS, caching, and security headers. Free online tool.",
    url: "https://codeutilo.com/htaccess-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: ".htaccess Generator — Redirects, SSL & Caching | CodeUtilo",
    description: "Generate .htaccess rules for redirects, HTTPS, caching, and security headers. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/htaccess-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name=".htaccess Generator"
        description="Generate .htaccess rules for redirects, HTTPS, caching, and security headers. Free online tool."
        slug="htaccess-generator"
      />
      {children}
    </>
  );
}
