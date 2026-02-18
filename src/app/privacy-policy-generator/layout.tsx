import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy Generator — Free Privacy Policy Template",
  description:
    "Generate a free privacy policy for your website or app. Customizable template covering data collection, cookies, GDPR, and third-party services.",
  keywords: ["privacy policy generator", "privacy policy template", "free privacy policy", "gdpr privacy policy", "website privacy policy"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
