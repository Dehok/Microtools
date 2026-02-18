import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Privacy Policy Generator — Free Privacy Policy Template",
  description: "Generate a free privacy policy for your website or app. Customizable template covering data collection, cookies, GDPR, and third-party services.",
  keywords: ["privacy policy generator","privacy policy template","free privacy policy","gdpr privacy policy","website privacy policy"],
  openGraph: {
    title: "Privacy Policy Generator — Free Privacy Policy Template | CodeUtilo",
    description: "Generate a free privacy policy for your website or app. Customizable template covering data collection, cookies, GDPR, and third-party services.",
    url: "https://codeutilo.com/privacy-policy-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy Generator — Free Privacy Policy Template | CodeUtilo",
    description: "Generate a free privacy policy for your website or app. Customizable template covering data collection, cookies, GDPR, and third-party services.",
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
        description="Generate a free privacy policy for your website or app. Customizable template covering data collection, cookies, GDPR, and third-party services."
        slug="privacy-policy-generator"
      />
      {children}
    </>
  );
}
