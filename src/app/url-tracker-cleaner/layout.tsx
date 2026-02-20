import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "URL Tracker Cleaner",
  description:
    "Remove UTM and tracking query parameters from links in bulk. Clean and privacy-friendly URL sharing tool.",
  keywords: ["url tracker cleaner", "remove utm parameters", "strip tracking links", "clean url"],
  openGraph: {
    title: "URL Tracker Cleaner | CodeUtilo",
    description:
      "Remove UTM and tracking query parameters from links in bulk. Clean and privacy-friendly URL sharing tool.",
    url: "https://codeutilo.com/url-tracker-cleaner",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "URL Tracker Cleaner | CodeUtilo",
    description:
      "Remove UTM and tracking query parameters from links in bulk. Clean and privacy-friendly URL sharing tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/url-tracker-cleaner",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="URL Tracker Cleaner"
        description="Remove tracking query parameters from URLs locally in your browser."
        slug="url-tracker-cleaner"
      />
      {children}
    </>
  );
}
