import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Morse Code Translator — Text to Morse & Morse to Text",
  description: "Translate text to Morse code and Morse code back to text. Full reference chart included. Free online tool.",
  keywords: ["morse code translator", "text to morse", "morse to text", "morse code converter", "morse code online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
