import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Tailwind Class Sorter — Sort Tailwind CSS Classes",
  description: "Sort Tailwind CSS classes in the recommended order. Clean up messy class strings. Follow the official Tailwind CSS class ordering convention.",
  keywords: ["tailwind class sorter","tailwind class order","sort tailwind classes","tailwind css sort","tailwind prettier"],
  openGraph: {
    title: "Tailwind Class Sorter — Sort Tailwind CSS Classes | CodeUtilo",
    description: "Sort Tailwind CSS classes in the recommended order. Clean up messy class strings. Follow the official Tailwind CSS class ordering convention.",
    url: "https://codeutilo.com/tailwind-class-sorter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tailwind Class Sorter — Sort Tailwind CSS Classes | CodeUtilo",
    description: "Sort Tailwind CSS classes in the recommended order. Clean up messy class strings. Follow the official Tailwind CSS class ordering convention.",
  },
  alternates: {
    canonical: "https://codeutilo.com/tailwind-class-sorter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Tailwind Class Sorter"
        description="Sort Tailwind CSS classes in the recommended order. Clean up messy class strings. Follow the official Tailwind CSS class ordering convention."
        slug="tailwind-class-sorter"
      />
      {children}
    </>
  );
}
