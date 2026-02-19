import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Invoice Generator Online — Create Free PDF Invoices",
  description: "Create professional PDF invoices with line items, tax, and multiple currencies. Free, no signup, runs in your browser.",
  keywords: ["invoice generator","create invoice online","free invoice maker","pdf invoice generator","invoice template"],
  openGraph: {
    title: "Invoice Generator Online — Create Free PDF Invoices | CodeUtilo",
    description: "Create professional PDF invoices with line items, tax, and multiple currencies. Free, no signup, runs in your browser.",
    url: "https://codeutilo.com/invoice-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Invoice Generator Online — Create Free PDF Invoices | CodeUtilo",
    description: "Create professional PDF invoices with line items, tax, and multiple currencies. Free, no signup, runs in your browser.",
  },
  alternates: {
    canonical: "https://codeutilo.com/invoice-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Invoice Generator"
        description="Create professional PDF invoices with line items, tax, and multiple currencies. Free, no signup, runs in your browser."
        slug="invoice-generator"
      />
      {children}
    </>
  );
}
