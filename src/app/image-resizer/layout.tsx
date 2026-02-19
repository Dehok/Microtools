import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Image Resizer Online — Resize Images to Any Size",
  description: "Resize images to exact pixel dimensions or scale by percentage. Supports JPEG, PNG, and WebP output. Free online image resizer.",
  keywords: ["image resizer","resize image online","image resize tool","resize photo","change image dimensions"],
  openGraph: {
    title: "Image Resizer Online — Resize Images to Any Size | CodeUtilo",
    description: "Resize images to exact pixel dimensions or scale by percentage. Supports JPEG, PNG, and WebP output. Free online image resizer.",
    url: "https://codeutilo.com/image-resizer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image Resizer Online — Resize Images to Any Size | CodeUtilo",
    description: "Resize images to exact pixel dimensions or scale by percentage. Supports JPEG, PNG, and WebP output. Free online image resizer.",
  },
  alternates: {
    canonical: "https://codeutilo.com/image-resizer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Image Resizer"
        description="Resize images to exact pixel dimensions or scale by percentage. Supports JPEG, PNG, and WebP output. Free online image resizer."
        slug="image-resizer"
      />
      {children}
    </>
  );
}
