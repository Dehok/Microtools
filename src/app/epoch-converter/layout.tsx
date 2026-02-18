import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Epoch Converter — Unix Timestamp to Date",
  description: "Convert Unix timestamps to human-readable dates and vice versa. Free online epoch converter.",
  keywords: ["epoch converter","unix timestamp converter","timestamp to date","epoch to date","unix time converter"],
  openGraph: {
    title: "Epoch Converter — Unix Timestamp to Date | CodeUtilo",
    description: "Convert Unix timestamps to human-readable dates and vice versa. Free online epoch converter.",
    url: "https://codeutilo.com/epoch-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Epoch Converter — Unix Timestamp to Date | CodeUtilo",
    description: "Convert Unix timestamps to human-readable dates and vice versa. Free online epoch converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/epoch-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Epoch / Timestamp Converter"
        description="Convert Unix timestamps to human-readable dates and vice versa. Free online epoch converter."
        slug="epoch-converter"
      />
      {children}
    </>
  );
}
