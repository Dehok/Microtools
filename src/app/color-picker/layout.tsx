import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Picker — HEX, RGB & HSL Converter Online",
  description:
    "Pick colors visually and convert between HEX, RGB, and HSL formats. Copy CSS-ready color values instantly. Free online color picker.",
  keywords: ["color picker", "hex to rgb", "rgb to hex", "hsl converter", "css color picker"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
