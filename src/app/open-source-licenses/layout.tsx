import type { Metadata } from "next";
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
      {children}
    </>
  );
}
