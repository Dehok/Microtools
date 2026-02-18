import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Screen Resolution Info — What Is My Screen Size?",
  description: "View your screen resolution, viewport size, device pixel ratio, color depth, and device info. Free screen size checker.",
  keywords: ["screen resolution","what is my screen resolution","screen size","viewport size","device pixel ratio","monitor resolution"],
  openGraph: {
    title: "Screen Resolution Info — What Is My Screen Size? | CodeUtilo",
    description: "View your screen resolution, viewport size, device pixel ratio, color depth, and device info. Free screen size checker.",
    url: "https://codeutilo.com/screen-resolution-info",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Screen Resolution Info — What Is My Screen Size? | CodeUtilo",
    description: "View your screen resolution, viewport size, device pixel ratio, color depth, and device info. Free screen size checker.",
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
        description="View your screen resolution, viewport size, device pixel ratio, color depth, and device info. Free screen size checker."
        slug="screen-resolution-info"
      />
      {children}
    </>
  );
}
