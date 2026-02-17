import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encode & Decode Online — Free Base64 Converter",
  description:
    "Encode text to Base64 or decode Base64 to plain text instantly. Supports UTF-8 characters. Free online tool, no signup required.",
  keywords: ["base64 encode", "base64 decode", "base64 converter", "base64 online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
