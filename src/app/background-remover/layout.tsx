import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Background Remover — AI-Powered Image Background Removal Free",
  description: "Remove image backgrounds instantly using AI running 100% in your browser. No server uploads, completely private. Works with people, products, and animals.",
  keywords: ["background remover","remove background online","image background remover","background eraser","transparent background maker"],
  openGraph: {
    title: "Background Remover — AI-Powered Image Background Removal Free | CodeUtilo",
    description: "Remove image backgrounds instantly using AI running 100% in your browser. No server uploads, completely private. Works with people, products, and animals.",
    url: "https://codeutilo.com/background-remover",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Background Remover — AI-Powered Image Background Removal Free | CodeUtilo",
    description: "Remove image backgrounds instantly using AI running 100% in your browser. No server uploads, completely private. Works with people, products, and animals.",
  },
  alternates: {
    canonical: "https://codeutilo.com/background-remover",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Background Remover"
        description="Remove image backgrounds instantly using AI running 100% in your browser. No server uploads, completely private. Works with people, products, and animals."
        slug="background-remover"
      />
      {children}
    </>
  );
}
