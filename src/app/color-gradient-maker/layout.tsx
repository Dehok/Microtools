import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Gradient Maker — Create Beautiful Gradients",
  description: "Create beautiful CSS gradients with a visual editor. Linear, radial, and conic types. Multi-stop color editor with presets.",
  keywords: ["gradient maker","css gradient generator","color gradient tool","gradient creator","linear gradient maker"],
  openGraph: {
    title: "CSS Gradient Maker — Create Beautiful Gradients | CodeUtilo",
    description: "Create beautiful CSS gradients with a visual editor. Linear, radial, and conic types. Multi-stop color editor with presets.",
    url: "https://codeutilo.com/color-gradient-maker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Gradient Maker — Create Beautiful Gradients | CodeUtilo",
    description: "Create beautiful CSS gradients with a visual editor. Linear, radial, and conic types. Multi-stop color editor with presets.",
  },
  alternates: {
    canonical: "https://codeutilo.com/color-gradient-maker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Color Gradient Maker"
        description="Create beautiful CSS gradients with a visual editor. Linear, radial, and conic types. Multi-stop color editor with presets."
        slug="color-gradient-maker"
      />
      {children}
    </>
  );
}
