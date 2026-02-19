import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Box Shadow Generator — Visual Shadow Editor",
  description: "Create box shadows with a visual editor. Adjust offset, blur, spread, and color. Free CSS tool.",
  keywords: ["box shadow generator","css box shadow","shadow generator css","drop shadow css","css shadow tool"],
  openGraph: {
    title: "CSS Box Shadow Generator — Visual Shadow Editor | CodeUtilo",
    description: "Create box shadows with a visual editor. Adjust offset, blur, spread, and color. Free CSS tool.",
    url: "https://codeutilo.com/box-shadow-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Box Shadow Generator — Visual Shadow Editor | CodeUtilo",
    description: "Create box shadows with a visual editor. Adjust offset, blur, spread, and color. Free CSS tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/box-shadow-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSS Box Shadow Generator"
        description="Create box shadows with a visual editor. Adjust offset, blur, spread, and color. Free CSS tool."
        slug="box-shadow-generator"
      />
      {children}
    </>
  );
}
