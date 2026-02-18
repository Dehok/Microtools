import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Time Zone Converter — Convert Time Between Zones",
  description: "Convert time between different time zones instantly. Compare multiple time zones at a glance. Free online time zone converter.",
  keywords: ["time zone converter","timezone converter","convert time zones","world clock","time difference calculator"],
  openGraph: {
    title: "Time Zone Converter — Convert Time Between Zones | CodeUtilo",
    description: "Convert time between different time zones instantly. Compare multiple time zones at a glance. Free online time zone converter.",
    url: "https://codeutilo.com/time-zone-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Time Zone Converter — Convert Time Between Zones | CodeUtilo",
    description: "Convert time between different time zones instantly. Compare multiple time zones at a glance. Free online time zone converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/time-zone-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Time Zone Converter"
        description="Convert time between different time zones instantly. Compare multiple time zones at a glance. Free online time zone converter."
        slug="time-zone-converter"
      />
      {children}
    </>
  );
}
