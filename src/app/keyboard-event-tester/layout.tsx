import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyboard Event Tester — JavaScript Key Codes",
  description:
    "Test keyboard events in real time. See key codes, key names, event.code, event.key, and modifier keys. Free JavaScript keycode tester.",
  keywords: ["keyboard event tester", "javascript keycode", "key code finder", "keyboard event", "keypress tester", "event.key"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
