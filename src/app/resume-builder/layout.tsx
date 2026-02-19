import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Resume Builder Online — Create Professional Resume PDF Free",
  description: "Build a professional resume with our free online builder. Choose from 3 templates, customize colors, and download as PDF. No signup required.",
  keywords: ["resume builder","cv builder online","free resume maker","resume generator","pdf resume creator"],
  openGraph: {
    title: "Resume Builder Online — Create Professional Resume PDF Free | CodeUtilo",
    description: "Build a professional resume with our free online builder. Choose from 3 templates, customize colors, and download as PDF. No signup required.",
    url: "https://codeutilo.com/resume-builder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Resume Builder Online — Create Professional Resume PDF Free | CodeUtilo",
    description: "Build a professional resume with our free online builder. Choose from 3 templates, customize colors, and download as PDF. No signup required.",
  },
  alternates: {
    canonical: "https://codeutilo.com/resume-builder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Resume Builder"
        description="Build a professional resume with our free online builder. Choose from 3 templates, customize colors, and download as PDF. No signup required."
        slug="resume-builder"
      />
      {children}
    </>
  );
}
