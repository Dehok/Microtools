import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "YAML to JSON Converter & JSON to YAML — Online Tool",
  description: "Convert between YAML and JSON formats instantly. Free online YAML to JSON and JSON to YAML converter.",
  keywords: ["yaml to json","json to yaml","yaml converter","yaml json online","convert yaml","yaml parser"],
  openGraph: {
    title: "YAML to JSON Converter & JSON to YAML — Online Tool | CodeUtilo",
    description: "Convert between YAML and JSON formats instantly. Free online YAML to JSON and JSON to YAML converter.",
    url: "https://codeutilo.com/yaml-json-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "YAML to JSON Converter & JSON to YAML — Online Tool | CodeUtilo",
    description: "Convert between YAML and JSON formats instantly. Free online YAML to JSON and JSON to YAML converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/yaml-json-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Yaml Json Converter"
        description="Convert between YAML and JSON formats instantly. Free online YAML to JSON and JSON to YAML converter."
        slug="yaml-json-converter"
      />
      {children}
    </>
  );
}
