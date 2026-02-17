import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HEX to RGB & RGB to HEX Converter — Color Converter Online",
  description:
    "Convert between HEX and RGB color values. Also shows HSL. Free online color converter for web developers and designers.",
  keywords: [
    "hex to rgb",
    "rgb to hex",
    "color converter",
    "hex color converter",
    "rgb converter",
    "css color converter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
