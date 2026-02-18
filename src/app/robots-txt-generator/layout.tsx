import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "robots.txt Generator Online — Create Robots.txt File",
  description: "Generate a robots.txt file for your website. Set crawl rules for search engines, add sitemaps, and control bot access. Free online tool.",
  keywords: ["robots.txt generator","robots txt","create robots.txt","seo robots","crawl rules"],
  openGraph: {
    title: "robots.txt Generator Online — Create Robots.txt File | CodeUtilo",
    description: "Generate a robots.txt file for your website. Set crawl rules for search engines, add sitemaps, and control bot access. Free online tool.",
    url: "https://codeutilo.com/robots-txt-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "robots.txt Generator Online — Create Robots.txt File | CodeUtilo",
    description: "Generate a robots.txt file for your website. Set crawl rules for search engines, add sitemaps, and control bot access. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/robots-txt-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Robots Txt Generator"
        description="Generate a robots.txt file for your website. Set crawl rules for search engines, add sitemaps, and control bot access. Free online tool."
        slug="robots-txt-generator"
      />
        <FAQSchema faqs={[{"question":"Is the robots.txt Generator free to use?","answer":"Yes, the robots.txt Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The robots.txt Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The robots.txt Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
