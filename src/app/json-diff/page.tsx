"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// --- Types ---

type DiffType = "added" | "removed" | "modified" | "unchanged";

interface DiffNode {
  key: string;
  type: DiffType;
  oldValue?: unknown;
  newValue?: unknown;
  children?: DiffNode[];
}

interface DiffStats {
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
}

interface DiffResult {
  diff: DiffNode[] | null;
  stats: DiffStats;
  error: string;
  summary: string;
}

// --- Diff algorithm ---

function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

function sortKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = obj[key];
  }
  return sorted;
}

function deepEqual(a: unknown, b: unknown, ignoreKeyOrder: boolean): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i], ignoreKeyOrder));
  }
  if (isObject(a) && isObject(b)) {
    const aObj = ignoreKeyOrder ? sortKeys(a) : a;
    const bObj = ignoreKeyOrder ? sortKeys(b) : b;
    const keysA = Object.keys(aObj);
    const keysB = Object.keys(bObj);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(
      (key) => key in bObj && deepEqual(aObj[key], bObj[key], ignoreKeyOrder)
    );
  }
  return false;
}

function computeDiffTree(
  oldVal: unknown,
  newVal: unknown,
  key: string,
  ignoreKeyOrder: boolean,
  stats: DiffStats
): DiffNode {
  // Both are objects
  if (isObject(oldVal) && isObject(newVal)) {
    const allKeys = new Set([
      ...Object.keys(oldVal),
      ...Object.keys(newVal),
    ]);
    const sortedKeys = ignoreKeyOrder
      ? [...allKeys].sort()
      : [...allKeys];
    const children: DiffNode[] = [];
    for (const k of sortedKeys) {
      const inOld = k in oldVal;
      const inNew = k in newVal;
      if (inOld && inNew) {
        children.push(
          computeDiffTree(oldVal[k], newVal[k], k, ignoreKeyOrder, stats)
        );
      } else if (inOld) {
        stats.removed++;
        children.push({ key: k, type: "removed", oldValue: oldVal[k] });
      } else {
        stats.added++;
        children.push({ key: k, type: "added", newValue: newVal[k] });
      }
    }
    const hasChanges = children.some((c) => c.type !== "unchanged");
    return {
      key,
      type: hasChanges ? "modified" : "unchanged",
      children,
    };
  }

  // Both are arrays
  if (Array.isArray(oldVal) && Array.isArray(newVal)) {
    const maxLen = Math.max(oldVal.length, newVal.length);
    const children: DiffNode[] = [];
    for (let i = 0; i < maxLen; i++) {
      if (i >= oldVal.length) {
        stats.added++;
        children.push({
          key: `[${i}]`,
          type: "added",
          newValue: newVal[i],
        });
      } else if (i >= newVal.length) {
        stats.removed++;
        children.push({
          key: `[${i}]`,
          type: "removed",
          oldValue: oldVal[i],
        });
      } else {
        children.push(
          computeDiffTree(oldVal[i], newVal[i], `[${i}]`, ignoreKeyOrder, stats)
        );
      }
    }
    const hasChanges = children.some((c) => c.type !== "unchanged");
    return {
      key,
      type: hasChanges ? "modified" : "unchanged",
      children,
    };
  }

  // Leaf comparison
  if (deepEqual(oldVal, newVal, ignoreKeyOrder)) {
    stats.unchanged++;
    return { key, type: "unchanged", oldValue: oldVal, newValue: newVal };
  } else {
    stats.modified++;
    return { key, type: "modified", oldValue: oldVal, newValue: newVal };
  }
}

function formatValue(val: unknown): string {
  if (val === undefined) return "undefined";
  if (typeof val === "string") return `"${val}"`;
  if (isObject(val) || Array.isArray(val)) {
    return JSON.stringify(val, null, 2);
  }
  return String(val);
}

