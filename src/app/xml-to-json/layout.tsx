import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML to JSON Converter — Convert XML Online",
  description:
    "Convert XML data to JSON format online. Handles nested elements, attributes, and arrays. Free XML to JSON converter tool.",
  keywords: ["xml to json", "xml to json converter", "convert xml to json", "xml parser", "xml json online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
