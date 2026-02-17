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
          <label className="text-sm text-gray-600">Generate:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
            className="w-16 rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
          <select
            value={unit}
            onChange={(e) =>
              setUnit(e.target.value as "paragraphs" | "sentences" | "words")
            }
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="rounded border-gray-300"
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
        className="h-64 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm"
      />

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          What is Lorem Ipsum?
        </h2>
        <p className="mb-3">
          Lorem Ipsum is placeholder text used in the printing and typesetting
          industry since the 1500s. It is used by designers and developers to
          fill layouts with text before the final content is available.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Why use Lorem Ipsum?
        </h2>
        <p>
          Using placeholder text allows designers to focus on visual elements
          without being distracted by readable content. It also shows the
          approximate length and layout of the final text.
        </p>
      </div>
    </ToolLayout>
  );
}
