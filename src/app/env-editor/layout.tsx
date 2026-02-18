import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: ".env Editor & Validator — Check Environment Files",
  description: "Edit and validate .env files. Check for duplicates, empty values, and syntax errors. Free tool.",
  keywords: ["env editor","env file validator","dotenv editor",".env checker","environment file editor"],
  openGraph: {
    title: ".env Editor & Validator — Check Environment Files | CodeUtilo",
    description: "Edit and validate .env files. Check for duplicates, empty values, and syntax errors. Free tool.",
    url: "https://codeutilo.com/env-editor",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: ".env Editor & Validator — Check Environment Files | CodeUtilo",
    description: "Edit and validate .env files. Check for duplicates, empty values, and syntax errors. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/env-editor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name=".env Editor & Validator"
        description="Edit and validate .env files. Check for duplicates, empty values, and syntax errors. Free tool."
        slug="env-editor"
      />
      {children}
    </>
  );
}
