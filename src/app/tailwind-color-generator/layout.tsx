import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Tailwind CSS Color Palette Generator",
  description: "Generate Tailwind CSS color palettes (50-950) from any base color. Free online Tailwind tool.",
  keywords: ["tailwind colors","tailwind color generator","tailwind palette","tailwind css colors","color palette generator"],
  openGraph: {
    title: "Tailwind CSS Color Palette Generator | CodeUtilo",
    description: "Generate Tailwind CSS color palettes (50-950) from any base color. Free online Tailwind tool.",
    url: "https://codeutilo.com/tailwind-color-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tailwind CSS Color Palette Generator | CodeUtilo",
    description: "Generate Tailwind CSS color palettes (50-950) from any base color. Free online Tailwind tool.",
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
        description="Generate Tailwind CSS color palettes (50-950) from any base color. Free online Tailwind tool."
        slug="tailwind-color-generator"
      />
      {children}
    </>
  );
}
