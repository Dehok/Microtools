import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "PX to REM / EM Converter — CSS Unit Calculator",
  description: "Convert between px, rem, em, pt, vw, vh, and percent. Quick reference table included. Free online CSS unit converter.",
  keywords: ["px to rem","rem to px","em to px","css unit converter","pixel converter","rem calculator"],
  openGraph: {
    title: "PX to REM / EM Converter — CSS Unit Calculator | CodeUtilo",
    description: "Convert between px, rem, em, pt, vw, vh, and percent. Quick reference table included. Free online CSS unit converter.",
    url: "https://codeutilo.com/px-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PX to REM / EM Converter — CSS Unit Calculator | CodeUtilo",
    description: "Convert between px, rem, em, pt, vw, vh, and percent. Quick reference table included. Free online CSS unit converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/px-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Px Converter"
        description="Convert between px, rem, em, pt, vw, vh, and percent. Quick reference table included. Free online CSS unit converter."
        slug="px-converter"
      />
      {children}
    </>
  );
}
