import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Diff — Compare JSON Objects Online",
  description: "Compare two JSON objects and highlight differences. Find added, removed, and modified keys. Free online JSON diff tool.",
  keywords: ["json diff","json compare","compare json","json difference","json diff tool"],
  openGraph: {
    title: "JSON Diff — Compare JSON Objects Online | CodeUtilo",
    description: "Compare two JSON objects and highlight differences. Find added, removed, and modified keys. Free online JSON diff tool.",
    url: "https://codeutilo.com/json-diff",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Diff — Compare JSON Objects Online | CodeUtilo",
    description: "Compare two JSON objects and highlight differences. Find added, removed, and modified keys. Free online JSON diff tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-diff",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Diff"
        description="Compare two JSON objects and highlight differences. Find added, removed, and modified keys. Free online JSON diff tool."
        slug="json-diff"
      />
      {children}
    </>
  );
}
