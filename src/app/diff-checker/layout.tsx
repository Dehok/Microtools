import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Diff Checker — Compare Two Texts Online Free",
  description: "Compare two texts and highlight the differences line by line. Free online diff checker and text comparison tool.",
  keywords: ["diff checker","text compare","text diff","compare two texts","online diff tool"],
  openGraph: {
    title: "Diff Checker — Compare Two Texts Online Free | CodeUtilo",
    description: "Compare two texts and highlight the differences line by line. Free online diff checker and text comparison tool.",
    url: "https://codeutilo.com/diff-checker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Diff Checker — Compare Two Texts Online Free | CodeUtilo",
    description: "Compare two texts and highlight the differences line by line. Free online diff checker and text comparison tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/diff-checker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Diff Checker"
        description="Compare two texts and highlight the differences line by line. Free online diff checker and text comparison tool."
        slug="diff-checker"
      />
        <FAQSchema faqs={[{"question":"What types of differences does it detect?","answer":"The tool detects three types of differences: added lines (present only in the new text), removed lines (present only in the original text), and modified lines (lines that exist in both but have different content)."},{"question":"Can I compare code with this tool?","answer":"Yes. The diff checker works with any text, including source code in any programming language. It's commonly used for code reviews, comparing configuration files, and tracking changes between versions."},{"question":"How does the comparison algorithm work?","answer":"The tool uses a line-by-line comparison algorithm similar to Unix diff. It identifies the longest common subsequence between the two texts and highlights everything that differs."},{"question":"Can I compare files directly?","answer":"Currently, the tool works with pasted text. Copy and paste the contents of two files into the left and right panels to compare them."}]} />
      {children}
    </>
  );
}
