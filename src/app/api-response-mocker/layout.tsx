import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "API Response Mocker — Create Mock API Responses",
  description: "Create mock API responses with custom status codes, headers, and JSON body. Generate mock data for frontend development and testing.",
  keywords: ["api mock","mock api response","json placeholder","api mocker","mock server","fake api response"],
  openGraph: {
    title: "API Response Mocker — Create Mock API Responses | CodeUtilo",
    description: "Create mock API responses with custom status codes, headers, and JSON body. Generate mock data for frontend development and testing.",
    url: "https://codeutilo.com/api-response-mocker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "API Response Mocker — Create Mock API Responses | CodeUtilo",
    description: "Create mock API responses with custom status codes, headers, and JSON body. Generate mock data for frontend development and testing.",
  },
  alternates: {
    canonical: "https://codeutilo.com/api-response-mocker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Api Response Mocker"
        description="Create mock API responses with custom status codes, headers, and JSON body. Generate mock data for frontend development and testing."
        slug="api-response-mocker"
      />
      {children}
    </>
  );
}
