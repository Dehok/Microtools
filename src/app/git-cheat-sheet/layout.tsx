import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Git Cheat Sheet — Essential Git Commands Reference",
  description: "Complete Git cheat sheet with essential commands. Setup, branching, merging, stashing, and advanced operations. Searchable quick reference.",
  keywords: ["git cheat sheet","git commands","git reference","git guide","git command list"],
  openGraph: {
    title: "Git Cheat Sheet — Essential Git Commands Reference | CodeUtilo",
    description: "Complete Git cheat sheet with essential commands. Setup, branching, merging, stashing, and advanced operations. Searchable quick reference.",
    url: "https://codeutilo.com/git-cheat-sheet",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Git Cheat Sheet — Essential Git Commands Reference | CodeUtilo",
    description: "Complete Git cheat sheet with essential commands. Setup, branching, merging, stashing, and advanced operations. Searchable quick reference.",
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
        description="Complete Git cheat sheet with essential commands. Setup, branching, merging, stashing, and advanced operations. Searchable quick reference."
        slug="git-cheat-sheet"
      />
      {children}
    </>
  );
}
