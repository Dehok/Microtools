/**
 * Add dark mode Tailwind classes to all tool page.tsx files.
 * This does simple string replacements on class names that don't
 * already have a dark: counterpart on the same line.
 *
 * Run: node add-dark-classes.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const APP_DIR = join(import.meta.dirname, "src", "app");
const SKIP = new Set(["about", "privacy", "fonts"]);

// Replacements: [search, replacement]
// Only replace if the line does NOT already contain the corresponding dark: class
const REPLACEMENTS = [
    // Text colors
    ["text-gray-900", "text-gray-900 dark:text-gray-100"],
    ["text-gray-800", "text-gray-800 dark:text-gray-200"],
    ["text-gray-700", "text-gray-700 dark:text-gray-300"],
    ["text-gray-600", "text-gray-600 dark:text-gray-400"],
    ["text-gray-500", "text-gray-500 dark:text-gray-400"],
    ["text-gray-400", "text-gray-400 dark:text-gray-500"],
    // Background colors
    ["bg-white", "bg-white dark:bg-gray-900"],
    ["bg-gray-50", "bg-gray-50 dark:bg-gray-950"],
    ["bg-gray-100", "bg-gray-100 dark:bg-gray-800"],
    ["bg-gray-200", "bg-gray-200 dark:bg-gray-700"],
    // Border colors
    ["border-gray-200", "border-gray-200 dark:border-gray-700"],
    ["border-gray-300", "border-gray-300 dark:border-gray-600"],
    ["border-gray-100", "border-gray-100 dark:border-gray-800"],
    // Hover backgrounds
    ["hover:bg-gray-50", "hover:bg-gray-50 dark:hover:bg-gray-800"],
    ["hover:bg-gray-100", "hover:bg-gray-100 dark:hover:bg-gray-800"],
    ["hover:bg-blue-50", "hover:bg-blue-50 dark:hover:bg-blue-950"],
    ["hover:bg-red-50", "hover:bg-red-50 dark:hover:bg-red-950"],
    ["hover:bg-green-50", "hover:bg-green-50 dark:hover:bg-green-950"],
    // Hover borders
    ["hover:border-blue-300", "hover:border-blue-300 dark:hover:border-blue-700"],
    ["hover:border-gray-300", "hover:border-gray-300 dark:hover:border-gray-600"],
    // Hover text
    ["hover:text-gray-900", "hover:text-gray-900 dark:hover:text-gray-100"],
    ["hover:text-blue-600", "hover:text-blue-600 dark:hover:text-blue-400"],
    // Active
    ["active:bg-gray-100", "active:bg-gray-100 dark:active:bg-gray-800"],
    // Placeholder
    ["placeholder-gray-400", "placeholder-gray-400 dark:placeholder-gray-500"],
    ["placeholder:text-gray-400", "placeholder:text-gray-400 dark:placeholder:text-gray-500"],
    // Focus ring/border
    ["focus:ring-gray-300", "focus:ring-gray-300 dark:focus:ring-gray-600"],
    // Blue accents in tool UIs
    ["bg-blue-50", "bg-blue-50 dark:bg-blue-950"],
    ["bg-blue-100", "bg-blue-100 dark:bg-blue-900"],
    ["text-blue-600", "text-blue-600 dark:text-blue-400"],
    ["text-blue-700", "text-blue-700 dark:text-blue-300"],
    ["text-blue-800", "text-blue-800 dark:text-blue-200"],
    ["border-blue-200", "border-blue-200 dark:border-blue-800"],
    ["border-blue-500", "border-blue-500 dark:border-blue-400"],
    // Red (error states)
    ["text-red-600", "text-red-600 dark:text-red-400"],
    ["text-red-700", "text-red-700 dark:text-red-300"],
    ["text-red-500", "text-red-500 dark:text-red-400"],
    ["bg-red-50", "bg-red-50 dark:bg-red-950"],
    ["bg-red-100", "bg-red-100 dark:bg-red-900"],
    ["border-red-200", "border-red-200 dark:border-red-800"],
    ["border-red-300", "border-red-300 dark:border-red-700"],
    // Green (success states)
    ["text-green-600", "text-green-600 dark:text-green-400"],
    ["text-green-700", "text-green-700 dark:text-green-300"],
    ["bg-green-50", "bg-green-50 dark:bg-green-950"],
    ["bg-green-100", "bg-green-100 dark:bg-green-900"],
    ["border-green-200", "border-green-200 dark:border-green-800"],
    // Yellow/orange (warning states)
    ["text-yellow-600", "text-yellow-600 dark:text-yellow-400"],
    ["text-yellow-700", "text-yellow-700 dark:text-yellow-300"],
    ["bg-yellow-50", "bg-yellow-50 dark:bg-yellow-950"],
    ["bg-yellow-100", "bg-yellow-100 dark:bg-yellow-900"],
    ["border-yellow-200", "border-yellow-200 dark:border-yellow-800"],
    ["text-orange-600", "text-orange-600 dark:text-orange-400"],
    ["bg-orange-50", "bg-orange-50 dark:bg-orange-950"],
    // Purple
    ["text-purple-600", "text-purple-600 dark:text-purple-400"],
    ["text-purple-700", "text-purple-700 dark:text-purple-300"],
    ["bg-purple-50", "bg-purple-50 dark:bg-purple-950"],
    ["bg-purple-100", "bg-purple-100 dark:bg-purple-900"],
    // Divide
    ["divide-gray-200", "divide-gray-200 dark:divide-gray-700"],
    ["divide-gray-100", "divide-gray-100 dark:divide-gray-800"],
    // Shadow (make shadows darker in dark mode via ring trick is complex, skip for now)
];

// Sort by length descending so longer matches replace first
// This prevents "text-gray-50" from being caught by "text-gray-5"
REPLACEMENTS.sort((a, b) => b[0].length - a[0].length);

let totalFiles = 0;
let totalChanges = 0;

const dirs = readdirSync(APP_DIR).filter((d) => {
    if (SKIP.has(d)) return false;
    try { return statSync(join(APP_DIR, d)).isDirectory(); } catch { return false; }
});

for (const slug of dirs) {
    const filePath = join(APP_DIR, slug, "page.tsx");
    let content;
    try {
        content = readFileSync(filePath, "utf-8");
    } catch {
        continue;
    }

    let changed = false;
    let newContent = content;

    for (const [search, replacement] of REPLACEMENTS) {
        // Build a regex that matches the search string but NOT if it's already
        // preceded or followed by "dark:" variant of itself
        // We need word boundary matching to avoid partial replacements
        const darkClass = replacement.split(" ").find(c => c.startsWith("dark:"));
        if (!darkClass) continue;

        // Only replace occurrences where the dark: counterpart is not already present nearby
        const lines = newContent.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Skip lines that already have this specific dark: class
            if (line.includes(darkClass)) continue;
            // Skip lines that don't have the search class
            if (!line.includes(search)) continue;

            // Replace: but be careful not to replace inside already-dark: prefixed classes
            // e.g. don't replace "text-gray-900" inside "dark:text-gray-900"
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(`(?<!dark:)(?<!dark:hover:)(?<!dark:active:)(?<!dark:focus:)(?<!dark:placeholder:)\\b${escaped}\\b`, "g");

            const newLine = line.replace(regex, replacement);
            if (newLine !== line) {
                lines[i] = newLine;
                changed = true;
                totalChanges++;
            }
        }
        newContent = lines.join("\n");
    }

    if (changed) {
        writeFileSync(filePath, newContent, "utf-8");
        totalFiles++;
    }
}

console.log(`\n✅ Updated ${totalFiles} page.tsx files with ${totalChanges} dark mode class additions.`);
