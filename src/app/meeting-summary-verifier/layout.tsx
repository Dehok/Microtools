import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Meeting Summary Verifier",
  description:
    "Verify AI-generated meeting summaries against transcript evidence and detect unsupported or weakly supported claims.",
  keywords: ["meeting summary verifier", "ai summary fact check", "transcript grounding", "summary validation"],
  openGraph: {
    title: "Meeting Summary Verifier | CodeUtilo",
    description:
      "Verify AI-generated meeting summaries against transcript evidence and detect unsupported or weakly supported claims.",
    url: "https://codeutilo.com/meeting-summary-verifier",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Meeting Summary Verifier | CodeUtilo",
    description:
      "Verify AI-generated meeting summaries against transcript evidence and detect unsupported or weakly supported claims.",
  },
  alternates: {
    canonical: "https://codeutilo.com/meeting-summary-verifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Meeting Summary Verifier"
        description="Audit AI meeting summaries by checking statement support against transcript text."
        slug="meeting-summary-verifier"
      />
      {children}
    </>
  );
}
