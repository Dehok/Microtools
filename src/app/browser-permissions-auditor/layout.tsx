import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Browser Permissions Auditor",
  description:
    "Audit browser permission states like camera, microphone, geolocation, and notifications locally in your browser.",
  keywords: ["browser permissions", "permission audit", "camera permission test", "microphone permission checker"],
  openGraph: {
    title: "Browser Permissions Auditor | CodeUtilo",
    description:
      "Audit browser permission states like camera, microphone, geolocation, and notifications locally in your browser.",
    url: "https://codeutilo.com/browser-permissions-auditor",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Browser Permissions Auditor | CodeUtilo",
    description:
      "Audit browser permission states like camera, microphone, geolocation, and notifications locally in your browser.",
  },
  alternates: {
    canonical: "https://codeutilo.com/browser-permissions-auditor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Browser Permissions Auditor"
        description="Check browser permission states for camera, microphone, geolocation, and more."
        slug="browser-permissions-auditor"
      />
      {children}
    </>
  );
}
