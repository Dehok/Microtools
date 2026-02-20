"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, tools } from "@/lib/tools";

export default function ToolExplorer() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const base = activeCategory ? tools.filter((tool) => tool.category === activeCategory) : tools;
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (tool) => tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q)
    );
  }, [activeCategory, query]);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tool Explorer</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Search and filter all tools without leaving the page.
          </p>
        </div>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools by name or description..."
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-400 md:w-80"
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            activeCategory === null
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:bg-blue-950"
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === category.id
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:bg-blue-950"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{filteredTools.length} tools shown</span>
        {(activeCategory || query) && (
          <button
            type="button"
            onClick={() => {
              setActiveCategory(null);
              setQuery("");
            }}
            className="rounded-lg border border-gray-200 px-2 py-1 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
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
  );
}
