import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Line Sorter & Deduplicator Online",
  description: "Sort lines alphabetically, numerically, or by length. Remove duplicates. Free online line sorter.",
  keywords: ["line sorter","sort lines online","remove duplicate lines","text line sorter","deduplicator"],
  openGraph: {
    title: "Line Sorter & Deduplicator Online | CodeUtilo",
    description: "Sort lines alphabetically, numerically, or by length. Remove duplicates. Free online line sorter.",
    url: "https://codeutilo.com/line-sorter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Line Sorter & Deduplicator Online | CodeUtilo",
    description: "Sort lines alphabetically, numerically, or by length. Remove duplicates. Free online line sorter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/line-sorter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Line Sorter & Deduplicator"
        description="Sort lines alphabetically, numerically, or by length. Remove duplicates. Free online line sorter."
        slug="line-sorter"
      />
      {children}
    </>
  );
}
