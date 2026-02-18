import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Tailwind CSS Color Generator — Custom Color Palette Maker",
  description: "Generate Tailwind CSS color palettes from any base color. Get shades 50-950 with ready-to-use config. Free online tool.",
  keywords: ["tailwind color generator","tailwind colors","tailwind palette","css color palette","tailwind custom colors"],
  openGraph: {
    title: "Tailwind CSS Color Generator — Custom Color Palette Maker | CodeUtilo",
    description: "Generate Tailwind CSS color palettes from any base color. Get shades 50-950 with ready-to-use config. Free online tool.",
    url: "https://codeutilo.com/tailwind-color-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tailwind CSS Color Generator — Custom Color Palette Maker | CodeUtilo",
    description: "Generate Tailwind CSS color palettes from any base color. Get shades 50-950 with ready-to-use config. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/tailwind-color-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Tailwind Color Generator"
        description="Generate Tailwind CSS color palettes from any base color. Get shades 50-950 with ready-to-use config. Free online tool."
        slug="tailwind-color-generator"
      />
      {children}
    </>
  );
}
