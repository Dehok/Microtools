import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Nginx Config Generator — Generate Server Blocks",
  description: "Generate nginx configuration for static sites, reverse proxy, SSL, and redirects. Copy server blocks instantly. Free nginx config tool.",
  keywords: ["nginx config generator","nginx configuration","nginx server block","nginx reverse proxy","nginx ssl config"],
  openGraph: {
    title: "Nginx Config Generator — Generate Server Blocks | CodeUtilo",
    description: "Generate nginx configuration for static sites, reverse proxy, SSL, and redirects. Copy server blocks instantly. Free nginx config tool.",
    url: "https://codeutilo.com/nginx-config-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Nginx Config Generator — Generate Server Blocks | CodeUtilo",
    description: "Generate nginx configuration for static sites, reverse proxy, SSL, and redirects. Copy server blocks instantly. Free nginx config tool.",
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
        description="Generate nginx configuration for static sites, reverse proxy, SSL, and redirects. Copy server blocks instantly. Free nginx config tool."
        slug="nginx-config-generator"
      />
      {children}
    </>
  );
}
