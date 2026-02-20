import { tools } from "@/lib/tools";

export interface WorkflowFaq {
  question: string;
  answer: string;
}

export interface WorkflowStep {
  title: string;
  toolSlug: string;
  reason: string;
  outcome: string;
}

export interface WorkflowGuide {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  focusAreas: string[];
  toolSlugs: string[];
  comparisonSlugs: string[];
  steps: WorkflowStep[];
  faqs: WorkflowFaq[];
}

export const WORKFLOW_GUIDES: WorkflowGuide[] = [
  {
    slug: "prompt-release-checklist",
    name: "Prompt Release Checklist",
    title: "Prompt Release Checklist Workflow",
    description:
      "Run a practical pre-release prompt QA flow with linting, policy checks, replay testing, and final go/no-go scoring.",
    intro:
      "Use this workflow before deploying prompt changes to reduce regressions, safety leakage, and unstable outputs.",
    focusAreas: [
      "Prompt clarity and deterministic constraints",
      "Policy risk and sensitive-data checks",
      "Replay-based safety validation",
      "Final release gate scoring and decisioning",
    ],
    toolSlugs: [
      "prompt-linter",
      "prompt-test-case-generator",
      "llm-response-grader",
      "prompt-policy-firewall",
      "jailbreak-replay-lab",
      "ai-qa-workflow-runner",
      "ai-reliability-scorecard",
    ],
    comparisonSlugs: [
      "prompt-linter-vs-prompt-policy-firewall",
      "prompt-test-case-generator-vs-llm-response-grader",
      "ai-qa-workflow-runner-vs-ai-reliability-scorecard",
    ],
    steps: [
      {
        title: "Lint prompt draft",
        toolSlug: "prompt-linter",
        reason: "Detect ambiguity, weak constraints, and conflicting instructions early.",
        outcome: "Cleaner and more deterministic prompt baseline.",
      },
      {
        title: "Generate deterministic QA records",
        toolSlug: "prompt-test-case-generator",
        reason: "Create consistent test cases for repeatable validation.",
        outcome: "Stable test input set for scoring and regression checks.",
      },
      {
        title: "Score output quality",
        toolSlug: "llm-response-grader",
        reason: "Evaluate responses against weighted rubric requirements.",
        outcome: "Comparable quality score and rule-level failures.",
      },
      {
        title: "Run policy firewall",
        toolSlug: "prompt-policy-firewall",
        reason: "Check prompts for PII, secrets, and risky override patterns.",
        outcome: "Allow/review/block policy decision before release.",
      },
      {
        title: "Replay jailbreak defense",
        toolSlug: "jailbreak-replay-lab",
        reason: "Validate behavior against known attack scenario categories.",
        outcome: "Safety replay score with warning and fail cases.",
      },
      {
        title: "Finalize release gate",
        toolSlug: "ai-qa-workflow-runner",
        reason: "Aggregate QA signals into one deterministic Ship/Review/Block outcome.",
        outcome: "Actionable release decision for launch review.",
      },
    ],
    faqs: [
      {
        question: "How often should this checklist run?",
        answer:
          "Run this flow for every meaningful prompt change before production deployment, especially when constraints or policies are updated.",
      },
      {
        question: "Can I skip replay checks for low-risk features?",
        answer:
          "You can reduce depth for low-risk features, but a lightweight replay pass is still useful for catching unexpected instruction overrides.",
      },
    ],
  },
  {
    slug: "rag-grounding-audit",
    name: "RAG Grounding Audit",
    title: "RAG Grounding Audit Workflow",
    description:
      "Tune chunk quality and retrieval grounding with chunk simulation, noise pruning, relevance scoring, and claim-evidence checks.",
    intro:
      "Use this workflow when RAG outputs feel noisy, weakly cited, or factually unstable across similar queries.",
    focusAreas: [
      "Chunk strategy simulation and sizing",
      "Noise and duplicate chunk reduction",
      "Query-to-context relevance scoring",
      "Claim-level grounding and citation validation",
    ],
    toolSlugs: [
      "rag-chunking-simulator",
      "rag-noise-pruner",
      "rag-context-relevance-scorer",
      "claim-evidence-matrix",
      "grounded-answer-citation-checker",
      "hallucination-risk-checklist",
    ],
    comparisonSlugs: [
      "rag-noise-pruner-vs-rag-context-relevance-scorer",
      "rag-noise-pruner-vs-rag-chunking-simulator",
      "claim-evidence-matrix-vs-grounded-answer-citation-checker",
      "grounded-answer-citation-checker-vs-hallucination-risk-checklist",
    ],
    steps: [
      {
        title: "Simulate chunk strategy",
        toolSlug: "rag-chunking-simulator",
        reason: "Compare chunk size and overlap settings before reindexing.",
        outcome: "Better chunking baseline for retrieval precision and recall.",
      },
      {
        title: "Prune noise and duplicates",
        toolSlug: "rag-noise-pruner",
        reason: "Remove low-signal content that pollutes retrieval context.",
        outcome: "Cleaner chunk pool for ranking and grounding.",
      },
      {
        title: "Score context relevance",
        toolSlug: "rag-context-relevance-scorer",
        reason: "Measure query-specific value of candidate chunks.",
        outcome: "Ranked chunk candidates with clearer relevance signal.",
      },
      {
        title: "Map claims to evidence",
        toolSlug: "claim-evidence-matrix",
        reason: "Audit which claims are supported, weak, or unsupported.",
        outcome: "Claim-level evidence table for review and fixes.",
      },
      {
        title: "Validate citation grounding",
        toolSlug: "grounded-answer-citation-checker",
        reason: "Check generated answer references for mismatch and drift.",
        outcome: "Fast grounding diagnostics before user-facing release.",
      },
    ],
    faqs: [
      {
        question: "Should I tune chunking or relevance scoring first?",
        answer:
          "Start with chunk strategy and noise pruning first, then score relevance on the cleaned chunk set for more meaningful signals.",
      },
      {
        question: "How do I detect hallucination risk in RAG outputs?",
        answer:
          "Use claim-evidence mapping and citation checks on answers, then run hallucination risk checklist for broader risk posture.",
      },
    ],
  },
  {
    slug: "ai-output-validation",
    name: "AI Output Validation",
    title: "AI Output Validation Workflow",
    description:
      "Validate model output format and schema safety for automation pipelines using contract tests and function-call schema checks.",
    intro:
      "Use this workflow when structured output failures break downstream parsers, tool calls, or automated workflows.",
    focusAreas: [
      "Response contract enforcement",
      "Strict JSON schema validation",
      "Function-call argument integrity",
      "Automation-safe output hardening",
    ],
    toolSlugs: [
      "output-contract-tester",
      "json-output-guard",
      "function-calling-schema-tester",
      "context-window-packer",
      "prompt-guardrail-pack-composer",
    ],
    comparisonSlugs: [
      "output-contract-tester-vs-json-output-guard",
      "output-contract-tester-vs-function-calling-schema-tester",
      "json-output-guard-vs-function-calling-schema-tester",
    ],
    steps: [
      {
        title: "Define response contract",
        toolSlug: "output-contract-tester",
        reason: "Specify required keys, forbidden patterns, and length constraints.",
        outcome: "General response policy baseline for QA checks.",
      },
      {
        title: "Validate strict JSON output",
        toolSlug: "json-output-guard",
        reason: "Enforce parser-safe response schema conformance.",
        outcome: "Lower risk of broken downstream JSON handling.",
      },
      {
        title: "Verify function-call payload schema",
        toolSlug: "function-calling-schema-tester",
        reason: "Catch malformed tool/function argument objects before execution.",
        outcome: "Safer and more reliable tool invocation behavior.",
      },
      {
        title: "Pack context to avoid truncation",
        toolSlug: "context-window-packer",
        reason: "Reduce schema breakage caused by context overflow or clipping.",
        outcome: "More stable structured outputs under token limits.",
      },
      {
        title: "Compose output guardrails",
        toolSlug: "prompt-guardrail-pack-composer",
        reason: "Embed deterministic output and uncertainty rules into system prompts.",
        outcome: "Higher consistency in structured responses.",
      },
    ],
    faqs: [
      {
        question: "Which validator matters most for tool-calling agents?",
        answer:
          "Function Calling Schema Tester is critical for invocation payload safety, while JSON Output Guard protects final response conformance.",
      },
      {
        question: "Can output contract tests replace strict schema checks?",
        answer:
          "Not fully. Output contract tests are broad and flexible, while strict schema validation is better for parser and tool-call safety.",
      },
    ],
  },
  {
    slug: "prompt-safety-hardening",
    name: "Prompt Safety Hardening",
    title: "Prompt Safety Hardening Workflow",
    description:
      "Harden prompt safety using security scans, policy firewalls, guardrail templates, and replay testing for jailbreak resilience.",
    intro:
      "Use this workflow when prompts handle sensitive content or when you need stronger jailbreak and policy defenses.",
    focusAreas: [
      "Prompt risk scanning and secret detection",
      "Runtime policy gate enforcement",
      "Guardrail template standardization",
      "Replay-based adversarial resilience checks",
    ],
    toolSlugs: [
      "prompt-security-scanner",
      "secret-detector-for-code-snippets",
      "prompt-policy-firewall",
      "prompt-guardrail-pack-composer",
      "prompt-red-team-generator",
      "jailbreak-replay-lab",
      "agent-safety-checklist",
    ],
    comparisonSlugs: [
      "prompt-security-scanner-vs-prompt-policy-firewall",
      "prompt-security-scanner-vs-secret-detector-for-code-snippets",
      "prompt-guardrail-pack-composer-vs-prompt-policy-firewall",
      "prompt-policy-firewall-vs-agent-safety-checklist",
    ],
    steps: [
      {
        title: "Run broad prompt risk scan",
        toolSlug: "prompt-security-scanner",
        reason: "Detect leakage, injection, and risky language patterns quickly.",
        outcome: "First-pass risk inventory before deeper policy gating.",
      },
      {
        title: "Check code snippets for leaked secrets",
        toolSlug: "secret-detector-for-code-snippets",
        reason: "Identify credential/token patterns embedded in prompt context.",
        outcome: "Reduced secret leakage risk in model-bound content.",
      },
      {
        title: "Enforce policy firewall decisions",
        toolSlug: "prompt-policy-firewall",
        reason: "Apply allow/review/block logic and optional redaction at runtime.",
        outcome: "Consistent policy gate before model execution.",
      },
      {
        title: "Compose reusable guardrail packs",
        toolSlug: "prompt-guardrail-pack-composer",
        reason: "Standardize refusal, citation, uncertainty, and output rules.",
        outcome: "Reusable policy modules across prompts and assistants.",
      },
      {
        title: "Test adversarial resilience",
        toolSlug: "jailbreak-replay-lab",
        reason: "Evaluate defense performance against replayed attack scenarios.",
        outcome: "Measured safety posture and retest priorities.",
      },
    ],
    faqs: [
      {
        question: "Do I need both scanner and policy firewall?",
        answer:
          "Yes in most production setups. Scanner gives broad diagnostics, while firewall enforces strict policy decisions at runtime.",
      },
      {
        question: "When should I run red-team and replay checks?",
        answer:
          "Run adversarial generation and replay testing before release and after major prompt-policy changes.",
      },
    ],
  },
  {
    slug: "ai-eval-regression-debug",
    name: "AI Eval Regression Debug",
    title: "AI Eval Regression Debug Workflow",
    description:
      "Debug baseline-vs-candidate regressions by combining eval deltas, prompt version tracking, and deterministic release gating.",
    intro:
      "Use this workflow when candidate prompts underperform baseline runs or pass-rates suddenly decline.",
    focusAreas: [
      "Baseline-candidate delta diagnostics",
      "Prompt version drift detection",
      "Deterministic regression suite generation",
      "Final release-gate risk decisioning",
    ],
    toolSlugs: [
      "eval-results-comparator",
      "prompt-versioning-regression-dashboard",
      "prompt-regression-suite-builder",
      "prompt-test-case-generator",
      "ai-qa-workflow-runner",
      "ai-reliability-scorecard",
    ],
    comparisonSlugs: [
      "eval-results-comparator-vs-prompt-regression-suite-builder",
      "ai-qa-workflow-runner-vs-eval-results-comparator",
      "ai-qa-workflow-runner-vs-prompt-versioning-regression-dashboard",
      "prompt-versioning-regression-dashboard-vs-prompt-regression-suite-builder",
    ],
    steps: [
      {
        title: "Compare eval outputs",
        toolSlug: "eval-results-comparator",
        reason: "Identify score and pass-rate regressions between baseline and candidate.",
        outcome: "Clear delta map of improved and degraded behaviors.",
      },
      {
        title: "Inspect prompt version drift",
        toolSlug: "prompt-versioning-regression-dashboard",
        reason: "Review how revisions changed constraints and behavior over time.",
        outcome: "Snapshot-level root-cause candidates for regressions.",
      },
      {
        title: "Build deterministic regression suite",
        toolSlug: "prompt-regression-suite-builder",
        reason: "Generate repeatable tests targeting regression-sensitive cases.",
        outcome: "Reproducible QA suite for fixing and retesting.",
      },
      {
        title: "Regenerate focused test records",
        toolSlug: "prompt-test-case-generator",
        reason: "Expand edge-case coverage where deltas are most severe.",
        outcome: "Higher-confidence regression verification set.",
      },
      {
        title: "Finalize risk decision",
        toolSlug: "ai-qa-workflow-runner",
        reason: "Aggregate quality, policy, replay, and eval signals for release gating.",
        outcome: "Deterministic Block/Review/Ship outcome with actions.",
      },
    ],
    faqs: [
      {
        question: "What is the fastest way to isolate regression root cause?",
        answer:
          "Start with eval delta comparison, then inspect version drift and rerun targeted deterministic regression suites.",
      },
      {
        question: "Should release be blocked on any major negative delta?",
        answer:
          "For critical flows, yes. Large negative deltas should trigger deeper review and retest before promotion to production.",
      },
    ],
  },
];

export function getWorkflowBySlug(slug: string) {
  return WORKFLOW_GUIDES.find((workflow) => workflow.slug === slug);
}

export function getWorkflowTools(slug: string) {
  const workflow = getWorkflowBySlug(slug);
  if (!workflow) return [];
  return workflow.toolSlugs
    .map((toolSlug) => tools.find((tool) => tool.slug === toolSlug))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool));
}

