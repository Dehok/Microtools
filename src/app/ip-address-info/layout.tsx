import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "IP Address Analyzer — IPv4 & IPv6 Info Tool",
  description: "Analyze IP addresses: class, scope (private/public), binary & hex representation. Supports IPv4 and IPv6. Free online tool.",
  keywords: ["IP address analyzer","IPv4 info","IPv6 info","private IP check","IP class calculator","IP binary converter"],
  openGraph: {
    title: "IP Address Analyzer — IPv4 & IPv6 Info Tool | CodeUtilo",
    description: "Analyze IP addresses: class, scope (private/public), binary & hex representation. Supports IPv4 and IPv6. Free online tool.",
    url: "https://codeutilo.com/ip-address-info",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "IP Address Analyzer — IPv4 & IPv6 Info Tool | CodeUtilo",
    description: "Analyze IP addresses: class, scope (private/public), binary & hex representation. Supports IPv4 and IPv6. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/ip-address-info",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Ip Address Info"
        description="Analyze IP addresses: class, scope (private/public), binary & hex representation. Supports IPv4 and IPv6. Free online tool."
        slug="ip-address-info"
      />
      {children}
    </>
  );
}
