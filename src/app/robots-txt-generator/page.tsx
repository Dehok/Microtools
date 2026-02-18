"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface BotRule {
  name: string;
  enabled: boolean;
  disallowPaths: string[];
  allowPaths: string[];
}

const DEFAULT_BOTS: BotRule[] = [
  { name: "*", enabled: true, disallowPaths: [], allowPaths: ["/"] },
  { name: "Googlebot", enabled: false, disallowPaths: [], allowPaths: ["/"] },
  { name: "Bingbot", enabled: false, disallowPaths: [], allowPaths: ["/"] },
];

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "Google-Extended",
  "anthropic-ai",
  "ClaudeBot",
  "Bytespider",
  "PerplexityBot",
];

export default function RobotsTxtGenerator() {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [bots, setBots] = useState<BotRule[]>(DEFAULT_BOTS);
  const [newPathInputs, setNewPathInputs] = useState<
    Record<string, { allow: string; disallow: string }>
  >({});

  const updateBot = (index: number, updates: Partial<BotRule>) => {
    setBots((prev) =>
      prev.map((bot, i) => (i === index ? { ...bot, ...updates } : bot))
    );
  };

  const addDisallowPath = (botIndex: number) => {
    const botName = bots[botIndex].name;
    const path = newPathInputs[botName]?.disallow?.trim();
    if (!path) return;
    setBots((prev) =>
      prev.map((bot, i) =>
        i === botIndex
          ? { ...bot, disallowPaths: [...bot.disallowPaths, path] }
          : bot
      )
    );
    setNewPathInputs((prev) => ({
      ...prev,
      [botName]: { ...prev[botName], disallow: "" },
    }));
  };

  const removeDisallowPath = (botIndex: number, pathIndex: number) => {
    setBots((prev) =>
      prev.map((bot, i) =>
        i === botIndex
          ? {
              ...bot,
              disallowPaths: bot.disallowPaths.filter(
                (_, pi) => pi !== pathIndex
              ),
            }
          : bot
      )
    );
  };

  const addAllowPath = (botIndex: number) => {
    const botName = bots[botIndex].name;
    const path = newPathInputs[botName]?.allow?.trim();
    if (!path) return;
    setBots((prev) =>
      prev.map((bot, i) =>
        i === botIndex
          ? { ...bot, allowPaths: [...bot.allowPaths, path] }
          : bot
      )
    );
    setNewPathInputs((prev) => ({
      ...prev,
      [botName]: { ...prev[botName], allow: "" },
    }));
  };

  const removeAllowPath = (botIndex: number, pathIndex: number) => {
    setBots((prev) =>
      prev.map((bot, i) =>
        i === botIndex
          ? {
              ...bot,
              allowPaths: bot.allowPaths.filter((_, pi) => pi !== pathIndex),
            }
          : bot
      )
    );
  };

  // Preset: Allow All
  const applyAllowAll = () => {
    setBots([
      { name: "*", enabled: true, disallowPaths: [], allowPaths: ["/"] },
    ]);
    setSitemapUrl("");
    setCrawlDelay("");
    setNewPathInputs({});
  };

  // Preset: Block All
  const applyBlockAll = () => {
    setBots([
      { name: "*", enabled: true, disallowPaths: ["/"], allowPaths: [] },
    ]);
    setNewPathInputs({});
  };

  // Preset: Block AI Bots
  const applyBlockAiBots = () => {
    const aiBotRules: BotRule[] = AI_BOTS.map((name) => ({
      name,
      enabled: true,
      disallowPaths: ["/"],
      allowPaths: [],
    }));
    setBots([
      { name: "*", enabled: true, disallowPaths: [], allowPaths: ["/"] },
      ...aiBotRules,
    ]);
    setNewPathInputs({});
  };

  const output = useMemo(() => {
    const lines: string[] = [];

    const enabledBots = bots.filter((bot) => bot.enabled);

    for (const bot of enabledBots) {
      lines.push(`User-agent: ${bot.name}`);

      for (const path of bot.allowPaths) {
        lines.push(`Allow: ${path}`);
      }

      for (const path of bot.disallowPaths) {
        lines.push(`Disallow: ${path}`);
      }

      if (
        bot.disallowPaths.length === 0 &&
        bot.allowPaths.length === 0
      ) {
        lines.push("Disallow:");
      }

      if (crawlDelay && bot.name === "*") {
        lines.push(`Crawl-delay: ${crawlDelay}`);
      }

      lines.push("");
    }

    if (sitemapUrl.trim()) {
      lines.push(`Sitemap: ${sitemapUrl.trim()}`);
      lines.push("");
    }

    return lines.join("\n");
  }, [bots, sitemapUrl, crawlDelay]);

  const highlightedLines = useMemo(() => {
    return output.split("\n").map((line) => {
      if (line.startsWith("User-agent:")) {
        return { text: line, color: "text-purple-600 font-semibold" };
      }
      if (line.startsWith("Allow:")) {
        return { text: line, color: "text-green-600" };
      }
      if (line.startsWith("Disallow:")) {
        return { text: line, color: "text-red-600" };
      }
      if (line.startsWith("Crawl-delay:")) {
        return { text: line, color: "text-yellow-600" };
      }
      if (line.startsWith("Sitemap:")) {
        return { text: line, color: "text-blue-600" };
      }
      return { text: line, color: "text-gray-500" };
    });
  }, [output]);

  return (
    <ToolLayout
      title="robots.txt Generator"
      description="Generate a robots.txt file for your website. Configure crawl rules for search engine bots, add sitemaps, and control access."
      relatedTools={["meta-tag-generator", "og-meta-generator", "url-parser"]}
    >
      {/* Preset buttons */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Presets
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={applyAllowAll}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Allow All
          </button>
          <button
            onClick={applyBlockAll}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Block All
          </button>
          <button
            onClick={applyBlockAiBots}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Block AI Bots
          </button>
        </div>
      </div>

      {/* Global settings */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Sitemap URL
          </label>
          <input
            type="text"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            placeholder="https://example.com/sitemap.xml"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Crawl Delay (seconds)
          </label>
          <input
            type="number"
            value={crawlDelay}
            onChange={(e) => setCrawlDelay(e.target.value)}
            placeholder="e.g. 10"
            min="0"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Bot rules */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Bot Rules</h3>
        <div className="space-y-4">
          {bots.map((bot, botIndex) => (
            <div
              key={`${bot.name}-${botIndex}`}
              className="rounded-lg border border-gray-300 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={bot.enabled}
                    onChange={(e) =>
                      updateBot(botIndex, { enabled: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {bot.name === "*" ? "All Bots (*)" : bot.name}
                  </span>
                </label>
                {botIndex >= DEFAULT_BOTS.length && (
                  <button
                    onClick={() =>
                      setBots((prev) => prev.filter((_, i) => i !== botIndex))
                    }
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              {bot.enabled && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Allow paths */}
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">
                      Allow paths
                    </label>
                    <div className="space-y-1">
                      {bot.allowPaths.map((path, pathIndex) => (
                        <div
                          key={pathIndex}
                          className="flex items-center gap-1"
                        >
                          <span className="flex-1 rounded border border-green-200 bg-green-50 px-2 py-1 font-mono text-xs text-green-700">
                            {path}
                          </span>
                          <button
                            onClick={() =>
                              removeAllowPath(botIndex, pathIndex)
                            }
                            className="rounded px-1.5 py-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-600"
                          >
                            x
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={newPathInputs[bot.name]?.allow || ""}
                          onChange={(e) =>
                            setNewPathInputs((prev) => ({
                              ...prev,
                              [bot.name]: {
                                ...prev[bot.name],
                                allow: e.target.value,
                              },
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addAllowPath(botIndex);
                          }}
                          placeholder="/path"
                          className="flex-1 rounded-lg border border-gray-300 px-2 py-1 font-mono text-xs focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => addAllowPath(botIndex)}
                          className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Disallow paths */}
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">
                      Disallow paths
                    </label>
                    <div className="space-y-1">
                      {bot.disallowPaths.map((path, pathIndex) => (
                        <div
                          key={pathIndex}
                          className="flex items-center gap-1"
                        >
                          <span className="flex-1 rounded border border-red-200 bg-red-50 px-2 py-1 font-mono text-xs text-red-700">
                            {path}
                          </span>
                          <button
                            onClick={() =>
                              removeDisallowPath(botIndex, pathIndex)
                            }
                            className="rounded px-1.5 py-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-600"
                          >
                            x
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={newPathInputs[bot.name]?.disallow || ""}
                          onChange={(e) =>
                            setNewPathInputs((prev) => ({
                              ...prev,
                              [bot.name]: {
                                ...prev[bot.name],
                                disallow: e.target.value,
                              },
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              addDisallowPath(botIndex);
                          }}
                          placeholder="/private"
                          className="flex-1 rounded-lg border border-gray-300 px-2 py-1 font-mono text-xs focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => addDisallowPath(botIndex)}
                          className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Generated robots.txt
          </label>
          <CopyButton text={output} />
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-gray-900 p-4">
          <pre className="font-mono text-sm leading-relaxed">
            {highlightedLines.map((line, i) => (
              <div key={i} className={line.color || "text-gray-500"}>
                {line.text || "\u00A0"}
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          What is a robots.txt File?
        </h2>
        <p className="mb-3">
          A robots.txt file is a plain text file placed at the root of your
          website (e.g., https://example.com/robots.txt) that tells search
          engine crawlers which pages or sections of your site they are allowed
          or disallowed from crawling. It follows the Robots Exclusion Protocol,
          a standard used by all major search engines including Google, Bing,
          Yahoo, and others.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Why Do You Need a robots.txt?
        </h2>
        <p className="mb-3">
          A properly configured robots.txt file helps you manage crawl budget,
          prevent indexing of duplicate or sensitive content, and guide search
          engine bots to the most important pages on your site. It is an
          essential part of technical SEO and is one of the first files search
          engines look for when crawling your website.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          How to Use This Generator
        </h2>
        <p className="mb-3">
          Use the preset buttons for common configurations, or manually
          configure rules for specific bots. Add your sitemap URL so search
          engines can discover all your pages. You can also set a crawl delay to
          prevent bots from overwhelming your server with too many requests.
          Once configured, copy the generated output and save it as
          &quot;robots.txt&quot; in the root directory of your website.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Blocking AI Crawlers
        </h2>
        <p>
          With the rise of AI language models, many website owners want to
          prevent their content from being used for AI training. The
          &quot;Block AI Bots&quot; preset adds rules for known AI crawlers
          including GPTBot, ChatGPT-User, CCBot, Google-Extended, ClaudeBot,
          and others. This allows regular search engines to index your site
          while blocking AI-specific data collection bots.
        </p>
      </div>
    </ToolLayout>
  );
}
