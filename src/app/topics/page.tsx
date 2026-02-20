import type { Metadata } from "next";
import Link from "next/link";
import { TOPIC_HUBS, getTopicTools } from "@/lib/topics";

const SITE_URL = "https://codeutilo.com";

export const metadata: Metadata = {
  title: "Topic Hubs",
  description:
    "Explore curated topic hubs for AI prompt quality, privacy and security, and PDF workflows on CodeUtilo.",
  alternates: {
    canonical: `${SITE_URL}/topics`,
  },
  openGraph: {
    title: "Topic Hubs | CodeUtilo",
    description:
      "Explore curated topic hubs for AI prompt quality, privacy and security, and PDF workflows on CodeUtilo.",
    url: `${SITE_URL}/topics`,
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Topic Hubs | CodeUtilo",
    description:
      "Explore curated topic hubs for AI prompt quality, privacy and security, and PDF workflows on CodeUtilo.",
  },
};

export default function TopicsIndexPage() {
  const rows = TOPIC_HUBS.map((topic) => ({
    ...topic,
    tools: getTopicTools(topic.slug),
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "CodeUtilo Topic Hubs",
    itemListElement: rows.map((row, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: row.title,
      url: `${SITE_URL}/topics/${row.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Topic Hubs</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          Curated landing pages for high-intent workflows. Each hub bundles the most relevant tools and internal links
          for faster discovery and stronger SEO clustering.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <article
            key={row.slug}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{row.name}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{row.description}</p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{row.tools.length} tools in this hub</p>
            <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {row.tools.slice(0, 5).map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="hover:text-blue-700 dark:hover:text-blue-300">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/topics/${row.slug}`}
              className="mt-4 inline-flex rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
            >
              Open hub
            </Link>
          </article>
        ))}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
