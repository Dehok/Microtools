import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Schema Validator Online",
  description: "Validate JSON data against a JSON Schema. Check types, required fields, and constraints. Free tool.",
  keywords: ["json schema validator","validate json schema","json schema online","json validation","schema checker"],
  openGraph: {
    title: "JSON Schema Validator Online | CodeUtilo",
    description: "Validate JSON data against a JSON Schema. Check types, required fields, and constraints. Free tool.",
    url: "https://codeutilo.com/json-schema-validator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Schema Validator Online | CodeUtilo",
    description: "Validate JSON data against a JSON Schema. Check types, required fields, and constraints. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-schema-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON Schema Validator"
        description="Validate JSON data against a JSON Schema. Check types, required fields, and constraints. Free tool."
        slug="json-schema-validator"
      />
      {children}
    </>
  );
}
