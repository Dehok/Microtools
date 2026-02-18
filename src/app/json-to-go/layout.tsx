import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to Go Struct — Generate Go Types from JSON",
  description:
    "Convert JSON data to Go struct definitions. Handles nested objects, arrays, and null values. Free JSON to Go converter.",
  keywords: ["json to go", "json to go struct", "go struct generator", "json to golang", "convert json to go"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
