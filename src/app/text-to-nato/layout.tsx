import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "NATO Phonetic Alphabet Converter Online",
  description: "Convert text to NATO phonetic alphabet. Alpha, Bravo, Charlie and back. Free online converter.",
  keywords: ["nato phonetic alphabet","phonetic alphabet","nato alphabet converter","alpha bravo charlie","military alphabet"],
  openGraph: {
    title: "NATO Phonetic Alphabet Converter Online | CodeUtilo",
    description: "Convert text to NATO phonetic alphabet. Alpha, Bravo, Charlie and back. Free online converter.",
    url: "https://codeutilo.com/text-to-nato",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NATO Phonetic Alphabet Converter Online | CodeUtilo",
    description: "Convert text to NATO phonetic alphabet. Alpha, Bravo, Charlie and back. Free online converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-to-nato",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="NATO Phonetic Alphabet"
        description="Convert text to NATO phonetic alphabet. Alpha, Bravo, Charlie and back. Free online converter."
        slug="text-to-nato"
      />
      {children}
    </>
  );
}
