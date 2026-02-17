import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to CSV Converter Online — Free JSON/CSV Tool",
  description:
    "Convert JSON arrays to CSV format and CSV back to JSON instantly. Free online converter with copy and download.",
  keywords: ["json to csv", "csv to json", "json csv converter", "convert json to csv online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
