import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Backslash Escape / Unescape — Online String Escaper",
  description: "Escape or unescape special characters in strings. Handles newlines, tabs, quotes, and backslashes. Free online escape tool for developers.",
  keywords: ["backslash escape","string escape online","unescape string","escape newline","escape quotes","string escape tool"],
  openGraph: {
    title: "Backslash Escape / Unescape — Online String Escaper | CodeUtilo",
    description: "Escape or unescape special characters in strings. Handles newlines, tabs, quotes, and backslashes. Free online escape tool for developers.",
    url: "https://codeutilo.com/backslash-escape",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Backslash Escape / Unescape — Online String Escaper | CodeUtilo",
    description: "Escape or unescape special characters in strings. Handles newlines, tabs, quotes, and backslashes. Free online escape tool for developers.",
  },
  alternates: {
    canonical: "https://codeutilo.com/backslash-escape",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Backslash Escape"
        description="Escape or unescape special characters in strings. Handles newlines, tabs, quotes, and backslashes. Free online escape tool for developers."
        slug="backslash-escape"
      />
      {children}
    </>
  );
}
