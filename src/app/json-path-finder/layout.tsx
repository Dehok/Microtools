import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Path Finder — Extract JSONPath Expressions",
  description: "Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool.",
  keywords: ["json path finder","jsonpath","json path extractor","find json path","jsonpath expressions"],
  openGraph: {
    title: "JSON Path Finder — Extract JSONPath Expressions | CodeUtilo",
    description: "Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool.",
    url: "https://codeutilo.com/json-path-finder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Path Finder — Extract JSONPath Expressions | CodeUtilo",
    description: "Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-path-finder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON Path Finder"
        description="Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool."
        slug="json-path-finder"
      />
      {children}
    </>
  );
}
