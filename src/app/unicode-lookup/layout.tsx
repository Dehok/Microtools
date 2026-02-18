import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Unicode Character Lookup — Code Points & Entities",
  description: "Inspect characters: code points, HTML entities, CSS escapes, UTF-8 bytes. Free Unicode lookup.",
  keywords: ["unicode lookup","unicode character search","code point lookup","html entities","unicode inspector"],
  openGraph: {
    title: "Unicode Character Lookup — Code Points & Entities | CodeUtilo",
    description: "Inspect characters: code points, HTML entities, CSS escapes, UTF-8 bytes. Free Unicode lookup.",
    url: "https://codeutilo.com/unicode-lookup",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Unicode Character Lookup — Code Points & Entities | CodeUtilo",
    description: "Inspect characters: code points, HTML entities, CSS escapes, UTF-8 bytes. Free Unicode lookup.",
  },
  alternates: {
    canonical: "https://codeutilo.com/unicode-lookup",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Unicode Character Lookup"
        description="Inspect characters: code points, HTML entities, CSS escapes, UTF-8 bytes. Free Unicode lookup."
        slug="unicode-lookup"
      />
      {children}
    </>
  );
}
