import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: ".env Editor & Validator — Edit Environment Files Online",
  description: "Edit and validate .env files online. Check for duplicate keys, empty values, syntax errors, and formatting issues. Free .env editor tool.",
  keywords: ["env editor","env file validator","dotenv editor","environment variables editor","env file checker"],
  openGraph: {
    title: ".env Editor & Validator — Edit Environment Files Online | CodeUtilo",
    description: "Edit and validate .env files online. Check for duplicate keys, empty values, syntax errors, and formatting issues. Free .env editor tool.",
    url: "https://codeutilo.com/env-editor",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: ".env Editor & Validator — Edit Environment Files Online | CodeUtilo",
    description: "Edit and validate .env files online. Check for duplicate keys, empty values, syntax errors, and formatting issues. Free .env editor tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/env-editor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Env Editor"
        description="Edit and validate .env files online. Check for duplicate keys, empty values, syntax errors, and formatting issues. Free .env editor tool."
        slug="env-editor"
      />
      {children}
    </>
  );
}
