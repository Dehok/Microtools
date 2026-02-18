import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Screen Resolution Info — Viewport & Device Details",
  description: "View your screen resolution, viewport size, DPR, color depth, and device info. Free online tool.",
  keywords: ["screen resolution","viewport size","screen size","dpr checker","device pixel ratio"],
  openGraph: {
    title: "Screen Resolution Info — Viewport & Device Details | CodeUtilo",
    description: "View your screen resolution, viewport size, DPR, color depth, and device info. Free online tool.",
    url: "https://codeutilo.com/screen-resolution-info",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Screen Resolution Info — Viewport & Device Details | CodeUtilo",
    description: "View your screen resolution, viewport size, DPR, color depth, and device info. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/screen-resolution-info",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Screen Resolution Info"
        description="View your screen resolution, viewport size, DPR, color depth, and device info. Free online tool."
        slug="screen-resolution-info"
      />
      {children}
    </>
  );
}
