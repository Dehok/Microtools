"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

type Strictness = "strict" | "balanced" | "light";
type Domain = "general" | "support" | "finance" | "healthcare" | "legal";
type CitationMode = "required" | "optional" | "none";
type OutputMode = "json" | "markdown" | "plain";

type ModuleKey =
  | "refusal_policy"
  | "uncertainty_policy"
  | "citation_policy"
  | "output_contract"
  | "tool_boundaries"
  | "pii_safeguard"
  | "escalation_policy";

interface GuardrailModule {
  id: ModuleKey;
  title: string;
  description: string;
  defaultOn: boolean;
}

const MODULES: GuardrailModule[] = [
  {
    id: "refusal_policy",
    title: "Refusal Policy",
    description: "Refuse unsafe or disallowed requests with clear boundary language.",
    defaultOn: true,
  },
  {
    id: "uncertainty_policy",
    title: "Uncertainty Handling",
    description: "Admit uncertainty and avoid fabricated facts when confidence is low.",
    defaultOn: true,
  },
  {
    id: "citation_policy",
    title: "Citation Rules",
    description: "Require source references for factual claims where applicable.",
    defaultOn: true,
  },
  {
    id: "output_contract",
    title: "Output Contract",
    description: "Force deterministic output format and required fields.",
    defaultOn: true,
  },
  {
    id: "tool_boundaries",
    title: "Tool Boundaries",
    description: "Restrict dangerous or unauthorized tool calls and actions.",
    defaultOn: true,
  },
  {
    id: "pii_safeguard",
    title: "PII Safeguard",
    description: "Redact or refuse sensitive personal data handling by default.",
    defaultOn: true,
  },
  {
    id: "escalation_policy",
    title: "Human Escalation",
    description: "Define when the assistant must escalate to a human operator.",
    defaultOn: false,
  },
];

const SAMPLE_ALLOWED = "search_docs, summarize_text";

function strictnessPhrase(strictness: Strictness) {
  if (strictness === "strict") return "must strictly";
  if (strictness === "balanced") return "should";
  return "should generally";
}

function domainPhrase(domain: Domain) {
  if (domain === "finance") return "financial and compliance-sensitive";
  if (domain === "healthcare") return "healthcare and safety-sensitive";
  if (domain === "legal") return "legal and policy-sensitive";
  if (domain === "support") return "customer support";
  return "general assistant";
}

function moduleBlock(
  key: ModuleKey,
  context: {
    strictness: Strictness;
    citationMode: CitationMode;
    outputMode: OutputMode;
    allowedTools: string;
  }
) {
  const strictness = strictnessPhrase(context.strictness);
  switch (key) {
    case "refusal_policy":
      return `Refusal Policy:
- Assistant ${strictness} refuse unsafe, disallowed, or policy-violating requests.
- Refusals must be brief, neutral, and include a safe alternative when possible.`;
    case "uncertainty_policy":
      return `Uncertainty Policy:
- If evidence is missing or confidence is low, assistant must say so explicitly.
- Do not invent facts, references, or execution claims.`;
    case "citation_policy":
      if (context.citationMode === "none") {
        return `Citation Policy:
- Citations are not required by default.
- If user requests sources, provide them or state they are unavailable.`;
      }
      return `Citation Policy:
- For factual claims, assistant ${context.citationMode === "required" ? "must" : "should"} provide source citations when available.
- If sources are unavailable, state limitation clearly.`;
    case "output_contract":
      return `Output Contract:
- Response format must be ${context.outputMode.toUpperCase()}.
- Do not prepend hidden analysis or internal notes outside the required format.`;
    case "tool_boundaries":
      return `Tool Boundaries:
- Only allowed tools may be called: ${context.allowedTools || "none"}.
- Never execute destructive, unauthorized, or high-risk actions without explicit confirmation.`;
    case "pii_safeguard":
      return `PII Safeguard:
- Detect and avoid exposing personal data (email, phone, card, ID, address).
- Prefer masking, redaction, or refusal for sensitive data handling.`;
    case "escalation_policy":
      return `Escalation Policy:
- Escalate to a human when request implies legal, medical, financial, or security-critical impact.
- If escalation is required, summarize context and outstanding risks.`;
    default:
      return "";
  }
}

