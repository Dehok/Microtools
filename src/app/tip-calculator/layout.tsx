import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Tip Calculator — Calculate Tips & Split Bills Free",
  description: "Calculate tips and split bills easily. Choose from preset percentages or custom amounts. Split between any number of people.",
  keywords: ["tip calculator","bill splitter","split bill calculator","restaurant tip calculator","gratuity calculator"],
  openGraph: {
    title: "Tip Calculator — Calculate Tips & Split Bills Free | CodeUtilo",
    description: "Calculate tips and split bills easily. Choose from preset percentages or custom amounts. Split between any number of people.",
    url: "https://codeutilo.com/tip-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tip Calculator — Calculate Tips & Split Bills Free | CodeUtilo",
    description: "Calculate tips and split bills easily. Choose from preset percentages or custom amounts. Split between any number of people.",
  },
  alternates: {
    canonical: "https://codeutilo.com/tip-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Tip Calculator"
        description="Calculate tips and split bills easily. Choose from preset percentages or custom amounts. Split between any number of people."
        slug="tip-calculator"
      />
      {children}
    </>
  );
}
