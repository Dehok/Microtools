import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Color Blindness Simulator — Preview Color Vision Deficiency",
  description: "Preview how colors appear with different types of color vision deficiency. Free online simulator.",
  keywords: ["color blindness simulator","color blind test","color vision deficiency","deuteranopia simulator","protanopia test"],
  openGraph: {
    title: "Color Blindness Simulator — Preview Color Vision Deficiency | CodeUtilo",
    description: "Preview how colors appear with different types of color vision deficiency. Free online simulator.",
    url: "https://codeutilo.com/color-blindness-simulator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Color Blindness Simulator — Preview Color Vision Deficiency | CodeUtilo",
    description: "Preview how colors appear with different types of color vision deficiency. Free online simulator.",
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
        description="Preview how colors appear with different types of color vision deficiency. Free online simulator."
        slug="color-blindness-simulator"
      />
      {children}
    </>
  );
}
