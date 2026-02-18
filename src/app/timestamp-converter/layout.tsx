import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Timestamp Converter — ISO 8601, Unix, UTC Online",
  description: "Convert between ISO 8601, Unix timestamps (seconds & milliseconds), UTC, and human-readable formats. Free online timestamp converter.",
  keywords: ["timestamp converter","ISO 8601 converter","unix timestamp to date","date to unix timestamp","UTC converter","epoch to date"],
  openGraph: {
    title: "Timestamp Converter — ISO 8601, Unix, UTC Online | CodeUtilo",
    description: "Convert between ISO 8601, Unix timestamps (seconds & milliseconds), UTC, and human-readable formats. Free online timestamp converter.",
    url: "https://codeutilo.com/timestamp-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Timestamp Converter — ISO 8601, Unix, UTC Online | CodeUtilo",
    description: "Convert between ISO 8601, Unix timestamps (seconds & milliseconds), UTC, and human-readable formats. Free online timestamp converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/timestamp-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Timestamp Converter"
        description="Convert between ISO 8601, Unix timestamps (seconds & milliseconds), UTC, and human-readable formats. Free online timestamp converter."
        slug="timestamp-converter"
      />
      {children}
    </>
  );
}
