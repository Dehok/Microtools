import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online — Free JSON Beautifier",
  description: "Format, beautify, validate, and minify JSON data instantly. Free online JSON formatter with adjustable indentation. No signup required.",
  keywords: ["json formatter","json beautifier","json validator","json minifier","format json online"],
  openGraph: {
    title: "JSON Formatter & Validator Online — Free JSON Beautifier | CodeUtilo",
    description: "Format, beautify, validate, and minify JSON data instantly. Free online JSON formatter with adjustable indentation. No signup required.",
    url: "https://codeutilo.com/json-formatter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Formatter & Validator Online — Free JSON Beautifier | CodeUtilo",
    description: "Format, beautify, validate, and minify JSON data instantly. Free online JSON formatter with adjustable indentation. No signup required.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-formatter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Formatter"
        description="Format, beautify, validate, and minify JSON data instantly. Free online JSON formatter with adjustable indentation. No signup required."
        slug="json-formatter"
      />
        <FAQSchema faqs={[{"question":"What is valid JSON?","answer":"Valid JSON must use double quotes for keys and strings, no trailing commas, no comments, and must start with an object {} or array []. Numbers, booleans (true/false), and null are also valid values."},{"question":"Does this tool validate JSON?","answer":"Yes. When you paste or type JSON, the tool checks for syntax errors and shows the error message with the exact location of the problem, making it easy to fix invalid JSON."},{"question":"Is my data safe?","answer":"Absolutely. All formatting and validation happens locally in your browser using JavaScript. Your JSON data is never sent to any server."},{"question":"What is the difference between formatting and minifying JSON?","answer":"Formatting (beautifying) adds indentation and line breaks to make JSON readable. Minifying removes all unnecessary whitespace to reduce file size, which is useful for production environments and API responses."},{"question":"Can I use this tool for large JSON files?","answer":"Yes, the tool handles large JSON documents efficiently since all processing runs in your browser. However, extremely large files (10MB+) may cause slower performance depending on your device."}]} />
      {children}
    </>
  );
}
