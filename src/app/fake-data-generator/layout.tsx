import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the Fake Data Generator free to use?","answer":"Yes, the Fake Data Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Fake Data Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Fake Data Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
