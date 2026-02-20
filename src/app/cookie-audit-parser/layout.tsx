import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Cookie Audit Parser",
  description:
    "Parse Cookie and Set-Cookie headers and audit Secure, HttpOnly, SameSite, and other security attributes.",
  keywords: ["cookie audit", "set-cookie parser", "cookie security checker", "samesite secure httponly"],
  openGraph: {
    title: "Cookie Audit Parser | CodeUtilo",
    description:
      "Parse Cookie and Set-Cookie headers and audit Secure, HttpOnly, SameSite, and other security attributes.",
    url: "https://codeutilo.com/cookie-audit-parser",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Audit Parser | CodeUtilo",
    description:
      "Parse Cookie and Set-Cookie headers and audit Secure, HttpOnly, SameSite, and other security attributes.",
  },
  alternates: {
    canonical: "https://codeutilo.com/cookie-audit-parser",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Cookie Audit Parser"
        description="Audit cookie headers for common security flags and risky configurations."
        slug="cookie-audit-parser"
      />
      {children}
    </>
  );
}
