import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text to ASCII Art Generator — Create Text Banners",
  description: "Convert text to ASCII art with multiple font styles. Create text banners for README files, comments, and terminals. Free ASCII art generator.",
  keywords: ["text to ascii art","ascii art generator","text banner","ascii text","figlet online","ascii font generator"],
  openGraph: {
    title: "Text to ASCII Art Generator — Create Text Banners | CodeUtilo",
    description: "Convert text to ASCII art with multiple font styles. Create text banners for README files, comments, and terminals. Free ASCII art generator.",
    url: "https://codeutilo.com/text-to-ascii-art",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text to ASCII Art Generator — Create Text Banners | CodeUtilo",
    description: "Convert text to ASCII art with multiple font styles. Create text banners for README files, comments, and terminals. Free ASCII art generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-to-ascii-art",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text To Ascii Art"
        description="Convert text to ASCII art with multiple font styles. Create text banners for README files, comments, and terminals. Free ASCII art generator."
        slug="text-to-ascii-art"
      />
      {children}
    </>
  );
}
