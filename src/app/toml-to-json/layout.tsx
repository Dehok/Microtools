import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TOML to JSON Converter — Convert TOML ↔ JSON Online",
  description:
    "Convert between TOML and JSON formats instantly. Validate TOML syntax and see parsed output. Free online TOML to JSON converter.",
  keywords: ["toml to json", "json to toml", "toml converter", "toml validator", "toml parser online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
