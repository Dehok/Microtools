import type { Metadata } from "next";
import Link from "next/link";
import { WORKFLOW_GUIDES, getWorkflowTools } from "@/lib/workflows";

const SITE_URL = "https://codeutilo.com";

export const metadata: Metadata = {
  title: "AI Workflow Guides",
  description:
    "Step-by-step AI workflow guides for prompt release checks, RAG grounding audits, output validation, safety hardening, and regression debugging.",
  alternates: {
    canonical: `${SITE_URL}/workflows`,
  },
  openGraph: {
    title: "AI Workflow Guides | CodeUtilo",
    description:
      "Step-by-step AI workflow guides for prompt release checks, RAG grounding audits, output validation, safety hardening, and regression debugging.",
    url: `${SITE_URL}/workflows`,
    siteName: "CodeUtilo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Workflow Guides | CodeUtilo",
    description:
      "Step-by-step AI workflow guides for prompt release checks, RAG grounding audits, output validation, safety hardening, and regression debugging.",
  },
};

export default function WorkflowsIndexPage() {
  const rows = WORKFLOW_GUIDES.map((workflow) => ({
    ...workflow,
    tools: getWorkflowTools(workflow.slug),
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "CodeUtilo AI Workflow Guides",
    itemListElement: rows.map((row, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: row.title,
      url: `${SITE_URL}/workflows/${row.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">AI Workflow Guides</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          Practical workflow landing pages for high-intent AI tasks. Use these guides to choose the right tools and
          run repeatable quality, safety, and reliability processes.
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
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {row.tools.length} recommended tools and {row.steps.length} workflow steps
            </p>
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
              href={`/workflows/${row.slug}`}
              className="mt-4 inline-flex rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
            >
              Open workflow
            </Link>
          </article>
        ))}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}

