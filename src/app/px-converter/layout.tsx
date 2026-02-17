import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PX to REM / EM Converter — CSS Unit Calculator",
  description: "Convert between px, rem, em, pt, vw, vh, and percent. Quick reference table included. Free online CSS unit converter.",
  keywords: ["px to rem", "rem to px", "em to px", "css unit converter", "pixel converter", "rem calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
