import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Byte Counter — String Size Calculator Online",
  description: "Count bytes, characters, and code points in any text. Shows UTF-8, UTF-16, and ASCII sizes. Free online byte counter.",
  keywords: ["byte counter", "string size calculator", "utf-8 byte count", "character byte size", "string length bytes"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
