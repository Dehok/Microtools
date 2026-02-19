import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: "Docker Compose Generator — Visual Compose File Builder",
  description: "Generate docker-compose.yml files with a visual editor. Presets for PostgreSQL, MySQL, Redis, MongoDB, nginx. Auto volume detection.",
  keywords: ["docker compose generator","docker-compose builder","compose file generator","docker compose yaml","docker compose maker"],
  openGraph: {
    title: "Docker Compose Generator — Visual Compose File Builder | CodeUtilo",
    description: "Generate docker-compose.yml files with a visual editor. Presets for PostgreSQL, MySQL, Redis, MongoDB, nginx. Auto volume detection.",
    url: "https://codeutilo.com/docker-compose-generator",
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Docker Compose Generator — Visual Compose File Builder | CodeUtilo",
    description: "Generate docker-compose.yml files with a visual editor. Presets for PostgreSQL, MySQL, Redis, MongoDB, nginx. Auto volume detection.",
  },
  alternates: {
    canonical: "https://codeutilo.com/docker-compose-generator",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name="Docker Compose Generator"
        description="Generate docker-compose.yml files with a visual editor. Presets for PostgreSQL, MySQL, Redis, MongoDB, nginx. Auto volume detection."
        slug="docker-compose-generator"
      />
      {children}
    </>
  );
}
