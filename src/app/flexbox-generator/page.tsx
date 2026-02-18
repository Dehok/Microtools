"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface FlexChild {
  id: number;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  order: number;
  alignSelf: string;
}

const ITEM_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#14b8a6",
  "#6366f1",
  "#e11d48",
  "#84cc16",
];

const FLEX_DIRECTION_OPTIONS = ["row", "column", "row-reverse", "column-reverse"];
const JUSTIFY_CONTENT_OPTIONS = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"];
const ALIGN_ITEMS_OPTIONS = ["stretch", "flex-start", "center", "flex-end", "baseline"];
const FLEX_WRAP_OPTIONS = ["nowrap", "wrap", "wrap-reverse"];
const ALIGN_SELF_OPTIONS = ["auto", "flex-start", "center", "flex-end", "stretch", "baseline"];

let nextId = 4;

export default function FlexboxGenerator() {
  const [flexDirection, setFlexDirection] = useState("row");
  const [justifyContent, setJustifyContent] = useState("flex-start");
  const [alignItems, setAlignItems] = useState("stretch");
  const [flexWrap, setFlexWrap] = useState("nowrap");
  const [gap, setGap] = useState(10);

  const [children, setChildren] = useState<FlexChild[]>([
    { id: 1, flexGrow: 0, flexShrink: 1, flexBasis: "auto", order: 0, alignSelf: "auto" },
    { id: 2, flexGrow: 0, flexShrink: 1, flexBasis: "auto", order: 0, alignSelf: "auto" },
    { id: 3, flexGrow: 0, flexShrink: 1, flexBasis: "auto", order: 0, alignSelf: "auto" },
  ]);

  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  const addChild = () => {
    if (children.length >= 12) return;
    setChildren([
      ...children,
      { id: nextId++, flexGrow: 0, flexShrink: 1, flexBasis: "auto", order: 0, alignSelf: "auto" },
    ]);
  };

  const removeChild = (id: number) => {
    if (children.length <= 1) return;
    setChildren(children.filter((c) => c.id !== id));
    if (selectedChild === id) setSelectedChild(null);
  };

  const updateChild = (id: number, field: keyof FlexChild, value: string | number) => {
    setChildren(children.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const css = useMemo(() => {
    const containerLines: string[] = [
      "display: flex;",
      `flex-direction: ${flexDirection};`,
      `justify-content: ${justifyContent};`,
      `align-items: ${alignItems};`,
      `flex-wrap: ${flexWrap};`,
      `gap: ${gap}px;`,
    ];

    const itemLines: string[] = [];
    children.forEach((child, index) => {
      const props: string[] = [];
      if (child.flexGrow !== 0) props.push(`  flex-grow: ${child.flexGrow};`);
      if (child.flexShrink !== 1) props.push(`  flex-shrink: ${child.flexShrink};`);
      if (child.flexBasis !== "auto") props.push(`  flex-basis: ${child.flexBasis};`);
      if (child.order !== 0) props.push(`  order: ${child.order};`);
      if (child.alignSelf !== "auto") props.push(`  align-self: ${child.alignSelf};`);

      if (props.length > 0) {
        itemLines.push(`\n.item-${index + 1} {`);
        itemLines.push(...props);
        itemLines.push("}");
      }
    });

    return `.container {\n  ${containerLines.join("\n  ")}\n}${itemLines.join("\n")}`;
  }, [flexDirection, justifyContent, alignItems, flexWrap, gap, children]);

  const selectedChildData = useMemo(() => {
    if (selectedChild === null) return null;
    return children.find((c) => c.id === selectedChild) ?? null;
  }, [selectedChild, children]);

  return (
    <ToolLayout
      title="CSS Flexbox Generator"
      description="Build flexbox layouts visually. Adjust container and item properties, preview in real time, and copy the generated CSS code."
      relatedTools={["css-grid-generator", "box-shadow-generator", "css-minifier"]}
    >
      {/* Preview */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Preview</h3>
          <div className="flex gap-2">
            <button
              onClick={addChild}
              disabled={children.length >= 12}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-40"
            >
              + Add Item
            </button>
          </div>
        </div>
        <div
          className="min-h-[200px] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-4"
          style={{
            display: "flex",
            flexDirection: flexDirection as React.CSSProperties["flexDirection"],
            justifyContent,
            alignItems,
            flexWrap: flexWrap as React.CSSProperties["flexWrap"],
            gap: `${gap}px`,
          }}
        >
          {children.map((child, index) => (
            <div
              key={child.id}
              onClick={() => setSelectedChild(selectedChild === child.id ? null : child.id)}
              className={`flex min-h-[60px] min-w-[60px] cursor-pointer items-center justify-center rounded-lg text-sm font-bold text-white transition-all ${
                selectedChild === child.id ? "ring-2 ring-offset-2 ring-gray-900" : ""
              }`}
              style={{
                backgroundColor: ITEM_COLORS[index % ITEM_COLORS.length],
                flexGrow: child.flexGrow,
                flexShrink: child.flexShrink,
                flexBasis: child.flexBasis,
                order: child.order,
                alignSelf: child.alignSelf === "auto" ? undefined : child.alignSelf,
                padding: "12px 20px",
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Click an item to edit its individual properties.</p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        {/* Container Controls */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Container Properties</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">flex-direction</label>
              <select
                value={flexDirection}
                onChange={(e) => setFlexDirection(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {FLEX_DIRECTION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">justify-content</label>
              <select
                value={justifyContent}
                onChange={(e) => setJustifyContent(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {JUSTIFY_CONTENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">align-items</label>
              <select
                value={alignItems}
                onChange={(e) => setAlignItems(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {ALIGN_ITEMS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">flex-wrap</label>
              <select
                value={flexWrap}
                onChange={(e) => setFlexWrap(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {FLEX_WRAP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                gap
                <span className="font-mono text-gray-500 dark:text-gray-400">{gap}px</span>
              </label>
              <input
                type="range"
                min={0}
                max={50}
                value={gap}
                onChange={(e) => setGap(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Child Item Controls */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Item Properties
            {selectedChildData && (
              <span className="ml-2 font-normal text-gray-500 dark:text-gray-400">
                — Item {children.findIndex((c) => c.id === selectedChild) + 1}
              </span>
            )}
          </h3>

          {selectedChildData ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  flex-grow
                  <span className="font-mono text-gray-500 dark:text-gray-400">{selectedChildData.flexGrow}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={selectedChildData.flexGrow}
                  onChange={(e) => updateChild(selectedChildData.id, "flexGrow", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  flex-shrink
                  <span className="font-mono text-gray-500 dark:text-gray-400">{selectedChildData.flexShrink}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={selectedChildData.flexShrink}
                  onChange={(e) => updateChild(selectedChildData.id, "flexShrink", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">flex-basis</label>
                <input
                  type="text"
                  value={selectedChildData.flexBasis}
                  onChange={(e) => updateChild(selectedChildData.id, "flexBasis", e.target.value)}
                  placeholder="auto, 100px, 50%, etc."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                  order
                  <span className="font-mono text-gray-500 dark:text-gray-400">{selectedChildData.order}</span>
                </label>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  value={selectedChildData.order}
                  onChange={(e) => updateChild(selectedChildData.id, "order", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">align-self</label>
                <select
                  value={selectedChildData.alignSelf}
                  onChange={(e) => updateChild(selectedChildData.id, "alignSelf", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {ALIGN_SELF_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => removeChild(selectedChildData.id)}
                disabled={children.length <= 1}
                className="mt-2 w-full rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-950 dark:hover:bg-red-950 disabled:opacity-40"
              >
                Remove Item
              </button>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 text-sm text-gray-500 dark:text-gray-400">
              Click an item in the preview to edit its properties.
            </div>
          )}
        </div>
      </div>

      {/* CSS output */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</label>
          <CopyButton text={css} />
        </div>
        <pre className="mt-1 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 p-3 font-mono text-sm text-green-400">
          {css}
        </pre>
      </div>

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">CSS Flexbox Layout</h2>
        <p className="mb-3">
          <strong>CSS Flexbox</strong> (Flexible Box Layout) is a one-dimensional layout model that
          distributes space among items in a container. It excels at aligning items horizontally or
          vertically, handling dynamic sizing, and reordering elements without changing the HTML.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Container Properties</h2>
        <p className="mb-3">
          The <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">flex-direction</code> property
          sets the main axis direction (<code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">row</code>,{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">column</code>, or their reverse
          variants). Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">justify-content</code>{" "}
          to distribute items along the main axis, and{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">align-items</code> for cross-axis
          alignment. The <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">gap</code> property
          adds consistent spacing between items.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Item Properties</h2>
        <p className="mb-3">
          Each flex item can override container alignment with{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">align-self</code>. The{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">flex-grow</code> property controls
          how much an item grows to fill available space, while{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">flex-shrink</code> determines how
          it shrinks. Use <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">flex-basis</code>{" "}
          to set the initial size before growing or shrinking, and{" "}
          <code className="rounded bg-gray-100 dark:bg-gray-800 px-1 py-0.5 text-xs">order</code> to rearrange items
          visually.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Flexbox vs Grid</h2>
        <p>
          Flexbox is ideal for <strong>one-dimensional</strong> layouts (a single row or column),
          while CSS Grid handles <strong>two-dimensional</strong> layouts (rows and columns
          simultaneously). In practice, they complement each other -- use Flexbox for navigation
          bars, card rows, and alignment tasks, and Grid for full page layouts and complex grids.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The CSS Flexbox Generator is a free online tool available on CodeUtilo. Generate CSS flexbox layouts with a visual editor. Set direction, alignment, and wrapping. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All css flexbox generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the css flexbox generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the css flexbox generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the css flexbox generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
