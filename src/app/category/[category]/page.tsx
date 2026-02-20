import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, tools } from "@/lib/tools";

const SITE_URL = "https://codeutilo.com";

const categoryDescriptions: Record<string, string> = {
  developer: "Developer utilities for coding, debugging, formatting, and API workflows.",
  text: "Text and AI-focused utilities for prompts, writing checks, parsing, and transformation.",
  converter: "Converters for files, data formats, units, and structured transformations.",
  generator: "Generators for content, identifiers, templates, and productivity assets.",
  crypto: "Privacy and security tools for hashing, redaction, token checks, and safe handling.",
  media: "Image and media browser tools for conversion, compression, and extraction.",
  calculator: "Fast calculators for finance, health, percentages, and everyday operations.",
  legal: "Legal and business helpers for policies, agreements, and document workflows.",
  design: "Design tools for palettes, gradients, typography, and creative assets.",
  seo: "SEO tools for metadata, sitemaps, social previews, and search readiness.",
};

function getCategory(id: string) {
  return CATEGORIES.find((category) => category.id === id);
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.id }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const selected = getCategory(params.category);
  if (!selected) {
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false },
    };
  }

  const count = tools.filter((tool) => tool.category === selected.id).length;
  const description = `${categoryDescriptions[selected.id]} Explore ${count} tools in ${selected.name}.`;
  const canonical = `${SITE_URL}/category/${selected.id}`;

  return {
    title: `${selected.name} Tools`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${selected.name} Tools | CodeUtilo`,
      description,
      url: canonical,
      siteName: "CodeUtilo",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${selected.name} Tools | CodeUtilo`,
      description,
    },
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const selected = getCategory(params.category);
  if (!selected) notFound();

  const categoryTools = tools.filter((tool) => tool.category === selected.id);
  const related = CATEGORIES.filter((category) => category.id !== selected.id)
    .map((category) => ({
      ...category,
      count: tools.filter((tool) => tool.category === category.id).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${selected.name} Tools`,
    itemListElement: categoryTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${SITE_URL}/${tool.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-blue-700 dark:hover:text-blue-300">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/category" className="hover:text-blue-700 dark:hover:text-blue-300">
          Categories
        </Link>{" "}
        / <span>{selected.name}</span>
      </nav>

      <header className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{selected.name} Tools</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {categoryDescriptions[selected.id]} This category contains {categoryTools.length} tools.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 font-mono text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {tool.icon}
              </span>
              <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300">
                {tool.name}
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Explore More Categories</h2>
        <div className="flex flex-wrap gap-2">
          {related.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  );
}
