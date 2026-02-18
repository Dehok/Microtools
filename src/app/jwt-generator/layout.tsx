import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "JWT Generator — Create JSON Web Tokens Online",
  description: "Create JSON Web Tokens with custom payload, expiration, and HS256 signing. Free online JWT maker.",
  keywords: ["jwt generator","create jwt","json web token generator","jwt maker","jwt token online"],
  openGraph: {
    title: "JWT Generator — Create JSON Web Tokens Online | CodeUtilo",
    description: "Create JSON Web Tokens with custom payload, expiration, and HS256 signing. Free online JWT maker.",
    url: "https://codeutilo.com/jwt-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "JWT Generator — Create JSON Web Tokens Online | CodeUtilo",
    description: "Create JSON Web Tokens with custom payload, expiration, and HS256 signing. Free online JWT maker.",
  },
  alternates: {
    canonical: "https://codeutilo.com/jwt-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="JWT Generator"
        description="Create JSON Web Tokens with custom payload, expiration, and HS256 signing. Free online JWT maker."
        slug="jwt-generator"
      />
      {children}
    </>
  );
}
