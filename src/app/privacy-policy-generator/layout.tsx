import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Privacy Policy Generator — Free Privacy Policy Template",
  description: "Generate a free privacy policy for your website or app. Customizable template covering data collection, cookies, GDPR, and third-party services.",
  keywords: ["privacy policy generator","privacy policy template","free privacy policy","gdpr privacy policy","website privacy policy"],
  openGraph: {
    title: "Privacy Policy Generator — Free Privacy Policy Template | CodeUtilo",
    description: "Generate a free privacy policy for your website or app. Customizable template covering data collection, cookies, GDPR, and third-party services.",
    url: "https://codeutilo.com/privacy-policy-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy Generator — Free Privacy Policy Template | CodeUtilo",
    description: "Generate a free privacy policy for your website or app. Customizable template covering data collection, cookies, GDPR, and third-party services.",
  },
  alternates: {
    canonical: "https://codeutilo.com/privacy-policy-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Privacy Policy Generator"
        description="Generate a free privacy policy for your website or app. Customizable template covering data collection, cookies, GDPR, and third-party services."
        slug="privacy-policy-generator"
      />
        <FAQSchema faqs={[{"question":"Is the Privacy Policy Generator free to use?","answer":"Yes, the Privacy Policy Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Privacy Policy Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Privacy Policy Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
