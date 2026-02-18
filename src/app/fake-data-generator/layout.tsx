import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fake Data Generator — Random Names, Emails & Addresses",
  description:
    "Generate realistic fake data for testing. Random names, emails, phone numbers, addresses, and more. Export as JSON or CSV.",
  keywords: ["fake data generator", "random data", "test data generator", "mock data", "random name generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
