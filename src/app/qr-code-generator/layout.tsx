import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator Online — Free QR Code Maker",
  description:
    "Generate QR codes from text or URLs instantly. Customize size and colors. Download as PNG or SVG. Free online QR code generator.",
  keywords: ["qr code generator", "qr code maker", "qr code online", "generate qr code", "free qr code"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
