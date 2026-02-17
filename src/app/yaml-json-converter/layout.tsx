import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAML to JSON Converter & JSON to YAML — Online Tool",
  description:
    "Convert between YAML and JSON formats instantly. Free online YAML to JSON and JSON to YAML converter.",
  keywords: [
    "yaml to json",
    "json to yaml",
    "yaml converter",
    "yaml json online",
    "convert yaml",
    "yaml parser",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
