import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Timestamp Converter — ISO 8601, Unix & Human Dates",
  description: "Convert between ISO 8601, Unix timestamps, and human-readable dates. Free online timestamp converter.",
  keywords: ["timestamp converter","iso 8601 converter","date to timestamp","timestamp to date","unix timestamp"],
  openGraph: {
    title: "Timestamp Converter — ISO 8601, Unix & Human Dates | CodeUtilo",
    description: "Convert between ISO 8601, Unix timestamps, and human-readable dates. Free online timestamp converter.",
    url: "https://codeutilo.com/timestamp-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Timestamp Converter — ISO 8601, Unix & Human Dates | CodeUtilo",
    description: "Convert between ISO 8601, Unix timestamps, and human-readable dates. Free online timestamp converter.",
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
        description="Convert between ISO 8601, Unix timestamps, and human-readable dates. Free online timestamp converter."
        slug="timestamp-converter"
      />
      {children}
    </>
  );
}
