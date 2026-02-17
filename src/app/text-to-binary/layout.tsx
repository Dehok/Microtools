import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text to Binary Converter — Binary, Hex, Octal, Decimal",
  description: "Convert text to binary, hexadecimal, octal, or decimal. Decode binary back to text. Free online converter.",
  keywords: ["text to binary", "binary converter", "text to hex", "binary to text", "ascii to binary"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
