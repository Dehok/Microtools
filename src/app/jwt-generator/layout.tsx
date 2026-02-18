import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Generator — Create JSON Web Tokens Online",
  description:
    "Generate JSON Web Tokens (JWT) with custom payload and secret. Set expiration, issuer, and claims. Free online JWT maker.",
  keywords: ["jwt generator", "jwt maker", "create jwt", "json web token generator", "jwt token generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
