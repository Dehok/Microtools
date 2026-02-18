import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Data Size Converter — Bytes, KB, MB, GB, TB",
  description: "Convert between bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes. Binary (1024) and decimal (1000) units. Free converter.",
  keywords: ["data size converter","byte converter","mb to gb","kb to mb","file size converter","storage unit converter"],
  openGraph: {
    title: "Data Size Converter — Bytes, KB, MB, GB, TB | CodeUtilo",
    description: "Convert between bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes. Binary (1024) and decimal (1000) units. Free converter.",
    url: "https://codeutilo.com/data-size-converter",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Data Size Converter — Bytes, KB, MB, GB, TB | CodeUtilo",
    description: "Convert between bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes. Binary (1024) and decimal (1000) units. Free converter.",
  },
  alternates: {
    canonical: "https://codeutilo.com/data-size-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Data Size Converter"
        description="Convert between bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes. Binary (1024) and decimal (1000) units. Free converter."
        slug="data-size-converter"
      />
      {children}
    </>
  );
}
