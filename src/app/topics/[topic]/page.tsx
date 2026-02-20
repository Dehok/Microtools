import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tools } from "@/lib/tools";
import { TOPIC_HUBS, getTopicBySlug, getTopicTools } from "@/lib/topics";
import { getComparisonBySlug } from "@/lib/tool-comparisons";

const SITE_URL = "https://codeutilo.com";
const AI_TOPIC_SLUG = "ai-prompt-quality";

interface TopicUseCaseSection {
  id: string;
  title: string;
  description: string;
  toolSlugs: string[];
  compareSlugs: string[];
}

interface TopicWorkflow {
  id: string;
  title: string;
  summary: string;
  steps: { label: string; href: string; note: string }[];
}

const AI_USE_CASE_SECTIONS: TopicUseCaseSection[] = [
  {
    id: "qa",
    title: "Prompt QA and Evaluation",
    description: "Draft quality checks, deterministic tests, and release-gate scoring before deployment.",
    toolSlugs: [
      "prompt-linter",
      "prompt-test-case-generator",
      "llm-response-grader",
      "prompt-versioning-regression-dashboard",
      "eval-results-comparator",
      "ai-qa-workflow-runner",
    ],
    compareSlugs: [
      "prompt-test-case-generator-vs-llm-response-grader",
      "ai-qa-workflow-runner-vs-eval-results-comparator",
      "prompt-versioning-regression-dashboard-vs-prompt-ab-test-matrix",
    ],
  },
  {
    id: "safety",
    title: "Safety and Guardrails",
    description: "Policy checks, jailbreak resilience, and reusable guardrail packs for safer prompt operations.",
    toolSlugs: [
      "prompt-policy-firewall",
      "prompt-security-scanner",
      "prompt-guardrail-pack-composer",
      "jailbreak-replay-lab",
      "agent-safety-checklist",
      "hallucination-guardrail-builder",
    ],
    compareSlugs: [
      "prompt-guardrail-pack-composer-vs-prompt-policy-firewall",
      "prompt-policy-firewall-vs-agent-safety-checklist",
      "prompt-security-scanner-vs-secret-detector-for-code-snippets",
    ],
  },
  {
    id: "rag",
    title: "RAG and Grounding",
    description: "Retrieval chunk tuning, grounding checks, and claim-to-evidence review for factual reliability.",
    toolSlugs: [
      "rag-chunking-simulator",
      "rag-noise-pruner",
      "rag-context-relevance-scorer",
      "claim-evidence-matrix",
      "grounded-answer-citation-checker",
    ],
    compareSlugs: [
      "rag-noise-pruner-vs-rag-chunking-simulator",
      "claim-evidence-matrix-vs-grounded-answer-citation-checker",
      "grounded-answer-citation-checker-vs-hallucination-risk-checklist",
    ],
  },
  {
    id: "ops",
    title: "Ops and Structured Output",
    description: "Run-level comparisons, contract validation, and schema-safe output workflows for production ops.",
    toolSlugs: [
      "ai-reliability-scorecard",
      "output-contract-tester",
      "json-output-guard",
      "function-calling-schema-tester",
      "context-window-packer",
      "ai-cost-estimator",
    ],
    compareSlugs: [
      "output-contract-tester-vs-function-calling-schema-tester",
      "json-output-guard-vs-function-calling-schema-tester",
      "ai-qa-workflow-runner-vs-ai-reliability-scorecard",
    ],
  },
];

const AI_WORKFLOWS: TopicWorkflow[] = [
  {
    id: "quick-qa",
    title: "Quick QA Flow (10-20 min)",
    summary: "Fast pre-ship check for prompt quality, output stability, and citation grounding.",
    steps: [
      { label: "Prompt Linter", href: "/prompt-linter", note: "Catch ambiguity and weak constraints first." },
      {
        label: "Prompt Test Case Generator",
        href: "/prompt-test-case-generator",
        note: "Build deterministic records for quick repeatable checks.",
      },
      { label: "LLM Response Grader", href: "/llm-response-grader", note: "Score output quality against rubric." },
      {
        label: "Answer Consistency Checker",
        href: "/answer-consistency-checker",
        note: "Verify multiple responses stay aligned.",
      },
      {
        label: "Grounded Answer Citation Checker",
        href: "/grounded-answer-citation-checker",
        note: "Validate claims against cited evidence.",
      },
    ],
  },
  {
    id: "production-release",
    title: "Production Release Flow",
    summary: "Release-gate sequence for baseline/candidate changes with policy and jailbreak checks.",
    steps: [
      {
        label: "Prompt Versioning + Regression Dashboard",
        href: "/prompt-versioning-regression-dashboard",
        note: "Track drift across prompt snapshots.",
      },
      {
        label: "Prompt Regression Suite Builder",
        href: "/prompt-regression-suite-builder",
        note: "Generate deterministic suite artifacts.",
      },
      {
        label: "Prompt Policy Firewall",
        href: "/prompt-policy-firewall",
        note: "Apply allow/review/block policy checks.",
      },
      {
        label: "Jailbreak Replay Lab",
        href: "/jailbreak-replay-lab",
        note: "Score defense outcomes against attack replay cases.",
      },
      {
        label: "AI QA Workflow Runner",
        href: "/ai-qa-workflow-runner",
        note: "Aggregate stage metrics into Ship/Review/Block.",
      },
      {
        label: "AI Reliability Scorecard",
        href: "/ai-reliability-scorecard",
        note: "Produce final readiness summary for release review.",
      },
    ],
  },
  {
    id: "incident-debug",
    title: "Incident and Debug Flow",
    summary: "When quality drops or hallucinations increase, isolate regressions and harden guardrails quickly.",
    steps: [
      {
        label: "Eval Results Comparator",
        href: "/eval-results-comparator",
        note: "Pinpoint baseline vs candidate regressions.",
      },
      {
        label: "Prompt Security Scanner",
        href: "/prompt-security-scanner",
        note: "Detect new risky phrases and leakage patterns.",
      },
      {
        label: "Hallucination Risk Checklist",
        href: "/hallucination-risk-checklist",
        note: "Estimate current exposure and hardening priorities.",
      },
      {
        label: "Claim Evidence Matrix",
        href: "/claim-evidence-matrix",
        note: "Review unsupported claims at evidence level.",
      },
      {
        label: "Prompt Guardrail Pack Composer",
        href: "/prompt-guardrail-pack-composer",
        note: "Roll out stronger refusal, uncertainty, and citation modules.",
      },
    ],
  },
];

