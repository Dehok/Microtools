import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Password Strength Checker — Test Your Password",
  description: "Analyze password strength with detailed scoring. Get tips to improve security. Free online tool.",
  keywords: ["password strength checker","password tester","password strength","check password security","how strong is my password"],
  openGraph: {
    title: "Password Strength Checker — Test Your Password | CodeUtilo",
    description: "Analyze password strength with detailed scoring. Get tips to improve security. Free online tool.",
    url: "https://codeutilo.com/password-strength-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Password Strength Checker — Test Your Password | CodeUtilo",
    description: "Analyze password strength with detailed scoring. Get tips to improve security. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/password-strength-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Password Strength Checker"
        description="Analyze password strength with detailed scoring. Get tips to improve security. Free online tool."
        slug="password-strength-checker"
      />
      {children}
    </>
  );
}
