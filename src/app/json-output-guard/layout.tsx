import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Output Guard",
  description:
    "Validate AI JSON outputs against expected schema before using them in code or automation workflows.",
  keywords: ["json output guard", "ai json validator", "schema validation", "structured output checker"],
  openGraph: {
    title: "JSON Output Guard | CodeUtilo",
    description:
      "Validate AI JSON outputs against expected schema before using them in code or automation workflows.",
    url: "https://codeutilo.com/json-output-guard",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Output Guard | CodeUtilo",
    description:
      "Validate AI JSON outputs against expected schema before using them in code or automation workflows.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-output-guard",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JSON Output Guard"
        description="Extract, parse, and validate model JSON outputs with local schema checks."
        slug="json-output-guard"
      />
      {children}
    </>
  );
}
