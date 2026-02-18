import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Box Shadow Generator — Visual Shadow Editor",
  description: "Create CSS box shadows with a visual editor. Adjust offset, blur, spread, and color. Free online tool.",
  keywords: ["box shadow generator","css box shadow","shadow generator","css shadow","box shadow css"],
  openGraph: {
    title: "CSS Box Shadow Generator — Visual Shadow Editor | CodeUtilo",
    description: "Create CSS box shadows with a visual editor. Adjust offset, blur, spread, and color. Free online tool.",
    url: "https://codeutilo.com/box-shadow-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Box Shadow Generator — Visual Shadow Editor | CodeUtilo",
    description: "Create CSS box shadows with a visual editor. Adjust offset, blur, spread, and color. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/box-shadow-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Box Shadow Generator"
        description="Create CSS box shadows with a visual editor. Adjust offset, blur, spread, and color. Free online tool."
        slug="box-shadow-generator"
      />
      {children}
    </>
  );
}
