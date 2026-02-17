import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Gradient Generator — Linear & Radial Gradients",
  description: "Create beautiful CSS gradients with a visual editor. Linear and radial gradients with multiple color stops. Free online tool.",
  keywords: ["css gradient generator", "linear gradient", "radial gradient", "css gradient", "gradient maker", "background gradient"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
