import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Palette from Image — Extract Colors from Photos",
  description: "Extract dominant colors from any uploaded image. Get hex codes and RGB values. Adjust palette size from 3 to 12 colors. 100% client-side.",
  keywords: ["color palette from image","extract colors from image","image color picker","photo color palette","dominant colors extractor"],
  openGraph: {
    title: "Color Palette from Image — Extract Colors from Photos | CodeUtilo",
    description: "Extract dominant colors from any uploaded image. Get hex codes and RGB values. Adjust palette size from 3 to 12 colors. 100% client-side.",
    url: "https://codeutilo.com/color-palette-from-image",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Palette from Image — Extract Colors from Photos | CodeUtilo",
    description: "Extract dominant colors from any uploaded image. Get hex codes and RGB values. Adjust palette size from 3 to 12 colors. 100% client-side.",
  },
  alternates: {
    canonical: "https://codeutilo.com/color-palette-from-image",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Color Palette from Image"
        description="Extract dominant colors from any uploaded image. Get hex codes and RGB values. Adjust palette size from 3 to 12 colors. 100% client-side."
        slug="color-palette-from-image"
      />
      {children}
    </>
  );
}
