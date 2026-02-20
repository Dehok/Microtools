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
  {
    slug: "prompt-security-scanner-vs-prompt-policy-firewall",
    leftSlug: "prompt-security-scanner",
    rightSlug: "prompt-policy-firewall",
    intent: "Fast security scanning vs policy-driven prompt firewall gating.",
    summary:
      "Prompt Security Scanner is ideal for broad risk detection, while Prompt Policy Firewall is stronger for stricter policy gate workflows.",
    keyTakeaways: [
      "Use Prompt Security Scanner for quick broad scanning on draft prompts.",
      "Use Prompt Policy Firewall when policy decisions and redacted output are required.",
      "Together they form a practical two-step safety workflow.",
    ],
    whenToUseLeft: [
      "You need fast first-pass checks for secrets, PII, and risky phrases.",
      "You want lightweight prompt security diagnostics for iterative drafting.",
      "You need a high-signal scan before deeper policy review.",
    ],
    whenToUseRight: [
      "You need decision-style allow/review/block checks.",
      "You need redacted prompt output for safer downstream calls.",
      "You are enforcing policy gates before model API requests.",
    ],
    criteria: [
      { criterion: "Primary mode", left: "Security scan", right: "Policy firewall", winner: "tie" },
      { criterion: "Decision gating", left: "Basic", right: "Strong", winner: "right" },
      { criterion: "Scan speed", left: "Strong", right: "Strong", winner: "tie" },
      { criterion: "Redacted output", left: "No", right: "Yes", winner: "right" },
      { criterion: "Best workflow role", left: "Draft safety pass", right: "Final safety gate", winner: "tie" },
    ],
    faqs: [
      {
        question: "Which one should run first?",
        answer:
          "Run Prompt Security Scanner first for broad detection, then Prompt Policy Firewall for policy enforcement and redaction.",
      },
      {
        question: "Are these scans server-side?",
        answer: "No. Both tools run in-browser and keep prompt text local.",
      },
    ],
  },
  {
    slug: "prompt-regression-suite-builder-vs-prompt-test-case-generator",
    leftSlug: "prompt-regression-suite-builder",
    rightSlug: "prompt-test-case-generator",
    intent: "Regression drift analysis vs deterministic test case generation.",
    summary:
      "Prompt Regression Suite Builder focuses on version drift and constraint loss, while Prompt Test Case Generator focuses on creating deterministic test sets.",
    keyTakeaways: [
      "Use Regression Suite Builder to compare baseline vs candidate prompt changes.",
      "Use Prompt Test Case Generator to create consistent evaluation datasets.",
      "Combined usage improves reliability of prompt release cycles.",
    ],
    whenToUseLeft: [
      "You are releasing a new prompt version and need drift checks.",
      "You want to detect removed or weakened constraints.",
      "You need side-by-side baseline and candidate analysis.",
    ],
    whenToUseRight: [
      "You need deterministic test records for QA pipelines.",
      "You want standardized prompt-eval cases in JSONL format.",
      "You are building repeatable testing across teams.",
    ],
    criteria: [
      { criterion: "Best for", left: "Version regression analysis", right: "Test case generation", winner: "tie" },
      { criterion: "Constraint-loss detection", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Deterministic dataset output", left: "Moderate", right: "Strong", winner: "right" },
      { criterion: "Release gating value", left: "Strong", right: "Strong", winner: "tie" },
      { criterion: "Workflow stage", left: "Pre-release diff check", right: "QA dataset preparation", winner: "tie" },
    ],
    faqs: [
      {
        question: "Can I use one without the other?",
        answer:
          "Yes, but they solve different steps. Regression Suite Builder checks drift; Test Case Generator builds the reusable test input set.",
      },
      {
        question: "Which is better for CI checks?",
        answer:
          "Regression Suite Builder is often better for direct prompt version gating, while generated test cases can feed broader CI pipelines.",
      },
    ],
  },
  {
    slug: "llm-response-grader-vs-answer-consistency-checker",
    leftSlug: "llm-response-grader",
    rightSlug: "answer-consistency-checker",
    intent: "Rubric scoring quality vs multi-answer consistency analysis.",
    summary:
      "LLM Response Grader measures quality against rubric rules, while Answer Consistency Checker compares multiple outputs to detect drift and conflicts.",
    keyTakeaways: [
      "Use LLM Response Grader for weighted quality scoring.",
      "Use Answer Consistency Checker for stability checks across variants.",
      "Use both for quality plus consistency coverage.",
    ],
    whenToUseLeft: [
      "You need rubric-based pass/fail style scoring.",
      "You want weighted checks and explicit penalties.",
      "You are evaluating a single answer against standards.",
    ],
    whenToUseRight: [
      "You need to compare multiple model outputs.",
      "You are testing response stability between runs or models.",
      "You need conflict detection between answer variants.",
    ],
    criteria: [
      { criterion: "Primary focus", left: "Quality scoring", right: "Consistency analysis", winner: "tie" },
      { criterion: "Single-answer evaluation", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Cross-answer drift detection", left: "Limited", right: "Strong", winner: "right" },
      { criterion: "Rubric weighting support", left: "Strong", right: "Limited", winner: "left" },
      { criterion: "Best deployment", left: "Quality gate", right: "Stability gate", winner: "tie" },
    ],
    faqs: [
      {
        question: "If I only pick one for launch QA, which should it be?",
        answer:
          "Choose based on your risk: quality rubric concerns favor LLM Response Grader; stability concerns favor Answer Consistency Checker.",
      },
      {
        question: "Do these tools require model API calls?",
        answer: "No. Both tools perform local text analysis in-browser.",
      },
    ],
  },
  {
    slug: "hallucination-risk-checklist-vs-hallucination-guardrail-builder",
    leftSlug: "hallucination-risk-checklist",
    rightSlug: "hallucination-guardrail-builder",
    intent: "Risk assessment checklist vs guardrail prompt block generation.",
    summary:
      "Hallucination Risk Checklist estimates how risky a setup is, while Hallucination Guardrail Builder creates reusable prompt guardrails to reduce risk.",
    keyTakeaways: [
      "Use Hallucination Risk Checklist for diagnostics and planning.",
      "Use Hallucination Guardrail Builder for practical mitigation content.",
      "Best flow: assess risk first, then generate guardrails.",
    ],
    whenToUseLeft: [
      "You need a quick risk snapshot before deployment.",
      "You want to identify weak grounding or instruction gaps.",
      "You need prioritization of mitigation work.",
    ],
    whenToUseRight: [
      "You need reusable guardrail instructions for prompts.",
      "You want consistent uncertainty and citation behavior.",
      "You are standardizing safe-answer policies.",
    ],
    criteria: [
      { criterion: "Primary output", left: "Risk assessment", right: "Guardrail text blocks", winner: "tie" },
      { criterion: "Immediate mitigation content", left: "Limited", right: "Strong", winner: "right" },
      { criterion: "Diagnostic clarity", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Policy reuse value", left: "Moderate", right: "Strong", winner: "right" },
      { criterion: "Workflow order", left: "First step", right: "Second step", winner: "tie" },
    ],
    faqs: [
      {
        question: "Should guardrails be added without risk assessment?",
        answer:
          "You can, but risk assessment usually helps target the most relevant guardrails first.",
      },
      {
        question: "Can these be used outside RAG workflows?",
        answer: "Yes. They are useful in general AI assistant prompting and QA pipelines.",
      },
    ],
  },
  {
    slug: "rag-chunking-simulator-vs-rag-context-relevance-scorer",
    leftSlug: "rag-chunking-simulator",
    rightSlug: "rag-context-relevance-scorer",
    intent: "Chunking strategy simulation vs query-specific relevance ranking.",
    summary:
      "RAG Chunking Simulator helps tune chunk size and overlap strategy, while RAG Context Relevance Scorer ranks chunk quality for specific queries.",
    keyTakeaways: [
      "Use chunking simulation to shape retrieval-ready data upfront.",
      "Use relevance scoring to rank chunk usefulness at query time.",
      "Together they improve retrieval recall and precision.",
    ],
    whenToUseLeft: [
      "You are setting chunk size and overlap before indexing.",
      "You need to compare chunking presets for data preparation.",
      "You are tuning ingestion-time structure.",
    ],
    whenToUseRight: [
      "You need ranking signals for retrieved chunks.",
      "You are optimizing top-k selection for specific user queries.",
      "You need query-level relevance diagnostics.",
    ],
    criteria: [
      { criterion: "Pipeline stage", left: "Ingestion-time", right: "Query-time", winner: "tie" },
      { criterion: "Chunk strategy tuning", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Relevance scoring", left: "Limited", right: "Strong", winner: "right" },
      { criterion: "Best for precision tuning", left: "Moderate", right: "Strong", winner: "right" },
      { criterion: "Best for structure tuning", left: "Strong", right: "Moderate", winner: "left" },
    ],
    faqs: [
      {
        question: "Do I need both to optimize RAG?",
        answer:
          "In most cases yes: chunking simulation improves source structure, relevance scoring improves retrieval ranking behavior.",
      },
      {
        question: "Which one should I run first?",
        answer: "Tune chunking strategy first, then evaluate relevance scoring for real query sets.",
      },
    ],
  },
  {
    slug: "context-window-packer-vs-prompt-compressor",
    leftSlug: "context-window-packer",
    rightSlug: "prompt-compressor",
    intent: "Budget-aware context packing vs aggressive prompt text compression.",
    summary:
      "Context Window Packer prioritizes and fits segments into strict budgets, while Prompt Compressor shortens verbose prompt text to reduce token usage.",
    keyTakeaways: [
      "Use Context Window Packer for segment-level prioritization under token limits.",
      "Use Prompt Compressor to reduce verbosity and duplicates in text.",
      "Use compressor first, then packer for final budget fit.",
    ],
    whenToUseLeft: [
      "You have multiple context segments competing for limited budget.",
      "You need required/optional segment control.",
      "You are preparing prompts for strict context window constraints.",
    ],
    whenToUseRight: [
      "You need to shorten long instructions quickly.",
      "You want to remove repetitive filler phrases.",
      "You are optimizing draft prompts for lower token cost.",
    ],
    criteria: [
      { criterion: "Primary unit", left: "Segment packing", right: "Text compression", winner: "tie" },
      { criterion: "Budget control", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Verbosity reduction", left: "Moderate", right: "Strong", winner: "right" },
      { criterion: "Required-rule support", left: "Strong", right: "Limited", winner: "left" },
      { criterion: "Best use", left: "Final prompt assembly", right: "Draft prompt cleanup", winner: "tie" },
    ],
    faqs: [
      {
        question: "Can I chain these two tools?",
        answer:
          "Yes. Compress prompt text first, then use Context Window Packer to fit remaining segments into a fixed budget.",
      },
      {
        question: "Which one helps most with token overruns?",
        answer:
          "Context Window Packer is better for strict budget enforcement when you have multiple input segments.",
      },
    ],
  },
  {
    slug: "output-contract-tester-vs-json-output-guard",
    leftSlug: "output-contract-tester",
    rightSlug: "json-output-guard",
    intent: "General output contract checks vs JSON-specific schema validation.",
    summary:
      "Output Contract Tester validates broader output rules, while JSON Output Guard is focused on schema-safe JSON outputs for downstream parsing.",
    keyTakeaways: [
      "Use Output Contract Tester for mixed rule sets beyond JSON structure.",
      "Use JSON Output Guard for strict schema-focused JSON validation.",
      "Combine both when your workflow has JSON plus policy constraints.",
    ],
    whenToUseLeft: [
      "You need required keys, forbidden terms, and length checks together.",
      "You are validating non-JSON response constraints.",
      "You want contract-style test coverage for output quality.",
    ],
    whenToUseRight: [
      "You need strict JSON schema conformance before automation.",
      "You are protecting downstream parsers from malformed outputs.",
      "Your pipeline relies on typed JSON contracts.",
    ],
    criteria: [
      { criterion: "Best for", left: "General contracts", right: "JSON schema safety", winner: "tie" },
      { criterion: "JSON schema depth", left: "Moderate", right: "Strong", winner: "right" },
      { criterion: "Non-JSON rules", left: "Strong", right: "Limited", winner: "left" },
      { criterion: "Automation safety", left: "Strong", right: "Strong", winner: "tie" },
      { criterion: "Pipeline role", left: "Contract QA", right: "Parser guardrail", winner: "tie" },
    ],
    faqs: [
      {
        question: "If output must be valid JSON, which tool is primary?",
        answer:
          "JSON Output Guard should be primary for strict schema checks, then Output Contract Tester can enforce additional policy constraints.",
      },
      {
        question: "Can Output Contract Tester replace JSON Output Guard?",
        answer:
          "Not fully. It can cover some checks, but JSON Output Guard is better for strict schema-level JSON validation.",
      },
    ],
  },
  {
    slug: "prompt-red-team-generator-vs-agent-safety-checklist",
    leftSlug: "prompt-red-team-generator",
    rightSlug: "agent-safety-checklist",
    intent: "Adversarial prompt testing vs operational agent safety auditing.",
    summary:
      "Prompt Red-Team Generator creates adversarial attack cases, while Agent Safety Checklist audits operational controls like budgets, confirmation gates, and allowlists.",
    keyTakeaways: [
      "Use Prompt Red-Team Generator for attack simulation and jailbreak testing.",
      "Use Agent Safety Checklist for operational governance and risk controls.",
      "Use both for robust pre-launch agent evaluations.",
    ],
    whenToUseLeft: [
      "You need adversarial test prompts for safety stress tests.",
      "You are evaluating jailbreak and instruction override resilience.",
      "You are preparing red-team style test suites.",
    ],
    whenToUseRight: [
      "You are reviewing agent runbook safety controls.",
      "You need checks for approvals, budgets, and fallback behavior.",
      "You are preparing compliance-oriented launch readiness reviews.",
    ],
    criteria: [
      { criterion: "Primary lens", left: "Adversarial input", right: "Operational governance", winner: "tie" },
      { criterion: "Jailbreak test support", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Runbook and policy audit", left: "Limited", right: "Strong", winner: "right" },
      { criterion: "Pre-launch safety value", left: "Strong", right: "Strong", winner: "tie" },
      { criterion: "Best audience", left: "Red-team QA", right: "Ops and compliance", winner: "tie" },
    ],
    faqs: [
      {
        question: "Can checklist audits replace red-team testing?",
        answer:
          "No. Checklist audits and adversarial testing cover different risk classes and should be combined.",
      },
      {
        question: "When should these run in release cycle?",
        answer:
          "Run red-team prompt generation during model/prompt testing and use safety checklist audits before final release sign-off.",
      },
    ],
  },
  {
    slug: "sensitive-data-pseudonymizer-vs-pii-redactor",
    leftSlug: "sensitive-data-pseudonymizer",
    rightSlug: "pii-redactor",
    intent: "Reversible placeholder mapping vs direct sensitive data redaction.",
    summary:
      "Sensitive Data Pseudonymizer is best when you need reversible mappings, while PII Redactor is best for irreversible masking before sharing.",
    keyTakeaways: [
      "Use pseudonymization when context must remain analyzable and reversible.",
      "Use redaction when you need hard masking with minimal recovery risk.",
      "Pick based on whether reversibility is required.",
    ],
    whenToUseLeft: [
      "You need to restore original values later in a secure workflow.",
      "You want stable placeholders for repeated entity references.",
      "You are doing staged AI processing with controlled re-identification.",
    ],
    whenToUseRight: [
      "You need immediate and irreversible masking.",
      "You are sharing logs or snippets externally.",
      "You want a minimal-risk privacy sanitization pass.",
    ],
    criteria: [
      { criterion: "Reversibility", left: "Yes", right: "No", winner: "left" },
      { criterion: "Privacy hardening", left: "Strong", right: "Very strong", winner: "right" },
      { criterion: "Context preservation", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "External sharing safety", left: "Strong", right: "Very strong", winner: "right" },
      { criterion: "Best use", left: "Controlled internal workflows", right: "External-safe masking", winner: "tie" },
    ],
    faqs: [
      {
        question: "Which tool is safer for public sharing?",
        answer:
          "PII Redactor is usually safer for public sharing because it does not preserve reversible mappings.",
      },
      {
        question: "Can I combine both?",
        answer:
          "Yes. You can pseudonymize for internal processing and then apply redaction for external export.",
      },
    ],
  },
  {
    slug: "openai-batch-jsonl-validator-vs-jsonl-batch-splitter",
    leftSlug: "openai-batch-jsonl-validator",
    rightSlug: "jsonl-batch-splitter",
    intent: "Batch line validation vs dataset splitting for batch size limits.",
    summary:
      "OpenAI Batch JSONL Validator checks line-level validity, while JSONL Batch Splitter chunks large datasets by record count or byte size.",
    keyTakeaways: [
      "Use validator first to remove invalid JSONL records.",
      "Use splitter next to fit file-size or line-limit constraints.",
      "Together they reduce batch submission failures.",
    ],
    whenToUseLeft: [
      "You need to detect malformed lines and batch field errors.",
      "You want pre-flight validation before submission.",
      "You need clean batch-ready JSONL records.",
    ],
    whenToUseRight: [
      "Your dataset exceeds line or byte constraints.",
      "You need multiple smaller batch files.",
      "You want predictable chunk sizing for job orchestration.",
    ],
    criteria: [
      { criterion: "Primary action", left: "Validate JSONL lines", right: "Split JSONL files", winner: "tie" },
      { criterion: "Error detection", left: "Strong", right: "Limited", winner: "left" },
      { criterion: "Size-limit handling", left: "Limited", right: "Strong", winner: "right" },
      { criterion: "Batch reliability impact", left: "High", right: "High", winner: "tie" },
      { criterion: "Recommended order", left: "First", right: "Second", winner: "tie" },
    ],
    faqs: [
      {
        question: "Should I split files before validation?",
        answer:
          "Usually validate first, then split valid records. That prevents carrying bad lines into every chunk.",
      },
      {
        question: "Can splitter replace validator checks?",
        answer:
          "No. Splitting manages file size and record count, but does not validate record correctness.",
      },
    ],
  },
  {
    slug: "prompt-versioning-regression-dashboard-vs-prompt-regression-suite-builder",
    leftSlug: "prompt-versioning-regression-dashboard",
    rightSlug: "prompt-regression-suite-builder",
    intent: "Version timeline dashboard monitoring vs focused baseline-candidate regression suite generation.",
    summary:
      "Prompt Versioning + Regression Dashboard is best for tracking multiple prompt snapshots and release drift, while Prompt Regression Suite Builder is best for generating deterministic regression artifacts from a baseline-candidate pair.",
    keyTakeaways: [
      "Use Prompt Versioning Dashboard for iterative version tracking and quick release checks.",
      "Use Prompt Regression Suite Builder for deterministic suite output and structured assertions.",
      "Use dashboard first, then regression suite builder for deeper QA exports.",
    ],
    whenToUseLeft: [
      "You maintain many prompt revisions and need a timeline view.",
      "You want quick regression scores across snapshot candidates.",
      "You need lightweight version-level release gating.",
    ],
    whenToUseRight: [
      "You need deterministic markdown/JSONL regression artifacts.",
      "You are comparing one baseline against one candidate deeply.",
      "You need suite-ready output for downstream QA pipelines.",
    ],
    criteria: [
      { criterion: "Primary focus", left: "Version dashboard", right: "Regression suite export", winner: "tie" },
      { criterion: "Multi-version visibility", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Deterministic suite artifacts", left: "Moderate", right: "Strong", winner: "right" },
      { criterion: "Release snapshot workflow", left: "Strong", right: "Strong", winner: "tie" },
      { criterion: "Best first step", left: "Version monitoring", right: "Detailed suite generation", winner: "tie" },
    ],
    faqs: [
      {
        question: "Can these tools be used together?",
        answer:
          "Yes. Use Prompt Versioning Dashboard to shortlist candidate versions and then run Prompt Regression Suite Builder for deterministic exports.",
      },
      {
        question: "Which tool is better for quick PM reviews?",
        answer:
          "Prompt Versioning + Regression Dashboard is typically better for quick release review because it emphasizes snapshot-level comparisons.",
      },
    ],
  },
  {
    slug: "jailbreak-replay-lab-vs-prompt-red-team-generator",
    leftSlug: "jailbreak-replay-lab",
    rightSlug: "prompt-red-team-generator",
    intent: "Response replay scoring lab vs adversarial test case generation.",
    summary:
      "Jailbreak Replay Lab evaluates actual model responses against replay scenarios, while Prompt Red-Team Generator creates adversarial cases for testing.",
    keyTakeaways: [
      "Use Prompt Red-Team Generator to produce attack datasets.",
      "Use Jailbreak Replay Lab to score model responses against those attacks.",
      "Use both sequentially for full offensive-to-defensive safety evaluation.",
    ],
    whenToUseLeft: [
      "You already have model outputs and need defense scoring.",
      "You want replay-style pass/warning/fail safety reports.",
      "You need deterministic scoring for regression monitoring.",
    ],
    whenToUseRight: [
      "You need fresh adversarial prompts for safety testing.",
      "You want category-based jailbreak case generation.",
      "You need reusable attack prompts for red-team workflows.",
    ],
    criteria: [
      { criterion: "Primary output", left: "Replay defense score", right: "Attack cases", winner: "tie" },
      { criterion: "Adversarial generation depth", left: "Moderate", right: "Strong", winner: "right" },
      { criterion: "Response scoring workflow", left: "Strong", right: "Moderate", winner: "left" },
      { criterion: "Best pipeline role", left: "Evaluation stage", right: "Test creation stage", winner: "tie" },
      { criterion: "Combined value", left: "High", right: "High", winner: "tie" },
    ],
    faqs: [
      {
        question: "Should replay lab replace red-team generation?",
        answer:
          "No. Replay Lab evaluates responses, while Red-Team Generator creates adversarial input cases. They are complementary.",
      },
      {
        question: "What is the recommended order?",
        answer:
          "Generate attacks first with Prompt Red-Team Generator, then evaluate model responses in Jailbreak Replay Lab.",
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

export function getComparisonsForTool(slug: string, limit = 4) {
  return getAllComparisons()
    .filter((comparison) => comparison.leftSlug === slug || comparison.rightSlug === slug)
    .slice(0, limit);
}
