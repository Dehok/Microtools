import type { Metadata } from "next";

const SITE_NAME = "CodeUtilo";
const SITE_URL = "https://codeutilo.com";

export function toolMeta(
    title: string,
    description: string,
    slug: string,
    keywords: string[]
): Metadata {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}/${slug}`;

    return {
        title,
        description,
        keywords,
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_NAME,
            type: "website",
        },
        twitter: {
            card: "summary",
            title: fullTitle,
            description,
        },
        alternates: {
            canonical: url,
        },
    };
}
