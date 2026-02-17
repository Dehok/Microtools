import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Profile README Generator — Free README Maker",
  description:
    "Create an awesome GitHub profile README with stats, badges, social links, and tech stack. Free online generator.",
  keywords: ["github readme generator", "github profile readme", "readme maker", "github readme", "profile readme generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
