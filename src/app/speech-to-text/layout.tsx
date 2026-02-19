import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Speech to Text Online — Free Voice Transcription",
  description: "Convert speech to text in real-time using your microphone. Supports 18+ languages. Free, fast, private.",
  keywords: ["speech to text","voice to text","transcribe audio","speech recognition online","dictation tool"],
  openGraph: {
    title: "Speech to Text Online — Free Voice Transcription | CodeUtilo",
    description: "Convert speech to text in real-time using your microphone. Supports 18+ languages. Free, fast, private.",
    url: "https://codeutilo.com/speech-to-text",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Speech to Text Online — Free Voice Transcription | CodeUtilo",
    description: "Convert speech to text in real-time using your microphone. Supports 18+ languages. Free, fast, private.",
  },
  alternates: {
    canonical: "https://codeutilo.com/speech-to-text",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Speech to Text"
        description="Convert speech to text in real-time using your microphone. Supports 18+ languages. Free, fast, private."
        slug="speech-to-text"
      />
      {children}
    </>
  );
}
