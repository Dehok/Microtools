import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Invisible Character Detector — Find Hidden Characters",
  description: "Find and remove hidden, invisible, and zero-width characters from text. Detect BOM, ZWSP, soft hyphens, and 30+ types.",
  keywords: ["invisible character detector","zero width space finder","hidden character remover","invisible text detector","unicode character finder"],
  openGraph: {
    title: "Invisible Character Detector — Find Hidden Characters | CodeUtilo",
    description: "Find and remove hidden, invisible, and zero-width characters from text. Detect BOM, ZWSP, soft hyphens, and 30+ types.",
    url: "https://codeutilo.com/invisible-character-detector",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Invisible Character Detector — Find Hidden Characters | CodeUtilo",
    description: "Find and remove hidden, invisible, and zero-width characters from text. Detect BOM, ZWSP, soft hyphens, and 30+ types.",
  },
  alternates: {
    canonical: "https://codeutilo.com/invisible-character-detector",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Invisible Character Detector"
        description="Find and remove hidden, invisible, and zero-width characters from text. Detect BOM, ZWSP, soft hyphens, and 30+ types."
        slug="invisible-character-detector"
      />
      {children}
    </>
  );
}
