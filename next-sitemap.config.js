/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://codeutilo.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  autoLastmod: true,
  changefreq: "weekly",
  priority: 0.7,
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
