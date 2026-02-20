import type { Metadata } from "next";
import Link from "next/link";
import ToolExplorer from "@/components/ToolExplorer";
import { CATEGORIES, tools } from "@/lib/tools";
import { TOPIC_HUBS } from "@/lib/topics";
import { getAllComparisons } from "@/lib/tool-comparisons";

const SITE_URL = "https://codeutilo.com";

export const metadata: Metadata = {
  title: "Free Online Developer and AI Tools",
  description:
    "Browse free online developer, AI, privacy, and productivity tools. Fast browser-only processing with no data upload required.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "CodeUtilo - Free Online Developer and AI Tools",
    description:
      "Browse free online developer, AI, privacy, and productivity tools. Fast browser-only processing with no data upload required.",
    url: SITE_URL,
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeUtilo - Free Online Developer and AI Tools",
    description:
      "Browse free online developer, AI, privacy, and productivity tools. Fast browser-only processing with no data upload required.",
  },
};

const featuredSlugs = [
  "token-counter",
  "ai-cost-estimator",
  "prompt-policy-firewall",
  "llm-response-grader",
  "rag-context-relevance-scorer",
  "sensitive-data-pseudonymizer",
];

const featured = featuredSlugs
  .map((slug) => tools.find((tool) => tool.slug === slug))
  .filter((tool): tool is (typeof tools)[number] => Boolean(tool));

const categoryCounts = CATEGORIES.map((category) => ({
  ...category,
  count: tools.filter((tool) => tool.category === category.id).length,
}));

const topCategoryRows = categoryCounts
  .slice()
  .sort((a, b) => b.count - a.count)
  .slice(0, 4);

const featuredComparisons = getAllComparisons().slice(0, 4);

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-6 py-10 text-white shadow-xl sm:px-10">
        <div className="absolute -left-10 top-6 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative z-10">
          <p className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Browser-Only and Privacy First
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Free Online Developer and AI Tools
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-blue-100 sm:text-base">
            Run formatting, conversion, prompt QA, privacy checks, and productivity workflows directly in your
            browser. No sign-up and no server-side processing for tool input.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/category"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
            >
              Browse by category
            </Link>
            <Link
              href="/topics"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Open topic hubs
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-white/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              How CodeUtilo works
            </Link>
            <Link
              href="/compare"
              className="rounded-xl border border-white/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Compare tools
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topCategoryRows.map((row) => (
          <Link
            key={row.id}
            href={`/category/${row.id}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Category</p>
            <h2 className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">{row.name}</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{row.count} tools available</p>
          </Link>
        ))}
      </section>

      <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Topic Hubs</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Curated collections for high-intent workflows and stronger internal SEO clustering.
            </p>
          </div>
          <Link href="/topics" className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
            View all hubs
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {TOPIC_HUBS.map((hub) => (
            <Link
              key={hub.slug}
              href={`/topics/${hub.slug}`}
              className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-950"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{hub.name}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{hub.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tool Comparisons</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Side-by-side decision pages for similar AI and workflow tools.
            </p>
          </div>
          <Link
            href="/compare"
            className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
          >
            View all comparisons
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {featuredComparisons.map((comparison) => (
            <Link
              key={comparison.slug}
              href={`/compare/${comparison.slug}`}
              className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-950"
            >
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {comparison.leftTool.name} vs {comparison.rightTool.name}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{comparison.intent}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured AI and Privacy Tools</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              High-demand tools for prompt quality, grounding, and sensitive-data handling.
            </p>
          </div>
          <Link href="/category/text" className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
            View all AI text tools
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
            >
              <div className="mb-3 inline-flex rounded-lg bg-blue-50 px-2 py-1 font-mono text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {tool.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300">
                {tool.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <ToolExplorer />

      <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 text-sm leading-relaxed text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">SEO and Crawl-Friendly Structure</h2>
        <p>
          CodeUtilo organizes tools into crawlable categories and static pages so search engines can index specific
          user intents such as AI prompt testing, privacy utilities, and developer workflows.
        </p>
        <p className="mt-2">
          For best discovery, start from <Link className="font-semibold text-blue-700 dark:text-blue-300" href="/category">Categories</Link> and
          navigate to focused tool pages with canonical metadata and structured data.
        </p>
      </section>
    </div>
  );
}
