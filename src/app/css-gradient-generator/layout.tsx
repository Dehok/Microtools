import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Gradient Generator — Linear & Radial Gradients",
  description: "Create beautiful CSS gradients with a visual editor. Linear and radial gradients with multiple color stops. Free online tool.",
  keywords: ["css gradient generator","linear gradient","radial gradient","css gradient","gradient maker","background gradient"],
  openGraph: {
    title: "CSS Gradient Generator — Linear & Radial Gradients | CodeUtilo",
    description: "Create beautiful CSS gradients with a visual editor. Linear and radial gradients with multiple color stops. Free online tool.",
    url: "https://codeutilo.com/css-gradient-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Gradient Generator — Linear & Radial Gradients | CodeUtilo",
    description: "Create beautiful CSS gradients with a visual editor. Linear and radial gradients with multiple color stops. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-gradient-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Css Gradient Generator"
        description="Create beautiful CSS gradients with a visual editor. Linear and radial gradients with multiple color stops. Free online tool."
        slug="css-gradient-generator"
      />
      {children}
    </>
  );
}
