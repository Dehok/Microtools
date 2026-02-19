import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online",
  description: "Format, validate, and beautify JSON data with syntax highlighting. Free online JSON tool — no signup required.",
  keywords: ["json formatter","json beautifier","json validator","format json online","json pretty print"],
  openGraph: {
    title: "JSON Formatter & Validator Online | CodeUtilo",
    description: "Format, validate, and beautify JSON data with syntax highlighting. Free online JSON tool — no signup required.",
    url: "https://codeutilo.com/json-formatter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Formatter & Validator Online | CodeUtilo",
    description: "Format, validate, and beautify JSON data with syntax highlighting. Free online JSON tool — no signup required.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON Formatter"
        description="Format, validate, and beautify JSON data with syntax highlighting. Free online JSON tool — no signup required."
        slug="json-formatter"
      />
      {children}
    </>
  );
}
