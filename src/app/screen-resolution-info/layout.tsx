import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Screen Resolution Info — What Is My Screen Size?",
  description:
    "View your screen resolution, viewport size, device pixel ratio, color depth, and device info. Free screen size checker.",
  keywords: ["screen resolution", "what is my screen resolution", "screen size", "viewport size", "device pixel ratio", "monitor resolution"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
