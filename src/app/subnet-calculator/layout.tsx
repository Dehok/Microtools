import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Subnet Calculator Online — CIDR, Netmask & IP Range",
  description: "Calculate subnet details from CIDR notation. Get network address, broadcast, host range, and netmask. Free online subnet calculator.",
  keywords: ["subnet calculator","cidr calculator","ip subnet","netmask calculator","network calculator"],
  openGraph: {
    title: "Subnet Calculator Online — CIDR, Netmask & IP Range | CodeUtilo",
    description: "Calculate subnet details from CIDR notation. Get network address, broadcast, host range, and netmask. Free online subnet calculator.",
    url: "https://codeutilo.com/subnet-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Subnet Calculator Online — CIDR, Netmask & IP Range | CodeUtilo",
    description: "Calculate subnet details from CIDR notation. Get network address, broadcast, host range, and netmask. Free online subnet calculator.",
  },
  alternates: {
    canonical: "https://codeutilo.com/subnet-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Subnet Calculator"
        description="Calculate subnet details from CIDR notation. Get network address, broadcast, host range, and netmask. Free online subnet calculator."
        slug="subnet-calculator"
      />
      {children}
    </>
  );
}
