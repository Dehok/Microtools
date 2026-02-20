export default function SiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CodeUtilo",
    url: "https://codeutilo.com",
    description:
      "Free online developer and AI utility tools. Browser-only processing with no data upload required.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://codeutilo.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
