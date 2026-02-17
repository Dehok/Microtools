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
            <label className="mb-1 block text-xs font-medium text-gray-700">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            <div className="mt-0.5 text-right text-[10px] text-gray-400">{title.length}/60 chars</div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            <div className="mt-0.5 text-right text-[10px] text-gray-400">{description.length}/160 chars</div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">URL</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Image URL (1200×630 recommended)</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Site Name</label>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="profile">profile</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Twitter Card</label>
              <select value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="summary_large_image">Large Image</option>
                <option value="summary">Summary</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Twitter @handle</label>
              <input type="text" value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@yourhandle"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Locale</label>
            <input type="text" value={locale} onChange={(e) => setLocale(e.target.value)}
              className="w-24 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
        </div>

        {/* Preview & Output */}
        <div>
          {/* Social preview */}
          <label className="mb-1 block text-sm font-medium text-gray-700">Social Media Preview</label>
          <div className="mb-4 overflow-hidden rounded-lg border border-gray-300">
            <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              {image ? "OG Image Preview" : "No image set"}
            </div>
            <div className="bg-white p-3">
              <div className="text-xs text-gray-500 uppercase">{new URL(url || "https://example.com").hostname}</div>
              <div className="font-semibold text-gray-900 line-clamp-2">{title || "Page Title"}</div>
              <div className="text-sm text-gray-500 line-clamp-2">{description || "Page description..."}</div>
            </div>
          </div>

          {/* Code output */}
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">HTML Meta Tags</label>
            <CopyButton text={metaTags} />
          </div>
          <pre className="max-h-64 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-[11px] whitespace-pre-wrap">
            {metaTags}
          </pre>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">What are Open Graph Tags?</h2>
        <p className="mb-3">
          Open Graph (OG) meta tags control how your pages appear when shared on Facebook, LinkedIn,
          WhatsApp, Slack, and other platforms. Twitter has its own card tags but also falls back to OG tags.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Best Practices</h2>
        <p>
          Use a 1200×630px image for best results. Keep titles under 60 characters and descriptions
          under 160 characters. Always include og:title, og:description, og:image, and og:url for
          complete social previews.
        </p>
      </div>
    </ToolLayout>
  );
}
