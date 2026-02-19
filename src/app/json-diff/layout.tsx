import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Diff — Compare Two JSON Objects Online",
  description: "Compare two JSON objects and highlight added, removed, and modified keys. Free online JSON diff.",
  keywords: ["json diff","compare json","json comparison","json diff online","json compare tool"],
  openGraph: {
    title: "JSON Diff — Compare Two JSON Objects Online | CodeUtilo",
    description: "Compare two JSON objects and highlight added, removed, and modified keys. Free online JSON diff.",
    url: "https://codeutilo.com/json-diff",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Diff — Compare Two JSON Objects Online | CodeUtilo",
    description: "Compare two JSON objects and highlight added, removed, and modified keys. Free online JSON diff.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-diff",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON Diff"
        description="Compare two JSON objects and highlight added, removed, and modified keys. Free online JSON diff."
        slug="json-diff"
      />
      {children}
    </>
  );
}
