import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "PX to REM Converter — CSS Unit Calculator",
  description: "Convert between px, rem, em, pt, vw, vh, and percent CSS units. Free online unit converter.",
  keywords: ["px to rem","rem to px","css unit converter","px rem converter","em to px converter"],
  openGraph: {
    title: "PX to REM Converter — CSS Unit Calculator | CodeUtilo",
    description: "Convert between px, rem, em, pt, vw, vh, and percent CSS units. Free online unit converter.",
    url: "https://codeutilo.com/px-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "PX to REM Converter — CSS Unit Calculator | CodeUtilo",
    description: "Convert between px, rem, em, pt, vw, vh, and percent CSS units. Free online unit converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/px-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="PX / REM / EM Converter"
        description="Convert between px, rem, em, pt, vw, vh, and percent CSS units. Free online unit converter."
        slug="px-converter"
      />
      {children}
    </>
  );
}
