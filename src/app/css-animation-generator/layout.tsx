import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Animation Generator — Keyframe Animation Builder",
  description: "Create CSS keyframe animations with a visual editor. Preview and copy animation code. Free tool.",
  keywords: ["css animation generator","keyframe animation","css animation builder","css animate","animation generator online"],
  openGraph: {
    title: "CSS Animation Generator — Keyframe Animation Builder | CodeUtilo",
    description: "Create CSS keyframe animations with a visual editor. Preview and copy animation code. Free tool.",
    url: "https://codeutilo.com/css-animation-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Animation Generator — Keyframe Animation Builder | CodeUtilo",
    description: "Create CSS keyframe animations with a visual editor. Preview and copy animation code. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-animation-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSS Animation Generator"
        description="Create CSS keyframe animations with a visual editor. Preview and copy animation code. Free tool."
        slug="css-animation-generator"
      />
      {children}
    </>
  );
}
