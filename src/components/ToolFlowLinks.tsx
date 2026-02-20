"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getToolFlowLinks } from "@/lib/tool-flow";

const blockedSlugs = new Set(["", "about", "privacy", "category", "topics"]);

export default function ToolFlowLinks() {
  const pathname = usePathname() || "";
  const slug = pathname.replace(/^\/+/, "").split("/")[0] || "";

  const links = useMemo(() => {
    if (!slug || blockedSlugs.has(slug)) {
      return { before: [], after: [] };
    }
    return getToolFlowLinks(slug, 3);
  }, [slug]);

  if (links.before.length === 0 && links.after.length === 0) return null;

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Workflow Links</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Suggested step-by-step tools based on this page intent.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Before This Tool
          </p>
          <div className="space-y-2">
            {links.before.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No earlier-step suggestions.</p>
            ) : (
              links.before.map((tool) => (
                <Link
                  key={`before-${tool.slug}`}
                  href={`/${tool.slug}`}
                  className="block rounded-lg border border-gray-200 p-3 text-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-950"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">{tool.name}</span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">{tool.description}</span>
                </Link>
              ))
            )}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Next Step Tools
          </p>
          <div className="space-y-2">
            {links.after.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No next-step suggestions.</p>
            ) : (
              links.after.map((tool) => (
                <Link
                  key={`after-${tool.slug}`}
                  href={`/${tool.slug}`}
                  className="block rounded-lg border border-gray-200 p-3 text-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-700 dark:hover:bg-blue-950"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">{tool.name}</span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">{tool.description}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
