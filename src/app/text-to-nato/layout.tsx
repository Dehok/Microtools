import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NATO Phonetic Alphabet Converter — Text to NATO",
  description:
    "Convert text to NATO phonetic alphabet (Alpha, Bravo, Charlie...) and back. Useful for spelling over phone or radio. Free converter.",
  keywords: ["nato phonetic alphabet", "text to nato", "phonetic alphabet converter", "spelling alphabet", "nato alphabet"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
