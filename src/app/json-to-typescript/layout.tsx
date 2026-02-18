import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON to TypeScript — Generate Interfaces from JSON",
  description: "Convert JSON data to TypeScript interfaces automatically. Supports nested objects and arrays. Free online tool.",
  keywords: ["json to typescript","json to interface","typescript interface generator","json to ts","typescript types from json"],
  openGraph: {
    title: "JSON to TypeScript — Generate Interfaces from JSON | CodeUtilo",
    description: "Convert JSON data to TypeScript interfaces automatically. Supports nested objects and arrays. Free online tool.",
    url: "https://codeutilo.com/json-to-typescript",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON to TypeScript — Generate Interfaces from JSON | CodeUtilo",
    description: "Convert JSON data to TypeScript interfaces automatically. Supports nested objects and arrays. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-to-typescript",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json To Typescript"
        description="Convert JSON data to TypeScript interfaces automatically. Supports nested objects and arrays. Free online tool."
        slug="json-to-typescript"
      />
      {children}
    </>
  );
}
