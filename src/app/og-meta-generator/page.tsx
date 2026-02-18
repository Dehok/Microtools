"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function OgMetaGenerator() {
  const [title, setTitle] = useState("My Awesome Page");
  const [description, setDescription] = useState("A description of my page that appears in search results and social media previews.");
  const [url, setUrl] = useState("https://example.com/page");
  const [image, setImage] = useState("https://example.com/og-image.jpg");
  const [siteName, setSiteName] = useState("My Website");
  const [type, setType] = useState("website");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [locale, setLocale] = useState("en_US");

  const metaTags = useMemo(() => {
    const tags: string[] = [];

    // Basic meta
    if (title) tags.push(`<meta name="title" content="${title}" />`);
    if (description) tags.push(`<meta name="description" content="${description}" />`);

    tags.push("");
    tags.push("<!-- Open Graph / Facebook -->");
    if (type) tags.push(`<meta property="og:type" content="${type}" />`);
    if (url) tags.push(`<meta property="og:url" content="${url}" />`);
    if (title) tags.push(`<meta property="og:title" content="${title}" />`);
    if (description) tags.push(`<meta property="og:description" content="${description}" />`);
    if (image) tags.push(`<meta property="og:image" content="${image}" />`);
    if (siteName) tags.push(`<meta property="og:site_name" content="${siteName}" />`);
    if (locale) tags.push(`<meta property="og:locale" content="${locale}" />`);

    tags.push("");
    tags.push("<!-- Twitter -->");
    if (twitterCard) tags.push(`<meta property="twitter:card" content="${twitterCard}" />`);
    if (url) tags.push(`<meta property="twitter:url" content="${url}" />`);
    if (title) tags.push(`<meta property="twitter:title" content="${title}" />`);
    if (description) tags.push(`<meta property="twitter:description" content="${description}" />`);
    if (image) tags.push(`<meta property="twitter:image" content="${image}" />`);
    if (twitterHandle) tags.push(`<meta property="twitter:site" content="${twitterHandle}" />`);

    return tags.join("\n");
  }, [title, description, url, image, siteName, type, twitterCard, twitterHandle, locale]);

  return (
    <ToolLayout
      title="Open Graph Meta Tag Generator — OG Tags for Social Media"
      description="Generate Open Graph and Twitter Card meta tags for perfect social media previews. Copy-paste ready HTML code."
      relatedTools={["html-encoder-decoder", "slug-generator", "markdown-preview"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
            <div className="mt-0.5 text-right text-[10px] text-gray-400 dark:text-gray-500">{title.length}/60 chars</div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
            <div className="mt-0.5 text-right text-[10px] text-gray-400 dark:text-gray-500">{description.length}/160 chars</div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">URL</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm font-mono focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Image URL (1200×630 recommended)</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm font-mono focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Site Name</label>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="profile">profile</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Twitter Card</label>
              <select value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm">
                <option value="summary_large_image">Large Image</option>
                <option value="summary">Summary</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Twitter @handle</label>
              <input type="text" value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@yourhandle"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Locale</label>
            <input type="text" value={locale} onChange={(e) => setLocale(e.target.value)}
              className="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>
        </div>

        {/* Preview & Output */}
        <div>
          {/* Social preview */}
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Social Media Preview</label>
          <div className="mb-4 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              {image ? "OG Image Preview" : "No image set"}
            </div>
            <div className="bg-white dark:bg-gray-900 p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{new URL(url || "https://example.com").hostname}</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{title || "Page Title"}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{description || "Page description..."}</div>
            </div>
          </div>

          {/* Code output */}
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">HTML Meta Tags</label>
            <CopyButton text={metaTags} />
          </div>
          <pre className="max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-[11px] whitespace-pre-wrap">
            {metaTags}
          </pre>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What are Open Graph Tags?</h2>
        <p className="mb-3">
          Open Graph (OG) meta tags control how your pages appear when shared on Facebook, LinkedIn,
          WhatsApp, Slack, and other platforms. Twitter has its own card tags but also falls back to OG tags.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Best Practices</h2>
        <p>
          Use a 1200×630px image for best results. Keep titles under 60 characters and descriptions
          under 160 characters. Always include og:title, og:description, og:image, and og:url for
          complete social previews.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Open Graph Generator is a free online tool available on CodeUtilo. Generate Open Graph and Twitter Card meta tags for social media previews. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All open graph generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the open graph generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the open graph generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the open graph generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
