import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Image Compressor Online — Reduce Image File Size",
  description: "Compress JPEG, PNG, and WebP images directly in your browser. Reduce file size without losing quality. Free, fast, and private.",
  keywords: ["image compressor","compress image online","reduce image size","image optimizer","compress jpg png webp"],
  openGraph: {
    title: "Image Compressor Online — Reduce Image File Size | CodeUtilo",
    description: "Compress JPEG, PNG, and WebP images directly in your browser. Reduce file size without losing quality. Free, fast, and private.",
    url: "https://codeutilo.com/image-compressor",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image Compressor Online — Reduce Image File Size | CodeUtilo",
    description: "Compress JPEG, PNG, and WebP images directly in your browser. Reduce file size without losing quality. Free, fast, and private.",
  },
  alternates: {
    canonical: "https://codeutilo.com/image-compressor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Image Compressor"
        description="Compress JPEG, PNG, and WebP images directly in your browser. Reduce file size without losing quality. Free, fast, and private."
        slug="image-compressor"
      />
      {children}
    </>
  );
}
