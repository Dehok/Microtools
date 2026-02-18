import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Response Mocker — Create Mock API Responses",
  description:
    "Create mock API responses with custom status codes, headers, and JSON body. Generate mock data for frontend development and testing.",
  keywords: ["api mock", "mock api response", "json placeholder", "api mocker", "mock server", "fake api response"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
