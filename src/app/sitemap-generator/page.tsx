"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function SitemapGenerator() {
    const [urls, setUrls] = useState<{ loc: string; priority: string; changefreq: string; lastmod: string }[]>([
        { loc: "https://example.com/", priority: "1.0", changefreq: "daily", lastmod: new Date().toISOString().split("T")[0] },
        { loc: "https://example.com/about", priority: "0.8", changefreq: "monthly", lastmod: new Date().toISOString().split("T")[0] },
        { loc: "https://example.com/contact", priority: "0.5", changefreq: "yearly", lastmod: new Date().toISOString().split("T")[0] },
    ]);
    const [copied, setCopied] = useState(false);

    const addUrl = () => setUrls([...urls, { loc: "https://example.com/new-page", priority: "0.5", changefreq: "monthly", lastmod: new Date().toISOString().split("T")[0] }]);
    const removeUrl = (i: number) => setUrls(urls.filter((_, idx) => idx !== i));
    const update = (i: number, field: string, val: string) => { const u = [...urls]; u[i] = { ...u[i], [field]: val }; setUrls(u); };

    const xml = useMemo(() => {
        const lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ];
        for (const url of urls) {
            lines.push("  <url>");
            lines.push(`    <loc>${url.loc}</loc>`);
            if (url.lastmod) lines.push(`    <lastmod>${url.lastmod}</lastmod>`);
            if (url.changefreq) lines.push(`    <changefreq>${url.changefreq}</changefreq>`);
            if (url.priority) lines.push(`    <priority>${url.priority}</priority>`);
            lines.push("  </url>");
        }
        lines.push("</urlset>");
        return lines.join("\n");
    }, [urls]);

    const handleCopy = () => { navigator.clipboard.writeText(xml); setCopied(true); setTimeout(() => setCopied(false), 1500); };
    const handleDownload = () => { const blob = new Blob([xml], { type: "application/xml" }); const link = document.createElement("a"); link.download = "sitemap.xml"; link.href = URL.createObjectURL(blob); link.click(); };

    const bulkAdd = () => {
        const input = prompt("Enter URLs (one per line):");
        if (!input) return;
        const newUrls = input.split("\n").filter(Boolean).map((loc) => ({ loc: loc.trim(), priority: "0.5", changefreq: "monthly", lastmod: new Date().toISOString().split("T")[0] }));
        setUrls([...urls, ...newUrls]);
    };

    return (
        <ToolLayout title="Sitemap Generator" description="Generate XML sitemaps for your website. Add URLs, set priorities and change frequencies." relatedTools={["meta-tag-generator", "robots-txt-generator", "open-graph-preview"]}>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                    <div className="flex gap-2 mb-2">
                        <button onClick={addUrl} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">+ Add URL</button>
                        <button onClick={bulkAdd} className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Bulk Add</button>
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 self-center">{urls.length} URLs</span>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                        {urls.map((url, i) => (
                            <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 space-y-1 relative">
                                <button onClick={() => removeUrl(i)} className="absolute top-1 right-1 text-xs text-red-400 hover:text-red-600">×</button>
                                <input value={url.loc} onChange={(e) => update(i, "loc", e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-mono" placeholder="https://..." />
                                <div className="grid grid-cols-3 gap-1">
                                    <select value={url.priority} onChange={(e) => update(i, "priority", e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-[10px]">
                                        {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"].map((p) => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <select value={url.changefreq} onChange={(e) => update(i, "changefreq", e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-[10px]">
                                        {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((f) => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                    <input type="date" value={url.lastmod} onChange={(e) => update(i, "lastmod", e.target.value)} className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-1 py-0.5 text-[10px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">sitemap.xml</h3><div className="flex gap-2"><button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy"}</button><button onClick={handleDownload} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Download</button></div></div>
                    <pre className="rounded-lg bg-gray-900 p-4 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap" style={{ minHeight: 300 }}>{xml}</pre>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate XML sitemaps for search engine optimization. Add URLs individually or in bulk, set priority levels, change frequencies, and last modification dates. Download the sitemap.xml ready to upload to your server.</p>
            </div>
        </ToolLayout>
    );
}
