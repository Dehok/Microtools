import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unit Converter — Length, Weight, Temperature & More",
  description:
    "Convert between units of length, weight, temperature, speed, area, and volume. Free online unit converter with instant results.",
  keywords: ["unit converter", "convert units", "length converter", "weight converter", "temperature converter", "metric converter"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
