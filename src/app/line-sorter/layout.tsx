import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the Line Sorter & Deduplicator free to use?","answer":"Yes, the Line Sorter & Deduplicator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Line Sorter & Deduplicator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Line Sorter & Deduplicator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
