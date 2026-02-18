import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Privacy Policy Generator — Free & GDPR Ready",
  description: "Generate a free privacy policy for your website. GDPR, cookies, and data collection covered.",
  keywords: ["privacy policy generator","free privacy policy","gdpr privacy policy","website privacy policy","privacy policy template"],
  openGraph: {
    title: "Privacy Policy Generator — Free & GDPR Ready | CodeUtilo",
    description: "Generate a free privacy policy for your website. GDPR, cookies, and data collection covered.",
    url: "https://codeutilo.com/privacy-policy-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy Generator — Free & GDPR Ready | CodeUtilo",
    description: "Generate a free privacy policy for your website. GDPR, cookies, and data collection covered.",
  },
  alternates: {
    canonical: "https://codeutilo.com/privacy-policy-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Privacy Policy Generator"
        description="Generate a free privacy policy for your website. GDPR, cookies, and data collection covered."
        slug="privacy-policy-generator"
      />
      {children}
    </>
  );
}
