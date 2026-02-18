/**
 * Audit SEO content in all tool pages.
 * Counts words in the SEO sections (text after the tool UI).
 * Run: node audit-seo-content.mjs
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const APP_DIR = join(import.meta.dirname, "src", "app");
const SKIP = new Set(["about", "privacy", "fonts"]);

const dirs = readdirSync(APP_DIR).filter((d) => {
    if (SKIP.has(d)) return false;
    try { return statSync(join(APP_DIR, d)).isDirectory(); } catch { return false; }
});

const results = [];

for (const slug of dirs) {
    const filePath = join(APP_DIR, slug, "page.tsx");
    let content;
    try {
        content = readFileSync(filePath, "utf-8");
    } catch {
        continue;
    }

    // SEO content is typically in the section after the main tool UI
    // Look for patterns like "What is", "How to use", "FAQ", "About the" etc.
    // These are usually in JSX after the tool's functional content
    const seoPatterns = [
        /What is/i, /How to use/i, /FAQ/i, /About the/i, /Common use/i,
        /Why use/i, /Features/i, /Related Tools/i
    ];

    const hasSeoSection = seoPatterns.some(p => p.test(content));

    // Count text content in SEO-like sections
    // Extract all string literals in JSX that look like paragraph/heading content
    const textMatches = content.match(/>\s*\n?\s*([A-Z][^<>{}\n]{20,})/g) || [];
    const seoText = textMatches.join(" ");
    const wordCount = seoText.split(/\s+/).filter(w => w.length > 0).length;

    results.push({ slug, hasSeoSection, wordCount });
}

// Sort by word count ascending
results.sort((a, b) => a.wordCount - b.wordCount);

console.log("\n=== SEO CONTENT AUDIT ===\n");
console.log("Tools with LEAST content (first 30):\n");
console.log("Slug".padEnd(35) + "Words".padStart(6) + "  Has SEO?");
console.log("-".repeat(55));
for (const r of results.slice(0, 30)) {
    console.log(r.slug.padEnd(35) + String(r.wordCount).padStart(6) + "  " + (r.hasSeoSection ? "Yes" : "NO"));
}

console.log("\n\nTools with MOST content (top 10):\n");
console.log("Slug".padEnd(35) + "Words".padStart(6));
console.log("-".repeat(45));
for (const r of results.slice(-10).reverse()) {
    console.log(r.slug.padEnd(35) + String(r.wordCount).padStart(6));
}

const under150 = results.filter(r => r.wordCount < 150);
console.log(`\n\n${under150.length} tools have fewer than 150 words of SEO content.`);
