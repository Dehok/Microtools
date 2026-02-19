import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Fancy Text Generator — Cool Fonts for Social Media",
  description: "Generate fancy Unicode text styles for Instagram, Twitter, Discord. Bold, italic, script, fraktur and more. Copy and paste.",
  keywords: ["fancy text generator","cool text fonts","unicode text generator","instagram fonts","copy paste fonts"],
  openGraph: {
    title: "Fancy Text Generator — Cool Fonts for Social Media | CodeUtilo",
    description: "Generate fancy Unicode text styles for Instagram, Twitter, Discord. Bold, italic, script, fraktur and more. Copy and paste.",
    url: "https://codeutilo.com/fancy-text-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Fancy Text Generator — Cool Fonts for Social Media | CodeUtilo",
    description: "Generate fancy Unicode text styles for Instagram, Twitter, Discord. Bold, italic, script, fraktur and more. Copy and paste.",
  },
  alternates: {
    canonical: "https://codeutilo.com/fancy-text-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Fancy Text Generator"
        description="Generate fancy Unicode text styles for Instagram, Twitter, Discord. Bold, italic, script, fraktur and more. Copy and paste."
        slug="fancy-text-generator"
      />
      {children}
    </>
  );
}
