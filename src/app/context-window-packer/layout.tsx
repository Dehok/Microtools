import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Context Window Packer",
  description:
    "Pack prompt segments into a token budget using priority and required flags. Optimize context usage before model calls.",
  keywords: ["context window packer", "token budget planner", "prompt segment optimizer", "llm context packing"],
  openGraph: {
    title: "Context Window Packer | CodeUtilo",
    description:
      "Pack prompt segments into a token budget using priority and required flags. Optimize context usage before model calls.",
    url: "https://codeutilo.com/context-window-packer",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Context Window Packer | CodeUtilo",
    description:
      "Pack prompt segments into a token budget using priority and required flags. Optimize context usage before model calls.",
  },
  alternates: {
    canonical: "https://codeutilo.com/context-window-packer",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Context Window Packer"
        description="Pack prompt segments into a fixed context budget using local token estimates."
        slug="context-window-packer"
      />
      {children}
    </>
  );
}
