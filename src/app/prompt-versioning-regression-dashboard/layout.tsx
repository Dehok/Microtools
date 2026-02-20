import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Prompt Versioning + Regression Dashboard",
  description:
    "Track prompt versions, compare baseline vs candidate constraints, and monitor regression risk in a browser-only dashboard.",
  keywords: [
    "prompt versioning",
    "prompt regression dashboard",
    "llm prompt qa",
    "prompt drift detection",
  ],
  openGraph: {
    title: "Prompt Versioning + Regression Dashboard | CodeUtilo",
    description:
      "Track prompt versions, compare baseline vs candidate constraints, and monitor regression risk in a browser-only dashboard.",
    url: "https://codeutilo.com/prompt-versioning-regression-dashboard",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Prompt Versioning + Regression Dashboard | CodeUtilo",
    description:
      "Track prompt versions, compare baseline vs candidate constraints, and monitor regression risk in a browser-only dashboard.",
  },
  alternates: {
    canonical: "https://codeutilo.com/prompt-versioning-regression-dashboard",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Prompt Versioning + Regression Dashboard"
        description="Version prompt drafts, compare constraints, and detect instruction regression risk."
        slug="prompt-versioning-regression-dashboard"
      />
      {children}
    </>
  );
}
