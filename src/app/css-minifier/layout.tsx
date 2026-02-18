import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "CSS Minifier & Beautifier Online — Free CSS Formatter",
  description: "Minify CSS to reduce file size or beautify compressed CSS for readability. Free online CSS minifier and formatter.",
  keywords: ["css minifier","css beautifier","css formatter","minify css online","css compressor"],
  openGraph: {
    title: "CSS Minifier & Beautifier Online — Free CSS Formatter | CodeUtilo",
    description: "Minify CSS to reduce file size or beautify compressed CSS for readability. Free online CSS minifier and formatter.",
    url: "https://codeutilo.com/css-minifier",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CSS Minifier & Beautifier Online — Free CSS Formatter | CodeUtilo",
    description: "Minify CSS to reduce file size or beautify compressed CSS for readability. Free online CSS minifier and formatter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/css-minifier",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Css Minifier"
        description="Minify CSS to reduce file size or beautify compressed CSS for readability. Free online CSS minifier and formatter."
        slug="css-minifier"
      />
        <FAQSchema faqs={[{"question":"What does CSS minification do?","answer":"CSS minification removes all unnecessary characters from CSS code — whitespace, line breaks, comments, and redundant semicolons — without changing its functionality. This reduces file size and improves page load speed."},{"question":"How much file size reduction can I expect?","answer":"Typically, CSS minification reduces file size by 20-40% depending on how your CSS is written. Files with many comments and generous formatting see the biggest reductions."},{"question":"Will minification break my CSS?","answer":"No. Proper minification only removes characters that have no effect on how CSS is interpreted by browsers. Your styles will look and work exactly the same."},{"question":"Should I minify CSS for development or production?","answer":"Only for production. During development, keep your CSS readable and well-formatted for easier debugging. Minify only when deploying to production for optimal performance."}]} />
      {children}
    </>
  );
}
