import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "YAML Validator Online — Check YAML Syntax",
  description: "Validate YAML syntax online. Find errors with line numbers and helpful messages. Supports YAML 1.1 and 1.2. Free YAML validator.",
  keywords: ["yaml validator","yaml checker","validate yaml","yaml syntax checker","yaml lint"],
  openGraph: {
    title: "YAML Validator Online — Check YAML Syntax | CodeUtilo",
    description: "Validate YAML syntax online. Find errors with line numbers and helpful messages. Supports YAML 1.1 and 1.2. Free YAML validator.",
    url: "https://codeutilo.com/yaml-validator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "YAML Validator Online — Check YAML Syntax | CodeUtilo",
    description: "Validate YAML syntax online. Find errors with line numbers and helpful messages. Supports YAML 1.1 and 1.2. Free YAML validator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/yaml-validator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Yaml Validator"
        description="Validate YAML syntax online. Find errors with line numbers and helpful messages. Supports YAML 1.1 and 1.2. Free YAML validator."
        slug="yaml-validator"
      />
      {children}
    </>
  );
}
