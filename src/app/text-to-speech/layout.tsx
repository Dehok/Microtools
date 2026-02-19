import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Text to Speech Online — Free TTS with Multiple Voices",
  description: "Convert text to natural-sounding speech using your browser. Choose voice, adjust speed and pitch. No signup needed.",
  keywords: ["text to speech","tts online","text to speech free","read text aloud","convert text to audio"],
  openGraph: {
    title: "Text to Speech Online — Free TTS with Multiple Voices | CodeUtilo",
    description: "Convert text to natural-sounding speech using your browser. Choose voice, adjust speed and pitch. No signup needed.",
    url: "https://codeutilo.com/text-to-speech",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Text to Speech Online — Free TTS with Multiple Voices | CodeUtilo",
    description: "Convert text to natural-sounding speech using your browser. Choose voice, adjust speed and pitch. No signup needed.",
  },
  alternates: {
    canonical: "https://codeutilo.com/text-to-speech",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Text to Speech"
        description="Convert text to natural-sounding speech using your browser. Choose voice, adjust speed and pitch. No signup needed."
        slug="text-to-speech"
      />
      {children}
    </>
  );
}
