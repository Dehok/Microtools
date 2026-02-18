import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Random Number Generator — Generate Random Numbers Online",
  description: "Generate random numbers within a custom range. Support for multiple numbers, no duplicates, and sorting. Free online tool.",
  keywords: ["random number generator","random number online","random number picker","number randomizer","dice roller"],
  openGraph: {
    title: "Random Number Generator — Generate Random Numbers Online | CodeUtilo",
    description: "Generate random numbers within a custom range. Support for multiple numbers, no duplicates, and sorting. Free online tool.",
    url: "https://codeutilo.com/random-number-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Random Number Generator — Generate Random Numbers Online | CodeUtilo",
    description: "Generate random numbers within a custom range. Support for multiple numbers, no duplicates, and sorting. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/random-number-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Random Number Generator"
        description="Generate random numbers within a custom range. Support for multiple numbers, no duplicates, and sorting. Free online tool."
        slug="random-number-generator"
      />
        <FAQSchema faqs={[{"question":"Is the Random Number Generator free to use?","answer":"Yes, the Random Number Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Random Number Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Random Number Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
