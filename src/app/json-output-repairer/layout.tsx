import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Output Repairer",
  description:
    "Repair malformed AI JSON outputs (trailing commas, comments, single quotes, Python literals) and export clean parseable JSON.",
  keywords: ["json output repairer", "ai json fixer", "malformed json repair", "llm json cleanup"],
  openGraph: {
    title: "JSON Output Repairer | CodeUtilo",
    description:
      "Repair malformed AI JSON outputs (trailing commas, comments, single quotes, Python literals) and export clean parseable JSON.",
    url: "https://codeutilo.com/json-output-repairer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Output Repairer | CodeUtilo",
    description:
      "Repair malformed AI JSON outputs (trailing commas, comments, single quotes, Python literals) and export clean parseable JSON.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-output-repairer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON Output Repairer"
        description="Repair malformed AI-generated JSON outputs locally in-browser before validation and automation."
        slug="json-output-repairer"
      />
      {children}
    </>
  );
}

