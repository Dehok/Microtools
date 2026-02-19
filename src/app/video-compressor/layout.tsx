import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Video Compressor Online",
  description:
    "Compress videos in your browser by reducing bitrate and resolution. Private conversion with no uploads.",
  keywords: ["video compressor", "compress mp4", "reduce video size", "video compression online"],
  openGraph: {
    title: "Video Compressor Online | CodeUtilo",
    description:
      "Compress videos in your browser by reducing bitrate and resolution. Private conversion with no uploads.",
    url: "https://codeutilo.com/video-compressor",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Video Compressor Online | CodeUtilo",
    description:
      "Compress videos in your browser by reducing bitrate and resolution. Private conversion with no uploads.",
  },
  alternates: {
    canonical: "https://codeutilo.com/video-compressor",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Video Compressor"
        description="Compress video files in your browser by lowering bitrate and resolution."
        slug="video-compressor"
      />
      {children}
    </>
  );
}

