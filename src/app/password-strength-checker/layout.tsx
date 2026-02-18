import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Password Strength Checker — Test Your Password",
  description: "Check how strong your password is. Get detailed scoring, crack time estimates, and tips to improve security. Everything runs locally.",
  keywords: ["password strength checker","password tester","password security","check password strength","password analyzer"],
  openGraph: {
    title: "Password Strength Checker — Test Your Password | CodeUtilo",
    description: "Check how strong your password is. Get detailed scoring, crack time estimates, and tips to improve security. Everything runs locally.",
    url: "https://codeutilo.com/password-strength-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Password Strength Checker — Test Your Password | CodeUtilo",
    description: "Check how strong your password is. Get detailed scoring, crack time estimates, and tips to improve security. Everything runs locally.",
  },
  alternates: {
    canonical: "https://codeutilo.com/password-strength-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Password Strength Checker"
        description="Check how strong your password is. Get detailed scoring, crack time estimates, and tips to improve security. Everything runs locally."
        slug="password-strength-checker"
      />
        <FAQSchema faqs={[{"question":"Is the Password Strength Checker free to use?","answer":"Yes, the Password Strength Checker is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Password Strength Checker is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Password Strength Checker runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
