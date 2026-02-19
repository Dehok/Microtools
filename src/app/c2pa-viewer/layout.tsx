import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "C2PA Viewer (Content Credentials Inspector)",
  description:
    "Inspect files for C2PA/Content Credentials markers in your browser. Best-effort metadata detection with no upload.",
  keywords: ["c2pa viewer", "content credentials", "c2pa metadata", "ai provenance"],
  openGraph: {
    title: "C2PA Viewer | CodeUtilo",
    description:
      "Inspect files for C2PA/Content Credentials markers in your browser. Best-effort metadata detection with no upload.",
    url: "https://codeutilo.com/c2pa-viewer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "C2PA Viewer | CodeUtilo",
    description:
      "Inspect files for C2PA/Content Credentials markers in your browser. Best-effort metadata detection with no upload.",
  },
  alternates: {
    canonical: "https://codeutilo.com/c2pa-viewer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="C2PA Viewer"
        description="Inspect files for C2PA/content credential markers locally in your browser."
        slug="c2pa-viewer"
      />
      {children}
    </>
  );
}
