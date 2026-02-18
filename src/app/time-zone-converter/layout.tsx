import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Zone Converter — Convert Time Between Zones",
  description:
    "Convert time between different time zones instantly. Compare multiple time zones at a glance. Free online time zone converter.",
  keywords: ["time zone converter", "timezone converter", "convert time zones", "world clock", "time difference calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
