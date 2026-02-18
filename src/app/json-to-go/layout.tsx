import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to Go Struct — Generate Go Types from JSON",
  description: "Convert JSON data to Go struct definitions. Handles nested objects, arrays, and null values. Free JSON to Go converter.",
  keywords: ["json to go","json to go struct","go struct generator","json to golang","convert json to go"],
  openGraph: {
    title: "JSON to Go Struct — Generate Go Types from JSON | CodeUtilo",
    description: "Convert JSON data to Go struct definitions. Handles nested objects, arrays, and null values. Free JSON to Go converter.",
    url: "https://codeutilo.com/json-to-go",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to Go Struct — Generate Go Types from JSON | CodeUtilo",
    description: "Convert JSON data to Go struct definitions. Handles nested objects, arrays, and null values. Free JSON to Go converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-to-go",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json To Go"
        description="Convert JSON data to Go struct definitions. Handles nested objects, arrays, and null values. Free JSON to Go converter."
        slug="json-to-go"
      />
      {children}
    </>
  );
}
