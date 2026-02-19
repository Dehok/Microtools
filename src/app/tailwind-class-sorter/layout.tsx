import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Tailwind Class Sorter — Sort CSS Classes Online",
  description: "Sort Tailwind CSS classes in the recommended order. Paste your class string and get sorted output.",
  keywords: ["tailwind class sorter","tailwind sort","sort tailwind classes","tailwind class order","tailwind css sorter"],
  openGraph: {
    title: "Tailwind Class Sorter — Sort CSS Classes Online | CodeUtilo",
    description: "Sort Tailwind CSS classes in the recommended order. Paste your class string and get sorted output.",
    url: "https://codeutilo.com/tailwind-class-sorter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tailwind Class Sorter — Sort CSS Classes Online | CodeUtilo",
    description: "Sort Tailwind CSS classes in the recommended order. Paste your class string and get sorted output.",
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
        description="Sort Tailwind CSS classes in the recommended order. Paste your class string and get sorted output."
        slug="tailwind-class-sorter"
      />
      {children}
    </>
  );
}
