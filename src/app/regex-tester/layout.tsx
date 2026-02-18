import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Regex Tester Online — Free Regular Expression Tester",
  description: "Test regular expressions against text with real-time match highlighting. Supports JavaScript regex flags.",
  keywords: ["regex tester","regex online","regular expression tester","regex101","regex checker"],
  openGraph: {
    title: "Regex Tester Online — Free Regular Expression Tester | CodeUtilo",
    description: "Test regular expressions against text with real-time match highlighting. Supports JavaScript regex flags.",
    url: "https://codeutilo.com/regex-tester",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex Tester Online — Free Regular Expression Tester | CodeUtilo",
    description: "Test regular expressions against text with real-time match highlighting. Supports JavaScript regex flags.",
  },
  alternates: {
    canonical: "https://codeutilo.com/regex-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Regex Tester"
        description="Test regular expressions against text with real-time match highlighting. Supports JavaScript regex flags."
        slug="regex-tester"
      />
        <FAQSchema faqs={[{"question":"What are regex flags?","answer":"Flags modify how the regex engine works. Common ones: g (global — find all matches), i (case-insensitive), m (multiline — ^ and $ match line boundaries), s (dotAll — dot matches newlines)."},{"question":"What is the difference between * and + in regex?","answer":"* matches zero or more occurrences of the preceding element (can match empty strings). + matches one or more occurrences (must match at least once). For example, a* matches '' and 'aaa', while a+ only matches 'aaa'."},{"question":"How do I match an email address with regex?","answer":"A common pattern is: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$. However, email validation with regex is complex — for production use, consider using a dedicated validation library."},{"question":"Why does my regex work differently in different languages?","answer":"Different programming languages use different regex engines (PCRE, POSIX, ECMAScript). This tool uses JavaScript's RegExp engine (ECMAScript). Some features like lookbehinds may not be available in all engines."}]} />
      {children}
    </>
  );
}
