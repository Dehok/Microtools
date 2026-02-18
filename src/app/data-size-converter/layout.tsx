import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Data Size Converter — Bytes, KB, MB, GB & TB",
  description: "Convert between bytes, KB, MB, GB, TB, and PB. Binary and decimal units. Free online converter.",
  keywords: ["data size converter","bytes to mb","mb to gb","file size converter","storage unit converter"],
  openGraph: {
    title: "Data Size Converter — Bytes, KB, MB, GB & TB | CodeUtilo",
    description: "Convert between bytes, KB, MB, GB, TB, and PB. Binary and decimal units. Free online converter.",
    url: "https://codeutilo.com/data-size-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Data Size Converter — Bytes, KB, MB, GB & TB | CodeUtilo",
    description: "Convert between bytes, KB, MB, GB, TB, and PB. Binary and decimal units. Free online converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/data-size-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Data Size Converter"
        description="Convert between bytes, KB, MB, GB, TB, and PB. Binary and decimal units. Free online converter."
        slug="data-size-converter"
      />
      {children}
    </>
  );
}
