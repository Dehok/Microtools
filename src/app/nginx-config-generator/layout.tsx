import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the Nginx Config Generator free to use?","answer":"Yes, the Nginx Config Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Nginx Config Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Nginx Config Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
