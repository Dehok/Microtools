import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Box Shadow Generator — Visual Shadow Editor",
  description: "Create CSS box shadows with a visual editor. Adjust offset, blur, spread, and color. Free online tool.",
  keywords: ["box shadow generator", "css box shadow", "shadow generator", "css shadow", "box shadow css"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
