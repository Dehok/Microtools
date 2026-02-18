import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Border Radius Generator — Visual Radius Editor",
  description:
    "Create CSS border-radius values with a visual editor. Adjust each corner individually. Copy CSS code instantly. Free online tool.",
  keywords: ["border radius generator", "css border radius", "rounded corners css", "border radius editor", "css radius tool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
