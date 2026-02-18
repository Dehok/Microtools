import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JWT Decoder — Decode JSON Web Tokens Online",
  description: "Decode and inspect JSON Web Tokens. View header, payload, and expiration. Free online JWT decoder.",
  keywords: ["jwt decoder","decode jwt","json web token decoder","jwt parser","jwt inspect"],
  openGraph: {
    title: "JWT Decoder — Decode JSON Web Tokens Online | CodeUtilo",
    description: "Decode and inspect JSON Web Tokens. View header, payload, and expiration. Free online JWT decoder.",
    url: "https://codeutilo.com/jwt-decoder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JWT Decoder — Decode JSON Web Tokens Online | CodeUtilo",
    description: "Decode and inspect JSON Web Tokens. View header, payload, and expiration. Free online JWT decoder.",
  },
  alternates: {
    canonical: "https://codeutilo.com/jwt-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JWT Decoder"
        description="Decode and inspect JSON Web Tokens. View header, payload, and expiration. Free online JWT decoder."
        slug="jwt-decoder"
      />
      {children}
    </>
  );
}
