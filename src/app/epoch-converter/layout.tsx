import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Epoch / Unix Timestamp Converter Online — Free Tool",
  description: "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Live clock included.",
  keywords: ["epoch converter","unix timestamp","timestamp converter","epoch to date","unix time"],
  openGraph: {
    title: "Epoch / Unix Timestamp Converter Online — Free Tool | CodeUtilo",
    description: "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Live clock included.",
    url: "https://codeutilo.com/epoch-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Epoch / Unix Timestamp Converter Online — Free Tool | CodeUtilo",
    description: "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Live clock included.",
  },
  alternates: {
    canonical: "https://codeutilo.com/epoch-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Epoch Converter"
        description="Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Live clock included."
        slug="epoch-converter"
      />
        <FAQSchema faqs={[{"question":"What is Unix epoch time?","answer":"Unix epoch time (also called POSIX time or Unix timestamp) is the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC. It's the standard way computers internally track time."},{"question":"What is the difference between seconds and milliseconds timestamps?","answer":"Unix timestamps in seconds are 10 digits (e.g., 1708300800), while millisecond timestamps are 13 digits (e.g., 1708300800000). JavaScript's Date.now() returns milliseconds, while most other systems use seconds."},{"question":"What is the Year 2038 problem?","answer":"Systems using 32-bit signed integers to store Unix timestamps will overflow on January 19, 2038. After this date, the timestamp wraps around to a negative number. Most modern systems use 64-bit integers to avoid this."},{"question":"How do I get the current Unix timestamp in code?","answer":"In JavaScript: Math.floor(Date.now() / 1000). In Python: import time; int(time.time()). In PHP: time(). In Java: System.currentTimeMillis() / 1000."}]} />
      {children}
    </>
  );
}
