import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the JWT Generator free to use?","answer":"Yes, the JWT Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The JWT Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The JWT Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
