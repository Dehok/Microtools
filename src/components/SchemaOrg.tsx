interface SchemaOrgProps {
    name: string;
    description: string;
    slug: string;
}

export default function SchemaOrg({ name, description, slug }: SchemaOrgProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        url: `https://codeutilo.com/${slug}`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
