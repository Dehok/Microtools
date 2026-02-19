import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Schema Generator — Auto-Generate Schema from JSON",
  description: "Generate JSON Schema (2020-12 draft) from any JSON data. Auto-detects formats like email, URI, date, UUID. Handles nested objects and arrays.",
  keywords: ["json schema generator","generate json schema","json to schema","json schema maker","json schema from json"],
  openGraph: {
    title: "JSON Schema Generator — Auto-Generate Schema from JSON | CodeUtilo",
    description: "Generate JSON Schema (2020-12 draft) from any JSON data. Auto-detects formats like email, URI, date, UUID. Handles nested objects and arrays.",
    url: "https://codeutilo.com/json-schema-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Schema Generator — Auto-Generate Schema from JSON | CodeUtilo",
    description: "Generate JSON Schema (2020-12 draft) from any JSON data. Auto-detects formats like email, URI, date, UUID. Handles nested objects and arrays.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-schema-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON Schema Generator"
        description="Generate JSON Schema (2020-12 draft) from any JSON data. Auto-detects formats like email, URI, date, UUID. Handles nested objects and arrays."
        slug="json-schema-generator"
      />
      {children}
    </>
  );
}
