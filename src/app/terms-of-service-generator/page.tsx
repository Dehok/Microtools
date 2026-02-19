"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function TermsOfServiceGenerator() {
    const [companyName, setCompanyName] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("United States");
    const [hasAccounts, setHasAccounts] = useState(true);
    const [hasPayments, setHasPayments] = useState(false);
    const [hasUserContent, setHasUserContent] = useState(false);
    const [lastUpdated] = useState(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
    const [copied, setCopied] = useState(false);

    const generateTOS = useCallback(() => {
        const name = companyName || "[Company Name]";
        const url = websiteUrl || "[Website URL]";
        const contactEmail = email || "[contact@email.com]";

        let tos = `Terms of Service\n\nLast Updated: ${lastUpdated}\n\n`;
        tos += `1. Acceptance of Terms\n\nBy accessing and using ${url} ("the Service"), operated by ${name}, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.\n\n`;
        tos += `2. Description of Service\n\n${name} provides online tools and utilities through ${url}. We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.\n\n`;
        tos += `3. Use of the Service\n\nYou agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:\n- Use the Service in any way that violates applicable laws or regulations\n- Attempt to interfere with or disrupt the Service\n- Use automated systems to access the Service in a manner that sends more requests than a human can reasonably produce\n- Attempt to gain unauthorized access to any part of the Service\n\n`;

        if (hasAccounts) {
            tos += `4. User Accounts\n\nIf you create an account, you are responsible for maintaining the security of your account and password. ${name} cannot and will not be liable for any loss or damage from your failure to comply with this security obligation. You are responsible for all activity that occurs under your account.\n\n`;
        }

        if (hasPayments) {
            tos += `${hasAccounts ? "5" : "4"}. Payments and Refunds\n\nCertain features of the Service may require payment. All payments are processed securely through third-party payment processors. Prices are subject to change with reasonable notice. Refund requests will be handled on a case-by-case basis. Contact ${contactEmail} for payment-related inquiries.\n\n`;
        }

        if (hasUserContent) {
            const n = (hasAccounts ? 1 : 0) + (hasPayments ? 1 : 0) + 4;
            tos += `${n}. User-Generated Content\n\nYou retain ownership of any content you submit or upload to the Service. By submitting content, you grant ${name} a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content solely for the purpose of operating and improving the Service. You are solely responsible for the content you submit and must ensure it does not violate any third-party rights.\n\n`;
        }

        tos += `Intellectual Property\n\nThe Service and its original content, features, and functionality are owned by ${name} and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.\n\n`;
        tos += `Limitation of Liability\n\nThe Service is provided "as is" and "as available" without any warranties of any kind. ${name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.\n\n`;
        tos += `Indemnification\n\nYou agree to indemnify and hold harmless ${name} and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.\n\n`;
        tos += `Governing Law\n\nThese Terms shall be governed by and construed in accordance with the laws of ${country}, without regard to its conflict of law provisions.\n\n`;
        tos += `Changes to Terms\n\nWe reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on this page. Your continued use of the Service after changes constitutes acceptance of the modified Terms.\n\n`;
        tos += `Contact Us\n\nIf you have any questions about these Terms, please contact us at ${contactEmail}.\n`;

        return tos;
    }, [companyName, websiteUrl, email, country, hasAccounts, hasPayments, hasUserContent, lastUpdated]);

    const tosText = generateTOS();

    const handleCopy = () => {
        navigator.clipboard.writeText(tosText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([tosText], { type: "text/plain" });
        const link = document.createElement("a");
        link.download = "terms-of-service.txt";
        link.href = URL.createObjectURL(blob);
        link.click();
    };

    return (
        <ToolLayout
            title="Terms of Service Generator"
            description="Generate a free Terms of Service for your website or app. Customizable, no signup required, instant download."
            relatedTools={["privacy-policy-generator", "lorem-ipsum-generator", "word-counter"]}
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Your Information</h3>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Company / Website Name</label>
                        <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Website URL</label>
                        <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://example.com" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Contact Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@example.com" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Governing Law (Country/State)</label>
                        <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>

                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider pt-2">Features</h3>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={hasAccounts} onChange={(e) => setHasAccounts(e.target.checked)} className="accent-blue-600" /> User accounts / registration</label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={hasPayments} onChange={(e) => setHasPayments(e.target.checked)} className="accent-blue-600" /> Payments / subscriptions</label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={hasUserContent} onChange={(e) => setHasUserContent(e.target.checked)} className="accent-blue-600" /> User-generated content</label>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Preview</h3>
                        <div className="flex gap-2">
                            <button onClick={handleCopy} className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy"}</button>
                            <button onClick={handleDownload} className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Download .txt</button>
                        </div>
                    </div>
                    <textarea value={tosText} readOnly rows={24} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-4 py-3 text-xs font-mono leading-relaxed text-gray-700 dark:text-gray-300" />
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Generate a basic Terms of Service document for your website or app. Customize it with your company details and toggle sections for user accounts, payments, and user-generated content. The generated document is a starting point — we recommend having a lawyer review it before use.</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Is this legally binding?</summary><p className="mt-2 pl-4">This tool generates a template that covers common legal requirements. However, it is not a substitute for legal advice. We recommend consulting with a lawyer, especially for businesses handling sensitive data or payments.</p></details>
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Can I edit the generated text?</summary><p className="mt-2 pl-4">Yes! Copy the text and edit it freely to match your specific needs. You can also download it as a text file for further editing.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
