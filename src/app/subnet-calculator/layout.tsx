import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the Subnet Calculator free to use?","answer":"Yes, the Subnet Calculator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Subnet Calculator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Subnet Calculator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
