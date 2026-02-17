import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Minifier & Beautifier Online — Free CSS Formatter",
  description:
    "Minify CSS to reduce file size or beautify compressed CSS for readability. Free online CSS minifier and formatter.",
  keywords: ["css minifier", "css beautifier", "css formatter", "minify css online", "css compressor"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
