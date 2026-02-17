import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Epoch / Unix Timestamp Converter Online — Free Tool",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Live clock included.",
  keywords: ["epoch converter", "unix timestamp", "timestamp converter", "epoch to date", "unix time"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
