import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Output Contract Tester",
  description:
    "Test AI outputs against strict contracts including JSON validity, required keys, forbidden phrases, and word limits.",
  keywords: ["output contract tester", "ai output validation", "json output contract", "llm schema checks"],
  openGraph: {
    title: "Output Contract Tester | CodeUtilo",
    description:
      "Test AI outputs against strict contracts including JSON validity, required keys, forbidden phrases, and word limits.",
    url: "https://codeutilo.com/output-contract-tester",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Output Contract Tester | CodeUtilo",
    description:
      "Test AI outputs against strict contracts including JSON validity, required keys, forbidden phrases, and word limits.",
  },
  alternates: {
    canonical: "https://codeutilo.com/output-contract-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Output Contract Tester"
        description="Validate AI response contracts locally before downstream automation."
        slug="output-contract-tester"
      />
      {children}
    </>
  );
}
