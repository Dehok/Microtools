import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Placeholder Image Generator — SVG Placeholder Images",
  description:
    "Generate lightweight SVG placeholder images with custom dimensions, colors, and text. No external service needed. Free online tool.",
  keywords: [
    "placeholder image generator",
    "SVG placeholder",
    "dummy image generator",
    "placeholder image",
    "test image generator",
    "placeholder.com alternative",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
