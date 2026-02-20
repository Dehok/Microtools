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

const categoryFaqs: Record<string, { question: string; answer: string }[]> = {
  developer: [
    {
      question: "Which developer tools are most useful for API workflows?",
      answer:
        "JSON Formatter, API Response Mocker, JSON Schema tools, and output validation utilities are a strong baseline stack.",
    },
    {
      question: "Can I chain tools in this category?",
      answer: "Yes. Many developer tools are intended for step-by-step workflows such as parse, transform, validate, and test.",
    },
  ],
  text: [
    {
      question: "Do text tools support AI prompt workflows?",
      answer:
        "Yes. This category includes prompt linting, consistency checks, guardrail generation, and other AI-oriented text utilities.",
    },
    {
      question: "Are text transformations done locally?",
      answer: "Yes. Text input processing runs in the browser for privacy-friendly usage.",
    },
  ],
  converter: [
    {
      question: "Can I convert files without upload?",
      answer: "Most converter tools process files directly in-browser without remote upload.",
    },
    {
      question: "Which conversion flow is common?",
      answer: "Typical flows include source format cleanup, conversion, then validation or compression.",
    },
  ],
  generator: [
    {
      question: "What can generator tools produce?",
      answer: "Generators create IDs, templates, content blocks, configs, and utility assets with deterministic options.",
    },
    {
      question: "Are generated outputs reusable?",
      answer: "Yes. You can copy generated results and reuse them in docs, codebases, and workflows.",
    },
  ],
  crypto: [
    {
      question: "Does this category include privacy-focused tools?",
      answer:
        "Yes. It includes token scanners, redaction helpers, pseudonymization, and browser privacy diagnostics.",
    },
    {
      question: "Can these tools reduce AI data leakage risk?",
      answer:
        "Yes. Tools like Prompt Policy Firewall and Sensitive Data Pseudonymizer help remove risky content before model calls.",
    },
  ],
  media: [
    {
      question: "Are media tools browser-only?",
      answer:
        "Yes. Core image and media transformations are designed for local browser execution whenever supported by the browser.",
    },
    {
      question: "Can I chain media operations?",
      answer: "Yes. A common flow is convert, resize/compress, then export.",
    },
  ],
  calculator: [
    {
      question: "Are calculator results saved?",
      answer: "No. Calculations are performed instantly and locally without account storage.",
    },
    {
      question: "Can calculators be used for quick checks?",
      answer: "Yes. They are designed for rapid operational checks and planning estimates.",
    },
  ],
  legal: [
    {
      question: "Do legal tools replace professional advice?",
      answer: "No. They provide draft starting points and templates, not legal counsel.",
    },
    {
      question: "Can generated legal drafts be edited?",
      answer: "Yes. Generated text is editable and should be reviewed before final use.",
    },
  ],
  design: [
    {
      question: "What can design tools help with?",
      answer: "They help with color systems, gradients, typography pairings, and quick visual assets.",
    },
    {
      question: "Can outputs be copied directly?",
      answer: "Yes. Most design outputs are copy-ready for CSS and project assets.",
    },
  ],
  seo: [
    {
      question: "Which SEO tasks are covered?",
      answer: "Meta tags, sitemap generation, Open Graph previewing, and crawl-related utility tasks.",
    },
    {
      question: "Are SEO pages crawl-friendly?",
      answer: "Yes. Category and tool pages use canonical metadata and structured data for indexing clarity.",
    },
  ],
};

function getCategory(id: string) {
  return CATEGORIES.find((category) => category.id === id);
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const selected = getCategory(categorySlug);
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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const selected = getCategory(categorySlug);
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

  const faqItems = categoryFaqs[selected.id] || [];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
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

      {faqItems.length > 0 && (
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">{selected.name} FAQ</h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
                <summary className="cursor-pointer font-medium text-gray-800 group-hover:text-blue-700 dark:text-gray-200 dark:group-hover:text-blue-300">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </div>
  );
}
