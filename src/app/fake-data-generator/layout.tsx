import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Fake Data Generator — Names, Emails & Addresses",
  description: "Generate realistic fake data for testing. Names, emails, phone numbers, and addresses. Free tool.",
  keywords: ["fake data generator","test data generator","random data","mock data","dummy data generator"],
  openGraph: {
    title: "Fake Data Generator — Names, Emails & Addresses | CodeUtilo",
    description: "Generate realistic fake data for testing. Names, emails, phone numbers, and addresses. Free tool.",
    url: "https://codeutilo.com/fake-data-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Fake Data Generator — Names, Emails & Addresses | CodeUtilo",
    description: "Generate realistic fake data for testing. Names, emails, phone numbers, and addresses. Free tool.",
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
        description="Generate realistic fake data for testing. Names, emails, phone numbers, and addresses. Free tool."
        slug="fake-data-generator"
      />
      {children}
    </>
  );
}
