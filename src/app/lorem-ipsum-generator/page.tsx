"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

const WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit",
  "sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore",
  "magna","aliqua","enim","ad","minim","veniam","quis","nostrud",
  "exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo",
  "consequat","duis","aute","irure","in","reprehenderit","voluptate",
  "velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint",
  "occaecat","cupidatat","non","proident","sunt","culpa","qui","officia",
  "deserunt","mollit","anim","id","est","laborum","porta","nibh","venenatis",
  "cras","pulvinar","mattis","nunc","sapien","faucibus","morbi","tristique",
  "senectus","netus","malesuada","fames","turpis","egestas","maecenas",
  "pharetra","convallis","posuere","lacus","pellentesque","habitant",
  "dignissim","diam","quas","eleifend","volutpat","blandit","massa",
  "viverra","justo","tortor","pretium","auctor","neque","vitae","semper",
];

function randomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSentence(minWords: number, maxWords: number): string {
  const len = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
  const words = Array.from({ length: len }, () => randomWord());
  words[0] = capitalize(words[0]);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentenceCount }, () =>
    generateSentence(6, 14)
  ).join(" ");
}

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">(
    "paragraphs"
  );
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    let result = "";
    if (unit === "paragraphs") {
      const paragraphs = Array.from({ length: count }, () =>
        generateParagraph()
      );
      if (startWithLorem) {
        paragraphs[0] =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
          paragraphs[0];
      }
      result = paragraphs.join("\n\n");
    } else if (unit === "sentences") {
      const sentences = Array.from({ length: count }, () =>
        generateSentence(6, 14)
      );
      if (startWithLorem) {
        sentences[0] =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      }
      result = sentences.join(" ");
    } else {
      const words = Array.from({ length: count }, () => randomWord());
      if (startWithLorem && words.length >= 2) {
        words[0] = "lorem";
        words[1] = "ipsum";
      }
      result = words.join(" ");
    }
    setOutput(result);
  };

  return (
    <ToolLayout
      title="Lorem Ipsum Generator Online"
      description="Generate placeholder text in paragraphs, sentences, or words. Classic lorem ipsum or randomized latin text."
      relatedTools={["word-counter", "uuid-generator", "json-formatter"]}
    >
      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Generate:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
            className="w-16 rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          />
          <select
            value={unit}
            onChange={(e) =>
              setUnit(e.target.value as "paragraphs" | "sentences" | "words")
            }
            className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          Start with &quot;Lorem ipsum...&quot;
        </label>
      </div>

      {/* Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleGenerate}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Generate
        </button>
        <CopyButton text={output} />
      </div>

      {/* Output */}
      <textarea
        value={output}
        readOnly
        placeholder="Click Generate to create lorem ipsum text..."
        className="h-64 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 text-sm"
      />

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>The Lorem Ipsum Generator creates placeholder text for web design mockups, print layouts, and UI prototyping. Based on scrambled Latin text from Cicero&apos;s De Finibus, lorem ipsum has been the industry&apos;s standard dummy text since the 1500s and remains essential for designers and developers worldwide.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-gray-700 dark:text-gray-300">Paragraphs, Words, or Sentences</strong> &mdash; Choose exactly how much text to generate&mdash;by paragraph count, word count, or sentence count&mdash;to fit any layout requirement.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Start With Lorem Ipsum</strong> &mdash; Option to begin the text with the classic &quot;Lorem ipsum dolor sit amet&quot; opening phrase for convention-compliant placeholder content.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">One-Click Copy</strong> &mdash; Instantly copy all generated text to your clipboard with a single button click, ready to paste into any design or code editor.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> &mdash; All generation happens locally in your browser. No data is sent to any server.</li>
          <li><strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> &mdash; Use this tool as many times as you need without creating an account or paying anything.</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Common Use Cases</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Filling text areas in Figma, Sketch, or Adobe XD mockups to simulate realistic content density</li>
          <li>Populating HTML templates and CSS layout tests with dummy text to check typography and spacing</li>
          <li>Seeding databases with realistic paragraph-length text fields for testing search and display features</li>
          <li>Creating placeholder content for email templates and newsletter designs before final copy is ready</li>
          <li>Testing text truncation, overflow, and line-height behavior in responsive web components</li>
        </ul>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">How to Use</h2>
        <p>Choose your output type (Paragraphs, Words, or Sentences) and set the desired count using the input field. Toggle the &quot;Start with Lorem ipsum&quot; switch if you want the classic opening. Click Generate to produce the text, then click Copy to copy everything to your clipboard.</p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Why is it called Lorem Ipsum?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">The text derives from Cicero&apos;s De Finibus Bonorum et Malorum written in 45 BC. A typesetter scrambled the text in the 1500s to create filler content, and it became the standard placeholder ever since.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is Lorem Ipsum real Latin?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">The words are real Latin but the specific phrase &quot;Lorem ipsum dolor sit amet&quot; is a scrambled fragment. The original passage discusses the theory of ethics, not the meaning of the words.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I use Lorem Ipsum in production?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Lorem ipsum is strictly for prototyping and should never appear in a finished product. Replace all placeholder text with real, meaningful content before launching any website or application.</p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How many words are in a paragraph of Lorem Ipsum?</summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">Paragraph length varies by generator settings. Typical lorem ipsum paragraphs contain 50&ndash;100 words. Use the Words mode if you need an exact word count for a specific content slot.</p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}
