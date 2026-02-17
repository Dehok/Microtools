import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML Formatter Online — Beautify & Validate XML",
  description:
    "Format, beautify, and validate XML data online. Minify or pretty-print XML with custom indentation. Free XML formatter tool.",
  keywords: ["xml formatter", "xml beautifier", "xml validator", "format xml", "xml pretty print"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
