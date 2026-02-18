import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Validator — Check Email Address Format",
  description:
    "Validate email address format and syntax. Detect common typos and mistakes. Bulk validation supported. Free email validator tool.",
  keywords: ["email validator", "validate email", "email checker", "email syntax checker", "email format validator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
