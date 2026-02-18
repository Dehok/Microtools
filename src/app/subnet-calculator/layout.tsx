import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subnet Calculator Online — CIDR, Netmask & IP Range",
  description:
    "Calculate subnet details from CIDR notation. Get network address, broadcast, host range, and netmask. Free online subnet calculator.",
  keywords: ["subnet calculator", "cidr calculator", "ip subnet", "netmask calculator", "network calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
