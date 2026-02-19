import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Nginx Config Generator — Server Block Builder",
  description: "Generate nginx server blocks for static sites, reverse proxy, SSL, and redirects. Free online tool.",
  keywords: ["nginx config generator","nginx server block","nginx configuration","nginx reverse proxy","nginx ssl config"],
  openGraph: {
    title: "Nginx Config Generator — Server Block Builder | CodeUtilo",
    description: "Generate nginx server blocks for static sites, reverse proxy, SSL, and redirects. Free online tool.",
    url: "https://codeutilo.com/nginx-config-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Nginx Config Generator — Server Block Builder | CodeUtilo",
    description: "Generate nginx server blocks for static sites, reverse proxy, SSL, and redirects. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/nginx-config-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Nginx Config Generator"
        description="Generate nginx server blocks for static sites, reverse proxy, SSL, and redirects. Free online tool."
        slug="nginx-config-generator"
      />
      {children}
    </>
  );
}
