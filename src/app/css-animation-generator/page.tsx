"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

interface Keyframe {
  percentage: number;
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  opacity: number;
  backgroundColor: string;
}

const DEFAULT_KEYFRAMES: Keyframe[] = [
  { percentage: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
  { percentage: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
];

type Preset = {
  name: string;
  keyframes: Keyframe[];
  duration: number;
  timingFunction: string;
  iterationCount: string;
  direction: string;
  fillMode: string;
};

const PRESETS: Preset[] = [
  {
    name: "Fade In",
    keyframes: [
      { percentage: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 0, backgroundColor: "#6366f1" },
      { percentage: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
    ],
    duration: 1,
    timingFunction: "ease",
    iterationCount: "1",
    direction: "normal",
    fillMode: "forwards",
  },
  {
    name: "Fade Out",
    keyframes: [
      { percentage: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 0, backgroundColor: "#6366f1" },
    ],
    duration: 1,
    timingFunction: "ease",
    iterationCount: "1",
    direction: "normal",
    fillMode: "forwards",
  },
  {
    name: "Slide In Left",
    keyframes: [
      { percentage: 0, translateX: -100, translateY: 0, rotate: 0, scale: 1, opacity: 0, backgroundColor: "#6366f1" },
      { percentage: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
    ],
    duration: 0.6,
    timingFunction: "ease-out",
    iterationCount: "1",
    direction: "normal",
    fillMode: "forwards",
  },
  {
    name: "Slide In Right",
    keyframes: [
      { percentage: 0, translateX: 100, translateY: 0, rotate: 0, scale: 1, opacity: 0, backgroundColor: "#6366f1" },
      { percentage: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
    ],
    duration: 0.6,
    timingFunction: "ease-out",
    iterationCount: "1",
    direction: "normal",
    fillMode: "forwards",
  },
  {
    name: "Bounce",
    keyframes: [
      { percentage: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 40, translateX: 0, translateY: -30, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 70, translateX: 0, translateY: -15, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
    ],
    duration: 0.8,
    timingFunction: "ease",
    iterationCount: "infinite",
    direction: "normal",
    fillMode: "none",
  },
  {
    name: "Spin",
    keyframes: [
      { percentage: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 100, translateX: 0, translateY: 0, rotate: 360, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
    ],
    duration: 1,
    timingFunction: "linear",
    iterationCount: "infinite",
    direction: "normal",
    fillMode: "none",
  },
  {
    name: "Pulse",
    keyframes: [
      { percentage: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 50, translateX: 0, translateY: 0, rotate: 0, scale: 1.1, opacity: 0.8, backgroundColor: "#818cf8" },
      { percentage: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
    ],
    duration: 1.5,
    timingFunction: "ease-in-out",
    iterationCount: "infinite",
    direction: "normal",
    fillMode: "none",
  },
  {
    name: "Shake",
    keyframes: [
      { percentage: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 15, translateX: -10, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 30, translateX: 10, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 45, translateX: -10, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 60, translateX: 10, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 75, translateX: -5, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
      { percentage: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
    ],
    duration: 0.6,
    timingFunction: "ease-in-out",
    iterationCount: "infinite",
    direction: "normal",
    fillMode: "none",
  },
];

const TIMING_FUNCTIONS = ["ease", "linear", "ease-in", "ease-out", "ease-in-out", "cubic-bezier(0.68,-0.55,0.27,1.55)"];
const DIRECTIONS = ["normal", "reverse", "alternate", "alternate-reverse"];
const FILL_MODES = ["none", "forwards", "backwards", "both"];

function keyframeToCSS(kf: Keyframe): string {
  const parts: string[] = [];
  const hasTransform =
    kf.translateX !== 0 || kf.translateY !== 0 || kf.rotate !== 0 || kf.scale !== 1;
  if (hasTransform) {
    const transforms: string[] = [];
    if (kf.translateX !== 0 || kf.translateY !== 0) transforms.push(`translate(${kf.translateX}px, ${kf.translateY}px)`);
    if (kf.rotate !== 0) transforms.push(`rotate(${kf.rotate}deg)`);
    if (kf.scale !== 1) transforms.push(`scale(${kf.scale})`);
    parts.push(`  transform: ${transforms.join(" ")};`);
  } else {
    parts.push(`  transform: none;`);
  }
  parts.push(`  opacity: ${kf.opacity};`);
  parts.push(`  background-color: ${kf.backgroundColor};`);
  return parts.join("\n");
}

export default function CssAnimationGenerator() {
  const [animationName, setAnimationName] = useState("my-animation");
  const [duration, setDuration] = useState(1);
  const [timingFunction, setTimingFunction] = useState("ease");
  const [delay, setDelay] = useState(0);
  const [iterationCount, setIterationCount] = useState("1");
  const [isInfinite, setIsInfinite] = useState(false);
  const [direction, setDirection] = useState("normal");
  const [fillMode, setFillMode] = useState("none");
  const [keyframes, setKeyframes] = useState<Keyframe[]>(DEFAULT_KEYFRAMES);
  const [animationKey, setAnimationKey] = useState(0);

  const safeName = useMemo(() => {
    return animationName.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/^-+/, "") || "my-animation";
  }, [animationName]);

  const effectiveIterationCount = useMemo(() => {
    return isInfinite ? "infinite" : iterationCount;
  }, [isInfinite, iterationCount]);

  const generatedCSS = useMemo(() => {
    const sortedKeyframes = [...keyframes].sort((a, b) => a.percentage - b.percentage);

    const keyframeBlocks = sortedKeyframes.map((kf) => {
      return `  ${kf.percentage}% {\n${keyframeToCSS(kf)}\n  }`;
    });

    const keyframesRule = `@keyframes ${safeName} {\n${keyframeBlocks.join("\n")}\n}`;

    const animationRule = `.animated-element {\n  animation-name: ${safeName};\n  animation-duration: ${duration}s;\n  animation-timing-function: ${timingFunction};\n  animation-delay: ${delay}s;\n  animation-iteration-count: ${effectiveIterationCount};\n  animation-direction: ${direction};\n  animation-fill-mode: ${fillMode};\n}`;

    return `${keyframesRule}\n\n${animationRule}`;
  }, [safeName, keyframes, duration, timingFunction, delay, effectiveIterationCount, direction, fillMode]);

  const previewStyle = useMemo(() => {
    return {
      animationName: safeName,
      animationDuration: `${duration}s`,
      animationTimingFunction: timingFunction,
      animationDelay: `${delay}s`,
      animationIterationCount: effectiveIterationCount,
      animationDirection: direction as "normal" | "reverse" | "alternate" | "alternate-reverse",
      animationFillMode: fillMode as "none" | "forwards" | "backwards" | "both",
    };
  }, [safeName, duration, timingFunction, delay, effectiveIterationCount, direction, fillMode]);

  const styleTag = useMemo(() => {
    const sortedKeyframes = [...keyframes].sort((a, b) => a.percentage - b.percentage);
    const keyframeBlocks = sortedKeyframes.map((kf) => {
      const lines: string[] = [];
      const transforms: string[] = [];
      if (kf.translateX !== 0 || kf.translateY !== 0) transforms.push(`translate(${kf.translateX}px, ${kf.translateY}px)`);
      if (kf.rotate !== 0) transforms.push(`rotate(${kf.rotate}deg)`);
      if (kf.scale !== 1) transforms.push(`scale(${kf.scale})`);
      if (transforms.length > 0) {
        lines.push(`transform: ${transforms.join(" ")}`);
      } else {
        lines.push(`transform: none`);
      }
      lines.push(`opacity: ${kf.opacity}`);
      lines.push(`background-color: ${kf.backgroundColor}`);
      return `${kf.percentage}% { ${lines.join("; ")} }`;
    });
    return `@keyframes ${safeName} { ${keyframeBlocks.join(" ")} }`;
  }, [keyframes, safeName]);

  const applyPreset = (preset: Preset) => {
    setKeyframes(preset.keyframes);
    setDuration(preset.duration);
    setTimingFunction(preset.timingFunction);
    setIsInfinite(preset.iterationCount === "infinite");
    setIterationCount(preset.iterationCount === "infinite" ? "1" : preset.iterationCount);
    setDirection(preset.direction);
    setFillMode(preset.fillMode);
    setAnimationKey((k) => k + 1);
  };

  const addKeyframe = () => {
    if (keyframes.length >= 8) return;
    const existingPercentages = keyframes.map((k) => k.percentage);
    let newPercentage = 50;
    while (existingPercentages.includes(newPercentage) && newPercentage < 100) {
      newPercentage += 10;
    }
    setKeyframes([
      ...keyframes,
      { percentage: newPercentage, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, backgroundColor: "#6366f1" },
    ]);
  };

  const removeKeyframe = (index: number) => {
    if (keyframes.length <= 2) return;
    setKeyframes(keyframes.filter((_, i) => i !== index));
  };

  const updateKeyframe = (index: number, field: keyof Keyframe, value: number | string) => {
    setKeyframes(keyframes.map((kf, i) => (i === index ? { ...kf, [field]: value } : kf)));
  };

  const replayAnimation = () => {
    setAnimationKey((k) => k + 1);
  };

  return (
    <ToolLayout
      title="CSS Animation Generator"
      description="Generate CSS @keyframes animations visually. Configure timing, easing, direction, and keyframes — then copy the ready-to-use CSS code."
      relatedTools={["css-gradient-generator", "box-shadow-generator", "flexbox-generator"]}
    >
      <style>{styleTag}</style>

      {/* Preset animations */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Preset Animations</h3>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:bg-blue-950 dark:hover:bg-blue-950 hover:text-blue-700 dark:text-blue-300"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live preview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Live Preview</h3>
          <button
            onClick={replayAnimation}
            className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800"
          >
            Replay
          </button>
        </div>
        <div className="flex h-40 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950">
          <div
            key={animationKey}
            className="h-16 w-16 rounded-lg"
            style={previewStyle}
          />
        </div>
      </div>

      {/* Animation properties */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* Animation name */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Animation Name</label>
          <input
            type="text"
            value={animationName}
            onChange={(e) => setAnimationName(e.target.value)}
            placeholder="my-animation"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 font-mono text-sm focus:border-blue-400 focus:outline-none"
          />
        </div>

        {/* Timing function */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Timing Function</label>
          <select
            value={timingFunction}
            onChange={(e) => setTimingFunction(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
          >
            {TIMING_FUNCTIONS.map((tf) => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Duration: <span className="font-mono text-blue-600 dark:text-blue-400">{duration.toFixed(1)}s</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Delay */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Delay: <span className="font-mono text-blue-600 dark:text-blue-400">{delay.toFixed(1)}s</span>
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={delay}
            onChange={(e) => setDelay(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Iteration count */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Iteration Count</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              value={isInfinite ? 1 : parseInt(iterationCount) || 1}
              onChange={(e) => setIterationCount(e.target.value)}
              disabled={isInfinite}
              className="w-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none disabled:opacity-50"
            />
            <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isInfinite}
                onChange={(e) => setIsInfinite(e.target.checked)}
                className="rounded"
              />
              Infinite
            </label>
          </div>
        </div>

        {/* Direction */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Direction</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
          >
            {DIRECTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Fill mode */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Fill Mode</label>
          <select
            value={fillMode}
            onChange={(e) => setFillMode(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
          >
            {FILL_MODES.map((fm) => (
              <option key={fm} value={fm}>{fm}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Keyframe editor */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Keyframes</h3>
          <button
            onClick={addKeyframe}
            disabled={keyframes.length >= 8}
            className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 disabled:opacity-40"
          >
            + Add Keyframe
          </button>
        </div>

        <div className="space-y-3">
          {[...keyframes]
            .map((kf, originalIndex) => ({ kf, originalIndex }))
            .sort((a, b) => a.kf.percentage - b.kf.percentage)
            .map(({ kf, originalIndex }) => (
              <div key={originalIndex} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">At</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={kf.percentage}
                      onChange={(e) => updateKeyframe(originalIndex, "percentage", parseInt(e.target.value) || 0)}
                      className="w-16 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-0.5 text-center font-mono text-xs focus:border-blue-400 focus:outline-none"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">%</span>
                  </div>
                  {keyframes.length > 2 && (
                    <button
                      onClick={() => removeKeyframe(originalIndex)}
                      className="rounded px-1.5 py-0.5 text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:bg-red-950 dark:hover:bg-red-950"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                  <div>
                    <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">Translate X (px)</label>
                    <input
                      type="number"
                      value={kf.translateX}
                      onChange={(e) => updateKeyframe(originalIndex, "translateX", parseInt(e.target.value) || 0)}
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-0.5 font-mono text-xs focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">Translate Y (px)</label>
                    <input
                      type="number"
                      value={kf.translateY}
                      onChange={(e) => updateKeyframe(originalIndex, "translateY", parseInt(e.target.value) || 0)}
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-0.5 font-mono text-xs focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">Rotate (deg)</label>
                    <input
                      type="number"
                      value={kf.rotate}
                      onChange={(e) => updateKeyframe(originalIndex, "rotate", parseInt(e.target.value) || 0)}
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-0.5 font-mono text-xs focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">Scale</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={kf.scale}
                      onChange={(e) => updateKeyframe(originalIndex, "scale", parseFloat(e.target.value) || 1)}
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-0.5 font-mono text-xs focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">Opacity (0–1)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={kf.opacity}
                      onChange={(e) => updateKeyframe(originalIndex, "opacity", parseFloat(e.target.value))}
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-0.5 font-mono text-xs focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-gray-500 dark:text-gray-400">Background Color</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={kf.backgroundColor}
                        onChange={(e) => updateKeyframe(originalIndex, "backgroundColor", e.target.value)}
                        className="h-6 w-6 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={kf.backgroundColor}
                        onChange={(e) => updateKeyframe(originalIndex, "backgroundColor", e.target.value)}
                        className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-0.5 font-mono text-xs focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Generated CSS */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Generated CSS</label>
          <CopyButton text={generatedCSS} />
        </div>
        <pre className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-900 p-4 font-mono text-xs leading-relaxed text-green-400">
          {generatedCSS}
        </pre>
      </div>

      {/* SEO content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is a CSS Animation?</h2>
        <p className="mb-3">
          CSS animations allow elements to transition between styles over a defined period using <strong>@keyframes</strong> rules.
          Unlike CSS transitions (which only move between two states), animations support multiple keyframes and loop
          indefinitely — making them ideal for loading spinners, attention effects, and decorative motion.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">How to Use This Generator</h2>
        <p className="mb-3">
          Choose a preset to start quickly, or configure every property manually. Add keyframes at any percentage point
          and define the <strong>transform</strong> (translate, rotate, scale), <strong>opacity</strong>, and{" "}
          <strong>background-color</strong> at each step. The live preview updates instantly, and the
          &ldquo;Replay&rdquo; button restarts the animation so you can evaluate it from the beginning.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Key Animation Properties</h2>
        <ul className="mb-3 list-disc pl-5 space-y-1">
          <li><strong>animation-duration</strong> — how long one cycle takes (in seconds).</li>
          <li><strong>animation-timing-function</strong> — easing curve (ease, linear, ease-in-out, etc.).</li>
          <li><strong>animation-delay</strong> — how long to wait before the animation starts.</li>
          <li><strong>animation-iteration-count</strong> — number of cycles, or <code>infinite</code>.</li>
          <li><strong>animation-direction</strong> — whether the animation runs forward, backward, or alternates.</li>
          <li><strong>animation-fill-mode</strong> — what styles are applied before/after the animation runs.</li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Browser Support</h2>
        <p>
          CSS animations with <code>@keyframes</code> are supported in all modern browsers (Chrome, Firefox, Safari,
          Edge) without vendor prefixes. They are hardware-accelerated when using <strong>transform</strong> and{" "}
          <strong>opacity</strong>, which is why these two properties are recommended for smooth 60 fps animations.
        </p>
      </div>
    </ToolLayout>
  );
}
