/**
 * Adds FAQ sections to all tool pages and FAQPage JSON-LD to layout files.
 * 
 * For each tool:
 * 1. Generates 4-5 relevant FAQ Q&As
 * 2. Injects FAQ JSX into page.tsx (before closing </ToolLayout>)
 * 3. Adds FAQSchema component import and usage to layout.tsx
 *
 * Run: node add-faqs.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

const APP_DIR = join(import.meta.dirname, "src", "app");
const SKIP = new Set(["about", "privacy", "fonts"]);

// Read tools.ts to get tool names and descriptions
const toolsContent = readFileSync(join(import.meta.dirname, "src", "lib", "tools.ts"), "utf-8");
const toolEntries = {};
const slugMatches = [...toolsContent.matchAll(/slug:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?description:\s*"([^"]+)"/g)];
for (const m of slugMatches) {
    toolEntries[m[1]] = { name: m[2], description: m[3] };
}

// ── Tool-specific FAQ data ───────────────────────────────
// Each entry: slug → array of {q, a}
const TOOL_FAQS = {
    "json-formatter": [
        { q: "What is valid JSON?", a: "Valid JSON must use double quotes for keys and strings, no trailing commas, no comments, and must start with an object {} or array []. Numbers, booleans (true/false), and null are also valid values." },
        { q: "Does this tool validate JSON?", a: "Yes. When you paste or type JSON, the tool checks for syntax errors and shows the error message with the exact location of the problem, making it easy to fix invalid JSON." },
        { q: "Is my data safe?", a: "Absolutely. All formatting and validation happens locally in your browser using JavaScript. Your JSON data is never sent to any server." },
        { q: "What is the difference between formatting and minifying JSON?", a: "Formatting (beautifying) adds indentation and line breaks to make JSON readable. Minifying removes all unnecessary whitespace to reduce file size, which is useful for production environments and API responses." },
        { q: "Can I use this tool for large JSON files?", a: "Yes, the tool handles large JSON documents efficiently since all processing runs in your browser. However, extremely large files (10MB+) may cause slower performance depending on your device." },
    ],
    "base64-encode-decode": [
        { q: "What is Base64 encoding?", a: "Base64 is a method of encoding binary data into ASCII text using 64 characters (A-Z, a-z, 0-9, +, /). It's commonly used to embed images in HTML, transmit data in URLs, and encode email attachments." },
        { q: "Is Base64 encoding the same as encryption?", a: "No. Base64 is an encoding scheme, not encryption. Anyone can decode Base64 text back to its original form. It provides no security — it's only used to safely transmit binary data as text." },
        { q: "Why does Base64 increase the size of data?", a: "Base64 encoding increases data size by approximately 33% because it represents 3 bytes of binary data using 4 ASCII characters. This trade-off is necessary for safe text-based transmission." },
        { q: "Does this tool handle Unicode characters?", a: "Yes. The tool encodes text as UTF-8 before Base64 conversion, ensuring that special characters, emojis, and non-Latin scripts are handled correctly." },
    ],
    "uuid-generator": [
        { q: "What is a UUID?", a: "A UUID (Universally Unique Identifier) is a 128-bit identifier that is unique across space and time. It looks like: 550e8400-e29b-41d4-a716-446655440000. UUIDs are used as primary keys in databases, API identifiers, and session tokens." },
        { q: "What is the difference between UUID v1 and v4?", a: "UUID v1 uses a timestamp and MAC address, making it sequential but potentially exposing hardware information. UUID v4 is fully random, providing better privacy and unpredictability. This tool generates v4 UUIDs." },
        { q: "Are UUIDs truly unique?", a: "For all practical purposes, yes. The probability of generating two identical v4 UUIDs is astronomically small — about 1 in 5.3 × 10^36. You'd need to generate 1 billion UUIDs per second for about 85 years to have a 50% chance of one collision." },
        { q: "Can I use UUIDs as database primary keys?", a: "Yes, UUIDs are commonly used as primary keys in databases like PostgreSQL, MongoDB, and MySQL. They enable distributed systems to generate unique IDs without coordination." },
    ],
    "password-generator": [
        { q: "How strong is a generated password?", a: "A 16-character password with uppercase, lowercase, numbers, and symbols has approximately 95^16 possible combinations, which would take billions of years to crack with current technology." },
        { q: "Is it safe to generate passwords online?", a: "Yes, with this tool. The password is generated entirely in your browser using the cryptographic random number generator (crypto.getRandomValues). No password is ever sent to any server." },
        { q: "What makes a password strong?", a: "Strong passwords are long (12+ characters), use all character types (uppercase, lowercase, numbers, symbols), and are randomly generated rather than based on dictionary words or personal information." },
        { q: "How often should I change my passwords?", a: "Modern security guidelines (NIST) recommend changing passwords only when there's evidence of compromise, rather than on a fixed schedule. Using unique, strong passwords with a password manager is more effective." },
    ],
    "word-counter": [
        { q: "How does the word counter count words?", a: "The tool counts words by splitting text on whitespace boundaries (spaces, tabs, newlines). It handles multiple consecutive spaces correctly and ignores leading/trailing whitespace." },
        { q: "Does it count characters with or without spaces?", a: "Both. The tool shows total characters (including spaces) and characters without spaces, so you can use whichever metric you need." },
        { q: "Can I use this for essay word count requirements?", a: "Yes. The word count is accurate and matches the counting method used by most word processors. It's ideal for checking essay, blog post, and assignment word limits." },
        { q: "What is the average reading time calculation based on?", a: "Reading time is estimated at approximately 200-250 words per minute, which is the average adult reading speed. Speaking time uses approximately 130-150 words per minute." },
    ],
    "color-picker": [
        { q: "What is HEX color format?", a: "HEX is a six-digit hexadecimal representation of color. The first two digits represent red, the middle two green, and the last two blue. For example, #FF5733 is a shade of orange-red." },
        { q: "What is the difference between RGB and HSL?", a: "RGB defines colors using Red, Green, and Blue channel values (0-255). HSL uses Hue (0-360°), Saturation (0-100%), and Lightness (0-100%). HSL is more intuitive for humans — you can easily make a color lighter or more saturated." },
        { q: "Can I use the picked color in CSS?", a: "Yes. All color values are displayed in CSS-ready format. Simply copy the HEX, RGB, or HSL value and paste it directly into your CSS stylesheet." },
        { q: "How do I find the exact color from a website?", a: "Use your browser's built-in color picker: right-click → Inspect → click the color swatch in the Styles panel. Or use browser extensions like ColorZilla to pick colors from any webpage." },
    ],
    "hash-generator": [
        { q: "What is a hash function?", a: "A hash function takes any input and produces a fixed-length output (the hash). The same input always produces the same hash, but it's computationally infeasible to reverse the process or find two inputs with the same hash." },
        { q: "Which hash algorithm should I use?", a: "For general purposes, use SHA-256. MD5 and SHA-1 are considered insecure for cryptographic use. For password hashing, use bcrypt, scrypt, or Argon2 instead." },
        { q: "Is MD5 secure?", a: "No. MD5 is cryptographically broken — collision attacks are practical and fast. Don't use MD5 for security purposes. It's still acceptable for checksums and non-security data integrity checks." },
        { q: "Can I reverse a hash to get the original text?", a: "Hash functions are one-way by design. You cannot mathematically reverse a hash. However, short or common inputs can be found using rainbow tables or brute force, which is why strong passwords are important." },
    ],
    "regex-tester": [
        { q: "What are regex flags?", a: "Flags modify how the regex engine works. Common ones: g (global — find all matches), i (case-insensitive), m (multiline — ^ and $ match line boundaries), s (dotAll — dot matches newlines)." },
        { q: "What is the difference between * and + in regex?", a: "* matches zero or more occurrences of the preceding element (can match empty strings). + matches one or more occurrences (must match at least once). For example, a* matches '' and 'aaa', while a+ only matches 'aaa'." },
        { q: "How do I match an email address with regex?", a: "A common pattern is: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$. However, email validation with regex is complex — for production use, consider using a dedicated validation library." },
        { q: "Why does my regex work differently in different languages?", a: "Different programming languages use different regex engines (PCRE, POSIX, ECMAScript). This tool uses JavaScript's RegExp engine (ECMAScript). Some features like lookbehinds may not be available in all engines." },
    ],
    "jwt-decoder": [
        { q: "What is a JWT?", a: "A JSON Web Token (JWT) is a compact, URL-safe token format used for securely transmitting information between parties. It consists of three Base64-encoded parts separated by dots: header, payload, and signature." },
        { q: "Can I decode a JWT without the secret key?", a: "Yes. The header and payload of a JWT are only Base64-encoded, not encrypted. Anyone can decode them. The secret key is only needed to verify the signature (i.e., to confirm the token hasn't been tampered with)." },
        { q: "What does the 'exp' claim mean?", a: "The 'exp' (expiration time) claim identifies the time after which the JWT must not be accepted. It's a Unix timestamp. This tool automatically checks whether the token has expired." },
        { q: "Is it safe to put sensitive data in a JWT?", a: "No. Since JWT payloads are only Base64-encoded (not encrypted), anyone who has the token can read its contents. Never put passwords, credit card numbers, or other secrets in a JWT payload." },
    ],
    "markdown-preview": [
        { q: "What is Markdown?", a: "Markdown is a lightweight markup language created by John Gruber in 2004. It uses simple syntax like # for headings, ** for bold, and - for lists to format text. It's widely used for README files, documentation, and content writing." },
        { q: "What Markdown syntax is supported?", a: "This tool supports standard Markdown including headings (#), bold (**), italic (*), links, images, ordered and unordered lists, blockquotes, code blocks, horizontal rules, and tables (GitHub Flavored Markdown)." },
        { q: "Can I export the HTML output?", a: "Yes. The tool generates clean HTML from your Markdown. You can copy the rendered HTML and use it in your web pages, emails, or documentation." },
        { q: "What is GitHub Flavored Markdown (GFM)?", a: "GFM is GitHub's extended version of Markdown that adds support for tables, task lists, strikethrough text, autolinked URLs, and syntax-highlighted code blocks." },
    ],
    "css-minifier": [
        { q: "What does CSS minification do?", a: "CSS minification removes all unnecessary characters from CSS code — whitespace, line breaks, comments, and redundant semicolons — without changing its functionality. This reduces file size and improves page load speed." },
        { q: "How much file size reduction can I expect?", a: "Typically, CSS minification reduces file size by 20-40% depending on how your CSS is written. Files with many comments and generous formatting see the biggest reductions." },
        { q: "Will minification break my CSS?", a: "No. Proper minification only removes characters that have no effect on how CSS is interpreted by browsers. Your styles will look and work exactly the same." },
        { q: "Should I minify CSS for development or production?", a: "Only for production. During development, keep your CSS readable and well-formatted for easier debugging. Minify only when deploying to production for optimal performance." },
    ],
    "diff-checker": [
        { q: "What types of differences does it detect?", a: "The tool detects three types of differences: added lines (present only in the new text), removed lines (present only in the original text), and modified lines (lines that exist in both but have different content)." },
        { q: "Can I compare code with this tool?", a: "Yes. The diff checker works with any text, including source code in any programming language. It's commonly used for code reviews, comparing configuration files, and tracking changes between versions." },
        { q: "How does the comparison algorithm work?", a: "The tool uses a line-by-line comparison algorithm similar to Unix diff. It identifies the longest common subsequence between the two texts and highlights everything that differs." },
        { q: "Can I compare files directly?", a: "Currently, the tool works with pasted text. Copy and paste the contents of two files into the left and right panels to compare them." },
    ],
    "epoch-converter": [
        { q: "What is Unix epoch time?", a: "Unix epoch time (also called POSIX time or Unix timestamp) is the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC. It's the standard way computers internally track time." },
        { q: "What is the difference between seconds and milliseconds timestamps?", a: "Unix timestamps in seconds are 10 digits (e.g., 1708300800), while millisecond timestamps are 13 digits (e.g., 1708300800000). JavaScript's Date.now() returns milliseconds, while most other systems use seconds." },
        { q: "What is the Year 2038 problem?", a: "Systems using 32-bit signed integers to store Unix timestamps will overflow on January 19, 2038. After this date, the timestamp wraps around to a negative number. Most modern systems use 64-bit integers to avoid this." },
        { q: "How do I get the current Unix timestamp in code?", a: "In JavaScript: Math.floor(Date.now() / 1000). In Python: import time; int(time.time()). In PHP: time(). In Java: System.currentTimeMillis() / 1000." },
    ],
    "slug-generator": [
        { q: "What is a URL slug?", a: "A URL slug is the human-readable part of a URL that identifies a specific page. For example, in 'example.com/blog/my-first-post', the slug is 'my-first-post'. Good slugs are lowercase, hyphenated, and descriptive." },
        { q: "Why are slugs important for SEO?", a: "Search engines use URL slugs as a ranking signal. URLs containing relevant keywords rank slightly better than generic ones. Clean, descriptive slugs also improve click-through rates in search results." },
        { q: "What characters are allowed in a URL slug?", a: "Best practice is to use only lowercase letters (a-z), numbers (0-9), and hyphens (-). Avoid underscores, spaces, special characters, and uppercase letters for maximum compatibility." },
        { q: "How does this tool handle special characters?", a: "The tool transliterates accented characters (é → e, ü → u), removes non-alphanumeric characters, converts spaces to hyphens, and removes consecutive or trailing hyphens." },
    ],
    "qr-code-generator": [
        { q: "What can I put in a QR code?", a: "QR codes can encode URLs, plain text, email addresses, phone numbers, Wi-Fi network credentials, vCards (contact info), calendar events, and more. The most common use is encoding website URLs." },
        { q: "What is the maximum data capacity of a QR code?", a: "A QR code can hold up to 4,296 alphanumeric characters or 7,089 numeric characters. However, more data means a denser QR code that's harder to scan. Keep content short for best scanning reliability." },
        { q: "Can I customize the colors of a QR code?", a: "Yes. This tool lets you customize the foreground and background colors. However, ensure high contrast between foreground and background for reliable scanning. Dark foreground on light background works best." },
        { q: "Do QR codes expire?", a: "Static QR codes (like those generated by this tool) never expire — they encode data directly. Dynamic QR codes (offered by paid services) point to a redirect URL that can be changed or disabled." },
    ],
    "cron-generator": [
        { q: "What is a cron expression?", a: "A cron expression is a string of five fields (minute, hour, day of month, month, day of week) that defines a schedule for automated tasks. For example, '0 9 * * 1' means 'every Monday at 9:00 AM'." },
        { q: "What does the asterisk (*) mean in cron?", a: "The asterisk (*) means 'every possible value' for that field. For example, * in the minute field means 'every minute', and * in the day-of-week field means 'every day of the week'." },
        { q: "What is the difference between cron and crontab?", a: "Cron is the daemon (background service) that runs scheduled tasks. Crontab (cron table) is the file where you define your scheduled tasks and their cron expressions. You edit it with 'crontab -e'." },
        { q: "Can I use cron expressions in cloud services?", a: "Yes. AWS CloudWatch Events, Azure Functions, Google Cloud Scheduler, GitHub Actions, and many CI/CD platforms use cron expressions (sometimes with slight syntax variations) for scheduling." },
    ],
    "lorem-ipsum-generator": [
        { q: "What is Lorem Ipsum?", a: "Lorem Ipsum is dummy text used in the printing and typesetting industry since the 1500s. It is derived from a scrambled section of 'De Finibus Bonorum et Malorum' by Cicero, written in 45 BC." },
        { q: "Why use Lorem Ipsum instead of real text?", a: "Lorem Ipsum helps focus on visual design without the distraction of readable content. Real text can bias viewers toward reading rather than evaluating layout, typography, and spacing." },
        { q: "Is Lorem Ipsum real Latin?", a: "Lorem Ipsum is based on Latin but is not standard Latin. It is a scrambled and altered version of a passage by Cicero. Some words are real Latin, while others are modified or made up." },
        { q: "Can I use Lorem Ipsum in my projects commercially?", a: "Yes. Lorem Ipsum is in the public domain and can be used freely in any project. It is meant as placeholder text and should be replaced with real content before publishing." },
    ],
    "url-encoder-decoder": [
        { q: "Why do URLs need encoding?", a: "URLs can only contain a limited set of ASCII characters. Special characters like spaces, &, =, and non-ASCII characters must be percent-encoded (e.g., space → %20) to be valid in URLs." },
        { q: "What is the difference between encodeURI and encodeURIComponent?", a: "encodeURI() encodes a complete URI, preserving characters like :, /, ?, and #. encodeURIComponent() encodes everything except letters, digits, and a few special characters — use it for encoding individual query parameter values." },
        { q: "What does %20 mean in a URL?", a: "%20 is the percent-encoded representation of a space character. Sometimes you'll also see + used for spaces in query strings (application/x-www-form-urlencoded), but %20 is the standard URL encoding." },
        { q: "Is URL encoding reversible?", a: "Yes. URL encoding is a simple, reversible transformation. Any percent-encoded string can be decoded back to its original characters using this tool or the decodeURIComponent() function in JavaScript." },
    ],
    "html-encoder-decoder": [
        { q: "Why do I need to encode HTML entities?", a: "HTML encoding prevents special characters like <, >, and & from being interpreted as HTML tags or entities. This is essential for displaying code snippets and preventing cross-site scripting (XSS) attacks." },
        { q: "What is XSS and how does HTML encoding prevent it?", a: "XSS (Cross-Site Scripting) is an attack where malicious scripts are injected into web pages. HTML encoding user input ensures that < and > are displayed as text rather than interpreted as HTML tags, preventing script execution." },
        { q: "What is the difference between &amp; and &#38;?", a: "&amp; is a named HTML entity, while &#38; is its numeric equivalent. Both represent the ampersand (&) character. Named entities are more readable, while numeric entities work for any Unicode character." },
        { q: "Should I encode all special characters?", a: "At minimum, encode these five characters: < (&lt;), > (&gt;), & (&amp;), \" (&quot;), and ' (&#39;). These are the characters that can cause interpretation issues or security vulnerabilities in HTML." },
    ],
};

// Generic FAQ generator for tools without specific FAQs
function generateGenericFAQs(toolName) {
    const name = toolName.replace(/[<>]/g, "");
    return [
        { q: `Is the ${name} free to use?`, a: `Yes, the ${name} is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.` },
        { q: `Is my data safe when using this tool?`, a: `Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.` },
        { q: `Does this tool work on mobile devices?`, a: `Yes. The ${name} is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.` },
        { q: `Do I need to install anything?`, a: `No. The ${name} runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.` },
    ];
}

function escJSX(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
}

function generateFAQJSX(faqs) {
    let jsx = `\n        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">\n`;
    jsx += `          Frequently Asked Questions\n`;
    jsx += `        </h2>\n`;
    jsx += `        <div className="space-y-4">\n`;
    for (const faq of faqs) {
        jsx += `          <details className="group">\n`;
        jsx += `            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">\n`;
        jsx += `              ${escJSX(faq.q)}\n`;
        jsx += `            </summary>\n`;
        jsx += `            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">\n`;
        jsx += `              ${escJSX(faq.a)}\n`;
        jsx += `            </p>\n`;
        jsx += `          </details>\n`;
    }
    jsx += `        </div>\n`;
    return jsx;
}

// ── Main ─────────────────────────────────────────────────
const dirs = readdirSync(APP_DIR).filter((d) => {
    if (SKIP.has(d)) return false;
    try { return statSync(join(APP_DIR, d)).isDirectory(); } catch { return false; }
});

let pagesUpdated = 0;
let layoutsUpdated = 0;

for (const slug of dirs) {
    const pagePath = join(APP_DIR, slug, "page.tsx");
    const layoutPath = join(APP_DIR, slug, "layout.tsx");

    let pageContent;
    try {
        pageContent = readFileSync(pagePath, "utf-8");
    } catch { continue; }

    // Skip if FAQ already exists
    if (pageContent.includes("Frequently Asked Questions")) continue;

    const tool = toolEntries[slug];
    if (!tool) continue;

    const faqs = TOOL_FAQS[slug] || generateGenericFAQs(tool.name);

    // ── Inject FAQ into page.tsx ──
    // Insert FAQ before the closing </div> of the SEO content section, or before </ToolLayout>
    const seoContentIdx = pageContent.indexOf("{/* SEO Content */}");
    const toolLayoutCloseIdx = pageContent.lastIndexOf("</ToolLayout>");

    if (toolLayoutCloseIdx === -1) continue;

    let insertIdx;
    if (seoContentIdx !== -1) {
        // Find the closing </div> of the SEO content section (last </div> before </ToolLayout>)
        const seoSection = pageContent.slice(seoContentIdx, toolLayoutCloseIdx);
        const lastDivClose = seoSection.lastIndexOf("</div>");
        if (lastDivClose !== -1) {
            insertIdx = seoContentIdx + lastDivClose;
        } else {
            insertIdx = toolLayoutCloseIdx;
        }
    } else {
        insertIdx = toolLayoutCloseIdx;
    }

    const faqJSX = generateFAQJSX(faqs);
    const newPageContent = pageContent.slice(0, insertIdx) + faqJSX + pageContent.slice(insertIdx);
    writeFileSync(pagePath, newPageContent, "utf-8");
    pagesUpdated++;

    // ── Add FAQSchema to layout.tsx ──
    if (existsSync(layoutPath)) {
        let layoutContent = readFileSync(layoutPath, "utf-8");

        // Skip if already has FAQSchema
        if (layoutContent.includes("FAQSchema")) continue;

        // Add import
        if (!layoutContent.includes("FAQSchema")) {
            layoutContent = layoutContent.replace(
                /import SchemaOrg/,
                'import FAQSchema from "@/components/FAQSchema";\nimport SchemaOrg'
            );
        }

        // Build FAQ data string for layout
        const faqDataStr = JSON.stringify(faqs.map(f => ({ question: f.q, answer: f.a })));

        // Add FAQSchema component after SchemaOrg
        layoutContent = layoutContent.replace(
            /(<SchemaOrg[^/]*\/>)/,
            `$1\n        <FAQSchema faqs={${faqDataStr}} />`
        );

        writeFileSync(layoutPath, layoutContent, "utf-8");
        layoutsUpdated++;
    }
}

console.log(`\n✅ Updated ${pagesUpdated} page.tsx files with FAQ sections.`);
console.log(`✅ Updated ${layoutsUpdated} layout.tsx files with FAQPage JSON-LD schema.`);
