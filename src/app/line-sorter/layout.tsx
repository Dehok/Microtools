import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Line Sorter & Deduplicator — Sort Lines Online",
  description: "Sort lines alphabetically, numerically, or by length. Remove duplicates and empty lines. Free online line sorter tool.",
  keywords: ["line sorter","sort lines online","remove duplicate lines","alphabetical sort","line deduplicator","text sorter"],
  openGraph: {
    title: "Line Sorter & Deduplicator — Sort Lines Online | CodeUtilo",
    description: "Sort lines alphabetically, numerically, or by length. Remove duplicates and empty lines. Free online line sorter tool.",
    url: "https://codeutilo.com/line-sorter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Line Sorter & Deduplicator — Sort Lines Online | CodeUtilo",
    description: "Sort lines alphabetically, numerically, or by length. Remove duplicates and empty lines. Free online line sorter tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/line-sorter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Line Sorter"
        description="Sort lines alphabetically, numerically, or by length. Remove duplicates and empty lines. Free online line sorter tool."
        slug="line-sorter"
      />
      {children}
    </>
  );
}
