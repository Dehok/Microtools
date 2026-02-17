import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Parser — Break Down URLs Into Components",
  description: "Parse URLs into protocol, hostname, port, path, query parameters, and hash. Free online URL parser.",
  keywords: ["url parser", "parse url online", "url components", "query string parser", "url breakdown"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
