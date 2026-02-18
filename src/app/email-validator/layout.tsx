import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Email Validator — Check Email Address Format",
  description: "Validate email address format and syntax. Detect common typos and mistakes. Bulk validation supported. Free email validator tool.",
  keywords: ["email validator","validate email","email checker","email syntax checker","email format validator"],
  openGraph: {
    title: "Email Validator — Check Email Address Format | CodeUtilo",
    description: "Validate email address format and syntax. Detect common typos and mistakes. Bulk validation supported. Free email validator tool.",
    url: "https://codeutilo.com/email-validator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Email Validator — Check Email Address Format | CodeUtilo",
    description: "Validate email address format and syntax. Detect common typos and mistakes. Bulk validation supported. Free email validator tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/email-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Email Validator"
        description="Validate email address format and syntax. Detect common typos and mistakes. Bulk validation supported. Free email validator tool."
        slug="email-validator"
      />
      {children}
    </>
  );
}
