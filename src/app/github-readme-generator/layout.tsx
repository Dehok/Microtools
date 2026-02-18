import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "GitHub Profile README Generator — Free README Maker",
  description: "Create an awesome GitHub profile README with stats, badges, social links, and tech stack. Free online generator.",
  keywords: ["github readme generator","github profile readme","readme maker","github readme","profile readme generator"],
  openGraph: {
    title: "GitHub Profile README Generator — Free README Maker | CodeUtilo",
    description: "Create an awesome GitHub profile README with stats, badges, social links, and tech stack. Free online generator.",
    url: "https://codeutilo.com/github-readme-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GitHub Profile README Generator — Free README Maker | CodeUtilo",
    description: "Create an awesome GitHub profile README with stats, badges, social links, and tech stack. Free online generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/github-readme-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Github Readme Generator"
        description="Create an awesome GitHub profile README with stats, badges, social links, and tech stack. Free online generator."
        slug="github-readme-generator"
      />
      {children}
    </>
  );
}
