import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator Online — Strong & Random Passwords",
  description:
    "Generate strong, random, and secure passwords with customizable length and character sets. Free online password generator.",
  keywords: ["password generator", "random password", "strong password", "secure password generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
