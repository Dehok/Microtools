import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Open Source License Chooser — Compare & Copy Licenses",
  description: "Compare popular open source licenses (MIT, Apache, GPL, BSD, ISC). Understand permissions, conditions, and limitations. Copy license text instantly.",
  keywords: ["open source license","license chooser","mit license","apache license","gpl license","software license"],
  openGraph: {
    title: "Open Source License Chooser — Compare & Copy Licenses | CodeUtilo",
    description: "Compare popular open source licenses (MIT, Apache, GPL, BSD, ISC). Understand permissions, conditions, and limitations. Copy license text instantly.",
    url: "https://codeutilo.com/open-source-licenses",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Open Source License Chooser — Compare & Copy Licenses | CodeUtilo",
    description: "Compare popular open source licenses (MIT, Apache, GPL, BSD, ISC). Understand permissions, conditions, and limitations. Copy license text instantly.",
  },
  alternates: {
    canonical: "https://codeutilo.com/open-source-licenses",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Open Source Licenses"
        description="Compare popular open source licenses (MIT, Apache, GPL, BSD, ISC). Understand permissions, conditions, and limitations. Copy license text instantly."
        slug="open-source-licenses"
      />
        <FAQSchema faqs={[{"question":"Is the Open Source Licenses free to use?","answer":"Yes, the Open Source Licenses is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Open Source Licenses is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Open Source Licenses runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
