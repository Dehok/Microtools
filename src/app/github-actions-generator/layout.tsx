import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "GitHub Actions Generator — CI/CD Workflow Builder",
  description: "Generate GitHub Actions CI/CD workflows visually. Configure triggers, Node versions, deploy to Vercel, Netlify, S3. Export YAML.",
  keywords: ["github actions generator","ci cd workflow builder","github actions yaml","github workflow generator","github actions template"],
  openGraph: {
    title: "GitHub Actions Generator — CI/CD Workflow Builder | CodeUtilo",
    description: "Generate GitHub Actions CI/CD workflows visually. Configure triggers, Node versions, deploy to Vercel, Netlify, S3. Export YAML.",
    url: "https://codeutilo.com/github-actions-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GitHub Actions Generator — CI/CD Workflow Builder | CodeUtilo",
    description: "Generate GitHub Actions CI/CD workflows visually. Configure triggers, Node versions, deploy to Vercel, Netlify, S3. Export YAML.",
  },
  alternates: {
    canonical: "https://codeutilo.com/github-actions-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="GitHub Actions Generator"
        description="Generate GitHub Actions CI/CD workflows visually. Configure triggers, Node versions, deploy to Vercel, Netlify, S3. Export YAML."
        slug="github-actions-generator"
      />
      {children}
    </>
  );
}
