/**
 * Reads original title/description/keywords from git history (e0e2cd0)
 * and regenerates layout.tsx files preserving those originals
 * while adding Open Graph, Twitter Cards, Schema.org, and canonical URLs.
 *
 * Run: node fix-layouts.mjs
 */
import { execSync } from "child_process";
import { writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const SITE = "CodeUtilo";
const URL = "https://codeutilo.com";
const APP_DIR = join(import.meta.dirname, "src", "app");
const OLD_COMMIT = "e0e2cd0";

// Skip non-tool directories
const SKIP = new Set(["about", "privacy", "fonts"]);

// Get all tool directories
const dirs = readdirSync(APP_DIR).filter((d) => {
    if (SKIP.has(d)) return false;
    try {
        return statSync(join(APP_DIR, d)).isDirectory();
    } catch {
        return false;
    }
});

let fixed = 0;
let failed = [];

for (const slug of dirs) {
    // Read old layout.tsx from git history
    let oldContent;
    try {
        oldContent = execSync(`git show ${OLD_COMMIT}:src/app/${slug}/layout.tsx`, {
            cwd: import.meta.dirname,
            encoding: "utf-8",
        });
    } catch {
        // No old file — skip
        failed.push(slug);
        continue;
    }

    // Extract title
    const titleMatch = oldContent.match(/title:\s*"([^"]+)"/);
    if (!titleMatch) {
        failed.push(slug);
        continue;
    }
    const title = titleMatch[1];

    // Extract description (handles multi-line)
    const descMatch = oldContent.match(/description:\s*\n?\s*"([^"]+)"/);
    const desc = descMatch ? descMatch[1] : "";

    // Extract keywords array
    const kwMatch = oldContent.match(/keywords:\s*\[([^\]]+)\]/);
    let keywords = [];
    if (kwMatch) {
        keywords = kwMatch[1].match(/"([^"]+)"/g)?.map((s) => s.replace(/"/g, "")) || [];
    }
    const kwArray = JSON.stringify(keywords);

    // Extract tool name from tools.ts convention (slug to name)
    const name = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const content = `import type { Metadata } from "next";
import SchemaOrg from "@/components/SchemaOrg";

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(desc)},
  keywords: ${kwArray},
  openGraph: {
    title: "${title} | ${SITE}",
    description: ${JSON.stringify(desc)},
    url: "${URL}/${slug}",
    siteName: "${SITE}",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "${title} | ${SITE}",
    description: ${JSON.stringify(desc)},
  },
  alternates: {
    canonical: "${URL}/${slug}",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaOrg
        name=${JSON.stringify(name)}
        description=${JSON.stringify(desc)}
        slug="${slug}"
      />
      {children}
    </>
  );
}
`;

    writeFileSync(join(APP_DIR, slug, "layout.tsx"), content, "utf-8");
    fixed++;
}

console.log(`\n✅ Fixed ${fixed} layout.tsx files with original title/description restored.`);
if (failed.length > 0) {
    console.log(`⚠️  Could not process: ${failed.join(", ")}`);
}
