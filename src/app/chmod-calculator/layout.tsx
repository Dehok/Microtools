import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Chmod Calculator — Unix File Permissions Calculator",
  description: "Calculate Unix file permissions in octal and symbolic notation. Visual chmod calculator for Linux and macOS with common permission presets.",
  keywords: ["chmod calculator","unix permissions","file permissions calculator","linux chmod","octal permissions","rwx calculator"],
  openGraph: {
    title: "Chmod Calculator — Unix File Permissions Calculator | CodeUtilo",
    description: "Calculate Unix file permissions in octal and symbolic notation. Visual chmod calculator for Linux and macOS with common permission presets.",
    url: "https://codeutilo.com/chmod-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Chmod Calculator — Unix File Permissions Calculator | CodeUtilo",
    description: "Calculate Unix file permissions in octal and symbolic notation. Visual chmod calculator for Linux and macOS with common permission presets.",
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
        description="Calculate Unix file permissions in octal and symbolic notation. Visual chmod calculator for Linux and macOS with common permission presets."
        slug="chmod-calculator"
      />
      {children}
    </>
  );
}
