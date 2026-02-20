import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, tools } from "@/lib/tools";

const SITE_URL = "https://codeutilo.com";

export const metadata: Metadata = {
  title: "Tool Categories",
  description:
    "Browse CodeUtilo tool categories including AI, developer, privacy, SEO, converters, calculators, and media tools.",
  alternates: {
    canonical: `${SITE_URL}/category`,
  },
  openGraph: {
    title: "Tool Categories | CodeUtilo",
    description:
      "Browse CodeUtilo tool categories including AI, developer, privacy, SEO, converters, calculators, and media tools.",
    url: `${SITE_URL}/category`,
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tool Categories | CodeUtilo",
    description:
      "Browse CodeUtilo tool categories including AI, developer, privacy, SEO, converters, calculators, and media tools.",
  },
};

export default function CategoryIndexPage() {
  const categoryRows = CATEGORIES.map((category) => {
    const items = tools.filter((tool) => tool.category === category.id);
    return { ...category, count: items.length, tools: items.slice(0, 6) };
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: categoryRows.map((row, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: row.name,
      url: `${SITE_URL}/category/${row.id}`,
    })),
  };

  const faq = [
    {
      question: "How are categories organized on CodeUtilo?",
      answer:
        "Categories group tools by intent, such as AI workflows, developer operations, privacy checks, converters, and SEO tasks.",
    },
    {
      question: "Are category pages indexable by search engines?",
      answer:
        "Yes. Category pages are static, crawlable routes with canonical metadata and structured data.",
    },
    {
      question: "Do tools in these categories upload data?",
      answer:
        "Core tool processing is browser-side. Category pages help discover tools but do not process user input themselves.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tool Categories</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
          Explore tools by intent. Category pages are optimized for focused workflows and easier discovery.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryRows.map((row) => (
          <article
            key={row.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{row.name}</h2>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {row.count}
              </span>
            </div>
            <ul className="mb-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {row.tools.map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="hover:text-blue-700 dark:hover:text-blue-300">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/category/${row.id}`}
              className="inline-flex rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
            >
              Open {row.name}
            </Link>
          </article>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">Category FAQ</h2>
        <div className="space-y-4">
          {faq.map((item) => (
            <details key={item.question} className="group rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
              <summary className="cursor-pointer font-medium text-gray-800 group-hover:text-blue-700 dark:text-gray-200 dark:group-hover:text-blue-300">
                {item.question}
              </summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
