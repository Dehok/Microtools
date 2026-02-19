import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Keyboard Event Tester — Key Codes & Event Properties",
  description: "Test keyboard events in real time. See key codes, key names, and event properties. Free online tool.",
  keywords: ["keyboard event tester","key code tester","keycode","keyboard event","javascript keycode"],
  openGraph: {
    title: "Keyboard Event Tester — Key Codes & Event Properties | CodeUtilo",
    description: "Test keyboard events in real time. See key codes, key names, and event properties. Free online tool.",
    url: "https://codeutilo.com/keyboard-event-tester",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Keyboard Event Tester — Key Codes & Event Properties | CodeUtilo",
    description: "Test keyboard events in real time. See key codes, key names, and event properties. Free online tool.",
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
        description="Test keyboard events in real time. See key codes, key names, and event properties. Free online tool."
        slug="keyboard-event-tester"
      />
      {children}
    </>
  );
}
