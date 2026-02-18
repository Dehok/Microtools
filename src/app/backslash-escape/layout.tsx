import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the Backslash Escape / Unescape free to use?","answer":"Yes, the Backslash Escape / Unescape is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Backslash Escape / Unescape is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Backslash Escape / Unescape runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
