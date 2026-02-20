import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getComparisonBySlug } from "@/lib/tool-comparisons";
import { WORKFLOW_GUIDES, getWorkflowBySlug, getWorkflowTools } from "@/lib/workflows";

const SITE_URL = "https://codeutilo.com";

export function generateStaticParams() {
  return WORKFLOW_GUIDES.map((workflow) => ({ workflow: workflow.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ workflow: string }>;
}): Promise<Metadata> {
  const { workflow: workflowSlug } = await params;
  const workflow = getWorkflowBySlug(workflowSlug);
  if (!workflow) {
    return {
      title: "Workflow Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${SITE_URL}/workflows/${workflow.slug}`;
  return {
    title: workflow.title,
    description: workflow.description,
    alternates: { canonical },
    openGraph: {
      title: `${workflow.title} | CodeUtilo`,
      description: workflow.description,
      url: canonical,
      siteName: "CodeUtilo",
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${workflow.title} | CodeUtilo`,
      description: workflow.description,
    },
  };
}

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ workflow: string }>;
}) {
  const { workflow: workflowSlug } = await params;
  const workflow = getWorkflowBySlug(workflowSlug);
  if (!workflow) notFound();

  const workflowTools = getWorkflowTools(workflow.slug);
  const workflowComparisons = workflow.comparisonSlugs
    .map((slug) => getComparisonBySlug(slug))
    .filter((comparison): comparison is NonNullable<ReturnType<typeof getComparisonBySlug>> => Boolean(comparison));
  const relatedWorkflows = WORKFLOW_GUIDES.filter((item) => item.slug !== workflow.slug).slice(0, 3);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: workflow.title,
    itemListElement: workflowTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${SITE_URL}/${tool.slug}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: workflow.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: workflow.title,
    description: workflow.description,
    step: workflow.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: `${step.reason} ${step.outcome}`,
      url: `${SITE_URL}/${step.toolSlug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-blue-700 dark:hover:text-blue-300">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/workflows" className="hover:text-blue-700 dark:hover:text-blue-300">
          Workflows
        </Link>{" "}
        / <span>{workflow.name}</span>
      </nav>

      <header className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{workflow.title}</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{workflow.intro}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/category/ai"
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
          >
            AI category
          </Link>
          <Link
            href="/topics/ai-prompt-quality"
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
          >
            AI topic hub
          </Link>
          <Link
            href="/compare"
            className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
          >
            Compare guides
          </Link>
        </div>
      </header>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Workflow Focus</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
            {workflow.focusAreas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Links</h2>
          <div className="flex flex-wrap gap-2">
            {workflowTools.slice(0, 6).map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">Step-by-Step Workflow</h2>
        <ol className="space-y-3">
          {workflow.steps.map((step, index) => {
            const stepTool = workflowTools.find((tool) => tool.slug === step.toolSlug);
            return (
              <li key={step.title} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{step.reason}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{step.outcome}</p>
                {stepTool && (
                  <Link
                    href={`/${stepTool.slug}`}
                    className="mt-2 inline-flex text-xs font-medium text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                  >
                    Open {stepTool.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">Recommended Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflowTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 font-mono text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {tool.icon}
                </span>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-300">
                  {tool.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {workflowComparisons.length > 0 && (
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">Best Compare Guides</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {workflowComparisons.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="rounded-lg border border-gray-200 p-3 text-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-950"
              >
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {comparison.leftTool.name} vs {comparison.rightTool.name}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{comparison.intent}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">FAQ</h2>
        <div className="space-y-4">
          {workflow.faqs.map((faq) => (
            <details key={faq.question} className="group rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
              <summary className="cursor-pointer font-medium text-gray-800 group-hover:text-blue-700 dark:text-gray-200 dark:group-hover:text-blue-300">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Related Workflow Guides</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedWorkflows.map((item) => (
            <Link
              key={item.slug}
              href={`/workflows/${item.slug}`}
              className="rounded-lg border border-gray-200 p-3 text-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-950"
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
    </div>
  );
}

