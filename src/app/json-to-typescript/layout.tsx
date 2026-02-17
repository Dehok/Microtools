import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to TypeScript — Generate Interfaces from JSON",
  description: "Convert JSON data to TypeScript interfaces automatically. Supports nested objects and arrays. Free online tool.",
  keywords: ["json to typescript", "json to interface", "typescript interface generator", "json to ts", "typescript types from json"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
