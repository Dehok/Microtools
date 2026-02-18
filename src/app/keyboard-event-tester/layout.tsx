import type { Metadata } from "next";
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
      {children}
    </>
  );
}
