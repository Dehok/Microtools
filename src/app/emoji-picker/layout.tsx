import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Emoji Picker — Search, Browse & Copy Emojis",
  description: "Search, browse, and copy emojis to clipboard. Organized by category with Unicode info. Free tool.",
  keywords: ["emoji picker","emoji search","copy emoji","emoji list","emoji keyboard online"],
  openGraph: {
    title: "Emoji Picker — Search, Browse & Copy Emojis | CodeUtilo",
    description: "Search, browse, and copy emojis to clipboard. Organized by category with Unicode info. Free tool.",
    url: "https://codeutilo.com/emoji-picker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Emoji Picker — Search, Browse & Copy Emojis | CodeUtilo",
    description: "Search, browse, and copy emojis to clipboard. Organized by category with Unicode info. Free tool.",
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
        description="Search, browse, and copy emojis to clipboard. Organized by category with Unicode info. Free tool."
        slug="emoji-picker"
      />
      {children}
    </>
  );
}
