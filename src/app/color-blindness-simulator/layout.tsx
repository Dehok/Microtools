import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Blindness Simulator — Preview Color Vision Deficiency",
  description: "Simulate how colors appear with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and more. Free accessibility tool.",
  keywords: ["color blindness simulator","color vision deficiency","protanopia","deuteranopia","accessibility tool","color blind test"],
  openGraph: {
    title: "Color Blindness Simulator — Preview Color Vision Deficiency | CodeUtilo",
    description: "Simulate how colors appear with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and more. Free accessibility tool.",
    url: "https://codeutilo.com/color-blindness-simulator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Blindness Simulator — Preview Color Vision Deficiency | CodeUtilo",
    description: "Simulate how colors appear with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and more. Free accessibility tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/color-blindness-simulator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Color Blindness Simulator"
        description="Simulate how colors appear with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and more. Free accessibility tool."
        slug="color-blindness-simulator"
      />
      {children}
    </>
  );
}
