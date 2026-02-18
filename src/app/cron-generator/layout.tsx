import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"What is a cron expression?","answer":"A cron expression is a string of five fields (minute, hour, day of month, month, day of week) that defines a schedule for automated tasks. For example, '0 9 * * 1' means 'every Monday at 9:00 AM'."},{"question":"What does the asterisk (*) mean in cron?","answer":"The asterisk (*) means 'every possible value' for that field. For example, * in the minute field means 'every minute', and * in the day-of-week field means 'every day of the week'."},{"question":"What is the difference between cron and crontab?","answer":"Cron is the daemon (background service) that runs scheduled tasks. Crontab (cron table) is the file where you define your scheduled tasks and their cron expressions. You edit it with 'crontab -e'."},{"question":"Can I use cron expressions in cloud services?","answer":"Yes. AWS CloudWatch Events, Azure Functions, Google Cloud Scheduler, GitHub Actions, and many CI/CD platforms use cron expressions (sometimes with slight syntax variations) for scheduling."}]} />
      {children}
    </>
  );
}
