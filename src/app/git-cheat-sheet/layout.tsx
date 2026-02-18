import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Git Cheat Sheet — Essential Git Commands Reference",
  description:
    "Complete Git cheat sheet with essential commands. Setup, branching, merging, stashing, and advanced operations. Searchable quick reference.",
  keywords: ["git cheat sheet", "git commands", "git reference", "git guide", "git command list"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
