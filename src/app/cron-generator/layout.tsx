import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Expression Generator Online — Free Cron Builder",
  description: "Build and understand cron expressions with a visual, interactive editor. Generate cron syntax for scheduled tasks.",
  keywords: ["cron generator", "cron expression", "crontab generator", "cron builder", "cron schedule"],
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
