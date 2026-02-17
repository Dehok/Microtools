import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Number Generator — Generate Random Numbers Online",
  description: "Generate random numbers within a custom range. Support for multiple numbers, no duplicates, and sorting. Free online tool.",
  keywords: ["random number generator", "random number online", "random number picker", "number randomizer", "dice roller"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
