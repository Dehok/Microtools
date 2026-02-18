import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Size Converter — Bytes, KB, MB, GB, TB",
  description:
    "Convert between bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes. Binary (1024) and decimal (1000) units. Free converter.",
  keywords: ["data size converter", "byte converter", "mb to gb", "kb to mb", "file size converter", "storage unit converter"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
