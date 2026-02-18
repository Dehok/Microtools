import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Border Radius Generator — Visual Radius Editor",
  description: "Create CSS border-radius values with a visual editor. Adjust each corner individually. Copy CSS code instantly. Free online tool.",
  keywords: ["border radius generator","css border radius","rounded corners css","border radius editor","css radius tool"],
  openGraph: {
    title: "CSS Border Radius Generator — Visual Radius Editor | CodeUtilo",
    description: "Create CSS border-radius values with a visual editor. Adjust each corner individually. Copy CSS code instantly. Free online tool.",
    url: "https://codeutilo.com/border-radius-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Border Radius Generator — Visual Radius Editor | CodeUtilo",
    description: "Create CSS border-radius values with a visual editor. Adjust each corner individually. Copy CSS code instantly. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/border-radius-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Border Radius Generator"
        description="Create CSS border-radius values with a visual editor. Adjust each corner individually. Copy CSS code instantly. Free online tool."
        slug="border-radius-generator"
      />
      {children}
    </>
  );
}
