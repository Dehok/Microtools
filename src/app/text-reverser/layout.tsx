import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Reverser — Reverse Text, Words & Lines",
  description:
    "Reverse text characters, words, or lines instantly. Create mirror text, flip text upside down, and check palindromes. Free text reverser.",
  keywords: ["text reverser", "reverse text", "backwards text", "mirror text", "flip text", "reverse words"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
