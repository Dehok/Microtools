"use client";

interface HowToStep {
  title: string;
  details: string;
}

interface HowToBlockProps {
  title?: string;
  intro?: string;
  steps: HowToStep[];
  tips?: string[];
  schemaName: string;
  schemaUrl: string;
}

export default function HowToBlock({
  title = "How to use this tool",
  intro,
  steps,
  tips = [],
  schemaName,
  schemaUrl,
}: HowToBlockProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: schemaName,
    url: schemaUrl,
    description: intro || title,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.details,
    })),
  };

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      {intro && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{intro}</p>}

      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Step {index + 1}: {step.title}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{step.details}</p>
          </li>
        ))}
      </ol>

      {tips.length > 0 && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Pro Tips</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-800 dark:text-blue-200">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