function buildSummary(diff: DiffNode[], path: string = ""): string[] {
  const lines: string[] = [];
  for (const node of diff) {
    const currentPath = path ? `${path}.${node.key}` : node.key;
    if (node.type === "added") {
      lines.push(`+ ${currentPath}: ${formatValue(node.newValue)}`);
    } else if (node.type === "removed") {
      lines.push(`- ${currentPath}: ${formatValue(node.oldValue)}`);
    } else if (node.type === "modified" && node.children) {
      lines.push(...buildSummary(node.children, currentPath));
    } else if (node.type === "modified") {
      lines.push(
        `~ ${currentPath}: ${formatValue(node.oldValue)} => ${formatValue(node.newValue)}`
      );
    }
  }
  return lines;
}

// --- Tree view component ---

function DiffTreeNode({
  node,
  depth,
  showUnchanged,
  defaultExpanded,
}: {
  node: DiffNode;
  depth: number;
  showUnchanged: boolean;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!showUnchanged && node.type === "unchanged" && !node.children) {
    return null;
  }

  const hasChildren = node.children && node.children.length > 0;

  const bgColor =
    node.type === "added"
      ? "bg-green-50 dark:bg-green-950"
      : node.type === "removed"
      ? "bg-red-50 dark:bg-red-950"
      : node.type === "modified" && !hasChildren
      ? "bg-yellow-50 dark:bg-yellow-950"
      : "";

  const textColor =
    node.type === "added"
      ? "text-green-700 dark:text-green-300"
      : node.type === "removed"
      ? "text-red-700 dark:text-red-300"
      : node.type === "modified" && !hasChildren
      ? "text-yellow-700 dark:text-yellow-300"
      : "text-gray-600 dark:text-gray-400";

  const prefix =
    node.type === "added"
      ? "+"
      : node.type === "removed"
      ? "-"
      : node.type === "modified" && !hasChildren
      ? "~"
      : " ";

  const prefixColor =
    node.type === "added"
      ? "text-green-600 dark:text-green-400"
      : node.type === "removed"
      ? "text-red-600 dark:text-red-400"
      : node.type === "modified" && !hasChildren
      ? "text-yellow-600 dark:text-yellow-400"
      : "text-gray-400 dark:text-gray-500";

  const filteredChildren = hasChildren
    ? node.children!.filter(
        (c) => showUnchanged || c.type !== "unchanged" || c.children
      )
    : [];

  return (
    <div>
      <div
        className={`flex items-start border-b border-gray-100 dark:border-gray-800 font-mono text-sm ${bgColor}`}
        style={{ paddingLeft: `${depth * 20 + 4}px` }}
      >
        <span
          className={`w-4 shrink-0 select-none font-bold ${prefixColor}`}
        >
          {prefix}
        </span>
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mr-1 shrink-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 select-none w-4"
          >
            {expanded ? "\u25BC" : "\u25B6"}
          </button>
        ) : (
          <span className="mr-1 w-4 shrink-0" />
        )}
        <span className={`font-medium ${textColor}`}>{node.key}</span>
        {!hasChildren && node.type === "added" && (
          <span className="ml-2 text-green-600 dark:text-green-400">
            {formatValue(node.newValue)}
          </span>
        )}
        {!hasChildren && node.type === "removed" && (
          <span className="ml-2 text-red-600 dark:text-red-400 line-through">
            {formatValue(node.oldValue)}
          </span>
        )}
        {!hasChildren && node.type === "modified" && (
          <span className="ml-2">
            <span className="text-red-500 dark:text-red-400 line-through">
              {formatValue(node.oldValue)}
            </span>
            <span className="mx-1 text-gray-400 dark:text-gray-500">{"\u2192"}</span>
            <span className="text-green-600 dark:text-green-400">
              {formatValue(node.newValue)}
            </span>
          </span>
        )}
        {!hasChildren && node.type === "unchanged" && (
          <span className="ml-2 text-gray-400 dark:text-gray-500">
            {formatValue(node.oldValue)}
          </span>
        )}
        {hasChildren && (
          <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
            {node.type === "unchanged"
              ? "(no changes)"
              : `(${filteredChildren.length} ${filteredChildren.length === 1 ? "change" : "changes"})`}
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child, i) => (
            <DiffTreeNode
              key={`${child.key}-${i}`}
              node={child}
              depth={depth + 1}
              showUnchanged={showUnchanged}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Main component ---

export default function JsonDiff() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [ignoreKeyOrder, setIgnoreKeyOrder] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [showUnchanged, setShowUnchanged] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

  const result: DiffResult = useMemo(() => {
    const emptyStats: DiffStats = {
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 0,
    };

    if (!original.trim() && !modified.trim()) {
      return { diff: null, stats: emptyStats, error: "", summary: "" };
    }

    if (!original.trim()) {
      return {
        diff: null,
        stats: emptyStats,
        error: "Please enter the original JSON.",
        summary: "",
      };
    }

    if (!modified.trim()) {
      return {
        diff: null,
        stats: emptyStats,
        error: "Please enter the modified JSON.",
        summary: "",
      };
    }

    let parsedOld: unknown;
    let parsedNew: unknown;

    try {
      const origText = ignoreWhitespace
        ? original.replace(/\s+/g, " ").trim()
        : original;
      parsedOld = JSON.parse(origText);
    } catch {
      return {
        diff: null,
        stats: emptyStats,
        error: "Original JSON is invalid. Please check the syntax.",
        summary: "",
      };
    }

    try {
      const modText = ignoreWhitespace
        ? modified.replace(/\s+/g, " ").trim()
        : modified;
      parsedNew = JSON.parse(modText);
    } catch {
      return {
        diff: null,
        stats: emptyStats,
        error: "Modified JSON is invalid. Please check the syntax.",
        summary: "",
      };
    }

    if (deepEqual(parsedOld, parsedNew, ignoreKeyOrder)) {
      return {
        diff: [],
        stats: emptyStats,
        error: "",
        summary: "No differences found. Both JSON objects are identical.",
      };
    }

    const stats: DiffStats = {
      added: 0,
      removed: 0,
      modified: 0,
      unchanged: 0,
    };

    const rootNode = computeDiffTree(
      parsedOld,
      parsedNew,
      "(root)",
      ignoreKeyOrder,
      stats
    );

    const diffNodes = rootNode.children || [rootNode];
    const summaryLines = buildSummary(diffNodes);
    const summaryText = [
      `JSON Diff Summary`,
      `Added: ${stats.added} | Removed: ${stats.removed} | Modified: ${stats.modified} | Unchanged: ${stats.unchanged}`,
      `---`,
      ...summaryLines,
    ].join("\n");

    return { diff: diffNodes, stats, error: "", summary: summaryText };
  }, [original, modified, ignoreKeyOrder, ignoreWhitespace]);

  const handleClear = () => {
    setOriginal("");
    setModified("");
  };

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  const handleSample = () => {
    setOriginal(
      JSON.stringify(
        {
          name: "CodeUtilo",
          version: "1.0.0",
          tools: ["JSON Formatter", "Base64", "UUID"],
          config: { theme: "light", language: "en" },
          deprecated: true,
        },
        null,
        2
      )
    );
    setModified(
      JSON.stringify(
        {
          name: "CodeUtilo",
          version: "2.0.0",
          tools: ["JSON Formatter", "Base64", "UUID", "JSON Diff"],
          config: { theme: "dark", language: "en", beta: true },
          author: "Community",
        },
        null,
        2
      )
    );
  };

  const totalChanges = result.stats.added + result.stats.removed + result.stats.modified;

  return (
    <ToolLayout
      title="JSON Diff -- Compare Two JSON Objects Online"
      description="Compare two JSON objects and visualize the differences. Find added, removed, and modified keys with a tree diff view. Free online JSON comparison tool."
      relatedTools={["diff-checker", "json-formatter", "json-path-finder"]}
    >
      {/* Textareas side by side */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Original JSON
          </label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder='{"key": "value", ...}'
            className="h-56 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Modified JSON
          </label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder='{"key": "newValue", ...}'
            className="h-56 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Options */}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={ignoreKeyOrder}
            onChange={(e) => setIgnoreKeyOrder(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Ignore key order
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={ignoreWhitespace}
            onChange={(e) => setIgnoreWhitespace(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Ignore whitespace
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={showUnchanged}
            onChange={(e) => setShowUnchanged(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Show unchanged
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={expandAll}
            onChange={(e) => setExpandAll(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Expand all
        </label>
      </div>

      {/* Buttons */}
      <div className="my-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleSample}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Load Sample
        </button>
        <button
          onClick={handleSwap}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Swap
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        {result.summary && <CopyButton text={result.summary} />}
      </div>

      {/* Error */}
      {result.error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          {result.error}
        </div>
      )}

      {/* Stats bar */}
      {result.diff !== null && (
        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 font-medium text-green-700 dark:text-green-300">
            +{result.stats.added} added
          </span>
          <span className="rounded-full bg-red-100 dark:bg-red-900 px-3 py-1 font-medium text-red-700 dark:text-red-300">
            -{result.stats.removed} removed
          </span>
          <span className="rounded-full bg-yellow-100 dark:bg-yellow-900 px-3 py-1 font-medium text-yellow-700 dark:text-yellow-300">
            ~{result.stats.modified} modified
          </span>
          <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 font-medium text-gray-500 dark:text-gray-400">
            {result.stats.unchanged} unchanged
          </span>
        </div>
      )}

      {/* Diff tree */}
      {result.diff !== null && result.diff.length === 0 && (
        <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 p-4 text-center text-sm text-green-700 dark:text-green-300">
          Both JSON objects are identical. No differences found.
        </div>
      )}

      {result.diff !== null && result.diff.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            {result.diff.map((node, i) => (
              <DiffTreeNode
                key={`${node.key}-${i}`}
                node={node}
                depth={0}
                showUnchanged={showUnchanged}
                defaultExpanded={expandAll}
              />
            ))}
          </div>
          {totalChanges > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
              {totalChanges} {totalChanges === 1 ? "difference" : "differences"} found
            </div>
          )}
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What is JSON Diff?
        </h2>
        <p className="mb-3">
          JSON Diff is a tool that compares two JSON objects and highlights
          the structural differences between them. Unlike plain text diff, it
          understands the JSON structure and can show exactly which keys were
          added, removed, or had their values changed. This makes it ideal for
          comparing API responses, configuration files, database records, and
          any other JSON data.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How does the comparison work?
        </h2>
        <p className="mb-3">
          The tool recursively walks both JSON trees simultaneously. For each
          key, it determines whether the key exists only in the original
          (removed), only in the modified version (added), or in both but with
          different values (modified). Arrays are compared by index. The result
          is displayed as an interactive tree view with color-coded differences:
          green for added, red for removed, and yellow for modified values.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Options explained
        </h2>
        <ul className="mb-3 list-disc pl-5 space-y-1">
          <li>
            <strong>Ignore key order</strong> &mdash; Treats objects with the
            same keys but in different order as equal.
          </li>
          <li>
            <strong>Ignore whitespace</strong> &mdash; Normalizes whitespace
            before parsing, useful when comparing formatted vs. minified JSON.
          </li>
          <li>
            <strong>Show unchanged</strong> &mdash; Displays keys that are
            identical in both versions.
          </li>
          <li>
            <strong>Expand all</strong> &mdash; Expands all tree nodes by
            default for a full overview.
          </li>
        </ul>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Common use cases
        </h2>
        <p className="mb-3">
          Comparing REST API responses across environments, reviewing
          configuration changes before deployment, debugging data
          transformations, verifying database migration results, and tracking
          changes in JSON-based settings files.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">FAQ</h2>
        <p className="mb-1 font-medium">Is my data safe?</p>
        <p className="mb-3">
          Yes. All comparison happens entirely in your browser. No data is
          sent to any server.
        </p>
        <p className="mb-1 font-medium">Can it compare nested objects?</p>
        <p className="mb-3">
          Yes. The tool recursively compares deeply nested objects and arrays
          at any depth level, showing differences at each level of the tree.
        </p>
        <p className="mb-1 font-medium">What about large JSON files?</p>
        <p>
          The tool handles reasonably large JSON structures efficiently since
          all processing happens client-side. For extremely large files
          (several MB), performance may vary depending on your browser.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the JSON Diff free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the JSON Diff is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is my data safe when using this tool?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool work on mobile devices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The JSON Diff is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The JSON Diff runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
