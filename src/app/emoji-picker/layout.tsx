import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Emoji Picker — Search & Copy Emojis Online",
  description: "Search, browse, and copy emojis instantly. Organized by category with Unicode info. Click to copy any emoji to clipboard.",
  keywords: ["emoji picker","emoji copy","emoji search","emoji list","copy emoji online"],
  openGraph: {
    title: "Emoji Picker — Search & Copy Emojis Online | CodeUtilo",
    description: "Search, browse, and copy emojis instantly. Organized by category with Unicode info. Click to copy any emoji to clipboard.",
    url: "https://codeutilo.com/emoji-picker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Emoji Picker — Search & Copy Emojis Online | CodeUtilo",
    description: "Search, browse, and copy emojis instantly. Organized by category with Unicode info. Click to copy any emoji to clipboard.",
  },
  alternates: {
    canonical: "https://codeutilo.com/emoji-picker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Emoji Picker"
        description="Search, browse, and copy emojis instantly. Organized by category with Unicode info. Click to copy any emoji to clipboard."
        slug="emoji-picker"
      />
        <FAQSchema faqs={[{"question":"Is the Emoji Picker free to use?","answer":"Yes, the Emoji Picker is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Emoji Picker is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Emoji Picker runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
