import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tailwind CSS Color Generator — Custom Color Palette Maker",
  description:
    "Generate Tailwind CSS color palettes from any base color. Get shades 50-950 with ready-to-use config. Free online tool.",
  keywords: ["tailwind color generator", "tailwind colors", "tailwind palette", "css color palette", "tailwind custom colors"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
