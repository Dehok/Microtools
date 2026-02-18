import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"How strong is a generated password?","answer":"A 16-character password with uppercase, lowercase, numbers, and symbols has approximately 95^16 possible combinations, which would take billions of years to crack with current technology."},{"question":"Is it safe to generate passwords online?","answer":"Yes, with this tool. The password is generated entirely in your browser using the cryptographic random number generator (crypto.getRandomValues). No password is ever sent to any server."},{"question":"What makes a password strong?","answer":"Strong passwords are long (12+ characters), use all character types (uppercase, lowercase, numbers, symbols), and are randomly generated rather than based on dictionary words or personal information."},{"question":"How often should I change my passwords?","answer":"Modern security guidelines (NIST) recommend changing passwords only when there's evidence of compromise, rather than on a fixed schedule. Using unique, strong passwords with a password manager is more effective."}]} />
      {children}
    </>
  );
}
