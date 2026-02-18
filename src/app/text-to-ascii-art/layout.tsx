import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text to ASCII Art Generator — Create Text Banners",
  description: "Convert text to ASCII art with multiple font styles. Create text banners for README files, comments, and terminals. Free ASCII art generator.",
  keywords: ["text to ascii art","ascii art generator","text banner","ascii text","figlet online","ascii font generator"],
  openGraph: {
    title: "Text to ASCII Art Generator — Create Text Banners | CodeUtilo",
    description: "Convert text to ASCII art with multiple font styles. Create text banners for README files, comments, and terminals. Free ASCII art generator.",
    url: "https://codeutilo.com/text-to-ascii-art",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text to ASCII Art Generator — Create Text Banners | CodeUtilo",
    description: "Convert text to ASCII art with multiple font styles. Create text banners for README files, comments, and terminals. Free ASCII art generator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-to-ascii-art",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text To Ascii Art"
        description="Convert text to ASCII art with multiple font styles. Create text banners for README files, comments, and terminals. Free ASCII art generator."
        slug="text-to-ascii-art"
      />
        <FAQSchema faqs={[{"question":"Is the Text to ASCII Art free to use?","answer":"Yes, the Text to ASCII Art is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Text to ASCII Art is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Text to ASCII Art runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
