"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function GithubReadmeGenerator() {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [about, setAbout] = useState("");
  const [currentWork, setCurrentWork] = useState("");
  const [learning, setLearning] = useState("");
  const [collaborate, setCollaborate] = useState("");
  const [contact, setContact] = useState("");
  const [funFact, setFunFact] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [languages, setLanguages] = useState("");
  const [showStats, setShowStats] = useState(true);
  const [showStreak, setShowStreak] = useState(true);
  const [showTopLangs, setShowTopLangs] = useState(true);

  const markdown = useMemo(() => {
    const lines: string[] = [];

    if (name) {
      lines.push(`# Hi there, I'm ${name} 👋`);
    } else {
      lines.push("# Hi there 👋");
    }
    lines.push("");

    if (subtitle) {
      lines.push(`### ${subtitle}`);
      lines.push("");
    }

    if (about) {
      lines.push(about);
      lines.push("");
    }

    const bullets: string[] = [];
    if (currentWork) bullets.push(`🔭 I'm currently working on **${currentWork}**`);
    if (learning) bullets.push(`🌱 I'm currently learning **${learning}**`);
    if (collaborate) bullets.push(`👯 I'm looking to collaborate on **${collaborate}**`);
    if (contact) bullets.push(`📫 How to reach me: **${contact}**`);
    if (funFact) bullets.push(`⚡ Fun fact: **${funFact}**`);

    if (bullets.length > 0) {
      lines.push(...bullets.map((b) => `- ${b}`));
      lines.push("");
    }

    // Social links
    const socials: string[] = [];
    if (twitter) {
      socials.push(`[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${twitter})`);
    }
    if (linkedin) {
      socials.push(`[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/${linkedin})`);
    }
    if (website) {
      socials.push(`[![Website](https://img.shields.io/badge/Website-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](${website})`);
    }

    if (socials.length > 0) {
      lines.push("### Connect with me:");
      lines.push(socials.join(" "));
      lines.push("");
    }

    // Languages & tools
    if (languages.trim()) {
      lines.push("### Languages and Tools:");
      lines.push("");
      const langs = languages.split(",").map((l) => l.trim().toLowerCase()).filter(Boolean);
      const badges = langs.map((lang) => {
        const colors: Record<string, string> = {
          javascript: "F7DF1E", typescript: "3178C6", python: "3776AB",
          java: "ED8B00", react: "61DAFB", "node.js": "339933",
          nodejs: "339933", html: "E34F26", css: "1572B6",
          go: "00ADD8", rust: "000000", php: "777BB4",
          ruby: "CC342D", swift: "FA7343", kotlin: "7F52FF",
          dart: "0175C2", vue: "4FC08D", angular: "DD0031",
          docker: "2496ED", git: "F05032", linux: "FCC624",
          mongodb: "47A248", postgresql: "4169E1", mysql: "4479A1",
          aws: "232F3E", azure: "0078D4", firebase: "FFCA28",
          figma: "F24E1E", tailwind: "06B6D4", nextjs: "000000",
          graphql: "E10098", redis: "DC382D", nginx: "009639",
        };
        const color = colors[lang] || "333333";
        const logoName = lang.replace(/[.\s]/g, "");
        return `![${lang}](https://img.shields.io/badge/${encodeURIComponent(lang)}-${color}?style=for-the-badge&logo=${logoName}&logoColor=white)`;
      });
      lines.push(badges.join(" "));
      lines.push("");
    }

    // GitHub stats
    if (github && (showStats || showStreak || showTopLangs)) {
      lines.push("### GitHub Stats:");
      lines.push("");
      if (showStats) {
        lines.push(`![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${github}&show_icons=true&theme=default)`);
        lines.push("");
      }
      if (showStreak) {
        lines.push(`![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${github}&theme=default)`);
        lines.push("");
      }
      if (showTopLangs) {
        lines.push(`![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=${github}&layout=compact&theme=default)`);
        lines.push("");
      }
    }

    return lines.join("\n");
  }, [name, subtitle, about, currentWork, learning, collaborate, contact, funFact, github, twitter, linkedin, website, languages, showStats, showStreak, showTopLangs]);

  return (
    <ToolLayout
      title="GitHub Profile README Generator"
      description="Create an awesome GitHub profile README with a visual editor. Add stats, badges, social links, and more."
      relatedTools={["markdown-preview", "markdown-table-generator", "slug-generator"]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Profile Info</h3>

          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Subtitle</label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Full Stack Developer | Open Source Enthusiast" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">About</label>
            <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={2} placeholder="A short bio about yourself..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Details</h3>
          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Currently working on</label>
            <input type="text" value={currentWork} onChange={(e) => setCurrentWork(e.target.value)} placeholder="My awesome project" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Currently learning</label>
            <input type="text" value={learning} onChange={(e) => setLearning(e.target.value)} placeholder="Rust, Kubernetes" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Looking to collaborate on</label>
            <input type="text" value={collaborate} onChange={(e) => setCollaborate(e.target.value)} placeholder="Open source projects" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Contact</label>
            <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="john@example.com" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Fun fact</label>
            <input type="text" value={funFact} onChange={(e) => setFunFact(e.target.value)} placeholder="I love coffee ☕" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Social Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">GitHub username</label>
              <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="johndoe" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Twitter/X handle</label>
              <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="johndoe" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">LinkedIn username</label>
              <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="johndoe" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">Website URL</label>
              <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Languages & Tools</h3>
          <div>
            <label className="mb-1 block text-sm text-gray-600 dark:text-gray-400">
              Comma-separated (e.g. JavaScript, React, Python)
            </label>
            <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="JavaScript, TypeScript, React, Node.js, Python" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none" />
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-gray-100">GitHub Stats</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={showStats} onChange={(e) => setShowStats(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
              Stats card
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={showStreak} onChange={(e) => setShowStreak(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
              Streak stats
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={showTopLangs} onChange={(e) => setShowTopLangs(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
              Top languages
            </label>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Markdown
            </label>
            <CopyButton text={markdown} />
          </div>
          <textarea
            value={markdown}
            readOnly
            rows={30}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm"
            spellCheck={false}
          />
        </div>
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The GitHub README Generator is a free online tool available on CodeUtilo. Create an awesome GitHub profile README with stats, badges, and social links. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All github readme generator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the github readme generator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the github readme generator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the github readme generator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the GitHub README Generator free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the GitHub README Generator is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is my data safe when using this tool?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool work on mobile devices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The GitHub README Generator is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The GitHub README Generator runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
