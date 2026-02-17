import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Repeater — Repeat Text Online Free",
  description: "Repeat any text multiple times with custom separators. Copy the result instantly. Free online text repeater tool.",
  keywords: ["text repeater", "repeat text online", "text multiplier", "repeat string", "text generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
