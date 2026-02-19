import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "MP4 to MP3 Converter Online",
  description:
    "Extract audio from MP4 videos and convert to MP3 in your browser. Private processing with no file upload.",
  keywords: ["mp4 to mp3", "extract audio from mp4", "video to mp3 converter", "mp4 audio extractor"],
  openGraph: {
    title: "MP4 to MP3 Converter Online | CodeUtilo",
    description:
      "Extract audio from MP4 videos and convert to MP3 in your browser. Private processing with no file upload.",
    url: "https://codeutilo.com/mp4-to-mp3",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "MP4 to MP3 Converter Online | CodeUtilo",
    description:
      "Extract audio from MP4 videos and convert to MP3 in your browser. Private processing with no file upload.",
  },
  alternates: {
    canonical: "https://codeutilo.com/mp4-to-mp3",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="MP4 to MP3 Converter"
        description="Convert MP4 video audio to MP3 directly in your browser."
        slug="mp4-to-mp3"
      />
      {children}
    </>
  );
}

