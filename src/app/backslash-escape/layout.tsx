import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Backslash Escape & Unescape Tool Online",
  description: "Escape or unescape special characters like newlines, tabs, and quotes. Free online escape tool.",
  keywords: ["backslash escape","string escape","unescape string","escape characters online","escape newline"],
  openGraph: {
    title: "Backslash Escape & Unescape Tool Online | CodeUtilo",
    description: "Escape or unescape special characters like newlines, tabs, and quotes. Free online escape tool.",
    url: "https://codeutilo.com/backslash-escape",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Backslash Escape & Unescape Tool Online | CodeUtilo",
    description: "Escape or unescape special characters like newlines, tabs, and quotes. Free online escape tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/backslash-escape",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Backslash Escape / Unescape"
        description="Escape or unescape special characters like newlines, tabs, and quotes. Free online escape tool."
        slug="backslash-escape"
      />
      {children}
    </>
  );
}
