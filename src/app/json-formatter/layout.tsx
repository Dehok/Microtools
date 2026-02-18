import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online — Free JSON Beautifier",
  description: "Format, beautify, validate, and minify JSON data instantly. Free online JSON formatter with adjustable indentation. No signup required.",
  keywords: ["json formatter","json beautifier","json validator","json minifier","format json online"],
  openGraph: {
    title: "JSON Formatter & Validator Online — Free JSON Beautifier | CodeUtilo",
    description: "Format, beautify, validate, and minify JSON data instantly. Free online JSON formatter with adjustable indentation. No signup required.",
    url: "https://codeutilo.com/json-formatter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Formatter & Validator Online — Free JSON Beautifier | CodeUtilo",
    description: "Format, beautify, validate, and minify JSON data instantly. Free online JSON formatter with adjustable indentation. No signup required.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Formatter"
        description="Format, beautify, validate, and minify JSON data instantly. Free online JSON formatter with adjustable indentation. No signup required."
        slug="json-formatter"
      />
      {children}
    </>
  );
}
