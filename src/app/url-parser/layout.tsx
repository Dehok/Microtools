import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "URL Parser — Break Down URLs Into Components",
  description: "Parse URLs into protocol, hostname, port, path, query parameters, and hash. Free online URL parser.",
  keywords: ["url parser","parse url online","url components","query string parser","url breakdown"],
  openGraph: {
    title: "URL Parser — Break Down URLs Into Components | CodeUtilo",
    description: "Parse URLs into protocol, hostname, port, path, query parameters, and hash. Free online URL parser.",
    url: "https://codeutilo.com/url-parser",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "URL Parser — Break Down URLs Into Components | CodeUtilo",
    description: "Parse URLs into protocol, hostname, port, path, query parameters, and hash. Free online URL parser.",
  },
  alternates: {
    canonical: "https://codeutilo.com/url-parser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Url Parser"
        description="Parse URLs into protocol, hostname, port, path, query parameters, and hash. Free online URL parser."
        slug="url-parser"
      />
      {children}
    </>
  );
}
