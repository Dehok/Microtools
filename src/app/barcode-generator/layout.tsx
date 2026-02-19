import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Barcode Generator Online — CODE128, EAN, UPC & More",
  description: "Generate barcodes in CODE128, EAN-13, UPC, CODE39 and more. Download as SVG or PNG. Free and instant.",
  keywords: ["barcode generator","generate barcode online","ean 13 generator","code 128 barcode","upc barcode maker"],
  openGraph: {
    title: "Barcode Generator Online — CODE128, EAN, UPC & More | CodeUtilo",
    description: "Generate barcodes in CODE128, EAN-13, UPC, CODE39 and more. Download as SVG or PNG. Free and instant.",
    url: "https://codeutilo.com/barcode-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Barcode Generator Online — CODE128, EAN, UPC & More | CodeUtilo",
    description: "Generate barcodes in CODE128, EAN-13, UPC, CODE39 and more. Download as SVG or PNG. Free and instant.",
  },
  alternates: {
    canonical: "https://codeutilo.com/barcode-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Barcode Generator"
        description="Generate barcodes in CODE128, EAN-13, UPC, CODE39 and more. Download as SVG or PNG. Free and instant."
        slug="barcode-generator"
      />
      {children}
    </>
  );
}
