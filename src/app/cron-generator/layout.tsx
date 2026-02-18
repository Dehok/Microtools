import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Cron Expression Generator & Explainer",
  description: "Build and understand cron expressions with a visual, interactive editor. Free online cron generator.",
  keywords: ["cron expression generator","crontab guru","cron builder","cron schedule generator","cron job expression"],
  openGraph: {
    title: "Cron Expression Generator & Explainer | CodeUtilo",
    description: "Build and understand cron expressions with a visual, interactive editor. Free online cron generator.",
    url: "https://codeutilo.com/cron-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cron Expression Generator & Explainer | CodeUtilo",
    description: "Build and understand cron expressions with a visual, interactive editor. Free online cron generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/cron-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Cron Expression Generator"
        description="Build and understand cron expressions with a visual, interactive editor. Free online cron generator."
        slug="cron-generator"
      />
      {children}
    </>
  );
}
