import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timestamp Converter — ISO 8601, Unix, UTC Online",
  description:
    "Convert between ISO 8601, Unix timestamps (seconds & milliseconds), UTC, and human-readable formats. Free online timestamp converter.",
  keywords: [
    "timestamp converter",
    "ISO 8601 converter",
    "unix timestamp to date",
    "date to unix timestamp",
    "UTC converter",
    "epoch to date",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
