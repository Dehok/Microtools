import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllComparisons, getComparisonBySlug, type Winner } from "@/lib/tool-comparisons";

const SITE_URL = "https://codeutilo.com";

export function generateStaticParams() {
  return getAllComparisons().map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    return {
      title: "Comparison Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${comparison.leftTool.name} vs ${comparison.rightTool.name}`;
  const description = comparison.summary;
  const canonical = `${SITE_URL}/compare/${comparison.slug}`;

  return {
    title: `${title} Comparison`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | CodeUtilo`,
      description,
      url: canonical,
      siteName: "CodeUtilo",
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${title} | CodeUtilo`,
      description,
    },
  };
}

function winnerClass(winner: Winner, side: "left" | "right") {
  if (winner === "tie") return "text-gray-700 dark:text-gray-300";
  if (winner === side) return "font-semibold text-green-700 dark:text-green-300";
  return "text-gray-500 dark:text-gray-400";
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) notFound();

  const otherComparisons = getAllComparisons()
    .filter((item) => item.slug !== comparison.slug)
    .slice(0, 4);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${comparison.leftTool.name} vs ${comparison.rightTool.name}`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: comparison.leftTool.name,
        url: `${SITE_URL}/${comparison.leftTool.slug}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: comparison.rightTool.name,
        url: `${SITE_URL}/${comparison.rightTool.slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: comparison.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-blue-700 dark:hover:text-blue-300">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/compare" className="hover:text-blue-700 dark:hover:text-blue-300">
          Compare
        </Link>{" "}
        / <span>{comparison.leftTool.name} vs {comparison.rightTool.name}</span>
      </nav>

      <header className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {comparison.leftTool.name} vs {comparison.rightTool.name}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{comparison.summary}</p>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{comparison.intent}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/${comparison.leftTool.slug}`}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
          >
            Open {comparison.leftTool.name}
          </Link>
          <Link
            href={`/${comparison.rightTool.slug}`}
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
          >
            Open {comparison.rightTool.name}
          </Link>
        </div>
      </header>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Best Use Cases: {comparison.leftTool.name}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
            {comparison.whenToUseLeft.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Best Use Cases: {comparison.rightTool.name}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
            {comparison.whenToUseRight.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">Decision Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Criterion
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {comparison.leftTool.name}
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {comparison.rightTool.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {comparison.criteria.map((row) => (
                <tr key={row.criterion}>
                  <td className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">{row.criterion}</td>
                  <td className={`px-3 py-2 text-sm ${winnerClass(row.winner, "left")}`}>{row.left}</td>
                  <td className={`px-3 py-2 text-sm ${winnerClass(row.winner, "right")}`}>{row.right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">Quick Takeaways</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
          {comparison.keyTakeaways.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">FAQ</h2>
        <div className="space-y-4">
          {comparison.faqs.map((item) => (
            <details key={item.question} className="group rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
              <summary className="cursor-pointer font-medium text-gray-800 group-hover:text-blue-700 dark:text-gray-200 dark:group-hover:text-blue-300">
                {item.question}
              </summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {otherComparisons.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">More Comparisons</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {otherComparisons.map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="rounded-lg border border-gray-200 p-3 text-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-950"
              >
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {item.leftTool.name} vs {item.rightTool.name}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.intent}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}
