import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Source License Chooser — Compare & Copy Licenses",
  description:
    "Compare popular open source licenses (MIT, Apache, GPL, BSD, ISC). Understand permissions, conditions, and limitations. Copy license text instantly.",
  keywords: ["open source license", "license chooser", "mit license", "apache license", "gpl license", "software license"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
