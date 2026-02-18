import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "SQL Formatter & Beautifier Online — Format SQL Queries",
  description: "Format and beautify SQL queries with proper indentation and keyword uppercasing. Minify SQL for production. Free online tool.",
  keywords: ["sql formatter","sql beautifier","format sql online","sql pretty print","sql minifier","sql query formatter"],
  openGraph: {
    title: "SQL Formatter & Beautifier Online — Format SQL Queries | CodeUtilo",
    description: "Format and beautify SQL queries with proper indentation and keyword uppercasing. Minify SQL for production. Free online tool.",
    url: "https://codeutilo.com/sql-formatter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SQL Formatter & Beautifier Online — Format SQL Queries | CodeUtilo",
    description: "Format and beautify SQL queries with proper indentation and keyword uppercasing. Minify SQL for production. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/sql-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Sql Formatter"
        description="Format and beautify SQL queries with proper indentation and keyword uppercasing. Minify SQL for production. Free online tool."
        slug="sql-formatter"
      />
        <FAQSchema faqs={[{"question":"Is the SQL Formatter free to use?","answer":"Yes, the SQL Formatter is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The SQL Formatter is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The SQL Formatter runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
