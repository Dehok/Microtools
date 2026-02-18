import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Epoch / Unix Timestamp Converter Online — Free Tool",
  description: "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Live clock included.",
  keywords: ["epoch converter","unix timestamp","timestamp converter","epoch to date","unix time"],
  openGraph: {
    title: "Epoch / Unix Timestamp Converter Online — Free Tool | CodeUtilo",
    description: "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Live clock included.",
    url: "https://codeutilo.com/epoch-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Epoch / Unix Timestamp Converter Online — Free Tool | CodeUtilo",
    description: "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Live clock included.",
  },
  alternates: {
    canonical: "https://codeutilo.com/epoch-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Epoch Converter"
        description="Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Live clock included."
        slug="epoch-converter"
      />
      {children}
    </>
  );
}
