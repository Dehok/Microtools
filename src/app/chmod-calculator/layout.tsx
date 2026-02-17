import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chmod Calculator — Unix File Permissions Calculator",
  description:
    "Calculate Unix file permissions in octal and symbolic notation. Visual chmod calculator for Linux and macOS with common permission presets.",
  keywords: [
    "chmod calculator",
    "unix permissions",
    "file permissions calculator",
    "linux chmod",
    "octal permissions",
    "rwx calculator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
