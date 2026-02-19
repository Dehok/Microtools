import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Video to GIF Converter Online — Convert Video to Animated GIF",
  description: "Convert video clips to animated GIF/WebM in your browser. Adjust FPS, resolution, quality, start time and duration. No uploads required.",
  keywords: ["video to gif","convert video to gif","video to gif converter","mp4 to gif","video gif maker"],
  openGraph: {
    title: "Video to GIF Converter Online — Convert Video to Animated GIF | CodeUtilo",
    description: "Convert video clips to animated GIF/WebM in your browser. Adjust FPS, resolution, quality, start time and duration. No uploads required.",
    url: "https://codeutilo.com/video-to-gif",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Video to GIF Converter Online — Convert Video to Animated GIF | CodeUtilo",
    description: "Convert video clips to animated GIF/WebM in your browser. Adjust FPS, resolution, quality, start time and duration. No uploads required.",
  },
  alternates: {
    canonical: "https://codeutilo.com/video-to-gif",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Video to GIF"
        description="Convert video clips to animated GIF/WebM in your browser. Adjust FPS, resolution, quality, start time and duration. No uploads required."
        slug="video-to-gif"
      />
      {children}
    </>
  );
}
