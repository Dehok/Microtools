import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online — Free JSON Beautifier",
  description:
    "Format, beautify, validate, and minify JSON data instantly. Free online JSON formatter with adjustable indentation. No signup required.",
  keywords: ["json formatter", "json beautifier", "json validator", "json minifier", "format json online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
