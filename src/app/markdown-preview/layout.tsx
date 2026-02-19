import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Markdown Editor & Preview Online",
  description: "Write Markdown and preview the rendered HTML output in real time. Free online Markdown editor.",
  keywords: ["markdown preview","markdown editor online","markdown to html","live markdown editor","markdown viewer"],
  openGraph: {
    title: "Markdown Editor & Preview Online | CodeUtilo",
    description: "Write Markdown and preview the rendered HTML output in real time. Free online Markdown editor.",
    url: "https://codeutilo.com/markdown-preview",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Markdown Editor & Preview Online | CodeUtilo",
    description: "Write Markdown and preview the rendered HTML output in real time. Free online Markdown editor.",
  },
  alternates: {
    canonical: "https://codeutilo.com/markdown-preview",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Markdown Preview"
        description="Write Markdown and preview the rendered HTML output in real time. Free online Markdown editor."
        slug="markdown-preview"
      />
      {children}
    </>
  );
}
