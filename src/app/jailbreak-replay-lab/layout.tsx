import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Jailbreak Replay Lab",
  description:
    "Replay jailbreak and policy-bypass scenarios, score model responses, and export deterministic safety reports in-browser.",
  keywords: [
    "jailbreak testing",
    "prompt security testing",
    "ai safety replay",
    "model defense evaluation",
  ],
  openGraph: {
    title: "Jailbreak Replay Lab | CodeUtilo",
    description:
      "Replay jailbreak and policy-bypass scenarios, score model responses, and export deterministic safety reports in-browser.",
    url: "https://codeutilo.com/jailbreak-replay-lab",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jailbreak Replay Lab | CodeUtilo",
    description:
      "Replay jailbreak and policy-bypass scenarios, score model responses, and export deterministic safety reports in-browser.",
  },
  alternates: {
    canonical: "https://codeutilo.com/jailbreak-replay-lab",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Jailbreak Replay Lab"
        description="Replay adversarial prompt scenarios and score defensive response quality."
        slug="jailbreak-replay-lab"
      />
      {children}
    </>
  );
}
