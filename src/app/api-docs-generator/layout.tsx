import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "API Docs Generator — OpenAPI 3.0 Swagger Builder",
  description: "Generate OpenAPI 3.0 (Swagger) documentation visually. Build endpoints, configure parameters, tags, and responses. Export YAML.",
  keywords: ["api docs generator","openapi generator","swagger builder","api documentation tool","openapi yaml generator"],
  openGraph: {
    title: "API Docs Generator — OpenAPI 3.0 Swagger Builder | CodeUtilo",
    description: "Generate OpenAPI 3.0 (Swagger) documentation visually. Build endpoints, configure parameters, tags, and responses. Export YAML.",
    url: "https://codeutilo.com/api-docs-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "API Docs Generator — OpenAPI 3.0 Swagger Builder | CodeUtilo",
    description: "Generate OpenAPI 3.0 (Swagger) documentation visually. Build endpoints, configure parameters, tags, and responses. Export YAML.",
  },
  alternates: {
    canonical: "https://codeutilo.com/api-docs-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="API Docs Generator"
        description="Generate OpenAPI 3.0 (Swagger) documentation visually. Build endpoints, configure parameters, tags, and responses. Export YAML."
        slug="api-docs-generator"
      />
      {children}
    </>
  );
}
