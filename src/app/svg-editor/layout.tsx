import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "SVG Editor Online — Create & Edit SVG Graphics Free",
  description: "Create and edit SVG graphics with a visual editor. Add rectangles, circles, text. Customize colors and export clean SVG code.",
  keywords: ["svg editor","svg editor online","svg creator","svg maker","edit svg online"],
  openGraph: {
    title: "SVG Editor Online — Create & Edit SVG Graphics Free | CodeUtilo",
    description: "Create and edit SVG graphics with a visual editor. Add rectangles, circles, text. Customize colors and export clean SVG code.",
    url: "https://codeutilo.com/svg-editor",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SVG Editor Online — Create & Edit SVG Graphics Free | CodeUtilo",
    description: "Create and edit SVG graphics with a visual editor. Add rectangles, circles, text. Customize colors and export clean SVG code.",
  },
  alternates: {
    canonical: "https://codeutilo.com/svg-editor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="SVG Editor"
        description="Create and edit SVG graphics with a visual editor. Add rectangles, circles, text. Customize colors and export clean SVG code."
        slug="svg-editor"
      />
      {children}
    </>
  );
}
