import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emoji Picker — Search & Copy Emojis Online",
  description:
    "Search, browse, and copy emojis instantly. Organized by category with Unicode info. Click to copy any emoji to clipboard.",
  keywords: ["emoji picker", "emoji copy", "emoji search", "emoji list", "copy emoji online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
