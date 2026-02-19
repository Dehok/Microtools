import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Dockerfile Generator — Create Dockerfiles Visually",
  description: "Generate Dockerfiles with a visual builder. Presets for Node.js, Python, Go, Java. Multi-stage builds, ENV, and more.",
  keywords: ["dockerfile generator","create dockerfile","dockerfile builder","docker generator online","dockerfile maker"],
  openGraph: {
    title: "Dockerfile Generator — Create Dockerfiles Visually | CodeUtilo",
    description: "Generate Dockerfiles with a visual builder. Presets for Node.js, Python, Go, Java. Multi-stage builds, ENV, and more.",
    url: "https://codeutilo.com/dockerfile-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Dockerfile Generator — Create Dockerfiles Visually | CodeUtilo",
    description: "Generate Dockerfiles with a visual builder. Presets for Node.js, Python, Go, Java. Multi-stage builds, ENV, and more.",
  },
  alternates: {
    canonical: "https://codeutilo.com/dockerfile-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Dockerfile Generator"
        description="Generate Dockerfiles with a visual builder. Presets for Node.js, Python, Go, Java. Multi-stage builds, ENV, and more."
        slug="dockerfile-generator"
      />
      {children}
    </>
  );
}
