import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Text Shadow Generator — Visual Shadow Editor",
  description:
    "Create CSS text-shadow effects with a visual editor. Adjust offset, blur, color, and add multiple shadows. Copy CSS code instantly.",
  keywords: ["text shadow generator", "css text shadow", "text shadow css", "shadow generator", "css text effects"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
