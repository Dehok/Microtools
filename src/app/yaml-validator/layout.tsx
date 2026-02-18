import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "YAML Validator — Check YAML Syntax Online",
  description: "Validate YAML syntax online. Find errors with line numbers and see parsed JSON output. Free tool.",
  keywords: ["yaml validator","yaml lint","validate yaml online","yaml syntax checker","yaml parser"],
  openGraph: {
    title: "YAML Validator — Check YAML Syntax Online | CodeUtilo",
    description: "Validate YAML syntax online. Find errors with line numbers and see parsed JSON output. Free tool.",
    url: "https://codeutilo.com/yaml-validator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "YAML Validator — Check YAML Syntax Online | CodeUtilo",
    description: "Validate YAML syntax online. Find errors with line numbers and see parsed JSON output. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/yaml-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="YAML Validator"
        description="Validate YAML syntax online. Find errors with line numbers and see parsed JSON output. Free tool."
        slug="yaml-validator"
      />
      {children}
    </>
  );
}
