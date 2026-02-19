import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Split PDF Online — Extract Pages from PDF Free",
  description: "Extract specific pages from a PDF file. Select page ranges or individual pages. Free, fast, private — runs in your browser.",
  keywords: ["split pdf","extract pages from pdf","pdf splitter online","separate pdf pages","split pdf free"],
  openGraph: {
    title: "Split PDF Online — Extract Pages from PDF Free | CodeUtilo",
    description: "Extract specific pages from a PDF file. Select page ranges or individual pages. Free, fast, private — runs in your browser.",
    url: "https://codeutilo.com/pdf-split",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Split PDF Online — Extract Pages from PDF Free | CodeUtilo",
    description: "Extract specific pages from a PDF file. Select page ranges or individual pages. Free, fast, private — runs in your browser.",
  },
  alternates: {
    canonical: "https://codeutilo.com/pdf-split",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="PDF Split"
        description="Extract specific pages from a PDF file. Select page ranges or individual pages. Free, fast, private — runs in your browser."
        slug="pdf-split"
      />
      {children}
    </>
  );
}
