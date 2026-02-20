"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";

const CATEGORIES = [
    {
        name: "Content Writing",
        prompts: [
            { label: "Blog Post", template: "Write a comprehensive blog post about [topic]. Include an engaging introduction, 3-5 key points with examples, and a conclusion with a call to action. Target audience: [audience]. Tone: [tone]." },
            { label: "Product Description", template: "Write a compelling product description for [product]. Highlight key features, benefits, and use cases. Include: emotional appeal, specifications, and a persuasive call to action. Tone: [tone]." },
            { label: "Social Media Post", template: "Create an engaging [platform] post about [topic]. Include relevant hashtags, a hook in the first line, value in the middle, and a CTA at the end. Character limit: [limit]. Tone: [tone]." },
            { label: "Email Newsletter", template: "Write an email newsletter about [topic] for [audience]. Include: catchy subject line, personal greeting, 2-3 key updates/stories, and a clear CTA. Keep it under [length] words." },
        ],
    },
    {
        name: "Development",
        prompts: [
            { label: "Code Review", template: "Review the following [language] code for: bugs, performance issues, security vulnerabilities, and code style. Suggest improvements with explanations.\n\nCode:\n```\n[paste code here]\n```" },
            { label: "Debug Help", template: "I'm getting the following error in my [language/framework] project:\n\nError: [error message]\n\nContext: [describe what you were doing]\nExpected behavior: [what should happen]\nActual behavior: [what actually happens]\n\nRelevant code:\n```\n[paste code]\n```" },
            { label: "Architecture Design", template: "Design a system architecture for [project description]. Requirements: [list requirements]. Consider: scalability, security, cost efficiency, and maintainability. Provide: component diagram, tech stack recommendations, and data flow." },
            { label: "API Design", template: "Design a RESTful API for [feature/system]. Include: endpoint paths, HTTP methods, request/response schemas (JSON), authentication, error handling, and pagination. Follow REST best practices." },
        ],
    },
    {
        name: "Marketing",
        prompts: [
            { label: "Landing Page Copy", template: "Write landing page copy for [product/service]. Include: hero headline, subheadline, 3 benefit sections, social proof section, FAQ section, and CTA. Target: [audience]. Unique selling point: [USP]." },
            { label: "Ad Copy (Google/Meta)", template: "Write [number] variations of [platform] ad copy for [product/service]. Target audience: [audience]. Include: headline (max [X] chars), description (max [Y] chars), CTA. Focus on [benefit/pain point]." },
            { label: "SEO Meta Description", template: "Write 3 SEO-optimized meta descriptions for a page about [topic]. Each should be 150-160 characters, include the primary keyword '[keyword]', and have a compelling CTA. Natural, non-spammy tone." },
        ],
    },
    {
        name: "Business",
        prompts: [
            { label: "SWOT Analysis", template: "Conduct a SWOT analysis for [company/product] in the [industry] market. For each category (Strengths, Weaknesses, Opportunities, Threats), provide 3-5 specific, actionable items with brief explanations." },
            { label: "Project Brief", template: "Write a project brief for [project name]. Include: objective, scope, deliverables, timeline, budget estimate, stakeholders, risks, and success metrics. Context: [background]." },
            { label: "Meeting Agenda", template: "Create a structured meeting agenda for a [duration]-minute [meeting type] meeting. Topic: [topic]. Attendees: [roles]. Include: time allocation per item, discussion points, expected outcomes, and action items template." },
        ],
    },
    {
        name: "Creative",
        prompts: [
            { label: "Story Premise", template: "Generate a unique story premise in the [genre] genre. Include: main character description, setting, central conflict, stakes, and a compelling hook. The story should explore themes of [themes]." },
            { label: "Character Profile", template: "Create a detailed character profile for a [role] in a [genre] story. Include: name, age, appearance, personality traits (3 strengths, 2 flaws), backstory, motivation, and a signature quirk." },
            { label: "Image Generation", template: "Create an image of [subject] in [style] style. Setting: [environment]. Lighting: [lighting type]. Color palette: [colors]. Mood: [mood]. Composition: [composition]. Additional details: [details]." },
        ],
    },
];

export default function AiPromptGenerator() {
    const [category, setCategory] = useState(0);
    const [promptIdx, setPromptIdx] = useState(0);
    const [customized, setCustomized] = useState("");
    const [copied, setCopied] = useState(false);

    const current = CATEGORIES[category].prompts[promptIdx];

    useEffect(() => {
        setCustomized(current.template);
    }, [current]);

    const handleCopy = () => {
        navigator.clipboard.writeText(customized);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <ToolLayout title="AI Prompt Generator" description="Generate effective AI prompts for ChatGPT, Claude, Gemini, and more. Templates for writing, coding, marketing, and business." relatedTools={["lorem-ipsum-generator", "fancy-text-generator", "text-to-speech"]}>
            <div className="mb-4 flex flex-wrap gap-2">
                {CATEGORIES.map((c, i) => (
                    <button key={c.name} onClick={() => { setCategory(i); setPromptIdx(0); }} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${category === i ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{c.name}</button>
                ))}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                {CATEGORIES[category].prompts.map((p, i) => (
                    <button key={p.label} onClick={() => setPromptIdx(i)} className={`rounded-md px-2.5 py-1 text-xs ${promptIdx === i ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>{p.label}</button>
                ))}
            </div>

            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 px-4 py-2 mb-3">
                <p className="text-xs text-blue-700 dark:text-blue-300">💡 Replace the <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">[placeholders]</code> with your specific details for the best results.</p>
            </div>

            <textarea value={customized} onChange={(e) => setCustomized(e.target.value)} rows={8} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />

            <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">{customized.length} characters</span>
                <div className="flex gap-2">
                    <button onClick={() => setCustomized(current.template)} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Reset</button>
                    <button onClick={handleCopy} className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy Prompt"}</button>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate effective AI prompts for ChatGPT, Claude, Gemini, Midjourney, and other AI tools. Browse templates across 5 categories: Content Writing, Development, Marketing, Business, and Creative. Customize the placeholders and copy the prompt.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Do these prompts work with all AI tools?</summary><p className="mt-2 pl-4">Yes! These templates are designed to work well with ChatGPT, Claude, Gemini, and most other large language models. Adjust specifics as needed for your tool of choice.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How do I get better results?</summary><p className="mt-2 pl-4">Replace all [placeholders] with specific, detailed information. The more context you provide, the better the AI output will be. Be specific about format, length, tone, and audience.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
