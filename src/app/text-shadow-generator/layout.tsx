import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Text Shadow Generator — Visual Shadow Editor",
  description: "Create CSS text-shadow effects with a visual editor. Multiple shadows and presets. Free tool.",
  keywords: ["text shadow generator","css text shadow","text shadow css","shadow text effect","css shadow generator"],
  openGraph: {
    title: "CSS Text Shadow Generator — Visual Shadow Editor | CodeUtilo",
    description: "Create CSS text-shadow effects with a visual editor. Multiple shadows and presets. Free tool.",
    url: "https://codeutilo.com/text-shadow-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Text Shadow Generator — Visual Shadow Editor | CodeUtilo",
    description: "Create CSS text-shadow effects with a visual editor. Multiple shadows and presets. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-shadow-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSS Text Shadow Generator"
        description="Create CSS text-shadow effects with a visual editor. Multiple shadows and presets. Free tool."
        slug="text-shadow-generator"
      />
      {children}
    </>
  );
}
