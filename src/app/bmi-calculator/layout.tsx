import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "BMI Calculator Online — Calculate Body Mass Index Free",
  description: "Calculate your Body Mass Index (BMI) with metric or imperial units. See weight categories and healthy range. Free and instant.",
  keywords: ["bmi calculator","body mass index calculator","calculate bmi","bmi checker","healthy weight calculator"],
  openGraph: {
    title: "BMI Calculator Online — Calculate Body Mass Index Free | CodeUtilo",
    description: "Calculate your Body Mass Index (BMI) with metric or imperial units. See weight categories and healthy range. Free and instant.",
    url: "https://codeutilo.com/bmi-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "BMI Calculator Online — Calculate Body Mass Index Free | CodeUtilo",
    description: "Calculate your Body Mass Index (BMI) with metric or imperial units. See weight categories and healthy range. Free and instant.",
  },
  alternates: {
    canonical: "https://codeutilo.com/bmi-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="BMI Calculator"
        description="Calculate your Body Mass Index (BMI) with metric or imperial units. See weight categories and healthy range. Free and instant."
        slug="bmi-calculator"
      />
      {children}
    </>
  );
}
