import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Image Metadata Remover Online",
  description:
    "Remove EXIF metadata from photos before sharing. Browser-only processing keeps files private on your device.",
  keywords: ["remove exif", "metadata remover", "strip image metadata", "remove gps from photo"],
  openGraph: {
    title: "Image Metadata Remover Online | CodeUtilo",
    description:
      "Remove EXIF metadata from photos before sharing. Browser-only processing keeps files private on your device.",
    url: "https://codeutilo.com/exif-metadata-remover",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image Metadata Remover Online | CodeUtilo",
    description:
      "Remove EXIF metadata from photos before sharing. Browser-only processing keeps files private on your device.",
  },
  alternates: {
    canonical: "https://codeutilo.com/exif-metadata-remover",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Image Metadata Remover"
        description="Strip EXIF and hidden metadata from photos in your browser."
        slug="exif-metadata-remover"
      />
      {children}
    </>
  );
}

