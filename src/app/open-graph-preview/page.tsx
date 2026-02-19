"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function OpenGraphPreview() {
    const [title, setTitle] = useState("My Amazing Website — Build Better Tools");
    const [description, setDescription] = useState("Discover the best free online tools for developers, designers, and creators. Fast, private, no signup required.");
    const [url, setUrl] = useState("https://codeutilo.com");
    const [image, setImage] = useState("https://codeutilo.com/og-image.jpg");
    const [siteName, setSiteName] = useState("CodeUtilo");

    return (
        <ToolLayout title="Open Graph Preview" description="Preview how your website looks when shared on Facebook, Twitter, LinkedIn, and Discord." relatedTools={["meta-tag-generator", "robots-txt-generator", "favicon-generator"]}>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">og:title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">og:description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">og:url</label><input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">og:image</label><input value={image} onChange={(e) => setImage(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">og:site_name</label><input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" /></div>
                </div>

                <div className="space-y-6">
                    {/* Facebook Preview */}
                    <div>
                        <h3 className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Facebook</h3>
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
                            <div className="h-40 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs">
                                {image ? <img src={image} alt="OG" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : "og:image preview"}
                            </div>
                            <div className="p-3">
                                <p className="text-[10px] uppercase text-gray-500 dark:text-gray-500">{new URL(url || "https://example.com").hostname}</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">{title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Twitter Preview */}
                    <div>
                        <h3 className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Twitter / X</h3>
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
                            <div className="h-36 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs">
                                {image ? <img src={image} alt="OG" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : "og:image preview"}
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>
                                <p className="text-xs text-gray-400 mt-1">🔗 {url ? new URL(url).hostname : "example.com"}</p>
                            </div>
                        </div>
                    </div>

                    {/* LinkedIn Preview */}
                    <div>
                        <h3 className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">LinkedIn</h3>
                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
                            <div className="h-32 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-xs">
                                {image ? <img src={image} alt="OG" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : "og:image preview"}
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{url ? new URL(url).hostname : "example.com"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Discord Preview */}
                    <div>
                        <h3 className="mb-2 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Discord</h3>
                        <div className="rounded-lg border-l-4 border-l-blue-500 bg-[#2f3136] p-3">
                            <p className="text-[10px] text-gray-400">{siteName}</p>
                            <p className="text-sm font-medium text-blue-400 mt-0.5">{title}</p>
                            <p className="text-xs text-gray-300 mt-1 line-clamp-2">{description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Preview how your website will appear when shared on social media platforms including Facebook, Twitter/X, LinkedIn, and Discord. Test your Open Graph meta tags before publishing to ensure professional-looking link previews.</p>
            </div>
        </ToolLayout>
    );
}
