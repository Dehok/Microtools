import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the .htaccess Generator free to use?","answer":"Yes, the .htaccess Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The .htaccess Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The .htaccess Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
