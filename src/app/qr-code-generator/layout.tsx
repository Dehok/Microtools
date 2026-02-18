import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "QR Code Generator Online — Free QR Code Maker",
  description: "Generate QR codes from text or URLs instantly. Customize size and colors. Download as PNG or SVG. Free online QR code generator.",
  keywords: ["qr code generator","qr code maker","qr code online","generate qr code","free qr code"],
  openGraph: {
    title: "QR Code Generator Online — Free QR Code Maker | CodeUtilo",
    description: "Generate QR codes from text or URLs instantly. Customize size and colors. Download as PNG or SVG. Free online QR code generator.",
    url: "https://codeutilo.com/qr-code-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "QR Code Generator Online — Free QR Code Maker | CodeUtilo",
    description: "Generate QR codes from text or URLs instantly. Customize size and colors. Download as PNG or SVG. Free online QR code generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/qr-code-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Qr Code Generator"
        description="Generate QR codes from text or URLs instantly. Customize size and colors. Download as PNG or SVG. Free online QR code generator."
        slug="qr-code-generator"
      />
      {children}
    </>
  );
}
