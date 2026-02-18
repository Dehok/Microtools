import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JSON Stringify / Parse — Escape & Unescape JSON Online",
  description: "Convert between formatted and stringified JSON. Escape and unescape JSON strings. Free online tool.",
  keywords: ["json stringify","json parse","json escape","json unescape","stringify json online"],
  openGraph: {
    title: "JSON Stringify / Parse — Escape & Unescape JSON Online | CodeUtilo",
    description: "Convert between formatted and stringified JSON. Escape and unescape JSON strings. Free online tool.",
    url: "https://codeutilo.com/json-stringify",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JSON Stringify / Parse — Escape & Unescape JSON Online | CodeUtilo",
    description: "Convert between formatted and stringified JSON. Escape and unescape JSON strings. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/json-stringify",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Json Stringify"
        description="Convert between formatted and stringified JSON. Escape and unescape JSON strings. Free online tool."
        slug="json-stringify"
      />
      {children}
    </>
  );
}
