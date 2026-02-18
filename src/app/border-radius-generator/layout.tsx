import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Border Radius Generator — Visual Editor",
  description: "Create CSS border-radius values with a visual editor. Adjust each corner individually. Free tool.",
  keywords: ["border radius generator","css border radius","rounded corners css","border radius css","corner radius generator"],
  openGraph: {
    title: "CSS Border Radius Generator — Visual Editor | CodeUtilo",
    description: "Create CSS border-radius values with a visual editor. Adjust each corner individually. Free tool.",
    url: "https://codeutilo.com/border-radius-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Border Radius Generator — Visual Editor | CodeUtilo",
    description: "Create CSS border-radius values with a visual editor. Adjust each corner individually. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/border-radius-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSS Border Radius Generator"
        description="Create CSS border-radius values with a visual editor. Adjust each corner individually. Free tool."
        slug="border-radius-generator"
      />
      {children}
    </>
  );
}
