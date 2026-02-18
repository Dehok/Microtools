import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV Viewer Online — View & Edit CSV Files",
  description:
    "View CSV data as a formatted table. Sort columns, search, and edit cells. Paste or upload CSV files. Free online CSV viewer.",
  keywords: ["csv viewer", "csv editor", "view csv online", "csv table", "csv file viewer"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
