import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Open Graph Meta Tag Generator — OG Tags for Social Media",
  description: "Generate Open Graph and Twitter Card meta tags for perfect social media previews. Free online OG tag generator.",
  keywords: ["open graph generator","og tags generator","meta tag generator","twitter card generator","social media preview"],
  openGraph: {
    title: "Open Graph Meta Tag Generator — OG Tags for Social Media | CodeUtilo",
    description: "Generate Open Graph and Twitter Card meta tags for perfect social media previews. Free online OG tag generator.",
    url: "https://codeutilo.com/og-meta-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Open Graph Meta Tag Generator — OG Tags for Social Media | CodeUtilo",
    description: "Generate Open Graph and Twitter Card meta tags for perfect social media previews. Free online OG tag generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/og-meta-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Og Meta Generator"
        description="Generate Open Graph and Twitter Card meta tags for perfect social media previews. Free online OG tag generator."
        slug="og-meta-generator"
      />
        <FAQSchema faqs={[{"question":"Is the Open Graph Generator free to use?","answer":"Yes, the Open Graph Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Open Graph Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Open Graph Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
