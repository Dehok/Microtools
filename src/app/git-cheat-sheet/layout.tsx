import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Git Cheat Sheet — Essential Git Commands Reference",
  description: "Essential Git commands reference. Setup, branching, merging, stashing, and more. Free cheat sheet.",
  keywords: ["git cheat sheet","git commands","git reference","git tutorial","git command list"],
  openGraph: {
    title: "Git Cheat Sheet — Essential Git Commands Reference | CodeUtilo",
    description: "Essential Git commands reference. Setup, branching, merging, stashing, and more. Free cheat sheet.",
    url: "https://codeutilo.com/git-cheat-sheet",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Git Cheat Sheet — Essential Git Commands Reference | CodeUtilo",
    description: "Essential Git commands reference. Setup, branching, merging, stashing, and more. Free cheat sheet.",
  },
  alternates: {
    canonical: "https://codeutilo.com/git-cheat-sheet",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Git Cheat Sheet"
        description="Essential Git commands reference. Setup, branching, merging, stashing, and more. Free cheat sheet."
        slug="git-cheat-sheet"
      />
      {children}
    </>
  );
}
