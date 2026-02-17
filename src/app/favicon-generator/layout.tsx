import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favicon Generator — SVG Favicon Maker Online",
  description: "Generate SVG favicons with emoji, text, or initials. Copy the SVG or data URI. No upload needed. Free online tool.",
  keywords: ["favicon generator", "svg favicon", "favicon maker", "emoji favicon", "favicon creator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
