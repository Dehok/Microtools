import type { Metadata } from "next";
import Link from "next/link";
import { getAllComparisons } from "@/lib/tool-comparisons";

const SITE_URL = "https://codeutilo.com";

export const metadata: Metadata = {
  title: "Tool Comparison Pages",
  description:
    "Compare similar AI and workflow tools on CodeUtilo. See key differences, use cases, and decision guides before picking a tool.",
  alternates: {
    canonical: `${SITE_URL}/compare`,
  },
  openGraph: {
    title: "Tool Comparison Pages | CodeUtilo",
    description:
      "Compare similar AI and workflow tools on CodeUtilo. See key differences, use cases, and decision guides before picking a tool.",
    url: `${SITE_URL}/compare`,
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tool Comparison Pages | CodeUtilo",
    description:
      "Compare similar AI and workflow tools on CodeUtilo. See key differences, use cases, and decision guides before picking a tool.",
  },
};

export default function CompareIndexPage() {
  const comparisons = getAllComparisons();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "CodeUtilo Tool Comparisons",
    itemListElement: comparisons.map((comparison, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${comparison.leftTool.name} vs ${comparison.rightTool.name}`,
      url: `${SITE_URL}/compare/${comparison.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tool Comparisons</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          Side-by-side decision pages for similar tools. Compare goals, strengths, and workflow fit before you choose.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {comparisons.map((comparison) => (
          <article
            key={comparison.slug}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {comparison.leftTool.name} vs {comparison.rightTool.name}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{comparison.summary}</p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{comparison.intent}</p>
            <Link
              href={`/compare/${comparison.slug}`}
              className="mt-4 inline-flex rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
            >
              Open comparison
            </Link>
          </article>
        ))}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
