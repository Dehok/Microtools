import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "YAML to JSON Converter & JSON to YAML Online",
  description: "Convert between YAML and JSON formats instantly. Free online YAML/JSON converter.",
  keywords: ["yaml to json","json to yaml","yaml converter","yaml json online","convert yaml to json"],
  openGraph: {
    title: "YAML to JSON Converter & JSON to YAML Online | CodeUtilo",
    description: "Convert between YAML and JSON formats instantly. Free online YAML/JSON converter.",
    url: "https://codeutilo.com/yaml-json-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "YAML to JSON Converter & JSON to YAML Online | CodeUtilo",
    description: "Convert between YAML and JSON formats instantly. Free online YAML/JSON converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/yaml-json-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="YAML ↔ JSON Converter"
        description="Convert between YAML and JSON formats instantly. Free online YAML/JSON converter."
        slug="yaml-json-converter"
      />
      {children}
    </>
  );
}
