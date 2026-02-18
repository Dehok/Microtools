import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nginx Config Generator — Generate Server Blocks",
  description:
    "Generate nginx configuration for static sites, reverse proxy, SSL, and redirects. Copy server blocks instantly. Free nginx config tool.",
  keywords: ["nginx config generator", "nginx configuration", "nginx server block", "nginx reverse proxy", "nginx ssl config"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
