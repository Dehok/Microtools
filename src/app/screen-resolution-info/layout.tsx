import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the Screen Resolution Info free to use?","answer":"Yes, the Screen Resolution Info is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Screen Resolution Info is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Screen Resolution Info runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
