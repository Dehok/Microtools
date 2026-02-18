import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Chmod Calculator — Unix File Permissions",
  description: "Calculate Unix file permissions in octal and symbolic notation. Free online chmod calculator.",
  keywords: ["chmod calculator","unix permissions","file permissions calculator","chmod online","linux chmod"],
  openGraph: {
    title: "Chmod Calculator — Unix File Permissions | CodeUtilo",
    description: "Calculate Unix file permissions in octal and symbolic notation. Free online chmod calculator.",
    url: "https://codeutilo.com/chmod-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Chmod Calculator — Unix File Permissions | CodeUtilo",
    description: "Calculate Unix file permissions in octal and symbolic notation. Free online chmod calculator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/chmod-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Chmod Calculator"
        description="Calculate Unix file permissions in octal and symbolic notation. Free online chmod calculator."
        slug="chmod-calculator"
      />
      {children}
    </>
  );
}
