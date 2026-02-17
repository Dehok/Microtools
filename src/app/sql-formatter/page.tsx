"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "LIKE", "BETWEEN",
  "JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN",
  "ON", "AS", "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "OFFSET",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
  "ALTER TABLE", "DROP TABLE", "CREATE INDEX", "UNION", "UNION ALL",
  "DISTINCT", "COUNT", "SUM", "AVG", "MIN", "MAX", "CASE", "WHEN", "THEN",
  "ELSE", "END", "IS NULL", "IS NOT NULL", "EXISTS", "WITH",
];

const NEWLINE_BEFORE = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING",
  "LIMIT", "OFFSET", "JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN",
  "FULL JOIN", "CROSS JOIN", "ON", "SET", "VALUES", "UNION", "UNION ALL",
  "INSERT INTO", "UPDATE", "DELETE FROM", "WITH",
];

function formatSQL(sql: string, indent: string): string {
  // Normalize whitespace
  let formatted = sql.replace(/\s+/g, " ").trim();

  // Add newlines before major keywords
  for (const kw of NEWLINE_BEFORE.sort((a, b) => b.length - a.length)) {
    const regex = new RegExp(`\\b(${kw})\\b`, "gi");
    formatted = formatted.replace(regex, `\n${kw}`);
  }

  // Indent sub-keywords
  const lines = formatted.split("\n").filter((l) => l.trim());
  const indented: string[] = [];
  const subKeywords = ["AND", "OR", "ON", "SET"];

  for (const line of lines) {
    const trimmed = line.trim();
    const firstWord = trimmed.split(/\s+/)[0].toUpperCase();
    const twoWords = trimmed.split(/\s+/).slice(0, 2).join(" ").toUpperCase();

    if (subKeywords.includes(firstWord) && !["ORDER BY", "GROUP BY"].includes(twoWords)) {
      indented.push(indent + trimmed);
    } else {
      indented.push(trimmed);
    }
  }

  // Uppercase keywords
  let result = indented.join("\n");
  for (const kw of KEYWORDS.sort((a, b) => b.length - a.length)) {
    const regex = new RegExp(`\\b(${kw})\\b`, "gi");
    result = result.replace(regex, kw);
  }

  return result;
}

function minifySQL(sql: string): string {
  return sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const SAMPLE = `select u.id, u.name, u.email, count(o.id) as order_count from users u left join orders o on u.id = o.user_id where u.active = 1 and o.created_at > '2024-01-01' group by u.id, u.name, u.email having count(o.id) > 5 order by order_count desc limit 10`;

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [indentSize, setIndentSize] = useState("  ");

  const formatted = useMemo(() => {
    if (!input.trim()) return "";
    return formatSQL(input, indentSize);
  }, [input, indentSize]);

  const minified = useMemo(() => {
    if (!input.trim()) return "";
    return minifySQL(input);
  }, [input]);

  return (
    <ToolLayout
      title="SQL Formatter & Beautifier Online"
      description="Format and beautify SQL queries with proper indentation and keyword highlighting. Minify SQL for production use."
      relatedTools={["json-formatter", "css-minifier", "diff-checker"]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">SQL Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL query here..."
            className="h-64 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs focus:border-blue-500 focus:outline-none"
            spellCheck={false}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setInput(SAMPLE)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Sample
            </button>
            <button
              onClick={() => setInput("")}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-xs"
            >
              <option value="  ">2 spaces</option>
              <option value="    ">4 spaces</option>
              <option value={"\t"}>Tab</option>
            </select>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Formatted</label>
            <CopyButton text={formatted} />
          </div>
          <textarea
            value={formatted}
            readOnly
            placeholder="Formatted SQL will appear here..."
            className="h-64 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-xs"
          />
        </div>
      </div>

      {/* Minified */}
      {minified && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Minified</label>
            <CopyButton text={minified} />
          </div>
          <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs text-gray-700 break-all">
            {minified}
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Why Format SQL?</h2>
        <p className="mb-3">
          Formatted SQL is easier to read, debug, and maintain. Proper indentation highlights
          the query structure, making JOINs, WHERE clauses, and subqueries immediately visible.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">SQL Formatting Best Practices</h2>
        <p>
          Place each major clause (SELECT, FROM, WHERE, JOIN) on its own line. Indent sub-clauses
          (AND, OR, ON). Use uppercase for SQL keywords. Align column lists and conditions for
          better readability.
        </p>
      </div>
    </ToolLayout>
  );
}
