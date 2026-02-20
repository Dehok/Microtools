import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Function Calling Schema Tester",
  description:
    "Validate tool/function-call arguments against JSON schema before running agent workflows.",
  keywords: ["function calling tester", "tool schema validator", "ai function arguments", "json schema test"],
  openGraph: {
    title: "Function Calling Schema Tester | CodeUtilo",
    description:
      "Validate tool/function-call arguments against JSON schema before running agent workflows.",
    url: "https://codeutilo.com/function-calling-schema-tester",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Function Calling Schema Tester | CodeUtilo",
    description:
      "Validate tool/function-call arguments against JSON schema before running agent workflows.",
  },
  alternates: {
    canonical: "https://codeutilo.com/function-calling-schema-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Function Calling Schema Tester"
        description="Test AI tool-call argument payloads against schema in-browser."
        slug="function-calling-schema-tester"
      />
      {children}
    </>
  );
}
