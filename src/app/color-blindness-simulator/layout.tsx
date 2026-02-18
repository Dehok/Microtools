import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Blindness Simulator — Preview Color Vision Deficiency",
  description:
    "Simulate how colors appear with different types of color blindness. Test protanopia, deuteranopia, tritanopia, and more. Free accessibility tool.",
  keywords: ["color blindness simulator", "color vision deficiency", "protanopia", "deuteranopia", "accessibility tool", "color blind test"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
