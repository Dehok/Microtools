import { tools } from "@/lib/tools";

export interface TopicFaq {
  question: string;
  answer: string;
}

export interface TopicHub {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  focusAreas: string[];
  toolSlugs: string[];
  faqs: TopicFaq[];
}

export const TOPIC_HUBS: TopicHub[] = [
  {
    slug: "ai-prompt-quality",
    name: "AI Prompt Quality",
    title: "AI Prompt Quality Tools",
    description:
      "Improve prompt reliability with linting, regression testing, grounding checks, and output contract validation.",
    intro:
      "This hub groups tools for prompt QA, output quality checks, and consistency validation across model responses.",
    focusAreas: [
      "Prompt lint and clarity checks",
      "Regression and A/B prompt testing",
      "Grounding and consistency validation",
      "Output contract enforcement",
    ],
    toolSlugs: [
      "prompt-linter",
      "prompt-versioning-regression-dashboard",
      "prompt-regression-suite-builder",
      "eval-results-comparator",
      "prompt-ab-test-matrix",
      "prompt-test-case-generator",
      "llm-response-grader",
      "ai-reliability-scorecard",
      "ai-qa-workflow-runner",
      "answer-consistency-checker",
      "claim-evidence-matrix",
      "grounded-answer-citation-checker",
      "output-contract-tester",
      "hallucination-risk-checklist",
      "hallucination-guardrail-builder",
      "prompt-guardrail-pack-composer",
    ],
    faqs: [
      {
        question: "Which tool should I start with for prompt QA?",
        answer:
          "Start with Prompt Linter, then use Prompt Regression Suite Builder and LLM Response Grader for repeatable validation.",
      },
      {
        question: "Can I test groundedness and consistency together?",
        answer:
          "Yes. Use Claim Evidence Matrix and Grounded Answer Citation Checker, then compare outputs with Answer Consistency Checker.",
      },
      {
        question: "Are these checks model-specific?",
        answer:
          "No. The tools are model-agnostic and evaluate text patterns and constraints locally in your browser.",
      },
    ],
  },
  {
    slug: "privacy-and-security",
    name: "Privacy and Security",
    title: "Privacy and Security AI Tools",
    description:
      "Reduce sensitive-data leakage with prompt firewall checks, pseudonymization, secret scanning, and browser privacy audits.",
    intro:
      "This hub focuses on privacy-first AI usage by masking data, scanning for secrets, and checking risky prompt patterns.",
    focusAreas: [
      "Prompt policy and injection checks",
      "PII masking and reversible pseudonymization",
      "Secret/token detection in snippets",
      "Browser privacy and tracking audits",
    ],
    toolSlugs: [
      "prompt-policy-firewall",
      "prompt-security-scanner",
      "prompt-red-team-generator",
      "jailbreak-replay-lab",
      "prompt-guardrail-pack-composer",
      "sensitive-data-pseudonymizer",
      "pii-redactor",
      "secret-detector-for-code-snippets",
      "cookie-audit-parser",
      "csp-header-builder",
      "browser-fingerprint-checker",
      "browser-permissions-auditor",
      "webrtc-leak-test",
      "url-tracker-cleaner",
      "passphrase-generator",
    ],
    faqs: [
      {
        question: "How do I safely share text with AI models?",
        answer:
          "Run Prompt Policy Firewall and Sensitive Data Pseudonymizer before sending data to reduce PII and secret leakage risk.",
      },
      {
        question: "Can I reverse pseudonymized text later?",
        answer:
          "Yes. Sensitive Data Pseudonymizer provides mapping data so placeholders can be restored locally.",
      },
      {
        question: "Do these tools upload my content?",
        answer:
          "No. These tools run client-side only and do not send prompt or file data to the server.",
      },
    ],
  },
  {
    slug: "pdf-workflows",
    name: "PDF Workflows",
    title: "PDF Conversion and Workflow Tools",
    description:
      "Handle full PDF workflows in-browser: merge, split, convert to images/text, and build PDFs from images.",
    intro:
      "This hub covers practical PDF pipelines from extraction to conversion and assembly without server upload.",
    focusAreas: [
      "PDF split and merge operations",
      "PDF to image/text conversions",
      "Image to PDF assembly",
      "Browser-only private processing",
    ],
    toolSlugs: [
      "pdf-merge",
      "pdf-split",
      "pdf-to-image",
      "pdf-to-jpg",
      "pdf-to-png",
      "pdf-to-text",
      "pdf-to-word",
      "image-to-pdf",
      "jpg-to-pdf",
      "png-to-pdf",
      "base64-to-pdf",
    ],
    faqs: [
      {
        question: "What is a common PDF workflow on CodeUtilo?",
        answer:
          "A common flow is split or merge first, then convert selected pages to image or text formats as needed.",
      },
      {
        question: "Can I convert scanned PDFs to text?",
        answer:
          "You can extract text with PDF to Text and complement it with Screenshot to Text for image-based content.",
      },
      {
        question: "Are file uploads required?",
        answer:
          "No remote upload is required. Processing runs directly in your browser.",
      },
    ],
  },
];

export function getTopicBySlug(slug: string) {
  return TOPIC_HUBS.find((topic) => topic.slug === slug);
}

export function getTopicTools(slug: string) {
  const topic = getTopicBySlug(slug);
  if (!topic) return [];
  return topic.toolSlugs
    .map((toolSlug) => tools.find((tool) => tool.slug === toolSlug))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool));
}
