/** @type {import('next-sitemap').IConfig} */
const WORKFLOW_PATHS = [
  "/workflows",
  "/workflows/prompt-release-checklist",
  "/workflows/rag-grounding-audit",
  "/workflows/ai-output-validation",
  "/workflows/prompt-safety-hardening",
  "/workflows/ai-eval-regression-debug",
];

module.exports = {
  siteUrl: "https://codeutilo.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  autoLastmod: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: WORKFLOW_PATHS,
  transform: async (config, path) => {
    const isWorkflow = WORKFLOW_PATHS.includes(path);
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: isWorkflow ? 0.8 : config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  additionalPaths: async () =>
    WORKFLOW_PATHS.map((path) => ({
      loc: path,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    })),
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: ["https://codeutilo.com/sitemap.xml"],
  },
};
