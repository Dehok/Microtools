import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Subnet Calculator — CIDR, Netmask & Host Range",
  description: "Calculate subnet details from CIDR notation. Network, broadcast, host range, and netmask. Free tool.",
  keywords: ["subnet calculator","cidr calculator","subnet mask calculator","ip subnet","network calculator"],
  openGraph: {
    title: "Subnet Calculator — CIDR, Netmask & Host Range | CodeUtilo",
    description: "Calculate subnet details from CIDR notation. Network, broadcast, host range, and netmask. Free tool.",
    url: "https://codeutilo.com/subnet-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Subnet Calculator — CIDR, Netmask & Host Range | CodeUtilo",
    description: "Calculate subnet details from CIDR notation. Network, broadcast, host range, and netmask. Free tool.",
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
        description="Calculate subnet details from CIDR notation. Network, broadcast, host range, and netmask. Free tool."
        slug="subnet-calculator"
      />
      {children}
    </>
  );
}
