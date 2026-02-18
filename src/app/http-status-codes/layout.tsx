import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTTP Status Codes Reference — Complete List with Descriptions",
  description:
    "Complete reference of all HTTP status codes (1xx-5xx). Search and filter status codes with descriptions and usage examples.",
  keywords: ["http status codes", "http codes", "status code list", "http 404", "http response codes"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
