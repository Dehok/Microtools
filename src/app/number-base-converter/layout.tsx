import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Number Base Converter — Binary, Hex, Octal, Decimal",
  description: "Convert numbers between decimal, binary, octal, and hexadecimal. Free online base converter.",
  keywords: ["number base converter","binary to decimal","hex to decimal","decimal to binary","base converter"],
  openGraph: {
    title: "Number Base Converter — Binary, Hex, Octal, Decimal | CodeUtilo",
    description: "Convert numbers between decimal, binary, octal, and hexadecimal. Free online base converter.",
    url: "https://codeutilo.com/number-base-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Number Base Converter — Binary, Hex, Octal, Decimal | CodeUtilo",
    description: "Convert numbers between decimal, binary, octal, and hexadecimal. Free online base converter.",
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
        description="Convert numbers between decimal, binary, octal, and hexadecimal. Free online base converter."
        slug="number-base-converter"
      />
      {children}
    </>
  );
}
