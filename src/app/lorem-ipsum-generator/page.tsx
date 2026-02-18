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
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Lorem Ipsum Generator creates placeholder text for design mockups, website layouts, and document templates. Lorem Ipsum has been the industry-standard dummy text since the 1500s, providing realistic-looking text without distracting from the visual design.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Multiple Output Types</strong> — Generate paragraphs, sentences, or individual words based on your needs.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Customizable Amount</strong> — Choose exactly how many paragraphs, sentences, or words you want to generate.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Standard Lorem Ipsum</strong> — Uses the classic Lorem Ipsum text that designers and developers have relied on for decades.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">One-Click Copy</strong> — Copy the generated placeholder text to your clipboard instantly.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Filling website mockups and wireframes with realistic placeholder text</li>
          <li>Testing typography, font sizes, and line spacing in web designs</li>
          <li>Populating database records with dummy content for development and testing</li>
          <li>Creating document templates with placeholder text for content management systems</li>
          <li>Demonstrating layout designs to clients before real content is available</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Select whether you want paragraphs, sentences, or words. Set the desired amount using the controls. The Lorem Ipsum text is generated instantly. Copy it to your clipboard with the Copy button.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              What is Lorem Ipsum?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Lorem Ipsum is dummy text used in the printing and typesetting industry since the 1500s. It is derived from a scrambled section of &apos;De Finibus Bonorum et Malorum&apos; by Cicero, written in 45 BC.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Why use Lorem Ipsum instead of real text?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Lorem Ipsum helps focus on visual design without the distraction of readable content. Real text can bias viewers toward reading rather than evaluating layout, typography, and spacing.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is Lorem Ipsum real Latin?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Lorem Ipsum is based on Latin but is not standard Latin. It is a scrambled and altered version of a passage by Cicero. Some words are real Latin, while others are modified or made up.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Can I use Lorem Ipsum in my projects commercially?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. Lorem Ipsum is in the public domain and can be used freely in any project. It is meant as placeholder text and should be replaced with real content before publishing.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
