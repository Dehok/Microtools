import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Password Generator Online — Strong & Random",
  description: "Generate strong, random, and secure passwords. Customize length, characters, and generate in bulk.",
  keywords: ["password generator","random password","strong password generator","secure password","generate password online"],
  openGraph: {
    title: "Password Generator Online — Strong & Random | CodeUtilo",
    description: "Generate strong, random, and secure passwords. Customize length, characters, and generate in bulk.",
    url: "https://codeutilo.com/password-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Password Generator Online — Strong & Random | CodeUtilo",
    description: "Generate strong, random, and secure passwords. Customize length, characters, and generate in bulk.",
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
        description="Generate strong, random, and secure passwords. Customize length, characters, and generate in bulk."
        slug="password-generator"
      />
      {children}
    </>
  );
}
