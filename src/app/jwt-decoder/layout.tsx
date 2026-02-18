import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"What is a JWT?","answer":"A JSON Web Token (JWT) is a compact, URL-safe token format used for securely transmitting information between parties. It consists of three Base64-encoded parts separated by dots: header, payload, and signature."},{"question":"Can I decode a JWT without the secret key?","answer":"Yes. The header and payload of a JWT are only Base64-encoded, not encrypted. Anyone can decode them. The secret key is only needed to verify the signature (i.e., to confirm the token hasn't been tampered with)."},{"question":"What does the 'exp' claim mean?","answer":"The 'exp' (expiration time) claim identifies the time after which the JWT must not be accepted. It's a Unix timestamp. This tool automatically checks whether the token has expired."},{"question":"Is it safe to put sensitive data in a JWT?","answer":"No. Since JWT payloads are only Base64-encoded (not encrypted), anyone who has the token can read its contents. Never put passwords, credit card numbers, or other secrets in a JWT payload."}]} />
      {children}
    </>
  );
}
