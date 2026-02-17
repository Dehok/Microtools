import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Formatter & Beautifier Online — Format SQL Queries",
  description:
    "Format and beautify SQL queries with proper indentation and keyword uppercasing. Minify SQL for production. Free online tool.",
  keywords: [
    "sql formatter",
    "sql beautifier",
    "format sql online",
    "sql pretty print",
    "sql minifier",
    "sql query formatter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
