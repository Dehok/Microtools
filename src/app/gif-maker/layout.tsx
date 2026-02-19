import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "GIF Maker — Create Animated GIFs from Images Online",
  description: "Create animated GIFs from individual image frames. Upload images, arrange order, set speed and resolution. All processing in your browser.",
  keywords: ["gif maker","create gif","animated gif maker","gif creator online","image to gif"],
  openGraph: {
    title: "GIF Maker — Create Animated GIFs from Images Online | CodeUtilo",
    description: "Create animated GIFs from individual image frames. Upload images, arrange order, set speed and resolution. All processing in your browser.",
    url: "https://codeutilo.com/gif-maker",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GIF Maker — Create Animated GIFs from Images Online | CodeUtilo",
    description: "Create animated GIFs from individual image frames. Upload images, arrange order, set speed and resolution. All processing in your browser.",
  },
  alternates: {
    canonical: "https://codeutilo.com/gif-maker",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="GIF Maker"
        description="Create animated GIFs from individual image frames. Upload images, arrange order, set speed and resolution. All processing in your browser."
        slug="gif-maker"
      />
      {children}
    </>
  );
}
