import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Cron Expression Generator Online — Free Cron Builder",
  description: "Build and understand cron expressions with a visual, interactive editor. Generate cron syntax for scheduled tasks.",
  keywords: ["cron generator","cron expression","crontab generator","cron builder","cron schedule"],
  openGraph: {
    title: "Cron Expression Generator Online — Free Cron Builder | CodeUtilo",
    description: "Build and understand cron expressions with a visual, interactive editor. Generate cron syntax for scheduled tasks.",
    url: "https://codeutilo.com/cron-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cron Expression Generator Online — Free Cron Builder | CodeUtilo",
    description: "Build and understand cron expressions with a visual, interactive editor. Generate cron syntax for scheduled tasks.",
  },
  alternates: {
    canonical: "https://codeutilo.com/cron-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Cron Generator"
        description="Build and understand cron expressions with a visual, interactive editor. Generate cron syntax for scheduled tasks."
        slug="cron-generator"
      />
      {children}
    </>
  );
}
