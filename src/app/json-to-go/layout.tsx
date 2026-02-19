import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to Go Struct Generator Online",
  description: "Generate Go struct definitions from JSON data. Handles nested objects and arrays. Free online tool.",
  keywords: ["json to go","json to go struct","go struct generator","golang json","convert json to go"],
  openGraph: {
    title: "JSON to Go Struct Generator Online | CodeUtilo",
    description: "Generate Go struct definitions from JSON data. Handles nested objects and arrays. Free online tool.",
    url: "https://codeutilo.com/json-to-go",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to Go Struct Generator Online | CodeUtilo",
    description: "Generate Go struct definitions from JSON data. Handles nested objects and arrays. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-to-go",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON to Go Struct"
        description="Generate Go struct definitions from JSON data. Handles nested objects and arrays. Free online tool."
        slug="json-to-go"
      />
      {children}
    </>
  );
}
