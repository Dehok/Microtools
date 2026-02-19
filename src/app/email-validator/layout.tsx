import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Email Validator — Check Email Format Online",
  description: "Validate email address format and syntax. Check for common mistakes and typos. Free online tool.",
  keywords: ["email validator","email checker","validate email","email syntax checker","check email format"],
  openGraph: {
    title: "Email Validator — Check Email Format Online | CodeUtilo",
    description: "Validate email address format and syntax. Check for common mistakes and typos. Free online tool.",
    url: "https://codeutilo.com/email-validator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Email Validator — Check Email Format Online | CodeUtilo",
    description: "Validate email address format and syntax. Check for common mistakes and typos. Free online tool.",
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
        description="Validate email address format and syntax. Check for common mistakes and typos. Free online tool."
        slug="email-validator"
      />
      {children}
    </>
  );
}
