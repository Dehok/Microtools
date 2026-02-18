import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Strength Checker — Test Your Password",
  description:
    "Check how strong your password is. Get detailed scoring, crack time estimates, and tips to improve security. Everything runs locally.",
  keywords: ["password strength checker", "password tester", "password security", "check password strength", "password analyzer"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
