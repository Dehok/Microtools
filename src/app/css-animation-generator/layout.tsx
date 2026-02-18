import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Animation Generator — @keyframes Builder",
  description: "Generate CSS @keyframes animations visually. Configure timing, easing, direction, keyframes, and copy the ready-to-use CSS code. Free online tool.",
  keywords: ["css animation generator", "keyframes generator", "css keyframes", "animation builder", "css transitions", "web animation tool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
