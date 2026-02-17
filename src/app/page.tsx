import Link from "next/link";
import { tools, CATEGORIES } from "@/lib/tools";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold text-gray-900 sm:text-5xl">
          Free Online <span className="text-blue-600">Developer Tools</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Fast, free, and private. All tools run directly in your browser — no
          data is ever sent to a server.
        </p>
      </div>

      {/* Categories */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <span
            key={cat.id}
            className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700"
          >
            {cat.icon} {cat.name}
          </span>
        ))}
      </div>

      {/* Tools grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 font-mono text-sm font-bold text-blue-600">
                {tool.icon}
              </span>
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                {tool.name}
              </h2>
            </div>
            <p className="text-sm text-gray-500">{tool.description}</p>
          </Link>
        ))}
      </div>

      {/* Bottom SEO text */}
      <div className="mt-16 text-center text-sm text-gray-400">
        <p>
          MicroTools provides free online utilities for developers, designers,
          and content creators. Built with privacy in mind — all processing
          happens locally in your browser.
        </p>
      </div>
    </div>
  );
}