function buildGuardrailPack({
  name,
  strictness,
  domain,
  citationMode,
  outputMode,
  enabledModules,
  allowedTools,
}: {
  name: string;
  strictness: Strictness;
  domain: Domain;
  citationMode: CitationMode;
  outputMode: OutputMode;
  enabledModules: Record<ModuleKey, boolean>;
  allowedTools: string;
}) {
  const active = MODULES.filter((module) => enabledModules[module.id]);
  const blocks = active.map((module) =>
    moduleBlock(module.id, {
      strictness,
      citationMode,
      outputMode,
      allowedTools: allowedTools.trim(),
    })
  );

  const header = `System Guardrail Pack: ${name || "Untitled Pack"}
Assistant profile: ${domainPhrase(domain)} assistant.
Operating strictness: ${strictness}.`;

  const packText = [header, ...blocks].join("\n\n");
  const requiredKeys: ModuleKey[] = ["refusal_policy", "uncertainty_policy", "output_contract"];
  const missingRequired = requiredKeys.filter((key) => !enabledModules[key]);

  const coverage = Math.round((active.length / MODULES.length) * 100);
  const readiness = missingRequired.length > 0 ? "Risky" : coverage >= 85 ? "Strong" : coverage >= 60 ? "Moderate" : "Weak";

  return {
    active,
    coverage,
    readiness,
    missingRequired,
    packText,
    packJson: {
      name: name || "Untitled Pack",
      domain,
      strictness,
      outputMode,
      citationMode,
      enabledModules: active.map((item) => item.id),
      missingRequired,
      guardrailText: packText,
    },
  };
}

