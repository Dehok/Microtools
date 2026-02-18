/**
 * Expands SEO content sections in all tool pages.
 * For tools that already have good SEO content (>200 words), it leaves them alone.
 * For tools with short or missing SEO sections, it injects comprehensive content.
 *
 * Run: node expand-seo.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const APP_DIR = join(import.meta.dirname, "src", "app");
const SKIP = new Set(["about", "privacy", "fonts"]);

// SEO content definitions for each tool.
// Keys are slugs, values have: about, features (array), useCases (array), howTo
const SEO_DATA = {
    "json-formatter": {
        about: "The JSON Formatter is a free online tool that helps you format, beautify, validate, and minify JSON data instantly. Whether you are debugging API responses, cleaning up configuration files, or preparing JSON for documentation, this tool makes it easy to work with JSON without installing any software.",
        features: [
            ["Format & Beautify", "Automatically indents and formats JSON with customizable spacing (2 or 4 spaces, or tabs) for maximum readability."],
            ["Validate JSON", "Instantly detects and highlights syntax errors such as missing brackets, trailing commas, unquoted keys, and mismatched braces."],
            ["Minify JSON", "Compresses JSON by removing all unnecessary whitespace and line breaks, reducing file size for production use."],
            ["Syntax Highlighting", "Color-coded output makes it easy to distinguish between keys, values, strings, numbers, booleans, and null values."],
        ],
        useCases: [
            "Debugging REST API responses by formatting raw JSON payloads",
            "Cleaning up and validating JSON configuration files (package.json, tsconfig.json, etc.)",
            "Preparing JSON data for documentation, presentations, or code reviews",
            "Minifying JSON before embedding it in scripts or sending over the network",
            "Validating JSON syntax before importing data into databases or applications",
        ],
        howTo: "Paste your JSON data into the input area or type it directly. Click \"Format / Beautify\" to prettify the JSON with proper indentation, or click \"Minify\" to compress it into a single line. If your JSON contains errors, the tool will display the error message with the location of the problem. You can copy the formatted output to your clipboard with one click.",
    },
    "base64-encode-decode": {
        about: "The Base64 Encoder/Decoder is a free online tool that converts text to Base64-encoded strings and decodes Base64 back to readable text. Base64 encoding is commonly used in web development, email protocols, and data serialization to safely transmit binary data as ASCII text.",
        features: [
            ["Encode to Base64", "Converts any text or string into its Base64-encoded representation using the standard Base64 alphabet."],
            ["Decode from Base64", "Converts Base64-encoded strings back into their original readable text format."],
            ["Instant Results", "Encoding and decoding happen in real time as you type, with no need to click a button."],
            ["UTF-8 Support", "Handles Unicode and special characters correctly by encoding text as UTF-8 before Base64 conversion."],
        ],
        useCases: [
            "Encoding data for embedding in HTML data URIs (e.g., inline images or fonts)",
            "Decoding Base64 strings from API responses, cookies, or authentication tokens",
            "Preparing binary data for transmission in JSON, XML, or email attachments",
            "Debugging encoded values in URLs, headers, or configuration files",
            "Learning and experimenting with Base64 encoding for educational purposes",
        ],
        howTo: "Select the mode (Encode or Decode) and paste your text into the input area. The result appears instantly in the output. Use the Copy button to copy the encoded or decoded text to your clipboard.",
    },
    "uuid-generator": {
        about: "The UUID Generator creates random universally unique identifiers (UUIDs) following the version 4 (v4) standard. UUIDs are 128-bit identifiers used extensively in software development for database records, API keys, session tokens, and distributed systems where unique identification without central coordination is required.",
        features: [
            ["UUID v4 Generation", "Creates cryptographically random UUIDs conforming to RFC 4122 version 4 specification."],
            ["Bulk Generation", "Generate multiple UUIDs at once for batch operations, database seeding, or test data creation."],
            ["One-Click Copy", "Copy individual UUIDs or all generated UUIDs to your clipboard with a single click."],
            ["Instant Generation", "UUIDs are generated using the browser's crypto.getRandomValues() for high-quality randomness."],
        ],
        useCases: [
            "Creating unique primary keys for database records in PostgreSQL, MongoDB, or other databases",
            "Generating unique identifiers for API resources, session tokens, or correlation IDs",
            "Seeding test databases with realistic unique identifiers",
            "Creating unique filenames or resource identifiers in distributed systems",
            "Generating tracking IDs for analytics events, logs, or audit trails",
        ],
        howTo: "Click the Generate button to create a new UUID. Use the bulk generation option to create multiple UUIDs at once. Click on any UUID to copy it to your clipboard.",
    },
    "password-generator": {
        about: "The Password Generator creates strong, random passwords with customizable length and character sets. Using the browser's cryptographic random number generator, it produces passwords that are virtually impossible to guess or crack through brute-force attacks.",
        features: [
            ["Customizable Length", "Set password length from 4 to 128 characters to meet various security requirements."],
            ["Character Set Selection", "Choose which character types to include: uppercase letters, lowercase letters, numbers, and special symbols."],
            ["Strength Indicator", "Visual password strength meter shows how strong the generated password is based on length and complexity."],
            ["Cryptographic Randomness", "Uses crypto.getRandomValues() for true randomness, unlike Math.random() which is predictable."],
        ],
        useCases: [
            "Creating strong passwords for online accounts, email, and social media",
            "Generating secure API keys and secret tokens for applications",
            "Creating master passwords for password managers",
            "Generating random strings for encryption keys and salts",
            "Meeting specific password requirements (minimum length, special characters, etc.)",
        ],
        howTo: "Adjust the password length using the slider and select which character types to include (uppercase, lowercase, numbers, symbols). Click Generate to create a new password. The strength indicator shows how secure the password is. Copy the password to your clipboard with the Copy button.",
    },
    "color-picker": {
        about: "The Color Picker is a free online tool for selecting colors and converting between HEX, RGB, and HSL formats. Whether you are designing a website, creating a brand identity, or choosing colors for a project, this tool lets you pick colors visually and get CSS-ready values instantly.",
        features: [
            ["Visual Color Picker", "Click anywhere on the color spectrum to select your desired color with precision."],
            ["Format Conversion", "Instantly converts between HEX, RGB, and HSL color formats with accurate values."],
            ["CSS-Ready Output", "Copies color values in CSS-compatible format, ready to paste into your stylesheets."],
            ["Color Preview", "Large preview area shows the selected color alongside its various format representations."],
        ],
        useCases: [
            "Choosing colors for web design projects and CSS styling",
            "Converting colors between HEX, RGB, and HSL for different design tools",
            "Picking brand colors and generating their various format representations",
            "Matching colors from mockups and converting them to code-ready values",
            "Experimenting with color variations by adjusting hue, saturation, and lightness",
        ],
        howTo: "Use the color picker to select a color visually, or enter a specific color value in any supported format (HEX, RGB, or HSL). The tool instantly converts and displays the color in all formats. Click the Copy button next to any format to copy the color value to your clipboard.",
    },
    "word-counter": {
        about: "The Word Counter is a free online text analysis tool that counts words, characters, sentences, and paragraphs in any text. It is essential for writers, students, and content creators who need to meet word count requirements for essays, blog posts, social media captions, or SEO content.",
        features: [
            ["Word Count", "Accurately counts words by splitting text on whitespace while handling multiple spaces and line breaks."],
            ["Character Count", "Counts total characters including spaces, and characters without spaces for precise length tracking."],
            ["Sentence Count", "Detects sentence boundaries using punctuation marks (periods, question marks, exclamation points)."],
            ["Paragraph Count", "Counts paragraphs separated by blank lines for document structure analysis."],
        ],
        useCases: [
            "Checking word count for essays, assignments, and academic papers",
            "Monitoring character limits for social media posts (Twitter, Instagram, LinkedIn)",
            "Ensuring SEO content meets recommended word count targets",
            "Tracking writing progress for blog posts, articles, and books",
            "Analyzing text statistics for readability and content optimization",
        ],
        howTo: "Paste or type your text into the input area. All statistics (words, characters, sentences, paragraphs) are calculated instantly in real time. The counts update automatically as you edit the text.",
    },
    "hash-generator": {
        about: "The Hash Generator creates cryptographic hash values from any text input using popular algorithms including MD5, SHA-1, SHA-256, and SHA-512. Hashing is a one-way function that converts data into a fixed-length string, widely used for data integrity verification, password storage, and digital signatures.",
        features: [
            ["Multiple Algorithms", "Supports MD5, SHA-1, SHA-256, and SHA-512 hash algorithms for various security requirements."],
            ["Instant Hashing", "Generates hash values in real time as you type, with no need to submit a form."],
            ["Hex Output", "Displays hash values in standard hexadecimal format, compatible with all programming languages and tools."],
            ["One-Click Copy", "Copy any hash value to your clipboard with a single click for easy use in your projects."],
        ],
        useCases: [
            "Verifying file integrity by comparing hash values before and after transfer",
            "Generating hash values for password storage and authentication systems",
            "Creating checksums for data validation and error detection",
            "Comparing hash outputs across different algorithms for security analysis",
            "Generating deterministic identifiers from text input for caching or deduplication",
        ],
        howTo: "Enter or paste your text into the input area. Hash values for all supported algorithms are generated instantly. Click the Copy button next to any hash to copy it to your clipboard.",
    },
    "markdown-preview": {
        about: "The Markdown Preview tool lets you write Markdown and see the rendered HTML output in real time. Markdown is a lightweight markup language used for README files, documentation, blog posts, and note-taking. This tool supports standard Markdown syntax including headings, lists, links, images, code blocks, and more.",
        features: [
            ["Live Preview", "See your Markdown rendered as HTML instantly as you type, with no delay."],
            ["Full Syntax Support", "Supports headings, bold, italic, links, images, lists, blockquotes, code blocks, and tables."],
            ["Split View", "Side-by-side editor and preview layout for efficient editing and reviewing."],
            ["Clean HTML Output", "Generates clean, semantic HTML that can be copied and used in web pages."],
        ],
        useCases: [
            "Writing and previewing GitHub README files before committing",
            "Drafting blog posts and articles in Markdown format",
            "Creating documentation with proper formatting and structure",
            "Learning Markdown syntax by seeing instant visual feedback",
            "Converting Markdown notes to HTML for web publishing",
        ],
        howTo: "Type or paste your Markdown content into the editor on the left. The rendered HTML preview appears instantly on the right. Edit your content and see the changes reflected in real time.",
    },
    "css-minifier": {
        about: "The CSS Minifier removes unnecessary whitespace, comments, and formatting from CSS code to reduce file size. Minified CSS loads faster by reducing the number of bytes transferred over the network. The beautifier mode reformats minified or poorly formatted CSS into a readable, properly indented format.",
        features: [
            ["Minify CSS", "Removes all comments, whitespace, and line breaks while preserving the CSS functionality."],
            ["Beautify CSS", "Reformats compressed CSS with proper indentation, line breaks, and spacing for readability."],
            ["Size Comparison", "Shows the original and minified file sizes so you can see the space savings."],
            ["Error Preservation", "Maintains CSS validity during minification — your styles will work exactly the same."],
        ],
        useCases: [
            "Minifying CSS files before deploying to production for faster page loads",
            "Beautifying minified CSS from third-party libraries for debugging and modification",
            "Reducing CSS file size to improve Core Web Vitals and page performance scores",
            "Formatting CSS pasted from browser DevTools into readable code",
            "Preparing CSS for code reviews by ensuring consistent formatting",
        ],
        howTo: "Paste your CSS code into the input area. Click \"Minify\" to compress the CSS or \"Beautify\" to format it with proper indentation. The result appears in the output area. Copy the processed CSS with the Copy button.",
    },
    "diff-checker": {
        about: "The Diff Checker compares two texts and highlights the differences between them line by line. It is an essential tool for code reviews, document comparison, and version tracking. The tool shows added, removed, and modified lines with color-coded highlighting for easy identification.",
        features: [
            ["Line-by-Line Comparison", "Compares text line by line and identifies additions, deletions, and modifications."],
            ["Color-Coded Output", "Green highlights for added lines, red for removed lines, making differences easy to spot."],
            ["Inline Diff", "Shows character-level changes within modified lines for precise difference identification."],
            ["Clean Interface", "Side-by-side text input areas with clear labeling for original and modified text."],
        ],
        useCases: [
            "Comparing code changes before committing or during code reviews",
            "Checking differences between configuration file versions",
            "Verifying document changes between drafts",
            "Debugging by comparing expected vs. actual output",
            "Tracking content changes in text files, scripts, or data files",
        ],
        howTo: "Paste the original text in the left panel and the modified text in the right panel. The differences are highlighted automatically. Added lines appear in green, removed lines in red, and modified lines show both old and new content.",
    },
    "regex-tester": {
        about: "The Regex Tester lets you test regular expressions against sample text with real-time match highlighting. Regular expressions are powerful patterns used for searching, matching, and manipulating text in programming. This tool helps you build, debug, and validate regex patterns before using them in your code.",
        features: [
            ["Real-Time Matching", "Highlights all matches instantly as you type or modify your regex pattern."],
            ["Flag Support", "Toggle regex flags including global (g), case-insensitive (i), and multiline (m)."],
            ["Match Details", "Shows all matched groups, capture groups, and their positions in the text."],
            ["Error Detection", "Highlights syntax errors in your regex pattern with descriptive error messages."],
        ],
        useCases: [
            "Building and debugging regex patterns for form validation (email, phone, URL)",
            "Testing text extraction patterns for web scraping and data parsing",
            "Creating search-and-replace patterns for batch text processing",
            "Learning regex syntax with immediate visual feedback on matches",
            "Validating regex patterns before implementing them in code (JavaScript, Python, etc.)",
        ],
        howTo: "Enter your regular expression pattern in the regex input field and set the desired flags (global, case-insensitive, multiline). Then paste or type your test text below. All matches are highlighted in real time. Match details show the matched text, groups, and positions.",
    },
    "jwt-decoder": {
        about: "The JWT Decoder lets you decode and inspect JSON Web Tokens (JWTs) without needing the secret key. JWTs are widely used in authentication and authorization systems (OAuth 2.0, OpenID Connect) to securely transmit information between parties. This tool displays the header, payload, and signature sections of any JWT.",
        features: [
            ["Header Inspection", "Decodes and displays the JWT header showing the algorithm and token type."],
            ["Payload Display", "Shows all claims in the payload including standard claims (iss, sub, exp, iat) and custom data."],
            ["Expiration Check", "Automatically checks if the token has expired based on the exp claim."],
            ["Pretty Formatting", "Displays the decoded header and payload as formatted, readable JSON."],
        ],
        useCases: [
            "Debugging authentication issues by inspecting JWT contents and expiration times",
            "Verifying JWT payload data during API development and testing",
            "Inspecting tokens received from OAuth 2.0 and OpenID Connect providers",
            "Checking token claims for authorization and access control debugging",
            "Learning about JWT structure and claims for educational purposes",
        ],
        howTo: "Paste your JWT token into the input field. The tool automatically decodes and displays the header, payload, and signature information. The expiration status is shown if the token contains an exp claim.",
    },
    "slug-generator": {
        about: "The Slug Generator converts any text into a clean, URL-friendly slug. Slugs are the human-readable portion of a URL that identifies a page, such as \"my-blog-post\" in \"example.com/blog/my-blog-post\". Good slugs improve SEO, readability, and user experience.",
        features: [
            ["Instant Conversion", "Transforms text to a URL-friendly slug in real time as you type."],
            ["Special Character Handling", "Removes or transliterates accented characters, symbols, and non-ASCII characters."],
            ["Lowercase & Hyphenated", "Converts all text to lowercase and replaces spaces with hyphens for URL compatibility."],
            ["Clean Output", "Removes consecutive hyphens, leading/trailing hyphens, and invalid URL characters."],
        ],
        useCases: [
            "Generating URL slugs for blog posts, product pages, and CMS content",
            "Creating SEO-friendly URLs that include target keywords",
            "Converting article titles to slugs for static site generators (Next.js, Hugo, Jekyll)",
            "Generating file names from titles for content management systems",
            "Creating clean permalink structures for web applications",
        ],
        howTo: "Type or paste your text (e.g., a blog post title) into the input field. The URL-friendly slug is generated instantly. Copy the slug with the Copy button and use it in your URLs.",
    },
    "epoch-converter": {
        about: "The Epoch Converter transforms Unix timestamps (seconds since January 1, 1970 UTC) into human-readable dates and vice versa. Unix timestamps are the standard way computers track time internally and are used extensively in databases, APIs, log files, and server configurations.",
        features: [
            ["Timestamp to Date", "Converts Unix epoch timestamps (seconds or milliseconds) to human-readable date and time."],
            ["Date to Timestamp", "Converts any date and time to its Unix epoch timestamp representation."],
            ["Current Timestamp", "Shows the current Unix timestamp updating in real time."],
            ["Multiple Formats", "Displays dates in ISO 8601, UTC, and local time zone formats."],
        ],
        useCases: [
            "Converting API timestamps to readable dates for debugging and logging",
            "Generating Unix timestamps for database queries and data filters",
            "Comparing timestamps from different systems or time zones",
            "Setting expiration times for tokens, cookies, and cache entries",
            "Debugging time-related issues in server logs and application data",
        ],
        howTo: "Enter a Unix timestamp (in seconds or milliseconds) to see it converted to a human-readable date. Or use the date picker to select a date and get the corresponding Unix timestamp. The current timestamp is displayed at the top for reference.",
    },
    "cron-generator": {
        about: "The Cron Expression Generator helps you build and understand cron expressions using a visual, interactive editor. Cron expressions define schedules for automated tasks in Linux, macOS, and many server environments. Instead of memorizing the cryptic five-field syntax, this tool lets you select time intervals visually.",
        features: [
            ["Visual Editor", "Select minutes, hours, days, months, and weekdays from dropdown menus instead of writing raw cron syntax."],
            ["Expression Preview", "See the generated cron expression update in real time as you adjust the schedule."],
            ["Human-Readable Description", "Displays a natural-language description of what the cron expression means."],
            ["Common Presets", "Quick-select buttons for common schedules like every minute, hourly, daily, weekly, and monthly."],
        ],
        useCases: [
            "Setting up scheduled tasks (cron jobs) on Linux and Unix servers",
            "Configuring CI/CD pipeline schedules in GitHub Actions, GitLab CI, or Jenkins",
            "Scheduling database backups, log rotation, and cleanup tasks",
            "Defining schedule expressions for cloud services (AWS CloudWatch, Azure Scheduler)",
            "Learning cron syntax with immediate visual feedback",
        ],
        howTo: "Use the visual editor to select your desired schedule by choosing values for minutes, hours, days of month, months, and days of week. The cron expression is generated automatically. Use preset buttons for common schedules. Copy the expression and use it in your crontab or scheduling service.",
    },
    "lorem-ipsum-generator": {
        about: "The Lorem Ipsum Generator creates placeholder text for design mockups, website layouts, and document templates. Lorem Ipsum has been the industry-standard dummy text since the 1500s, providing realistic-looking text without distracting from the visual design.",
        features: [
            ["Multiple Output Types", "Generate paragraphs, sentences, or individual words based on your needs."],
            ["Customizable Amount", "Choose exactly how many paragraphs, sentences, or words you want to generate."],
            ["Standard Lorem Ipsum", "Uses the classic Lorem Ipsum text that designers and developers have relied on for decades."],
            ["One-Click Copy", "Copy the generated placeholder text to your clipboard instantly."],
        ],
        useCases: [
            "Filling website mockups and wireframes with realistic placeholder text",
            "Testing typography, font sizes, and line spacing in web designs",
            "Populating database records with dummy content for development and testing",
            "Creating document templates with placeholder text for content management systems",
            "Demonstrating layout designs to clients before real content is available",
        ],
        howTo: "Select whether you want paragraphs, sentences, or words. Set the desired amount using the controls. The Lorem Ipsum text is generated instantly. Copy it to your clipboard with the Copy button.",
    },
    "qr-code-generator": {
        about: "The QR Code Generator creates QR codes from text, URLs, or any data you enter. QR codes are two-dimensional barcodes that can be scanned by smartphone cameras to quickly access links, share contact information, or transmit data. This tool lets you customize colors and download the QR code as PNG or SVG.",
        features: [
            ["Custom Content", "Generate QR codes from URLs, plain text, email addresses, phone numbers, or Wi-Fi credentials."],
            ["Color Customization", "Choose custom foreground and background colors to match your brand or design."],
            ["Multiple Formats", "Download QR codes as PNG for web use or SVG for print and scalable graphics."],
            ["Instant Preview", "See the QR code update in real time as you type or modify the content."],
        ],
        useCases: [
            "Creating QR codes for business cards, flyers, and marketing materials",
            "Generating scannable links for websites, apps, or social media profiles",
            "Sharing Wi-Fi network credentials with guests via QR codes",
            "Adding QR codes to product packaging for quick access to manuals or support",
            "Creating QR codes for event tickets, menus, and promotional campaigns",
        ],
        howTo: "Enter your text or URL in the input field. The QR code is generated instantly. Customize the foreground and background colors if desired. Download the QR code as PNG or SVG using the download buttons.",
    },
    "url-encoder-decoder": {
        about: "The URL Encoder/Decoder converts special characters in URLs to their percent-encoded equivalents and back. URL encoding (also called percent encoding) replaces unsafe characters with a % followed by their hexadecimal value, ensuring URLs are valid and can be transmitted safely across the internet.",
        features: [
            ["Encode URLs", "Converts special characters (spaces, &, =, ?, etc.) to percent-encoded format."],
            ["Decode URLs", "Converts percent-encoded strings back to their original readable characters."],
            ["Full Character Support", "Handles Unicode characters, query parameters, and fragment identifiers correctly."],
            ["Real-Time Results", "Encoding and decoding happen instantly as you type."],
        ],
        useCases: [
            "Encoding query parameters before appending them to URLs in web applications",
            "Decoding URLs from API responses, logs, or analytics data",
            "Preparing URLs with special characters for use in HTML, JavaScript, or API calls",
            "Debugging URL encoding issues in web applications and redirects",
            "Encoding file paths and resource identifiers for use in REST APIs",
        ],
        howTo: "Select Encode or Decode mode. Paste your URL or text into the input field. The encoded or decoded result appears instantly. Copy the result with the Copy button.",
    },
    "html-encoder-decoder": {
        about: "The HTML Encoder/Decoder converts special characters to their HTML entity equivalents and back. HTML encoding prevents browser rendering issues and cross-site scripting (XSS) vulnerabilities by escaping characters like <, >, &, and quotes that have special meaning in HTML.",
        features: [
            ["Encode HTML", "Converts special characters (<, >, &, \", ') to their corresponding HTML entities."],
            ["Decode HTML", "Converts HTML entities back to their original characters for readability."],
            ["Named & Numeric Entities", "Supports both named entities (&amp;) and numeric entities (&#38;)."],
            ["XSS Prevention", "Helps sanitize user input by encoding characters that could execute malicious scripts."],
        ],
        useCases: [
            "Encoding user-generated content before displaying it in web pages to prevent XSS",
            "Displaying HTML code snippets in tutorials and documentation without browser rendering",
            "Preparing text for safe inclusion in HTML attributes and meta tags",
            "Decoding HTML entities from parsed web content or API responses",
            "Converting special characters for use in email templates and newsletters",
        ],
        howTo: "Select Encode or Decode mode. Paste your text or HTML into the input area. The encoded or decoded result appears instantly. Copy the result to use in your HTML documents.",
    },
};

// For tools not explicitly listed above, generate generic but useful SEO content
function generateGenericSEO(slug, toolName, description) {
    const cleanName = toolName.replace(/[<>]/g, "");
    return {
        about: `The ${cleanName} is a free online tool available on CodeUtilo. ${description} All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.`,
        features: [
            ["Browser-Based Processing", `All ${cleanName.toLowerCase()} operations run locally in your browser using JavaScript. Your data never leaves your device.`],
            ["Instant Results", `Get results immediately as you type or paste your input. No waiting for server responses or page reloads.`],
            ["Free & No Signup", `Use the ${cleanName.toLowerCase()} as many times as you need without creating an account or paying anything.`],
            ["Mobile Friendly", `Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.`],
        ],
        useCases: [
            `Using the ${cleanName.toLowerCase()} for day-to-day development tasks`,
            "Saving time on repetitive tasks by using a browser-based tool instead of writing custom code",
            "Working on projects where installing software is not an option (school, work, shared computers)",
            "Quick prototyping and debugging without switching to a terminal or IDE",
            `Sharing the tool link with colleagues who need the same functionality`,
        ],
        howTo: `Enter your input in the text area provided and the ${cleanName.toLowerCase()} will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.`,
    };
}

// Generate the JSX string for SEO content
function generateSEOJSX(data) {
    let jsx = `\n      {/* SEO Content */}\n`;
    jsx += `      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">\n`;

    // About section
    jsx += `        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">\n`;
    jsx += `          About This Tool\n`;
    jsx += `        </h2>\n`;
    jsx += `        <p>\n`;
    jsx += `          ${escapeJSX(data.about)}\n`;
    jsx += `        </p>\n\n`;

    // Features
    if (data.features && data.features.length > 0) {
        jsx += `        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">\n`;
        jsx += `          Key Features\n`;
        jsx += `        </h2>\n`;
        jsx += `        <ul className="list-disc list-inside space-y-2">\n`;
        for (const [title, desc] of data.features) {
            jsx += `          <li>\n`;
            jsx += `            <strong className="text-gray-700 dark:text-gray-300">${escapeJSX(title)}</strong> — ${escapeJSX(desc)}\n`;
            jsx += `          </li>\n`;
        }
        jsx += `        </ul>\n\n`;
    }

    // Use cases
    if (data.useCases && data.useCases.length > 0) {
        jsx += `        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">\n`;
        jsx += `          Common Use Cases\n`;
        jsx += `        </h2>\n`;
        jsx += `        <ul className="list-disc list-inside space-y-2">\n`;
        for (const uc of data.useCases) {
            jsx += `          <li>${escapeJSX(uc)}</li>\n`;
        }
        jsx += `        </ul>\n\n`;
    }

    // How to
    jsx += `        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">\n`;
    jsx += `          How to Use\n`;
    jsx += `        </h2>\n`;
    jsx += `        <p>\n`;
    jsx += `          ${escapeJSX(data.howTo)}\n`;
    jsx += `        </p>\n`;

    jsx += `      </div>\n`;
    return jsx;
}

