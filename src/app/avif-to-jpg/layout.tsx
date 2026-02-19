import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "AVIF to JPG Converter Online",
  description:
    "Convert AVIF images to JPG online with adjustable quality. Browser-based processing keeps files private.",
  keywords: ["avif to jpg", "convert avif", "avif converter", "avif to jpeg"],
  openGraph: {
    title: "AVIF to JPG Converter Online | CodeUtilo",
    description:
      "Convert AVIF images to JPG online with adjustable quality. Browser-based processing keeps files private.",
    url: "https://codeutilo.com/avif-to-jpg",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AVIF to JPG Converter Online | CodeUtilo",
    description:
      "Convert AVIF images to JPG online with adjustable quality. Browser-based processing keeps files private.",
  },
  alternates: {
    canonical: "https://codeutilo.com/avif-to-jpg",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="AVIF to JPG Converter"
        description="Convert AVIF images to JPG in your browser with quality control."
        slug="avif-to-jpg"
      />
      {children}
    </>
  );
}

