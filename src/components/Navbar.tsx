"use client";

import Link from "next/link";
import { useState } from "react";
import { tools } from "@/lib/tools";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = search.length > 0
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-gray-900">
          <span className="text-blue-600">Code</span>Utilo
        </Link>

        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(e.target.value.length > 0);
            }}
            onFocus={() => search.length > 0 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            className="w-64 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          />
          {open && filtered.length > 0 && (
            <div className="absolute top-full mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
              {filtered.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="block px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => {
                    setSearch("");
                    setOpen(false);
                  }}
                >
                  <span className="font-medium">{tool.name}</span>
                  <span className="ml-2 text-gray-500">{tool.description.slice(0, 50)}...</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            All Tools
          </Link>
        </div>
      </div>
    </nav>
  );
}
