import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Image Watermark Tool Online — Add Text Watermarks Free",
  description: "Add text watermarks to images in your browser. Tile, center, or corner placement. Customizable font, opacity, and color.",
  keywords: ["image watermark","add watermark online","watermark tool","photo watermark","bulk watermark images"],
  openGraph: {
    title: "Image Watermark Tool Online — Add Text Watermarks Free | CodeUtilo",
    description: "Add text watermarks to images in your browser. Tile, center, or corner placement. Customizable font, opacity, and color.",
    url: "https://codeutilo.com/image-watermark",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image Watermark Tool Online — Add Text Watermarks Free | CodeUtilo",
    description: "Add text watermarks to images in your browser. Tile, center, or corner placement. Customizable font, opacity, and color.",
  },
  alternates: {
    canonical: "https://codeutilo.com/image-watermark",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Image Watermark"
        description="Add text watermarks to images in your browser. Tile, center, or corner placement. Customizable font, opacity, and color."
        slug="image-watermark"
      />
      {children}
    </>
  );
}
