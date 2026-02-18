import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "NATO Phonetic Alphabet Converter — Text to NATO",
  description: "Convert text to NATO phonetic alphabet (Alpha, Bravo, Charlie...) and back. Useful for spelling over phone or radio. Free converter.",
  keywords: ["nato phonetic alphabet","text to nato","phonetic alphabet converter","spelling alphabet","nato alphabet"],
  openGraph: {
    title: "NATO Phonetic Alphabet Converter — Text to NATO | CodeUtilo",
    description: "Convert text to NATO phonetic alphabet (Alpha, Bravo, Charlie...) and back. Useful for spelling over phone or radio. Free converter.",
    url: "https://codeutilo.com/text-to-nato",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NATO Phonetic Alphabet Converter — Text to NATO | CodeUtilo",
    description: "Convert text to NATO phonetic alphabet (Alpha, Bravo, Charlie...) and back. Useful for spelling over phone or radio. Free converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-to-nato",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text To Nato"
        description="Convert text to NATO phonetic alphabet (Alpha, Bravo, Charlie...) and back. Useful for spelling over phone or radio. Free converter."
        slug="text-to-nato"
      />
      {children}
    </>
  );
}
