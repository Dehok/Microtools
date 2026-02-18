import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ".env Editor & Validator — Edit Environment Files Online",
  description:
    "Edit and validate .env files online. Check for duplicate keys, empty values, syntax errors, and formatting issues. Free .env editor tool.",
  keywords: ["env editor", "env file validator", "dotenv editor", "environment variables editor", "env file checker"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
