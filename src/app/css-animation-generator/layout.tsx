import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Animation Generator — @keyframes Builder",
  description: "Generate CSS @keyframes animations visually. Configure timing, easing, direction, keyframes, and copy the ready-to-use CSS code. Free online tool.",
  keywords: ["css animation generator","keyframes generator","css keyframes","animation builder","css transitions","web animation tool"],
  openGraph: {
    title: "CSS Animation Generator — @keyframes Builder | CodeUtilo",
    description: "Generate CSS @keyframes animations visually. Configure timing, easing, direction, keyframes, and copy the ready-to-use CSS code. Free online tool.",
    url: "https://codeutilo.com/css-animation-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Animation Generator — @keyframes Builder | CodeUtilo",
    description: "Generate CSS @keyframes animations visually. Configure timing, easing, direction, keyframes, and copy the ready-to-use CSS code. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-animation-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Css Animation Generator"
        description="Generate CSS @keyframes animations visually. Configure timing, easing, direction, keyframes, and copy the ready-to-use CSS code. Free online tool."
        slug="css-animation-generator"
      />
      {children}
    </>
  );
}