export default function PromptGuardrailPackComposerPage() {
  const [packName, setPackName] = useState("Core Safety Pack");
  const [strictness, setStrictness] = useState<Strictness>("strict");
  const [domain, setDomain] = useState<Domain>("general");
  const [citationMode, setCitationMode] = useState<CitationMode>("required");
  const [outputMode, setOutputMode] = useState<OutputMode>("json");
  const [allowedTools, setAllowedTools] = useState(SAMPLE_ALLOWED);
  const [enabledModules, setEnabledModules] = useState<Record<ModuleKey, boolean>>(() =>
    MODULES.reduce(
      (acc, module) => {
        acc[module.id] = module.defaultOn;
        return acc;
      },
      {} as Record<ModuleKey, boolean>
    )
  );

  const result = useMemo(
    () =>
      buildGuardrailPack({
        name: packName,
        strictness,
        domain,
        citationMode,
        outputMode,
        enabledModules,
        allowedTools,
      }),
    [allowedTools, citationMode, domain, enabledModules, outputMode, packName, strictness]
  );

  const summary = useMemo(
    () =>
      [
        "Prompt Guardrail Pack Composer",
        `Pack name: ${packName || "Untitled Pack"}`,
        `Coverage: ${result.coverage}%`,
        `Readiness: ${result.readiness}`,
        `Enabled modules: ${result.active.length}/${MODULES.length}`,
        `Missing required: ${result.missingRequired.length ? result.missingRequired.join(", ") : "none"}`,
      ].join("\n"),
    [packName, result]
  );

  const loadSample = () => {
    setPackName("Production Safety Pack");
    setStrictness("strict");
    setDomain("support");
    setCitationMode("required");
    setOutputMode("json");
    setAllowedTools("search_docs, retrieve_ticket_context, summarize_text");
    setEnabledModules({
      refusal_policy: true,
      uncertainty_policy: true,
      citation_policy: true,
      output_contract: true,
      tool_boundaries: true,
      pii_safeguard: true,
      escalation_policy: true,
    });
  };

  const clearAll = () => {
    setPackName("");
    setStrictness("balanced");
    setDomain("general");
    setCitationMode("optional");
    setOutputMode("plain");
    setAllowedTools("");
    setEnabledModules(
      MODULES.reduce(
        (acc, module) => {
          acc[module.id] = false;
          return acc;
        },
        {} as Record<ModuleKey, boolean>
      )
    );
  };

  return (
    <ToolLayout
      title="Prompt Guardrail Pack Composer"
      description="Build reusable guardrail prompt packs for refusal policy, uncertainty handling, citations, output contracts, and tool boundaries."
      relatedTools={["hallucination-guardrail-builder", "prompt-policy-firewall", "jailbreak-replay-lab", "ai-reliability-scorecard"]}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={loadSample}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Load sample
        </button>
        <button
          onClick={clearAll}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Clear
        </button>
        <CopyButton text={summary} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Pack name
          <input
            value={packName}
            onChange={(event) => setPackName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Allowed tools (comma-separated)
          <input
            value={allowedTools}
            onChange={(event) => setAllowedTools(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <SelectField
          label="Strictness"
          value={strictness}
          onChange={(value) => setStrictness(value as Strictness)}
          options={[
            { label: "Strict", value: "strict" },
            { label: "Balanced", value: "balanced" },
            { label: "Light", value: "light" },
          ]}
        />
        <SelectField
          label="Domain"
          value={domain}
          onChange={(value) => setDomain(value as Domain)}
          options={[
            { label: "General", value: "general" },
            { label: "Support", value: "support" },
            { label: "Finance", value: "finance" },
            { label: "Healthcare", value: "healthcare" },
            { label: "Legal", value: "legal" },
          ]}
        />
        <SelectField
          label="Citation mode"
          value={citationMode}
          onChange={(value) => setCitationMode(value as CitationMode)}
          options={[
            { label: "Required", value: "required" },
            { label: "Optional", value: "optional" },
            { label: "None", value: "none" },
          ]}
        />
        <SelectField
          label="Output mode"
          value={outputMode}
          onChange={(value) => setOutputMode(value as OutputMode)}
          options={[
            { label: "JSON", value: "json" },
            { label: "Markdown", value: "markdown" },
            { label: "Plain text", value: "plain" },
          ]}
        />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Guardrail modules</p>
        <div className="grid gap-2 md:grid-cols-2">
          {MODULES.map((module) => (
            <label key={module.id} className="flex items-start gap-2 rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-700">
              <input
                type="checkbox"
                checked={enabledModules[module.id]}
                onChange={(event) =>
                  setEnabledModules((prev) => ({
                    ...prev,
                    [module.id]: event.target.checked,
                  }))
                }
                className="mt-0.5 accent-blue-600"
              />
              <span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{module.title}</span>
                <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{module.description}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <StatCard label="Coverage" value={`${result.coverage}%`} />
        <StatCard label="Readiness" value={result.readiness} />
        <StatCard label="Enabled" value={`${result.active.length}/${MODULES.length}`} />
        <StatCard label="Missing Required" value={`${result.missingRequired.length}`} />
      </div>

      {result.missingRequired.length > 0 && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Missing required safety modules: {result.missingRequired.join(", ")}
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Guardrail prompt pack</p>
            <CopyButton text={result.packText} />
          </div>
          <textarea
            value={result.packText}
            onChange={() => {}}
            rows={13}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pack JSON config</p>
            <CopyButton text={JSON.stringify(result.packJson, null, 2)} />
          </div>
          <textarea
            value={JSON.stringify(result.packJson, null, 2)}
            onChange={() => {}}
            rows={13}
            readOnly
            className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-xs dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="mt-12 space-y-6 border-t border-gray-200 pt-8 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
        <p>
          Prompt Guardrail Pack Composer creates reusable policy modules you can paste into system prompts to improve
          safety, consistency, and output determinism.
        </p>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is this generating model output?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. It deterministically assembles guardrail text from selected policy modules.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Should I keep all modules enabled?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              For production use, keep refusal, uncertainty, and output contract enabled at minimum.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
              Is pack data uploaded?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. All composition runs locally in your browser.
            </p>
          </details>
        </div>
      </div>
    </ToolLayout>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="text-sm text-gray-700 dark:text-gray-300">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-700">
      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
