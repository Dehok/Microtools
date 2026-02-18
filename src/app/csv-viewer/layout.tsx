import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSV Viewer — View & Sort CSV Data Online",
  description: "View CSV data as a formatted table. Sort columns, search, and filter rows. Free online CSV viewer.",
  keywords: ["csv viewer","csv reader online","view csv file","csv table viewer","open csv online"],
  openGraph: {
    title: "CSV Viewer — View & Sort CSV Data Online | CodeUtilo",
    description: "View CSV data as a formatted table. Sort columns, search, and filter rows. Free online CSV viewer.",
    url: "https://codeutilo.com/csv-viewer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSV Viewer — View & Sort CSV Data Online | CodeUtilo",
    description: "View CSV data as a formatted table. Sort columns, search, and filter rows. Free online CSV viewer.",
  },
  alternates: {
    canonical: "https://codeutilo.com/csv-viewer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="CSV Viewer"
        description="View CSV data as a formatted table. Sort columns, search, and filter rows. Free online CSV viewer."
        slug="csv-viewer"
      />
      {children}
    </>
  );
}
