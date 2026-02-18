"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

// ── Colour helpers ──────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  let r: number, g: number, b: number;

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

// ── Brettel / Vienot transformation matrices ────────────────────────────────
// All matrices operate on linear-light RGB (0-1 range).
// Sources: Vienot et al. 1999, Brettel et al. 1997

function linearize(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function delinearize(v: number): number {
  const c = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, c)) * 255);
}

// Apply a 3x3 matrix (row-major) to [r, g, b] linear values
function applyMatrix(
  m: [number, number, number, number, number, number, number, number, number],
  r: number,
  g: number,
  b: number
): [number, number, number] {
  return [
    m[0] * r + m[1] * g + m[2] * b,
    m[3] * r + m[4] * g + m[5] * b,
    m[6] * r + m[7] * g + m[8] * b,
  ];
}

// Protanopia matrix (Vienot 1999 / Machado 2009)
const PROTANOPIA_M: [number, number, number, number, number, number, number, number, number] = [
  0.152286, 1.052583, -0.204868,
  0.114503, 0.786281,  0.099216,
 -0.003882, -0.048116,  1.051998,
];

// Deuteranopia matrix (Vienot 1999)
const DEUTERANOPIA_M: [number, number, number, number, number, number, number, number, number] = [
  0.367322,  0.860646, -0.227968,
  0.280085,  0.672501,  0.047413,
 -0.011820,  0.042940,  0.968881,
];

// Tritanopia matrix (Brettel 1997 simplified / Machado 2009)
const TRITANOPIA_M: [number, number, number, number, number, number, number, number, number] = [
  1.255528, -0.076749, -0.178779,
 -0.078411,  0.930809,  0.147602,
  0.004733,  0.691367,  0.303900,
];

function simulateDeficiency(
  rIn: number,
  gIn: number,
  bIn: number,
  matrix: [number, number, number, number, number, number, number, number, number],
  blend: number // 0 = original, 1 = full deficiency
): string {
  const rL = linearize(rIn);
  const gL = linearize(gIn);
  const bL = linearize(bIn);

  const [rS, gS, bS] = applyMatrix(matrix, rL, gL, bL);

  // Interpolate between original and simulated
  const rOut = delinearize(rL + blend * (rS - rL));
  const gOut = delinearize(gL + blend * (gS - gL));
  const bOut = delinearize(bL + blend * (bS - bL));

  return rgbToHex(rOut, gOut, bOut);
}

function simulateAchromatopsia(
  r: number,
  g: number,
  b: number,
  blend: number
): string {
  const rL = linearize(r);
  const gL = linearize(g);
  const bL = linearize(b);

  // Luminance-weighted grayscale
  const gray = 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;

  const rOut = delinearize(rL + blend * (gray - rL));
  const gOut = delinearize(gL + blend * (gray - gL));
  const bOut = delinearize(bL + blend * (gray - bL));

  return rgbToHex(rOut, gOut, bOut);
}

// ── Deficiency type definitions ─────────────────────────────────────────────

interface DeficiencyType {
  id: string;
  name: string;
  shortName: string;
  description: string;
  simulate: (r: number, g: number, b: number) => string;
}

