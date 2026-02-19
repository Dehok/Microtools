import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Terms of Service Generator — Free ToS for Your Website",
  description: "Generate a free Terms of Service for your website or app. Customize for accounts, payments, and user content. Instant download.",
  keywords: ["terms of service generator","tos generator","free terms of service","terms and conditions generator","website terms generator"],
  openGraph: {
    title: "Terms of Service Generator — Free ToS for Your Website | CodeUtilo",
    description: "Generate a free Terms of Service for your website or app. Customize for accounts, payments, and user content. Instant download.",
    url: "https://codeutilo.com/terms-of-service-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service Generator — Free ToS for Your Website | CodeUtilo",
    description: "Generate a free Terms of Service for your website or app. Customize for accounts, payments, and user content. Instant download.",
  },
  alternates: {
    canonical: "https://codeutilo.com/terms-of-service-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Terms of Service Generator"
        description="Generate a free Terms of Service for your website or app. Customize for accounts, payments, and user content. Instant download."
        slug="terms-of-service-generator"
      />
      {children}
    </>
  );
}
