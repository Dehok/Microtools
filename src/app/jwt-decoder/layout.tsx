import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder Online — Decode JSON Web Tokens Free",
  description: "Decode and inspect JSON Web Tokens (JWT). View header, payload, expiration, and claims. Free online JWT decoder.",
  keywords: ["jwt decoder", "jwt decode", "json web token", "jwt online", "jwt.io"],
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