const DEFICIENCY_TYPES: DeficiencyType[] = [
  {
    id: "protanopia",
    name: "Protanopia",
    shortName: "No red cones",
    description: "Complete absence of L-cones (red). Red appears dark; cannot distinguish red from green.",
    simulate: (r, g, b) => simulateDeficiency(r, g, b, PROTANOPIA_M, 1),
  },
  {
    id: "deuteranopia",
    name: "Deuteranopia",
    shortName: "No green cones",
    description: "Complete absence of M-cones (green). Most common form of colour blindness in men.",
    simulate: (r, g, b) => simulateDeficiency(r, g, b, DEUTERANOPIA_M, 1),
  },
  {
    id: "tritanopia",
    name: "Tritanopia",
    shortName: "No blue cones",
    description: "Complete absence of S-cones (blue). Rare; blue appears green, yellow appears violet.",
    simulate: (r, g, b) => simulateDeficiency(r, g, b, TRITANOPIA_M, 1),
  },
  {
    id: "protanomaly",
    name: "Protanomaly",
    shortName: "Weak red cones",
    description: "Reduced sensitivity in L-cones. Reds appear weaker and harder to distinguish from green.",
    simulate: (r, g, b) => simulateDeficiency(r, g, b, PROTANOPIA_M, 0.5),
  },
  {
    id: "deuteranomaly",
    name: "Deuteranomaly",
    shortName: "Weak green cones",
    description: "Reduced sensitivity in M-cones. The most common colour vision deficiency overall.",
    simulate: (r, g, b) => simulateDeficiency(r, g, b, DEUTERANOPIA_M, 0.5),
  },
  {
    id: "tritanomaly",
    name: "Tritanomaly",
    shortName: "Weak blue cones",
    description: "Reduced sensitivity in S-cones. Blues appear greener and yellows are harder to see.",
    simulate: (r, g, b) => simulateDeficiency(r, g, b, TRITANOPIA_M, 0.5),
  },
  {
    id: "achromatopsia",
    name: "Achromatopsia",
    shortName: "No colour (total)",
    description: "Complete colour blindness — the world appears in shades of grey. Extremely rare.",
    simulate: (r, g, b) => simulateAchromatopsia(r, g, b, 1),
  },
  {
    id: "achromatomaly",
    name: "Achromatomaly",
    shortName: "Weak colour (partial)",
    description: "Greatly reduced colour perception. Colours appear desaturated with limited hue range.",
    simulate: (r, g, b) => simulateAchromatopsia(r, g, b, 0.5),
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function ColorBlindnessSimulator() {
  const [hex, setHex] = useState("#E63946");

  const rgb = useMemo(() => hexToRgb(hex), [hex]);

  const simulations = useMemo(() => {
    if (!rgb) return null;
    return DEFICIENCY_TYPES.map((def) => ({
      ...def,
      simulatedHex: def.simulate(rgb.r, rgb.g, rgb.b),
    }));
  }, [rgb]);

  const isValid = rgb !== null;
  const safeHex = isValid ? hex : "#E63946";

  function handleColorPicker(e: React.ChangeEvent<HTMLInputElement>) {
    setHex(e.target.value.toUpperCase());
  }

  function handleHexInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setHex(val.startsWith("#") ? val.toUpperCase() : ("#" + val).toUpperCase());
  }

  return (
    <ToolLayout
      title="Color Blindness Simulator"
      description="Preview how any colour appears to people with different types of colour vision deficiency, including protanopia, deuteranopia, tritanopia, and more."
      relatedTools={[
        "color-contrast-checker",
        "color-picker",
        "color-palette-generator",
      ]}
    >
      {/* ── Input ── */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[220px]">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Input Colour (Hex)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={isValid ? hex : "#E63946"}
              onChange={handleColorPicker}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-0.5"
            />
            <input
              type="text"
              value={hex}
              onChange={handleHexInput}
              placeholder="#E63946"
              maxLength={7}
              spellCheck={false}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 font-mono text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
            <CopyButton text={hex} />
          </div>
          {!isValid && hex.length > 1 && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">Invalid HEX colour</p>
          )}
        </div>

        {/* Original swatch */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Original
          </span>
          <div
            className="h-14 w-24 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            style={{ backgroundColor: safeHex }}
          />
          <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{safeHex}</span>
        </div>
      </div>

      {/* ── Simulations Grid ── */}
      {simulations && (
        <div className="mt-8">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
            Simulated Views
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {simulations.map((sim) => (
              <div
                key={sim.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4 flex flex-col gap-3"
              >
                {/* Colour swatches side by side */}
                <div className="flex gap-2 justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="h-12 w-12 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                      style={{ backgroundColor: safeHex }}
                      title="Original"
                    />
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">original</span>
                  </div>
                  <div className="flex items-center text-gray-300 self-center">→</div>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="h-12 w-12 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                      style={{ backgroundColor: sim.simulatedHex }}
                      title={sim.name}
                    />
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">simulated</span>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {sim.name}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {sim.shortName}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {sim.description}
                  </p>
                </div>

                {/* Hex value */}
                <div className="flex items-center gap-2 mt-auto">
                  <span className="flex-1 font-mono text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-gray-700 dark:text-gray-300">
                    {sim.simulatedHex}
                  </span>
                  <CopyButton text={sim.simulatedHex} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Compare strip ── */}
      {simulations && (
        <div className="mt-8">
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
            Colour Comparison Strip
          </h2>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Original and all simulated colours displayed side by side for quick visual comparison.
          </p>
          <div className="flex overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Original */}
            <div className="flex flex-col flex-shrink-0">
              <div
                className="h-20 w-20"
                style={{ backgroundColor: safeHex }}
                title="Original"
              />
              <div className="bg-white dark:bg-gray-900 px-1 py-1 text-center border-t border-gray-100 dark:border-gray-800">
                <p className="text-[9px] font-semibold text-gray-700 dark:text-gray-300 leading-tight">Original</p>
                <p className="font-mono text-[9px] text-gray-500 dark:text-gray-400">{safeHex}</p>
              </div>
            </div>

            {simulations.map((sim) => (
              <div key={sim.id} className="flex flex-col flex-shrink-0">
                <div
                  className="h-20 w-20 border-l border-gray-200 dark:border-gray-700"
                  style={{ backgroundColor: sim.simulatedHex }}
                  title={sim.name}
                />
                <div className="bg-white dark:bg-gray-900 px-1 py-1 text-center border-t border-l border-gray-100 dark:border-gray-800">
                  <p className="text-[9px] font-semibold text-gray-700 dark:text-gray-300 leading-tight">
                    {sim.name}
                  </p>
                  <p className="font-mono text-[9px] text-gray-500 dark:text-gray-400">
                    {sim.simulatedHex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SEO Content ── */}
      <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          What Is Colour Blindness?
        </h2>
        <p className="mb-3">
          Colour blindness (colour vision deficiency, CVD) is the reduced ability to perceive
          differences between colours that are apparent to most people. The human eye has three
          types of photoreceptor cones: L-cones (sensitive to long/red wavelengths), M-cones
          (medium/green), and S-cones (short/blue). When one or more cone types are absent or
          have reduced sensitivity, the affected person experiences a limited colour gamut.
        </p>
        <p className="mb-3">
          Approximately 8% of men and 0.5% of women worldwide have some form of colour vision
          deficiency. The most common forms are red-green colour blindness (protanopia and
          deuteranopia), which are X-linked genetic conditions.
        </p>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Types of Colour Vision Deficiency
        </h2>
        <ul className="mb-3 list-inside list-disc space-y-2">
          <li>
            <strong>Protanopia</strong> — Complete absence of L-cones (red-sensitive). Affects
            about 1% of men. Reds appear dark and cannot be distinguished from green.
          </li>
          <li>
            <strong>Deuteranopia</strong> — Complete absence of M-cones (green-sensitive). The
            most common severe form, affecting about 1% of men. Green and red look similar.
          </li>
          <li>
            <strong>Tritanopia</strong> — Complete absence of S-cones (blue-sensitive). Very
            rare (1 in 10,000). Blue appears green; yellow appears pink or violet.
          </li>
          <li>
            <strong>Protanomaly / Deuteranomaly / Tritanomaly</strong> — Anomalous trichromacy
            where the respective cone type is present but with shifted or reduced sensitivity.
            These are milder forms and are more common than their anopic counterparts.
          </li>
          <li>
            <strong>Achromatopsia</strong> — Complete colour blindness; only rods are functional.
            Extremely rare (1 in 30,000). Everything is seen in greyscale.
          </li>
          <li>
            <strong>Achromatomaly</strong> — Partial achromatopsia with residual, greatly reduced
            colour perception.
          </li>
        </ul>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How This Simulator Works
        </h2>
        <p className="mb-3">
          This tool uses published colour transformation matrices based on the algorithms by
          Vienot et al. (1999) and Brettel et al. (1997). The simulation pipeline is:
        </p>
        <ol className="mb-3 list-inside list-decimal space-y-1">
          <li>Convert the sRGB hex colour to linear-light RGB values (gamma expansion).</li>
          <li>Apply a 3×3 transformation matrix that maps the linear RGB to the simulated colour space for the given deficiency type.</li>
          <li>For anomaly types (protanomaly, deuteranomaly, tritanomaly), interpolate 50% between the original and the full deficiency simulation.</li>
          <li>For achromatopsia, convert to luminance-weighted greyscale (0.2126R + 0.7152G + 0.0722B).</li>
          <li>Apply gamma compression (sRGB encoding) and convert back to a hex value.</li>
        </ol>

        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Why Design for Colour Blindness?
        </h2>
        <p className="mb-3">
          Designing with colour accessibility in mind ensures your UI, data visualisations, charts,
          and images are usable by everyone. Best practices include: not relying solely on colour to
          convey information, using patterns or labels in addition to colour, choosing palettes with
          sufficient contrast, and testing with a colour blindness simulator during the design phase.
        </p>
        <p>
          Use the related{" "}
          <strong>Color Contrast Checker</strong> to verify that your colour combinations also meet
          WCAG 2.1 contrast requirements for text readability.
        </p>
      </div>
    
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Color Blindness Simulator is a free online tool available on CodeUtilo. Preview how colors appear with different types of color vision deficiency. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All color blindness simulator operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the color blindness simulator as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the color blindness simulator for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the color blindness simulator will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
