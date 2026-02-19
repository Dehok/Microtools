import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Signature Generator Online — Draw & Download Free",
  description: "Draw your digital signature and download as PNG or SVG. Customize pen color and width. Free, instant, private.",
  keywords: ["signature generator","digital signature maker","online signature creator","draw signature online","free signature maker"],
  openGraph: {
    title: "Signature Generator Online — Draw & Download Free | CodeUtilo",
    description: "Draw your digital signature and download as PNG or SVG. Customize pen color and width. Free, instant, private.",
    url: "https://codeutilo.com/signature-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Signature Generator Online — Draw & Download Free | CodeUtilo",
    description: "Draw your digital signature and download as PNG or SVG. Customize pen color and width. Free, instant, private.",
  },
  alternates: {
    canonical: "https://codeutilo.com/signature-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Signature Generator"
        description="Draw your digital signature and download as PNG or SVG. Customize pen color and width. Free, instant, private."
        slug="signature-generator"
      />
      {children}
    </>
  );
}
