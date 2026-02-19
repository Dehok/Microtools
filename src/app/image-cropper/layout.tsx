import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Image Cropper Online — Crop Images for Free",
  description: "Crop images with drag-and-resize handles directly in your browser. Export as PNG, JPG, or WebP. Free and private.",
  keywords: ["image cropper","crop image online","photo cropper","crop picture free","image crop tool"],
  openGraph: {
    title: "Image Cropper Online — Crop Images for Free | CodeUtilo",
    description: "Crop images with drag-and-resize handles directly in your browser. Export as PNG, JPG, or WebP. Free and private.",
    url: "https://codeutilo.com/image-cropper",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image Cropper Online — Crop Images for Free | CodeUtilo",
    description: "Crop images with drag-and-resize handles directly in your browser. Export as PNG, JPG, or WebP. Free and private.",
  },
  alternates: {
    canonical: "https://codeutilo.com/image-cropper",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Image Cropper"
        description="Crop images with drag-and-resize handles directly in your browser. Export as PNG, JPG, or WebP. Free and private."
        slug="image-cropper"
      />
      {children}
    </>
  );
}