function escapeJSX(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Main logic
const dirs = readdirSync(APP_DIR).filter((d) => {
    if (SKIP.has(d)) return false;
    try { return statSync(join(APP_DIR, d)).isDirectory(); } catch { return false; }
});

// Read tools.ts to get tool names and descriptions
const toolsContent = readFileSync(join(import.meta.dirname, "src", "lib", "tools.ts"), "utf-8");
const toolEntries = {};
const slugMatches = [...toolsContent.matchAll(/slug:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?description:\s*"([^"]+)"/g)];
for (const m of slugMatches) {
    toolEntries[m[1]] = { name: m[2], description: m[3] };
}

let updated = 0;
let skipped = 0;

for (const slug of dirs) {
    const filePath = join(APP_DIR, slug, "page.tsx");
    let content;
    try {
        content = readFileSync(filePath, "utf-8");
    } catch {
        continue;
    }

    // Check if the page already has substantial SEO content
    // Look for the SEO Content marker or substantial text after the tool UI
    const seoMarker = content.indexOf("{/* SEO Content */}");
    const aboutMatch = content.match(/About (the |this |)[\w\s]+ Tool/i);

    // Count words in existing SEO section
    let existingSEOWords = 0;
    if (seoMarker !== -1) {
        const seoSection = content.slice(seoMarker);
        const textContent = seoSection.replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "");
        existingSEOWords = textContent.split(/\s+/).filter(w => w.length > 2).length;
    } else if (aboutMatch) {
        const seoSection = content.slice(aboutMatch.index);
        const textContent = seoSection.replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "");
        existingSEOWords = textContent.split(/\s+/).filter(w => w.length > 2).length;
    }

    // Skip if already has substantial content (>200 useful words)
    if (existingSEOWords > 200) {
        skipped++;
        continue;
    }

    // Get SEO data
    const seoData = SEO_DATA[slug] || generateGenericSEO(
        slug,
        toolEntries[slug]?.name || slug.replace(/-/g, " "),
        toolEntries[slug]?.description || ""
    );

    const seoJSX = generateSEOJSX(seoData);

    // Find where to inject SEO content
    // Strategy: Insert before the closing </ToolLayout> or before the last closing div/section
    let newContent;

    if (seoMarker !== -1) {
        // Replace existing SEO section
        const beforeSEO = content.slice(0, seoMarker);
        // Find the closing </ToolLayout> or equivalent after the SEO section
        const afterSEOIndex = content.indexOf("</ToolLayout>", seoMarker);
        if (afterSEOIndex === -1) {
            skipped++;
            continue;
        }
        newContent = beforeSEO + seoJSX + "    " + content.slice(afterSEOIndex);
    } else {
        // Insert before closing </ToolLayout>
        const closingTag = "</ToolLayout>";
        const closingIndex = content.lastIndexOf(closingTag);
        if (closingIndex === -1) {
            skipped++;
            continue;
        }
        newContent = content.slice(0, closingIndex) + seoJSX + "    " + content.slice(closingIndex);
    }

    writeFileSync(filePath, newContent, "utf-8");
    updated++;
}

console.log(`\n✅ Updated ${updated} pages with expanded SEO content.`);
console.log(`⏭️  Skipped ${skipped} pages (already had substantial content or no ToolLayout).`);
