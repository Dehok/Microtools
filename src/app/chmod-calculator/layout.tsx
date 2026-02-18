import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Chmod Calculator — Unix File Permissions Calculator",
  description: "Calculate Unix file permissions in octal and symbolic notation. Visual chmod calculator for Linux and macOS with common permission presets.",
  keywords: ["chmod calculator","unix permissions","file permissions calculator","linux chmod","octal permissions","rwx calculator"],
  openGraph: {
    title: "Chmod Calculator — Unix File Permissions Calculator | CodeUtilo",
    description: "Calculate Unix file permissions in octal and symbolic notation. Visual chmod calculator for Linux and macOS with common permission presets.",
    url: "https://codeutilo.com/chmod-calculator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Chmod Calculator — Unix File Permissions Calculator | CodeUtilo",
    description: "Calculate Unix file permissions in octal and symbolic notation. Visual chmod calculator for Linux and macOS with common permission presets.",
  },
  alternates: {
    canonical: "https://codeutilo.com/chmod-calculator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Chmod Calculator"
        description="Calculate Unix file permissions in octal and symbolic notation. Visual chmod calculator for Linux and macOS with common permission presets."
        slug="chmod-calculator"
      />
        <FAQSchema faqs={[{"question":"Is the Chmod Calculator free to use?","answer":"Yes, the Chmod Calculator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Chmod Calculator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Chmod Calculator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
