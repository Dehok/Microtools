import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOPIC_HUBS, getTopicBySlug, getTopicTools } from "@/lib/topics";

const SITE_URL = "https://codeutilo.com";

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

  const topicTools = getTopicTools(topic.slug);
  const relatedHubs = TOPIC_HUBS.filter((hub) => hub.slug !== topic.slug).slice(0, 3);

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
          </div>
        </div>
      </section>

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
