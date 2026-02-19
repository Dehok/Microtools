import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Stringify & Parse Tool Online",
  description: "Convert between formatted and stringified (escaped) JSON. Free online JSON stringify tool.",
  keywords: ["json stringify","json parse","stringify json online","json escape","json string converter"],
  openGraph: {
    title: "JSON Stringify & Parse Tool Online | CodeUtilo",
    description: "Convert between formatted and stringified (escaped) JSON. Free online JSON stringify tool.",
    url: "https://codeutilo.com/json-stringify",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Stringify & Parse Tool Online | CodeUtilo",
    description: "Convert between formatted and stringified (escaped) JSON. Free online JSON stringify tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-stringify",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON Stringify / Parse"
        description="Convert between formatted and stringified (escaped) JSON. Free online JSON stringify tool."
        slug="json-stringify"
      />
      {children}
    </>
  );
}
