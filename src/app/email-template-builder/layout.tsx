import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Email Template Builder — HTML Email Generator Free",
  description: "Build responsive HTML email templates visually. Customize header, body, CTA button, and footer. Preview and download HTML.",
  keywords: ["email template builder","html email generator","email template maker","responsive email builder","email design tool"],
  openGraph: {
    title: "Email Template Builder — HTML Email Generator Free | CodeUtilo",
    description: "Build responsive HTML email templates visually. Customize header, body, CTA button, and footer. Preview and download HTML.",
    url: "https://codeutilo.com/email-template-builder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Email Template Builder — HTML Email Generator Free | CodeUtilo",
    description: "Build responsive HTML email templates visually. Customize header, body, CTA button, and footer. Preview and download HTML.",
  },
  alternates: {
    canonical: "https://codeutilo.com/email-template-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Email Template Builder"
        description="Build responsive HTML email templates visually. Customize header, body, CTA button, and footer. Preview and download HTML."
        slug="email-template-builder"
      />
      {children}
    </>
  );
}
