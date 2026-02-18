import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Time Zone Converter — Compare Time Zones Online",
  description: "Convert time between different time zones. Compare multiple zones at a glance. Free online tool.",
  keywords: ["time zone converter","timezone converter","convert time zones","world clock","time difference calculator"],
  openGraph: {
    title: "Time Zone Converter — Compare Time Zones Online | CodeUtilo",
    description: "Convert time between different time zones. Compare multiple zones at a glance. Free online tool.",
    url: "https://codeutilo.com/time-zone-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Time Zone Converter — Compare Time Zones Online | CodeUtilo",
    description: "Convert time between different time zones. Compare multiple zones at a glance. Free online tool.",
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
        description="Convert time between different time zones. Compare multiple zones at a glance. Free online tool."
        slug="time-zone-converter"
      />
      {children}
    </>
  );
}
