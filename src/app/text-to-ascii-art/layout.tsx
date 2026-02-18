import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text to ASCII Art Generator — FIGlet Font Banners",
  description: "Convert text to ASCII art with multiple font styles. Copy and share text banners. Free online tool.",
  keywords: ["text to ascii art","ascii art generator","figlet","text banner generator","ascii text art"],
  openGraph: {
    title: "Text to ASCII Art Generator — FIGlet Font Banners | CodeUtilo",
    description: "Convert text to ASCII art with multiple font styles. Copy and share text banners. Free online tool.",
    url: "https://codeutilo.com/text-to-ascii-art",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text to ASCII Art Generator — FIGlet Font Banners | CodeUtilo",
    description: "Convert text to ASCII art with multiple font styles. Copy and share text banners. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-to-ascii-art",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text to ASCII Art"
        description="Convert text to ASCII art with multiple font styles. Copy and share text banners. Free online tool."
        slug="text-to-ascii-art"
      />
      {children}
    </>
  );
}
