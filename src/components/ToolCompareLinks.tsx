"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getComparisonsForTool } from "@/lib/tool-comparisons";

const blockedSlugs = new Set(["", "about", "privacy", "category", "topics", "compare"]);

export default function ToolCompareLinks() {
  const pathname = usePathname() || "";
  const slug = pathname.replace(/^\/+/, "").split("/")[0] || "";

  const comparisons = useMemo(() => {
    if (!slug || blockedSlugs.has(slug)) return [];
    return getComparisonsForTool(slug, 3);
  }, [slug]);

  if (comparisons.length === 0) return null;

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Compare With Similar Tools</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Decision pages to quickly see when to use each tool.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {comparisons.map((comparison) => (
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
    </div>
  );
}
