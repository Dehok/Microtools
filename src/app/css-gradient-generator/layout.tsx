import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Gradient Generator — Linear & Radial Gradients",
  description: "Create CSS linear and radial gradients with a visual editor and presets. Free online gradient tool.",
  keywords: ["css gradient generator","gradient generator","css gradient","linear gradient css","radial gradient generator"],
  openGraph: {
    title: "CSS Gradient Generator — Linear & Radial Gradients | CodeUtilo",
    description: "Create CSS linear and radial gradients with a visual editor and presets. Free online gradient tool.",
    url: "https://codeutilo.com/css-gradient-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Gradient Generator — Linear & Radial Gradients | CodeUtilo",
    description: "Create CSS linear and radial gradients with a visual editor and presets. Free online gradient tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-gradient-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSS Gradient Generator"
        description="Create CSS linear and radial gradients with a visual editor and presets. Free online gradient tool."
        slug="css-gradient-generator"
      />
      {children}
    </>
  );
}
