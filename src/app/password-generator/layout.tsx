import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Password Generator Online — Strong & Random Passwords",
  description: "Generate strong, random, and secure passwords with customizable length and character sets. Free online password generator.",
  keywords: ["password generator","random password","strong password","secure password generator"],
  openGraph: {
    title: "Password Generator Online — Strong & Random Passwords | CodeUtilo",
    description: "Generate strong, random, and secure passwords with customizable length and character sets. Free online password generator.",
    url: "https://codeutilo.com/password-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Password Generator Online — Strong & Random Passwords | CodeUtilo",
    description: "Generate strong, random, and secure passwords with customizable length and character sets. Free online password generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/password-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Password Generator"
        description="Generate strong, random, and secure passwords with customizable length and character sets. Free online password generator."
        slug="password-generator"
      />
      {children}
    </>
  );
}
