import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IP Address Analyzer — IPv4 & IPv6 Info Tool",
  description:
    "Analyze IP addresses: class, scope (private/public), binary & hex representation. Supports IPv4 and IPv6. Free online tool.",
  keywords: [
    "IP address analyzer",
    "IPv4 info",
    "IPv6 info",
    "private IP check",
    "IP class calculator",
    "IP binary converter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
