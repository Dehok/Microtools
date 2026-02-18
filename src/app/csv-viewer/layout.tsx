import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSV Viewer Online — View & Edit CSV Files",
  description: "View CSV data as a formatted table. Sort columns, search, and edit cells. Paste or upload CSV files. Free online CSV viewer.",
  keywords: ["csv viewer","csv editor","view csv online","csv table","csv file viewer"],
  openGraph: {
    title: "CSV Viewer Online — View & Edit CSV Files | CodeUtilo",
    description: "View CSV data as a formatted table. Sort columns, search, and edit cells. Paste or upload CSV files. Free online CSV viewer.",
    url: "https://codeutilo.com/csv-viewer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSV Viewer Online — View & Edit CSV Files | CodeUtilo",
    description: "View CSV data as a formatted table. Sort columns, search, and edit cells. Paste or upload CSV files. Free online CSV viewer.",
  },
  alternates: {
    canonical: "https://codeutilo.com/csv-viewer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Csv Viewer"
        description="View CSV data as a formatted table. Sort columns, search, and edit cells. Paste or upload CSV files. Free online CSV viewer."
        slug="csv-viewer"
      />
      {children}
    </>
  );
}
