import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to TypeScript Interface Generator",
  description: "Generate TypeScript interfaces from JSON data automatically. Free online JSON to TypeScript tool.",
  keywords: ["json to typescript","json to ts","typescript interface generator","json to interface","json2ts"],
  openGraph: {
    title: "JSON to TypeScript Interface Generator | CodeUtilo",
    description: "Generate TypeScript interfaces from JSON data automatically. Free online JSON to TypeScript tool.",
    url: "https://codeutilo.com/json-to-typescript",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to TypeScript Interface Generator | CodeUtilo",
    description: "Generate TypeScript interfaces from JSON data automatically. Free online JSON to TypeScript tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-to-typescript",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON to TypeScript"
        description="Generate TypeScript interfaces from JSON data automatically. Free online JSON to TypeScript tool."
        slug="json-to-typescript"
      />
      {children}
    </>
  );
}
