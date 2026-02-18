import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the Git Cheat Sheet free to use?","answer":"Yes, the Git Cheat Sheet is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Git Cheat Sheet is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Git Cheat Sheet runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
