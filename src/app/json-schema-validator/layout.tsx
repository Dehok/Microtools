import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Schema Validator Online — Validate JSON Against Schema",
  description:
    "Validate JSON data against a JSON Schema. Check types, required fields, patterns, and constraints. Free online JSON schema validator.",
  keywords: ["json schema validator", "json validation", "json schema", "validate json", "json schema online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
