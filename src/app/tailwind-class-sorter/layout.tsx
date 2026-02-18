import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tailwind Class Sorter — Sort Tailwind CSS Classes",
  description:
    "Sort Tailwind CSS classes in the recommended order. Clean up messy class strings. Follow the official Tailwind CSS class ordering convention.",
  keywords: ["tailwind class sorter", "tailwind class order", "sort tailwind classes", "tailwind css sort", "tailwind prettier"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
