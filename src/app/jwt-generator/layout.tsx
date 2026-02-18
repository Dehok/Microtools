import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JWT Generator — Create JSON Web Tokens Online",
  description: "Generate JSON Web Tokens (JWT) with custom payload and secret. Set expiration, issuer, and claims. Free online JWT maker.",
  keywords: ["jwt generator","jwt maker","create jwt","json web token generator","jwt token generator"],
  openGraph: {
    title: "JWT Generator — Create JSON Web Tokens Online | CodeUtilo",
    description: "Generate JSON Web Tokens (JWT) with custom payload and secret. Set expiration, issuer, and claims. Free online JWT maker.",
    url: "https://codeutilo.com/jwt-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JWT Generator — Create JSON Web Tokens Online | CodeUtilo",
    description: "Generate JSON Web Tokens (JWT) with custom payload and secret. Set expiration, issuer, and claims. Free online JWT maker.",
  },
  alternates: {
    canonical: "https://codeutilo.com/jwt-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Jwt Generator"
        description="Generate JSON Web Tokens (JWT) with custom payload and secret. Set expiration, issuer, and claims. Free online JWT maker."
        slug="jwt-generator"
      />
      {children}
    </>
  );
}
