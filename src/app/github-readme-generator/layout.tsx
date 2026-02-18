import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "GitHub Profile README Generator Online",
  description: "Create an awesome GitHub profile README with stats, badges, and social links. Free online generator.",
  keywords: ["github readme generator","github profile readme","readme generator","github profile","awesome readme"],
  openGraph: {
    title: "GitHub Profile README Generator Online | CodeUtilo",
    description: "Create an awesome GitHub profile README with stats, badges, and social links. Free online generator.",
    url: "https://codeutilo.com/github-readme-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GitHub Profile README Generator Online | CodeUtilo",
    description: "Create an awesome GitHub profile README with stats, badges, and social links. Free online generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/github-readme-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="GitHub README Generator"
        description="Create an awesome GitHub profile README with stats, badges, and social links. Free online generator."
        slug="github-readme-generator"
      />
      {children}
    </>
  );
}
