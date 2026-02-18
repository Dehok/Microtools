import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JWT Decoder Online — Decode JSON Web Tokens Free",
  description: "Decode and inspect JSON Web Tokens (JWT). View header, payload, expiration, and claims. Free online JWT decoder.",
  keywords: ["jwt decoder","jwt decode","json web token","jwt online","jwt.io"],
  openGraph: {
    title: "JWT Decoder Online — Decode JSON Web Tokens Free | CodeUtilo",
    description: "Decode and inspect JSON Web Tokens (JWT). View header, payload, expiration, and claims. Free online JWT decoder.",
    url: "https://codeutilo.com/jwt-decoder",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JWT Decoder Online — Decode JSON Web Tokens Free | CodeUtilo",
    description: "Decode and inspect JSON Web Tokens (JWT). View header, payload, expiration, and claims. Free online JWT decoder.",
  },
  alternates: {
    canonical: "https://codeutilo.com/jwt-decoder",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Jwt Decoder"
        description="Decode and inspect JSON Web Tokens (JWT). View header, payload, expiration, and claims. Free online JWT decoder."
        slug="jwt-decoder"
      />
      {children}
    </>
  );
}
