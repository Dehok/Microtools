import type { Tool } from "@/lib/tools";
import { tools } from "@/lib/tools";

type FlowStage = "collect" | "prepare" | "build" | "verify" | "secure" | "optimize" | "deliver";

const stageKeywords: Record<FlowStage, string[]> = {
  collect: ["extract", "viewer", "lookup", "parser", "analyzer", "audit"],
  prepare: ["converter", "format", "formatter", "split", "merge", "encode", "decode"],
  build: ["generator", "builder", "creator", "editor", "maker"],
  verify: ["validator", "checker", "tester", "linter", "diff", "schema", "grader", "verifier"],
  secure: ["security", "privacy", "redactor", "scanner", "secret", "firewall", "guardrail"],
  optimize: ["compress", "optimizer", "minifier", "chunking", "packer", "pruner"],
  deliver: ["preview", "export", "policy", "summary", "report"],
};

const flowMap: Record<FlowStage, { before: FlowStage[]; after: FlowStage[] }> = {
  collect: { before: [], after: ["prepare", "build", "verify"] },
  prepare: { before: ["collect"], after: ["build", "verify", "secure"] },
  build: { before: ["collect", "prepare"], after: ["verify", "secure", "optimize"] },
  verify: { before: ["prepare", "build"], after: ["secure", "optimize", "deliver"] },
  secure: { before: ["prepare", "build", "verify"], after: ["optimize", "deliver"] },
  optimize: { before: ["verify", "secure"], after: ["deliver"] },
  deliver: { before: ["verify", "secure", "optimize"], after: [] },
};

function normalizeTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 2);
}

function stageFromTool(tool: Tool): FlowStage {
  const text = `${tool.slug} ${tool.name} ${tool.description}`.toLowerCase();
  const scores = (Object.keys(stageKeywords) as FlowStage[]).map((stage) => ({
    stage,
    score: stageKeywords[stage].reduce((sum, keyword) => (text.includes(keyword) ? sum + 1 : sum), 0),
  }));
  scores.sort((a, b) => b.score - a.score);
  return scores[0].score > 0 ? scores[0].stage : "build";
}

function overlapScore(a: string[], b: string[]) {
  if (a.length === 0 || b.length === 0) return 0;
  const bSet = new Set(b);
  let matches = 0;
  for (const token of a) {
    if (bSet.has(token)) matches += 1;
  }
  return matches;
}

function rankedFlowCandidates(current: Tool, mode: "before" | "after") {
  const currentStage = stageFromTool(current);
  const targetStages = flowMap[currentStage][mode];
  const currentTokens = normalizeTokens(`${current.slug} ${current.name} ${current.description}`);

  const scored = tools
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => {
      const candidateTokens = normalizeTokens(
        `${candidate.slug} ${candidate.name} ${candidate.description}`
      );
      const candidateStage = stageFromTool(candidate);
      let score = 0;

      if (candidate.category === current.category) score += 3;
      if (targetStages.includes(candidateStage)) score += 4;
      score += overlapScore(currentTokens, candidateTokens);

      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((entry) => entry.candidate);
}

export function getToolFlowLinks(slug: string, limit = 3) {
  const current = tools.find((tool) => tool.slug === slug);
  if (!current) return { before: [] as Tool[], after: [] as Tool[] };

  const before = rankedFlowCandidates(current, "before").slice(0, limit);
  const after = rankedFlowCandidates(current, "after").slice(0, limit);
  return { before, after };
}
