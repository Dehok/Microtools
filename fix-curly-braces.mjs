/**
 * Fix curly braces in FAQ sections that break JSX parsing.
 * Only escapes { and } inside FAQ text content (between > and < inside the FAQ section).
 * Does NOT touch JSX attributes, className, or code outside the FAQ section.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const APP_DIR = join(import.meta.dirname, "src", "app");

const dirs = readdirSync(APP_DIR).filter((d) => {
    try { return statSync(join(APP_DIR, d)).isDirectory(); } catch { return false; }
});

let fixed = 0;

for (const slug of dirs) {
    const filePath = join(APP_DIR, slug, "page.tsx");
    let content;
    try {
        content = readFileSync(filePath, "utf-8");
    } catch { continue; }

    const faqIdx = content.indexOf("Frequently Asked Questions");
    if (faqIdx === -1) continue;

    // First, restore any previously over-escaped braces
    let restored = content.replace(/&#123;/g, "{").replace(/&#125;/g, "}");

    // Find the FAQ section boundaries
    const faqSectionStart = restored.lastIndexOf("<h2", faqIdx);
    // Find the last </div> that closes the FAQ section's space-y-4 container
    const spaceDivIdx = restored.indexOf('<div className="space-y-4">', faqIdx);
    if (spaceDivIdx === -1) continue;

    // Count opening/closing divs to find the matching </div>
    let depth = 0;
    let faqEndIdx = -1;
    for (let i = spaceDivIdx; i < restored.length; i++) {
        if (restored.startsWith("<div", i)) depth++;
        if (restored.startsWith("</div>", i)) {
            depth--;
            if (depth === 0) {
                faqEndIdx = i + 6;
                break;
            }
        }
    }
    if (faqEndIdx === -1) continue;

    const before = restored.slice(0, faqSectionStart);
    let faqSection = restored.slice(faqSectionStart, faqEndIdx);
    const after = restored.slice(faqEndIdx);

    // In the FAQ section, escape { and } only in text content (between > and <)
    const original = faqSection;
    faqSection = faqSection.replace(/>([^<]+)</g, (match, textContent) => {
        // Skip if it's a JSX attribute or expression
        if (textContent.includes("className=")) return match;
        if (textContent.trim().startsWith("{")) return match;
        // Escape curly braces in plain text
        const escaped = textContent.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
        return ">" + escaped + "<";
    });

    const newContent = before + faqSection + after;
    if (newContent !== content) {
        writeFileSync(filePath, newContent, "utf-8");
        fixed++;
    }
}

console.log(`Fixed ${fixed} files with curly brace escaping in FAQ sections.`);
