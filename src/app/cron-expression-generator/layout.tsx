import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Cron Expression Generator — Visual Cron Builder",
  description: "Build and understand cron expressions visually. See human-readable descriptions and next 5 scheduled runs. Presets for common schedules.",
  keywords: ["cron expression generator","cron builder","cron schedule maker","cron job generator","cron expression tester"],
  openGraph: {
    title: "Cron Expression Generator — Visual Cron Builder | CodeUtilo",
    description: "Build and understand cron expressions visually. See human-readable descriptions and next 5 scheduled runs. Presets for common schedules.",
    url: "https://codeutilo.com/cron-expression-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cron Expression Generator — Visual Cron Builder | CodeUtilo",
    description: "Build and understand cron expressions visually. See human-readable descriptions and next 5 scheduled runs. Presets for common schedules.",
  },
  alternates: {
    canonical: "https://codeutilo.com/cron-expression-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Cron Expression Generator"
        description="Build and understand cron expressions visually. See human-readable descriptions and next 5 scheduled runs. Presets for common schedules."
        slug="cron-expression-generator"
      />
      {children}
    </>
  );
}
