import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Schema Validator Online — Validate JSON Against Schema",
  description: "Validate JSON data against a JSON Schema. Check types, required fields, patterns, and constraints. Free online JSON schema validator.",
  keywords: ["json schema validator","json validation","json schema","validate json","json schema online"],
  openGraph: {
    title: "JSON Schema Validator Online — Validate JSON Against Schema | CodeUtilo",
    description: "Validate JSON data against a JSON Schema. Check types, required fields, patterns, and constraints. Free online JSON schema validator.",
    url: "https://codeutilo.com/json-schema-validator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Schema Validator Online — Validate JSON Against Schema | CodeUtilo",
    description: "Validate JSON data against a JSON Schema. Check types, required fields, patterns, and constraints. Free online JSON schema validator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-schema-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Schema Validator"
        description="Validate JSON data against a JSON Schema. Check types, required fields, patterns, and constraints. Free online JSON schema validator."
        slug="json-schema-validator"
      />
      {children}
    </>
  );
}
