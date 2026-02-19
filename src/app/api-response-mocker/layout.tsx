import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "API Response Mocker — Create Mock API Responses",
  description: "Create mock API responses with custom status codes, headers, and JSON body. Free online tool.",
  keywords: ["api mocker","mock api response","api response generator","json placeholder","fake api response"],
  openGraph: {
    title: "API Response Mocker — Create Mock API Responses | CodeUtilo",
    description: "Create mock API responses with custom status codes, headers, and JSON body. Free online tool.",
    url: "https://codeutilo.com/api-response-mocker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "API Response Mocker — Create Mock API Responses | CodeUtilo",
    description: "Create mock API responses with custom status codes, headers, and JSON body. Free online tool.",
  },
  alternates: {
    canonical: "https://codeutilo.com/api-response-mocker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="API Response Mocker"
        description="Create mock API responses with custom status codes, headers, and JSON body. Free online tool."
        slug="api-response-mocker"
      />
      {children}
    </>
  );
}
