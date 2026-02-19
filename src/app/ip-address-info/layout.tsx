import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "IP Address Analyzer — IPv4 & IPv6 Inspector",
  description: "Analyze IPv4/IPv6 addresses: class, scope, binary, and hex representation. Free online IP analyzer.",
  keywords: ["ip address analyzer","ip address info","ipv4 analyzer","ipv6 info","ip address lookup"],
  openGraph: {
    title: "IP Address Analyzer — IPv4 & IPv6 Inspector | CodeUtilo",
    description: "Analyze IPv4/IPv6 addresses: class, scope, binary, and hex representation. Free online IP analyzer.",
    url: "https://codeutilo.com/ip-address-info",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "IP Address Analyzer — IPv4 & IPv6 Inspector | CodeUtilo",
    description: "Analyze IPv4/IPv6 addresses: class, scope, binary, and hex representation. Free online IP analyzer.",
  },
  alternates: {
    canonical: "https://codeutilo.com/ip-address-info",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="IP Address Analyzer"
        description="Analyze IPv4/IPv6 addresses: class, scope, binary, and hex representation. Free online IP analyzer."
        slug="ip-address-info"
      />
      {children}
    </>
  );
}
