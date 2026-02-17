import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROT13 Encoder/Decoder — Caesar Cipher Online",
  description: "Encode and decode text with ROT13, ROT47, or custom Caesar cipher shift. Free online cipher tool.",
  keywords: ["rot13", "rot13 encoder", "rot13 decoder", "caesar cipher", "rot47", "cipher online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