export function generateStaticParams() {
  return TOPIC_HUBS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getTopicBySlug(topicSlug);
  if (!topic) {
    return {
      title: "Topic Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${SITE_URL}/topics/${topic.slug}`;
  return {
    title: topic.title,
    description: topic.description,
    alternates: { canonical },
    openGraph: {
      title: `${topic.title} | CodeUtilo`,
      description: topic.description,
      url: canonical,
      siteName: "CodeUtilo",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${topic.title} | CodeUtilo`,
      description: topic.description,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicSlug } = await params;
  const topic = getTopicBySlug(topicSlug);
  if (!topic) notFound();

  const isAiTopicHub = topic.slug === AI_TOPIC_SLUG;
  const topicTools = getTopicTools(topic.slug);
  const relatedHubs = TOPIC_HUBS.filter((hub) => hub.slug !== topic.slug).slice(0, 3);
  const aiUseCaseRows = isAiTopicHub
    ? AI_USE_CASE_SECTIONS.map((section) => ({
        ...section,
        items: section.toolSlugs
          .map((slug) => tools.find((tool) => tool.slug === slug))
          .filter((tool): tool is (typeof tools)[number] => Boolean(tool)),
        comparisons: section.compareSlugs
          .map((slug) => getComparisonBySlug(slug))
          .filter((comparison): comparison is NonNullable<ReturnType<typeof getComparisonBySlug>> =>
            Boolean(comparison)
          ),
      }))
    : [];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: topic.title,
    itemListElement: topicTools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${SITE_URL}/${tool.slug}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topic.faqs.map((faq) => ({
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
        <Link href="/topics" className="hover:text-blue-700 dark:hover:text-blue-300">
          Topics
        </Link>{" "}
        / <span>{topic.name}</span>
      </nav>

      <header className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{topic.title}</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{topic.intro}</p>
      </header>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Focus Areas</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
            {topic.focusAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Links</h2>
          <div className="flex flex-wrap gap-2">
            {relatedHubs.map((hub) => (
              <Link
                key={hub.slug}
                href={`/topics/${hub.slug}`}
                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
              >
                {hub.name}
              </Link>
            ))}
            <Link
              href="/category"
              className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
            >
              All categories
            </Link>
            {isAiTopicHub && (
              <>
                <Link
                  href="/category/ai"
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
                >
                  AI category
                </Link>
                <Link
                  href="/compare"
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
                >
                  Compare tools
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {isAiTopicHub && (
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AI Use-Case Sections</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Choose a lane based on your immediate goal: quality checks, safety hardening, grounding, or production ops.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {aiUseCaseRows.map((section) => (
              <article key={section.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{section.title}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                <div className="mt-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Tools
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {section.items.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/${tool.slug}`}
                        className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:border-blue-300 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
                {section.comparisons.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Compare Guides
                    </p>
                    <div className="space-y-1.5">
                      {section.comparisons.map((comparison) => (
                        <Link
                          key={comparison.slug}
                          href={`/compare/${comparison.slug}`}
                          className="block text-xs text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                        >
                          {comparison.leftTool.name} vs {comparison.rightTool.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {isAiTopicHub && (
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recommended Workflows</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Practical step-by-step flows for quick checks, production releases, and incident response.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {AI_WORKFLOWS.map((flow) => (
              <article key={flow.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{flow.title}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{flow.summary}</p>
                <ol className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {flow.steps.map((step, index) => (
                    <li key={step.href + step.label}>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {index + 1}.{" "}
                        <Link
                          href={step.href}
                          className="text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                        >
                          {step.label}
                        </Link>
                      </p>
                      <p className="text-xs">{step.note}</p>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">Recommended Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topicTools.map((tool) => (
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

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">FAQ</h2>
        <div className="space-y-4">
          {topic.faqs.map((faq) => (
            <details key={faq.question} className="group rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
              <summary className="cursor-pointer font-medium text-gray-800 group-hover:text-blue-700 dark:text-gray-200 dark:group-hover:text-blue-300">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}
