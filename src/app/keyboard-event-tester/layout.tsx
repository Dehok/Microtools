import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Keyboard Event Tester — JavaScript Key Codes",
  description: "Test keyboard events in real time. See key codes, key names, event.code, event.key, and modifier keys. Free JavaScript keycode tester.",
  keywords: ["keyboard event tester","javascript keycode","key code finder","keyboard event","keypress tester","event.key"],
  openGraph: {
    title: "Keyboard Event Tester — JavaScript Key Codes | CodeUtilo",
    description: "Test keyboard events in real time. See key codes, key names, event.code, event.key, and modifier keys. Free JavaScript keycode tester.",
    url: "https://codeutilo.com/keyboard-event-tester",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Keyboard Event Tester — JavaScript Key Codes | CodeUtilo",
    description: "Test keyboard events in real time. See key codes, key names, event.code, event.key, and modifier keys. Free JavaScript keycode tester.",
  },
  alternates: {
    canonical: "https://codeutilo.com/keyboard-event-tester",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Keyboard Event Tester"
        description="Test keyboard events in real time. See key codes, key names, event.code, event.key, and modifier keys. Free JavaScript keycode tester."
        slug="keyboard-event-tester"
      />
        <FAQSchema faqs={[{"question":"Is the Keyboard Event Tester free to use?","answer":"Yes, the Keyboard Event Tester is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The Keyboard Event Tester is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The Keyboard Event Tester runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
