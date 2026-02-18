import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTTP Status Codes Reference — Complete List with Descriptions",
  description: "Complete reference of all HTTP status codes (1xx-5xx). Search and filter status codes with descriptions and usage examples.",
  keywords: ["http status codes","http codes","status code list","http 404","http response codes"],
  openGraph: {
    title: "HTTP Status Codes Reference — Complete List with Descriptions | CodeUtilo",
    description: "Complete reference of all HTTP status codes (1xx-5xx). Search and filter status codes with descriptions and usage examples.",
    url: "https://codeutilo.com/http-status-codes",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTTP Status Codes Reference — Complete List with Descriptions | CodeUtilo",
    description: "Complete reference of all HTTP status codes (1xx-5xx). Search and filter status codes with descriptions and usage examples.",
  },
  alternates: {
    canonical: "https://codeutilo.com/http-status-codes",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Http Status Codes"
        description="Complete reference of all HTTP status codes (1xx-5xx). Search and filter status codes with descriptions and usage examples."
        slug="http-status-codes"
      />
      {children}
    </>
  );
}
