import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID Generator Online — Free Random UUID v4 Generator",
  description:
    "Generate random UUIDs (v4) instantly. Bulk generation, uppercase, and no-dash options. Free online UUID generator.",
  keywords: ["uuid generator", "guid generator", "random uuid", "uuid v4", "bulk uuid"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
