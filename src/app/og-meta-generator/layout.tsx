import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Graph Meta Tag Generator — OG Tags for Social Media",
  description: "Generate Open Graph and Twitter Card meta tags for perfect social media previews. Free online OG tag generator.",
  keywords: ["open graph generator", "og tags generator", "meta tag generator", "twitter card generator", "social media preview"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
