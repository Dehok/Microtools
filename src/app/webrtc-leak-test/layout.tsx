import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "WebRTC Leak Test",
  description:
    "Check whether your browser exposes local or public IP addresses through WebRTC ICE candidates.",
  keywords: ["webrtc leak test", "ip leak test", "webrtc privacy", "stun leak checker"],
  openGraph: {
    title: "WebRTC Leak Test | CodeUtilo",
    description:
      "Check whether your browser exposes local or public IP addresses through WebRTC ICE candidates.",
    url: "https://codeutilo.com/webrtc-leak-test",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "WebRTC Leak Test | CodeUtilo",
    description:
      "Check whether your browser exposes local or public IP addresses through WebRTC ICE candidates.",
  },
  alternates: {
    canonical: "https://codeutilo.com/webrtc-leak-test",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="WebRTC Leak Test"
        description="Test WebRTC ICE candidates for potential local or public IP exposure."
        slug="webrtc-leak-test"
      />
      {children}
    </>
  );
}
