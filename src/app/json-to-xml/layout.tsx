import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to XML Converter Online — Convert JSON to XML",
  description:
    "Convert JSON data to XML format instantly. Handles nested objects, arrays, and attributes. Free online JSON to XML converter.",
  keywords: ["json to xml", "json to xml converter", "convert json xml", "json xml online", "json to xml tool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
