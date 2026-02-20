import { tools, type Tool } from "@/lib/tools";

export type Winner = "left" | "right" | "tie";

export interface ComparisonCriterion {
  criterion: string;
  left: string;
  right: string;
  winner: Winner;
}

export interface ComparisonFaq {
  question: string;
  answer: string;
}

export interface ToolComparisonDefinition {
  slug: string;
  leftSlug: string;
  rightSlug: string;
  intent: string;
  summary: string;
  keyTakeaways: string[];
  whenToUseLeft: string[];
  whenToUseRight: string[];
  criteria: ComparisonCriterion[];
  faqs: ComparisonFaq[];
}

export interface ToolComparison extends ToolComparisonDefinition {
  leftTool: Tool;
  rightTool: Tool;
}

const COMPARISON_DEFINITIONS: ToolComparisonDefinition[] = [
  {
    slug: "prompt-linter-vs-prompt-policy-firewall",
    leftSlug: "prompt-linter",
    rightSlug: "prompt-policy-firewall",
    intent: "Prompt quality checks vs prompt safety checks before model calls.",
    summary:
      "Prompt Linter improves instruction quality. Prompt Policy Firewall blocks sensitive or risky input patterns.",
    keyTakeaways: [
      "Use Prompt Linter for clarity, constraints, and conflict detection.",
      "Use Prompt Policy Firewall for PII, secrets, and injection pattern checks.",
      "Best stack: lint first, then run a policy firewall pass.",
    ],
    whenToUseLeft: [
      "You need cleaner and more deterministic prompt wording.",
      "You are reducing ambiguity and output drift in prompt templates.",
      "You want a quick quality score for draft prompts.",
    ],
    whenToUseRight: [
      "You must prevent sensitive data from leaving your prompt pipeline.",
      "You need policy gating for risky content before API calls.",
      "You are auditing prompts for PII, secrets, and override phrases.",
    ],
    criteria: [
      { criterion: "Primary goal", left: "Improve prompt quality", right: "Reduce policy risk", winner: "tie" },
      { criterion: "Finds ambiguity", left: "Strong", right: "Limited", winner: "left" },
      { criterion: "Finds PII and secrets", left: "Limited", right: "Strong", winner: "right" },
      { criterion: "Injection phrase checks", left: "Basic", right: "Strong", winner: "right" },
      { criterion: "Quality scoring", left: "Yes", right: "Risk score", winner: "tie" },
    ],
    faqs: [
      {
        question: "Should I choose one tool or use both?",
        answer:
          "For production workflows, use both. Start with Prompt Linter for instruction quality and then apply Prompt Policy Firewall to reduce leakage and injection risk.",
      },
      {
        question: "Do these tools send prompts to a server?",
        answer: "No. Both tools run client-side in the browser.",
      },
    ],
  },
  {
    slug: "claim-evidence-matrix-vs-grounded-answer-citation-checker",
    leftSlug: "claim-evidence-matrix",
    rightSlug: "grounded-answer-citation-checker",
    intent: "Claim-level mapping vs citation-level grounding validation.",
    summary:
      "Claim Evidence Matrix is best for structured claim-to-source mapping, while Grounded Answer Citation Checker is best for checking citation alignment inside generated answers.",
    keyTakeaways: [
      "Use Claim Evidence Matrix when you need audit-friendly claim coverage tables.",
      "Use Grounded Answer Citation Checker when you need quick grounding checks on generated answers.",
      "Combining both gives stronger verification in high-stakes QA workflows.",
    ],
    whenToUseLeft: [
      "You need a detailed matrix of claims and evidence support.",
      "You are preparing review artifacts for teams or compliance.",
      "You want explicit support strength scoring.",
    ],
    whenToUseRight: [
      "You need fast checks for citation mismatch in answer text.",
      "You are evaluating generated answers for grounding drift.",
      "You want quick pass/fail style grounding diagnostics.",
    ],
    criteria: [
      { criterion: "Best for", left: "Structured evidence mapping", right: "Citation alignment checks", winner: "tie" },
      { criterion: "Audit-style output", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Speed for quick checks", left: "Moderate", right: "Strong", winner: "right" },
      { criterion: "Claim granularity", left: "Very high", right: "High", winner: "left" },
      { criterion: "Workflow fit", left: "Manual review", right: "Rapid QA gate", winner: "tie" },
    ],
    faqs: [
      {
        question: "Can I use both tools in one workflow?",
        answer:
          "Yes. Start with Grounded Answer Citation Checker for fast screening, then run Claim Evidence Matrix for deeper evidence mapping.",
      },
      {
        question: "Which one is better for team review docs?",
        answer:
          "Claim Evidence Matrix is usually better for team review docs because the matrix format is easier to audit and share.",
      },
    ],
  },
  {
    slug: "pdf-to-jpg-vs-pdf-to-png",
    leftSlug: "pdf-to-jpg",
    rightSlug: "pdf-to-png",
    intent: "Smaller lossy exports vs sharper lossless exports for PDF pages.",
    summary:
      "PDF to JPG usually creates smaller files, while PDF to PNG keeps sharper details and lossless quality for text-heavy pages.",
    keyTakeaways: [
      "Choose JPG for smaller output size and faster sharing.",
      "Choose PNG for sharper text, diagrams, and OCR preparation.",
      "Use render scale controls in both tools to tune output detail.",
    ],
    whenToUseLeft: [
      "You want lighter files for web sharing.",
      "You are converting photos or visual pages where small loss is acceptable.",
      "You need fast, low-size image exports.",
    ],
    whenToUseRight: [
      "You need maximum sharpness for text and line graphics.",
      "You are preparing files for OCR or print pipelines.",
      "You prefer lossless image output.",
    ],
    criteria: [
      { criterion: "Compression", left: "Lossy", right: "Lossless", winner: "right" },
      { criterion: "Typical file size", left: "Smaller", right: "Larger", winner: "left" },
      { criterion: "Text sharpness", left: "Good", right: "Excellent", winner: "right" },
      { criterion: "Best for photos", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Best for OCR prep", left: "Moderate", right: "Strong", winner: "right" },
    ],
    faqs: [
      {
        question: "Which format should I use for scanned documents?",
        answer:
          "PNG is often better for scanned text if quality matters. JPG is better when you need smaller files.",
      },
      {
        question: "Are files uploaded during conversion?",
        answer: "No. Both converters run in-browser and do not upload PDFs to a server.",
      },
    ],
  },
  {
    slug: "rag-noise-pruner-vs-rag-context-relevance-scorer",
    leftSlug: "rag-noise-pruner",
    rightSlug: "rag-context-relevance-scorer",
    intent: "Chunk cleanup and pruning vs relevance ranking and scoring.",
    summary:
      "RAG Noise Pruner removes noisy or duplicate chunks, while RAG Context Relevance Scorer ranks chunk usefulness for a specific query.",
    keyTakeaways: [
      "Use RAG Noise Pruner to clean corpus quality before retrieval.",
      "Use RAG Context Relevance Scorer to prioritize chunks at query time.",
      "Best stack: prune first, then score relevance.",
    ],
    whenToUseLeft: [
      "You are reducing duplication and low-signal chunks in your knowledge base.",
      "You need cleaner retrieval inputs before indexing.",
      "You want corpus hygiene improvements.",
    ],
    whenToUseRight: [
      "You need query-specific ranking for retrieval candidates.",
      "You are tuning top-k chunk selection behavior.",
      "You want clearer relevance scoring signals.",
    ],
    criteria: [
      { criterion: "Primary operation", left: "Pruning and cleanup", right: "Scoring and ranking", winner: "tie" },
      { criterion: "Corpus hygiene impact", left: "High", right: "Moderate", winner: "left" },
      { criterion: "Query-time ranking", left: "Limited", right: "High", winner: "right" },
      { criterion: "Duplicate reduction", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Retrieval precision tuning", left: "Moderate", right: "Strong", winner: "right" },
    ],
    faqs: [
      {
        question: "Do I need both tools for RAG tuning?",
        answer:
          "In most cases yes. Pruning cleans the source set, and relevance scoring improves ranking quality for each query.",
      },
      {
        question: "Which one should come first in workflow?",
        answer: "Run pruning first, then use relevance scoring on the cleaned chunk set.",
      },
    ],
  },
  {
    slug: "token-counter-vs-ai-cost-estimator",
    leftSlug: "token-counter",
    rightSlug: "ai-cost-estimator",
    intent: "Token size estimation vs budget and spend projection.",
    summary:
      "AI Token Counter estimates token usage in text, while AI Cost Estimator projects request, daily, and monthly spend from token and pricing inputs.",
    keyTakeaways: [
      "Use Token Counter to size prompts and outputs quickly.",
      "Use AI Cost Estimator to plan costs and budget scenarios.",
      "Use Token Counter output as an input to cost estimation.",
    ],
    whenToUseLeft: [
      "You need quick token counts during prompt iteration.",
      "You want to fit within context windows.",
      "You are comparing prompt variants by token size.",
    ],
    whenToUseRight: [
      "You need budget projections and cost planning.",
      "You are evaluating model price tradeoffs across usage levels.",
      "You want monthly spend estimates for stakeholders.",
    ],
    criteria: [
      { criterion: "Main output", left: "Token estimates", right: "Cost projections", winner: "tie" },
      { criterion: "Pricing simulation", left: "No", right: "Yes", winner: "right" },
      { criterion: "Prompt iteration speed", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Budget planning", left: "Limited", right: "Strong", winner: "right" },
      { criterion: "Best role", left: "Prompt engineer", right: "Ops and planning", winner: "tie" },
    ],
    faqs: [
      {
        question: "Can I use both for model migration planning?",
        answer:
          "Yes. Count typical token usage first, then compare projected spending across pricing scenarios in AI Cost Estimator.",
      },
      {
        question: "Is pricing data fetched automatically?",
        answer:
          "No. AI Cost Estimator is manual-input based so you can test any pricing assumptions locally.",
      },
    ],
  },
];

function hydrateComparison(definition: ToolComparisonDefinition): ToolComparison | null {
  const leftTool = tools.find((tool) => tool.slug === definition.leftSlug);
  const rightTool = tools.find((tool) => tool.slug === definition.rightSlug);
  if (!leftTool || !rightTool) return null;

  return {
    ...definition,
    leftTool,
    rightTool,
  };
}

export function getAllComparisons() {
  return COMPARISON_DEFINITIONS.map(hydrateComparison).filter(
    (comparison): comparison is ToolComparison => Boolean(comparison)
  );
}

export function getComparisonBySlug(slug: string) {
  const definition = COMPARISON_DEFINITIONS.find((item) => item.slug === slug);
  if (!definition) return null;
  return hydrateComparison(definition);
}
