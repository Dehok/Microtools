import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "TOML to JSON Converter & JSON to TOML Online",
  description: "Convert between TOML and JSON formats. Validate TOML syntax and see parsed output. Free tool.",
  keywords: ["toml to json","json to toml","toml converter","toml parser","convert toml to json"],
  openGraph: {
    title: "TOML to JSON Converter & JSON to TOML Online | CodeUtilo",
    description: "Convert between TOML and JSON formats. Validate TOML syntax and see parsed output. Free tool.",
    url: "https://codeutilo.com/toml-to-json",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TOML to JSON Converter & JSON to TOML Online | CodeUtilo",
    description: "Convert between TOML and JSON formats. Validate TOML syntax and see parsed output. Free tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/toml-to-json",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="TOML ↔ JSON Converter"
        description="Convert between TOML and JSON formats. Validate TOML syntax and see parsed output. Free tool."
        slug="toml-to-json"
      />
      {children}
    </>
  );
}
