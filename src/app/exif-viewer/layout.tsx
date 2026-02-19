import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "EXIF Metadata Viewer Online",
  description:
    "Read EXIF camera metadata from JPEG photos in your browser. View timestamp, camera model, lens, and more.",
  keywords: ["exif viewer", "image metadata viewer", "read exif data", "photo metadata"],
  openGraph: {
    title: "EXIF Metadata Viewer Online | CodeUtilo",
    description:
      "Read EXIF camera metadata from JPEG photos in your browser. View timestamp, camera model, lens, and more.",
    url: "https://codeutilo.com/exif-viewer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "EXIF Metadata Viewer Online | CodeUtilo",
    description:
      "Read EXIF camera metadata from JPEG photos in your browser. View timestamp, camera model, lens, and more.",
  },
  alternates: {
    canonical: "https://codeutilo.com/exif-viewer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="EXIF Metadata Viewer"
        description="Read EXIF camera metadata from JPEG photos in your browser."
        slug="exif-viewer"
      />
      {children}
    </>
  );
}

