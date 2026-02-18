import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: ".htaccess Generator — Apache Redirect & Rewrite Rules",
  description: "Generate .htaccess rules for redirects, rewrites, HTTPS forcing, www handling, caching, and security headers. Free online generator.",
  keywords: ["htaccess generator","htaccess redirect","apache rewrite","htaccess rules","301 redirect generator"],
  openGraph: {
    title: ".htaccess Generator — Apache Redirect & Rewrite Rules | CodeUtilo",
    description: "Generate .htaccess rules for redirects, rewrites, HTTPS forcing, www handling, caching, and security headers. Free online generator.",
    url: "https://codeutilo.com/htaccess-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: ".htaccess Generator — Apache Redirect & Rewrite Rules | CodeUtilo",
    description: "Generate .htaccess rules for redirects, rewrites, HTTPS forcing, www handling, caching, and security headers. Free online generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/htaccess-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Htaccess Generator"
        description="Generate .htaccess rules for redirects, rewrites, HTTPS forcing, www handling, caching, and security headers. Free online generator."
        slug="htaccess-generator"
      />
      {children}
    </>
  );
}
