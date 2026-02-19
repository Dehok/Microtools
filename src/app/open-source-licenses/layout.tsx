import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Open Source Licenses — Compare MIT, Apache, GPL & More",
  description: "Compare and copy open source licenses. MIT, Apache, GPL, BSD, ISC, and more. Free reference.",
  keywords: ["open source licenses","mit license","apache license","gpl license","software license comparison"],
  openGraph: {
    title: "Open Source Licenses — Compare MIT, Apache, GPL & More | CodeUtilo",
    description: "Compare and copy open source licenses. MIT, Apache, GPL, BSD, ISC, and more. Free reference.",
    url: "https://codeutilo.com/open-source-licenses",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Open Source Licenses — Compare MIT, Apache, GPL & More | CodeUtilo",
    description: "Compare and copy open source licenses. MIT, Apache, GPL, BSD, ISC, and more. Free reference.",
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
        description="Compare and copy open source licenses. MIT, Apache, GPL, BSD, ISC, and more. Free reference."
        slug="open-source-licenses"
      />
      {children}
    </>
  );
}
