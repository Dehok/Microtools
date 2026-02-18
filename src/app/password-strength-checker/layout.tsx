import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Password Strength Checker — Test Your Password",
  description: "Check how strong your password is. Get detailed scoring, crack time estimates, and tips to improve security. Everything runs locally.",
  keywords: ["password strength checker","password tester","password security","check password strength","password analyzer"],
  openGraph: {
    title: "Password Strength Checker — Test Your Password | CodeUtilo",
    description: "Check how strong your password is. Get detailed scoring, crack time estimates, and tips to improve security. Everything runs locally.",
    url: "https://codeutilo.com/password-strength-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Password Strength Checker — Test Your Password | CodeUtilo",
    description: "Check how strong your password is. Get detailed scoring, crack time estimates, and tips to improve security. Everything runs locally.",
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
        description="Check how strong your password is. Get detailed scoring, crack time estimates, and tips to improve security. Everything runs locally."
        slug="password-strength-checker"
      />
      {children}
    </>
  );
}
