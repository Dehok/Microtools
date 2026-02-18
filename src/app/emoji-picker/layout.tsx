import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Emoji Picker — Search & Copy Emojis Online",
  description: "Search, browse, and copy emojis instantly. Organized by category with Unicode info. Click to copy any emoji to clipboard.",
  keywords: ["emoji picker","emoji copy","emoji search","emoji list","copy emoji online"],
  openGraph: {
    title: "Emoji Picker — Search & Copy Emojis Online | CodeUtilo",
    description: "Search, browse, and copy emojis instantly. Organized by category with Unicode info. Click to copy any emoji to clipboard.",
    url: "https://codeutilo.com/emoji-picker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Emoji Picker — Search & Copy Emojis Online | CodeUtilo",
    description: "Search, browse, and copy emojis instantly. Organized by category with Unicode info. Click to copy any emoji to clipboard.",
  },
  alternates: {
    canonical: "https://codeutilo.com/emoji-picker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Emoji Picker"
        description="Search, browse, and copy emojis instantly. Organized by category with Unicode info. Click to copy any emoji to clipboard."
        slug="emoji-picker"
      />
      {children}
    </>
  );
}
