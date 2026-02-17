import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder & Decoder Online — Free Percent Encoding Tool",
  description:
    "Encode or decode URLs and query string parameters instantly. Handles special characters, spaces, and unicode. Free online tool.",
  keywords: ["url encoder", "url decoder", "percent encoding", "url encode online", "urlencode"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
