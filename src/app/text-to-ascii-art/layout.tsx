import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text to ASCII Art Generator — Create Text Banners",
  description:
    "Convert text to ASCII art with multiple font styles. Create text banners for README files, comments, and terminals. Free ASCII art generator.",
  keywords: ["text to ascii art", "ascii art generator", "text banner", "ascii text", "figlet online", "ascii font generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
