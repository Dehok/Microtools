import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "HTTP Status Codes Reference — Complete List",
  description: "Complete reference of all HTTP status codes (1xx-5xx) with descriptions and examples. Free tool.",
  keywords: ["http status codes","status code list","http response codes","404 status code","http error codes"],
  openGraph: {
    title: "HTTP Status Codes Reference — Complete List | CodeUtilo",
    description: "Complete reference of all HTTP status codes (1xx-5xx) with descriptions and examples. Free tool.",
    url: "https://codeutilo.com/http-status-codes",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HTTP Status Codes Reference — Complete List | CodeUtilo",
    description: "Complete reference of all HTTP status codes (1xx-5xx) with descriptions and examples. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/http-status-codes",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="HTTP Status Codes"
        description="Complete reference of all HTTP status codes (1xx-5xx) with descriptions and examples. Free tool."
        slug="http-status-codes"
      />
      {children}
    </>
  );
}
