import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "TOML to JSON Converter — Convert TOML ↔ JSON Online",
  description: "Convert between TOML and JSON formats instantly. Validate TOML syntax and see parsed output. Free online TOML to JSON converter.",
  keywords: ["toml to json","json to toml","toml converter","toml validator","toml parser online"],
  openGraph: {
    title: "TOML to JSON Converter — Convert TOML ↔ JSON Online | CodeUtilo",
    description: "Convert between TOML and JSON formats instantly. Validate TOML syntax and see parsed output. Free online TOML to JSON converter.",
    url: "https://codeutilo.com/toml-to-json",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TOML to JSON Converter — Convert TOML ↔ JSON Online | CodeUtilo",
    description: "Convert between TOML and JSON formats instantly. Validate TOML syntax and see parsed output. Free online TOML to JSON converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/toml-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Toml To Json"
        description="Convert between TOML and JSON formats instantly. Validate TOML syntax and see parsed output. Free online TOML to JSON converter."
        slug="toml-to-json"
      />
      {children}
    </>
  );
}
