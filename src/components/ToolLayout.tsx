import Link from "next/link";
import { tools } from "@/lib/tools";
import ToolFlowLinks from "@/components/ToolFlowLinks";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  relatedTools?: string[];
}

export default function ToolLayout({
  title,
  description,
  children,
  relatedTools = [],
}: ToolLayoutProps) {
  const related = tools.filter((t) => relatedTools.includes(t.slug));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">{description}</p>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        {children}
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Related Tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 transition-colors hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">{tool.name}</div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tool.description}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <ToolFlowLinks />
    </div>
  );
}
