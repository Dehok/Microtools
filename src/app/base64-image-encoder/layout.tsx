import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Image Encoder — Convert Images to Base64 Online",
  description:
    "Convert images to Base64 encoded strings. Supports PNG, JPG, GIF, SVG, and WebP. Get data URI, raw Base64, or HTML img tag.",
  keywords: ["base64 image encoder", "image to base64", "convert image base64", "data uri generator", "base64 encode image"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
