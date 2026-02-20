import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Secret Detector for Code Snippets",
  description:
    "Detect leaked API keys, tokens, private keys, and credential-like strings in code snippets before sharing.",
  keywords: ["secret detector", "api key scanner", "code snippet security", "token leak checker"],
  openGraph: {
    title: "Secret Detector for Code Snippets | CodeUtilo",
    description:
      "Detect leaked API keys, tokens, private keys, and credential-like strings in code snippets before sharing.",
    url: "https://codeutilo.com/secret-detector-for-code-snippets",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Secret Detector for Code Snippets | CodeUtilo",
    description:
      "Detect leaked API keys, tokens, private keys, and credential-like strings in code snippets before sharing.",
  },
  alternates: {
    canonical: "https://codeutilo.com/secret-detector-for-code-snippets",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Secret Detector for Code Snippets"
        description="Scan pasted code for common secret patterns and produce redacted output locally."
        slug="secret-detector-for-code-snippets"
      />
      {children}
    </>
  );
}
