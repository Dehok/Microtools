import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Regex Cheat Sheet — Regular Expression Quick Reference",
  description: "Complete regex cheat sheet with syntax, character classes, quantifiers, anchors, groups, and lookaheads. Searchable quick reference.",
  keywords: ["regex cheat sheet","regular expression","regex reference","regex syntax","regex guide"],
  openGraph: {
    title: "Regex Cheat Sheet — Regular Expression Quick Reference | CodeUtilo",
    description: "Complete regex cheat sheet with syntax, character classes, quantifiers, anchors, groups, and lookaheads. Searchable quick reference.",
    url: "https://codeutilo.com/regex-cheat-sheet",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Regex Cheat Sheet — Regular Expression Quick Reference | CodeUtilo",
    description: "Complete regex cheat sheet with syntax, character classes, quantifiers, anchors, groups, and lookaheads. Searchable quick reference.",
  },
  alternates: {
    canonical: "https://codeutilo.com/regex-cheat-sheet",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Regex Cheat Sheet"
        description="Complete regex cheat sheet with syntax, character classes, quantifiers, anchors, groups, and lookaheads. Searchable quick reference."
        slug="regex-cheat-sheet"
      />
        <FAQSchema faqs={[{"question":"Is the Regex Cheat Sheet free to use?","answer":"Yes, the Regex Cheat Sheet is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Regex Cheat Sheet is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Regex Cheat Sheet runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
