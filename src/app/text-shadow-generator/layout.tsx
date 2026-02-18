import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Text Shadow Generator — Visual Shadow Editor",
  description: "Create CSS text-shadow effects with a visual editor. Adjust offset, blur, color, and add multiple shadows. Copy CSS code instantly.",
  keywords: ["text shadow generator","css text shadow","text shadow css","shadow generator","css text effects"],
  openGraph: {
    title: "CSS Text Shadow Generator — Visual Shadow Editor | CodeUtilo",
    description: "Create CSS text-shadow effects with a visual editor. Adjust offset, blur, color, and add multiple shadows. Copy CSS code instantly.",
    url: "https://codeutilo.com/text-shadow-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Text Shadow Generator — Visual Shadow Editor | CodeUtilo",
    description: "Create CSS text-shadow effects with a visual editor. Adjust offset, blur, color, and add multiple shadows. Copy CSS code instantly.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-shadow-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text Shadow Generator"
        description="Create CSS text-shadow effects with a visual editor. Adjust offset, blur, color, and add multiple shadows. Copy CSS code instantly."
        slug="text-shadow-generator"
      />
      {children}
    </>
  );
}
