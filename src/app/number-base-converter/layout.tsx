import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Number Base Converter — Decimal, Binary, Hex, Octal",
  description: "Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free online number base converter.",
  keywords: ["number base converter", "binary converter", "hex converter", "decimal to binary", "octal converter"],
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
