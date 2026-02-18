import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "GitHub Profile README Generator — Free README Maker",
  description: "Create an awesome GitHub profile README with stats, badges, social links, and tech stack. Free online generator.",
  keywords: ["github readme generator","github profile readme","readme maker","github readme","profile readme generator"],
  openGraph: {
    title: "GitHub Profile README Generator — Free README Maker | CodeUtilo",
    description: "Create an awesome GitHub profile README with stats, badges, social links, and tech stack. Free online generator.",
    url: "https://codeutilo.com/github-readme-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GitHub Profile README Generator — Free README Maker | CodeUtilo",
    description: "Create an awesome GitHub profile README with stats, badges, social links, and tech stack. Free online generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/github-readme-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Github Readme Generator"
        description="Create an awesome GitHub profile README with stats, badges, social links, and tech stack. Free online generator."
        slug="github-readme-generator"
      />
        <FAQSchema faqs={[{"question":"Is the GitHub README Generator free to use?","answer":"Yes, the GitHub README Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The GitHub README Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The GitHub README Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
