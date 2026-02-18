import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Unicode Character Lookup & Inspector — Online Tool",
  description: "Inspect Unicode characters: code points, HTML entities, CSS escapes, and UTF-8 bytes. Browse common character sets. Free online tool.",
  keywords: ["unicode lookup","unicode character finder","character code point","HTML entity lookup","unicode inspector","UTF-8 bytes"],
  openGraph: {
    title: "Unicode Character Lookup & Inspector — Online Tool | CodeUtilo",
    description: "Inspect Unicode characters: code points, HTML entities, CSS escapes, and UTF-8 bytes. Browse common character sets. Free online tool.",
    url: "https://codeutilo.com/unicode-lookup",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Unicode Character Lookup & Inspector — Online Tool | CodeUtilo",
    description: "Inspect Unicode characters: code points, HTML entities, CSS escapes, and UTF-8 bytes. Browse common character sets. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/unicode-lookup",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Unicode Lookup"
        description="Inspect Unicode characters: code points, HTML entities, CSS escapes, and UTF-8 bytes. Browse common character sets. Free online tool."
        slug="unicode-lookup"
      />
      {children}
    </>
  );
}
