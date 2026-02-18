import type { Metadata } from "next";
import FAQSchema from "@/components/FAQSchema";
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
        <FAQSchema faqs={[{"question":"Is the API Response Mocker free to use?","answer":"Yes, the API Response Mocker is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need."},{"question":"Is my data safe when using this tool?","answer":"Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device."},{"question":"Does this tool work on mobile devices?","answer":"Yes. The API Response Mocker is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device."},{"question":"Do I need to install anything?","answer":"No. The API Response Mocker runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately."}]} />
      {children}
    </>
  );
}
