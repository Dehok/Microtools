import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Meta Tag Generator — SEO Meta Tags & HTML Head Builder",
  description: "Generate HTML meta tags for SEO, social media, and search engines. Includes title, description, viewport, charset, and canonical tags.",
  keywords: ["meta tag generator","seo meta tags","html meta","meta description generator","seo tags"],
  openGraph: {
    title: "Meta Tag Generator — SEO Meta Tags & HTML Head Builder | CodeUtilo",
    description: "Generate HTML meta tags for SEO, social media, and search engines. Includes title, description, viewport, charset, and canonical tags.",
    url: "https://codeutilo.com/meta-tag-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Meta Tag Generator — SEO Meta Tags & HTML Head Builder | CodeUtilo",
    description: "Generate HTML meta tags for SEO, social media, and search engines. Includes title, description, viewport, charset, and canonical tags.",
  },
  alternates: {
    canonical: "https://codeutilo.com/meta-tag-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Meta Tag Generator"
        description="Generate HTML meta tags for SEO, social media, and search engines. Includes title, description, viewport, charset, and canonical tags."
        slug="meta-tag-generator"
      />
        <FAQSchema faqs={[{"question":"Is the Meta Tag Generator free to use?","answer":"Yes, the Meta Tag Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Meta Tag Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Meta Tag Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
