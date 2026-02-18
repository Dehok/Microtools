import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text to Binary Converter — Binary, Hex, Octal, Decimal",
  description: "Convert text to binary, hexadecimal, octal, or decimal. Decode binary back to text. Free online converter.",
  keywords: ["text to binary","binary converter","text to hex","binary to text","ascii to binary"],
  openGraph: {
    title: "Text to Binary Converter — Binary, Hex, Octal, Decimal | CodeUtilo",
    description: "Convert text to binary, hexadecimal, octal, or decimal. Decode binary back to text. Free online converter.",
    url: "https://codeutilo.com/text-to-binary",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text to Binary Converter — Binary, Hex, Octal, Decimal | CodeUtilo",
    description: "Convert text to binary, hexadecimal, octal, or decimal. Decode binary back to text. Free online converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-to-binary",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text To Binary"
        description="Convert text to binary, hexadecimal, octal, or decimal. Decode binary back to text. Free online converter."
        slug="text-to-binary"
      />
      {children}
    </>
  );
}
