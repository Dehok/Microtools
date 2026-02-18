import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the CSV Viewer free to use?","answer":"Yes, the CSV Viewer is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The CSV Viewer is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The CSV Viewer runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
