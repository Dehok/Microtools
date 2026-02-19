import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "QR Code Generator Online — Free & Customizable",
  description: "Generate QR codes from text or URLs. Customize colors and download as PNG or SVG. Free QR maker.",
  keywords: ["qr code generator","qr code maker","generate qr code","qr code online","free qr code"],
  openGraph: {
    title: "QR Code Generator Online — Free & Customizable | CodeUtilo",
    description: "Generate QR codes from text or URLs. Customize colors and download as PNG or SVG. Free QR maker.",
    url: "https://codeutilo.com/qr-code-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "QR Code Generator Online — Free & Customizable | CodeUtilo",
    description: "Generate QR codes from text or URLs. Customize colors and download as PNG or SVG. Free QR maker.",
  },
  alternates: {
    canonical: "https://codeutilo.com/qr-code-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="QR Code Generator"
        description="Generate QR codes from text or URLs. Customize colors and download as PNG or SVG. Free QR maker."
        slug="qr-code-generator"
      />
      {children}
    </>
  );
}
