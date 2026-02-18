import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the Time Zone Converter free to use?","answer":"Yes, the Time Zone Converter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Time Zone Converter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Time Zone Converter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
