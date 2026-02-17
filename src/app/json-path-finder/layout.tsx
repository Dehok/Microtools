import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Path Finder — Extract All Paths from JSON",
  description:
    "Extract all paths from a JSON object. Filter and copy JSONPath expressions. Free online tool for developers.",
  keywords: [
    "json path finder",
    "jsonpath extractor",
    "json path online",
    "json key finder",
    "json navigator",
    "json path tool",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
