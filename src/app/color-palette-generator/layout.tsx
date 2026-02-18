import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Palette Generator — Random & Harmonious Color Schemes",
  description:
    "Generate beautiful color palettes with one click. Create harmonious, complementary, and random color schemes. Copy HEX, RGB, or HSL values.",
  keywords: ["color palette generator", "color scheme", "random colors", "color generator", "color palette maker"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
