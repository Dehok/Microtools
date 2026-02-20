import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Claim Evidence Matrix",
  description:
    "Map answer claims to supporting sources with deterministic support scoring and exportable verification matrices.",
  keywords: ["claim evidence matrix", "grounding matrix", "fact checking ai", "citation audit"],
  openGraph: {
    title: "Claim Evidence Matrix | CodeUtilo",
    description:
      "Map answer claims to supporting sources with deterministic support scoring and exportable verification matrices.",
    url: "https://codeutilo.com/claim-evidence-matrix",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Claim Evidence Matrix | CodeUtilo",
    description:
      "Map answer claims to supporting sources with deterministic support scoring and exportable verification matrices.",
  },
  alternates: {
    canonical: "https://codeutilo.com/claim-evidence-matrix",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Claim Evidence Matrix"
        description="Build claim-to-evidence verification matrices from answer text and source context."
        slug="claim-evidence-matrix"
      />
      {children}
    </>
  );
}
