"use client";

import { useState, useEffect, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface KeyEvent {
  key: string;
  code: string;
  keyCode: number;
  which: number;
  location: number;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  timestamp: number;
}

const LOCATION_LABELS: Record<number, string> = {
  0: "Standard (0)",
  1: "Left (1)",
2: "Right (2)",
  3: "Numpad (3)",
};

function formatKey(key: string): string {
  if (key === " ") return "Space";
  return key;
}

function formatModifiers(event: KeyEvent): string {
  const mods: string[] = [];
  if (event.ctrlKey) mods.push("Ctrl");
  if (event.shiftKey) mods.push("Shift");
  if (event.altKey) mods.push("Alt");
  if (event.metaKey) mods.push("Meta");
  return mods.length > 0 ? mods.join(" + ") : "None";
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", fractionalSecondDigits: 3 });
}

export default function KeyboardEventTesterPage() {
  const [currentEvent, setCurrentEvent] = useState<KeyEvent | null>(null);
  const [history, setHistory] = useState<KeyEvent[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent | React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const event: KeyEvent = {
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      which: e.which,
      location: e.location,
      shiftKey: e.shiftKey,
      ctrlKey: e.ctrlKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      timestamp: Date.now(),
    };
    setCurrentEvent(event);
    setHistory((prev) => [event, ...prev].slice(0, 10));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentEvent(null);
  }, []);

  return (
    <ToolLayout
      title="Keyboard Event Tester"
      description="Test and inspect keyboard events in real time. See key names, codes, keyCodes, modifiers, and locations for any key press."
      relatedTools={["unicode-lookup", "screen-resolution-info", "text-to-binary"]}
    >
      <div className="space-y-6">

        {/* Key press area */}
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown as unknown as React.KeyboardEventHandler<HTMLDivElement>}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full rounded-xl border-2 cursor-pointer select-none transition-all duration-150 outline-none flex flex-col items-center justify-center py-10 px-4 min-h-[160px]
            ${isFocused
              ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
              : "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 dark:bg-gray-800/40 hover:border-blue-400"
            }`}
          aria-label="Keyboard event capture area. Click to focus, then press any key."
        >
          {!currentEvent ? (
            <div className="text-center">
              <div className="text-5xl mb-3 opacity-30">⌨</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                {isFocused ? "Press any key..." : "Click here, then press any key"}
              </p>
              {!isFocused && (
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Click or tap this area to focus it
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-7xl font-bold text-blue-600 dark:text-blue-400 tracking-tight mb-1 leading-none">
                {formatKey(currentEvent.key).length <= 2
                  ? formatKey(currentEvent.key)
                  : (
                    <span className="text-4xl">{formatKey(currentEvent.key)}</span>
                  )}
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                {isFocused ? "Press another key to update" : "Click to focus again"}
              </p>
            </div>
          )}
        </div>

        {/* Current event details */}
        {currentEvent && (
          <div className="space-y-4">

            {/* Modifier keys */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Modifier Keys
              </h2>
              <div className="flex flex-wrap gap-2">
                {(["Shift", "Ctrl", "Alt", "Meta"] as const).map((mod) => {
                  const active =
                    mod === "Shift" ? currentEvent.shiftKey :
                    mod === "Ctrl" ? currentEvent.ctrlKey :
                    mod === "Alt" ? currentEvent.altKey :
                    currentEvent.metaKey;
                  return (
                    <span
                      key={mod}
                      className={`px-4 py-1.5 rounded-full font-mono font-semibold text-sm border transition-colors
                        ${active
                          ? "bg-blue-600 text-white border-blue-600 shadow"
                          : "bg-white dark:bg-gray-900 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700"
                        }`}
                    >
                      {mod}
                      {mod === "Meta" && (
                        <span className="ml-1 font-normal opacity-70 text-xs">(Cmd/Win)</span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Event properties table */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Event Properties
              </h2>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-2 font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-300 w-1/3">Property</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-300">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr className="hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-mono text-blue-700 dark:text-blue-300 dark:text-blue-400">event.key</td>
                      <td className="px-4 py-2.5 font-mono text-gray-800 dark:text-gray-200 font-semibold">
                        &quot;{formatKey(currentEvent.key)}&quot;
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-mono text-blue-700 dark:text-blue-300 dark:text-blue-400">event.code</td>
                      <td className="px-4 py-2.5 font-mono text-gray-800 dark:text-gray-200">
                        &quot;{currentEvent.code}&quot;
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-mono text-orange-600 dark:text-orange-400">
                        event.keyCode
                        <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">(deprecated)</span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-gray-800 dark:text-gray-200">
                        {currentEvent.keyCode}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-mono text-orange-600 dark:text-orange-400">
                        event.which
                        <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">(deprecated)</span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-gray-800 dark:text-gray-200">
                        {currentEvent.which}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-mono text-blue-700 dark:text-blue-300 dark:text-blue-400">event.location</td>
                      <td className="px-4 py-2.5 font-mono text-gray-800 dark:text-gray-200">
                        {LOCATION_LABELS[currentEvent.location] ?? currentEvent.location}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-mono text-blue-700 dark:text-blue-300 dark:text-blue-400">event.shiftKey</td>
                      <td className="px-4 py-2.5 font-mono">
                        <span className={currentEvent.shiftKey ? "text-green-600 dark:text-green-400 font-semibold" : "text-gray-400 dark:text-gray-500"}>
                          {String(currentEvent.shiftKey)}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-mono text-blue-700 dark:text-blue-300 dark:text-blue-400">event.ctrlKey</td>
                      <td className="px-4 py-2.5 font-mono">
                        <span className={currentEvent.ctrlKey ? "text-green-600 dark:text-green-400 font-semibold" : "text-gray-400 dark:text-gray-500"}>
                          {String(currentEvent.ctrlKey)}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-mono text-blue-700 dark:text-blue-300 dark:text-blue-400">event.altKey</td>
                      <td className="px-4 py-2.5 font-mono">
                        <span className={currentEvent.altKey ? "text-green-600 dark:text-green-400 font-semibold" : "text-gray-400 dark:text-gray-500"}>
                          {String(currentEvent.altKey)}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2.5 font-mono text-blue-700 dark:text-blue-300 dark:text-blue-400">event.metaKey</td>
                      <td className="px-4 py-2.5 font-mono">
                        <span className={currentEvent.metaKey ? "text-green-600 dark:text-green-400 font-semibold" : "text-gray-400 dark:text-gray-500"}>
                          {String(currentEvent.metaKey)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Deprecated notice */}
            <div className="flex items-start gap-2 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 px-4 py-3 text-sm text-orange-800 dark:text-orange-300">
              <span className="mt-0.5 shrink-0 font-bold">!</span>
              <p>
                <strong>event.keyCode</strong> and <strong>event.which</strong> are deprecated and may be removed from future browsers.
                Use <strong>event.key</strong> and <strong>event.code</strong> in new projects.
                <code className="ml-1 text-xs bg-orange-100 dark:bg-orange-900/40 px-1 rounded">event.key</code> returns the logical key value,
                while <code className="ml-1 text-xs bg-orange-100 dark:bg-orange-900/40 px-1 rounded">event.code</code> returns the physical key position.
              </p>
            </div>
          </div>
        )}

        {/* Event history */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Key History
              {history.length > 0 && (
                <span className="ml-2 text-xs font-normal normal-case text-gray-400 dark:text-gray-500">
                  (last {history.length})
                </span>
              )}
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:bg-red-950 hover:border-red-200 dark:border-red-800 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors"
              >
                Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 px-4 py-8 text-center text-gray-400 dark:text-gray-500 dark:text-gray-600 text-sm">
              No key events recorded yet
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-xs min-w-[520px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-50 dark:bg-gray-950 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">#</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Key</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Code</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">keyCode</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Modifiers</th>
                      <th className="text-left px-3 py-2 font-semibold text-gray-500 dark:text-gray-400">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {history.map((event, idx) => (
                      <tr
                        key={event.timestamp + "-" + idx}
                        className={`transition-colors ${idx === 0 ? "bg-blue-50 dark:bg-blue-950/20" : "hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800/50"}`}
                      >
                        <td className="px-3 py-2 text-gray-300 dark:text-gray-600">
                          {history.length - idx}
                        </td>
                        <td className="px-3 py-2 font-mono font-bold text-blue-700 dark:text-blue-300 dark:text-blue-400">
                          {formatKey(event.key)}
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-700 dark:text-gray-300">
                          {event.code}
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">
                          {event.keyCode}
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-500 dark:text-gray-400">
                          {formatModifiers(event)}
                        </td>
                        <td className="px-3 py-2 text-gray-400 dark:text-gray-500 tabular-nums">
                          {formatTime(event.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* SEO content */}
        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-6 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              What Is a Keyboard Event Tester?
            </h2>
            <p>
              A keyboard event tester lets you inspect the properties of any key press event directly in your browser.
              When you press a key, JavaScript fires a <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">KeyboardEvent</code> containing
              detailed information such as the key name, physical key code, numeric key code, and active modifier keys.
              This tool captures that event and displays every property in a readable format, making it ideal for developers
              who need to quickly look up key codes or debug keyboard shortcuts.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              event.key vs event.code
            </h2>
            <p>
              <strong>event.key</strong> returns the logical key value - the character or action the key represents
              (e.g., <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">"A"</code> when Shift is held, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">"a"</code> otherwise,
              or <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">"Enter"</code> for the Enter key). It is locale- and layout-aware.
            </p>
            <p className="mt-2">
              <strong>event.code</strong> returns the physical key identifier based on the key position on a standard keyboard,
              regardless of layout or modifier state (e.g., <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">"KeyA"</code>,
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">"ArrowLeft"</code>,
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">"Numpad0"</code>). Use <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">event.code</code> when
              you care about the physical location (e.g., game controls), and <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">event.key</code> when you
              care about the character (e.g., text shortcuts).
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Why Are keyCode and which Deprecated?
            </h2>
            <p>
              <strong>event.keyCode</strong> and <strong>event.which</strong> are legacy numeric properties that were not
              standardized across browsers and had inconsistent behavior for non-alphanumeric keys. The modern
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded mx-1">event.key</code> and
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded mx-1">event.code</code> properties were introduced
              as part of the UI Events specification to replace them. Both are still widely supported, but you should
              avoid using them in new code since they may eventually be removed from browsers.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Understanding event.location
            </h2>
            <p>
              The <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">event.location</code> property distinguishes
              between multiple physical instances of the same logical key. Location <strong>0</strong> is the standard
              position, <strong>1</strong> means the left side of the keyboard (e.g., Left Shift), <strong>2</strong> means
              the right side (e.g., Right Alt), and <strong>3</strong> means the numpad. This is useful when you need to
              differentiate between, for example, the left and right Control keys.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Common Use Cases for Key Code Lookup
            </h2>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Building custom keyboard shortcuts in web applications</li>
              <li>Implementing game controls with arrow keys or WASD</li>
              <li>Debugging unexpected behavior of hotkeys in third-party libraries</li>
              <li>Testing accessibility of keyboard navigation</li>
              <li>Learning which key codes correspond to special or function keys</li>
              <li>Verifying modifier key combinations like Ctrl+Shift+Z</li>
            </ul>
          </div>
        </div>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Keyboard Event Tester is a free online tool available on CodeUtilo. Test keyboard events in real time. See key codes, key names, and event properties. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All keyboard event tester operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the keyboard event tester as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the keyboard event tester for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the keyboard event tester will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Keyboard Event Tester free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Keyboard Event Tester is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
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
              Yes. The Keyboard Event Tester is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Keyboard Event Tester runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
