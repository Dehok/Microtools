import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Path Finder — Extract All Paths from JSON",
  description: "Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool for developers.",
  keywords: ["json path finder","jsonpath extractor","json path online","json key finder","json navigator","json path tool"],
  openGraph: {
    title: "JSON Path Finder — Extract All Paths from JSON | CodeUtilo",
    description: "Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool for developers.",
    url: "https://codeutilo.com/json-path-finder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Path Finder — Extract All Paths from JSON | CodeUtilo",
    description: "Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool for developers.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-path-finder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Path Finder"
        description="Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool for developers."
        slug="json-path-finder"
      />
      {children}
    </>
  );
}
