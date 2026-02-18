import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAML Validator Online — Check YAML Syntax",
  description:
    "Validate YAML syntax online. Find errors with line numbers and helpful messages. Supports YAML 1.1 and 1.2. Free YAML validator.",
  keywords: ["yaml validator", "yaml checker", "validate yaml", "yaml syntax checker", "yaml lint"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
