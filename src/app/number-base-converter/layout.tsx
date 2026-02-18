import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Number Base Converter — Decimal, Binary, Hex, Octal",
  description: "Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free online number base converter.",
  keywords: ["number base converter","binary converter","hex converter","decimal to binary","octal converter"],
  openGraph: {
    title: "Number Base Converter — Decimal, Binary, Hex, Octal | CodeUtilo",
    description: "Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free online number base converter.",
    url: "https://codeutilo.com/number-base-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Number Base Converter — Decimal, Binary, Hex, Octal | CodeUtilo",
    description: "Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free online number base converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/number-base-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Number Base Converter"
        description="Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free online number base converter."
        slug="number-base-converter"
      />
      {children}
    </>
  );
}
