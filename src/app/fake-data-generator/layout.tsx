import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Fake Data Generator — Random Names, Emails & Addresses",
  description: "Generate realistic fake data for testing. Random names, emails, phone numbers, addresses, and more. Export as JSON or CSV.",
  keywords: ["fake data generator","random data","test data generator","mock data","random name generator"],
  openGraph: {
    title: "Fake Data Generator — Random Names, Emails & Addresses | CodeUtilo",
    description: "Generate realistic fake data for testing. Random names, emails, phone numbers, addresses, and more. Export as JSON or CSV.",
    url: "https://codeutilo.com/fake-data-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Fake Data Generator — Random Names, Emails & Addresses | CodeUtilo",
    description: "Generate realistic fake data for testing. Random names, emails, phone numbers, addresses, and more. Export as JSON or CSV.",
  },
  alternates: {
    canonical: "https://codeutilo.com/fake-data-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Fake Data Generator"
        description="Generate realistic fake data for testing. Random names, emails, phone numbers, addresses, and more. Export as JSON or CSV."
        slug="fake-data-generator"
      />
      {children}
    </>
  );
}
