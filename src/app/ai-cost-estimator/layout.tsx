import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "AI Cost Estimator",
  description:
    "Estimate AI model costs per request, per day, and per month using token estimates, pricing, and cache hit ratio.",
  keywords: ["ai cost estimator", "llm pricing calculator", "token cost calculator", "ai budget planner"],
  openGraph: {
    title: "AI Cost Estimator | CodeUtilo",
    description:
      "Estimate AI model costs per request, per day, and per month using token estimates, pricing, and cache hit ratio.",
    url: "https://codeutilo.com/ai-cost-estimator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Cost Estimator | CodeUtilo",
    description:
      "Estimate AI model costs per request, per day, and per month using token estimates, pricing, and cache hit ratio.",
  },
  alternates: {
    canonical: "https://codeutilo.com/ai-cost-estimator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="AI Cost Estimator"
        description="Estimate AI usage costs from token estimates and custom input/output pricing."
        slug="ai-cost-estimator"
      />
      {children}
    </>
  );
}
