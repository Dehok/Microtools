import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Merge PDF Online — Combine PDF Files Free",
  description: "Combine multiple PDF files into one document. Reorder pages, merge instantly. Free, private — files never leave your browser.",
  keywords: ["merge pdf","combine pdf","pdf merger online","join pdf files","merge pdf free"],
  openGraph: {
    title: "Merge PDF Online — Combine PDF Files Free | CodeUtilo",
    description: "Combine multiple PDF files into one document. Reorder pages, merge instantly. Free, private — files never leave your browser.",
    url: "https://codeutilo.com/pdf-merge",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Merge PDF Online — Combine PDF Files Free | CodeUtilo",
    description: "Combine multiple PDF files into one document. Reorder pages, merge instantly. Free, private — files never leave your browser.",
  },
  alternates: {
    canonical: "https://codeutilo.com/pdf-merge",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="PDF Merge"
        description="Combine multiple PDF files into one document. Reorder pages, merge instantly. Free, private — files never leave your browser."
        slug="pdf-merge"
      />
      {children}
    </>
  );
}
