import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ".htaccess Generator — Apache Redirect & Rewrite Rules",
  description:
    "Generate .htaccess rules for redirects, rewrites, HTTPS forcing, www handling, caching, and security headers. Free online generator.",
  keywords: ["htaccess generator", "htaccess redirect", "apache rewrite", "htaccess rules", "301 redirect generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
