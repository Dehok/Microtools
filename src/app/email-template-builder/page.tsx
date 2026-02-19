"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function EmailTemplateBuilder() {
    const [companyName, setCompanyName] = useState("Acme Inc.");
    const [logoUrl, setLogoUrl] = useState("");
    const [headerBg, setHeaderBg] = useState("#3b82f6");
    const [headerText, setHeaderText] = useState("Welcome to Our Newsletter!");
    const [bodyText, setBodyText] = useState("Thank you for subscribing. Here are the latest updates from our team.");
    const [ctaText, setCtaText] = useState("Visit Our Website");
    const [ctaUrl, setCtaUrl] = useState("https://example.com");
    const [ctaColor, setCtaColor] = useState("#3b82f6");
    const [footerText, setFooterText] = useState("© 2025 Acme Inc. All rights reserved.");
    const [bgColor, setBgColor] = useState("#f3f4f6");
    const [copied, setCopied] = useState(false);

    const html = useMemo(() => {
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerText}</title>
</head>
<body style="margin:0;padding:0;background-color:${bgColor};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${bgColor};">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:${headerBg};padding:30px;text-align:center;">
              ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" style="max-width:150px;margin-bottom:15px;" />` : ""}
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:bold;">${headerText}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:30px;">
              <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">${bodyText}</p>
              ${ctaText ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px auto;">
                <tr>
                  <td style="background-color:${ctaColor};border-radius:6px;">
                    <a href="${ctaUrl}" style="display:inline-block;padding:12px 30px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;">${ctaText}</a>
                  </td>
                </tr>
              </table>` : ""}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 30px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">${footerText}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }, [companyName, logoUrl, headerBg, headerText, bodyText, ctaText, ctaUrl, ctaColor, footerText, bgColor]);

    const handleCopy = () => {
        navigator.clipboard.writeText(html);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleDownload = () => {
        const blob = new Blob([html], { type: "text/html" });
        const link = document.createElement("a");
        link.download = "email-template.html";
        link.href = URL.createObjectURL(blob);
        link.click();
    };

    return (
        <ToolLayout
            title="Email Template Builder"
            description="Build responsive HTML email templates visually. Customize header, body, CTA, and footer. Copy or download the HTML."
            relatedTools={["terms-of-service-generator", "lorem-ipsum-generator", "html-encoder-decoder"]}
        >
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Company Name</label><input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Logo URL (optional)</label><input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Header Color</label><input type="color" value={headerBg} onChange={(e) => setHeaderBg(e.target.value)} className="h-9 w-full cursor-pointer rounded border-0" /></div>
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Background</label><input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-9 w-full cursor-pointer rounded border-0" /></div>
                    </div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Header Text</label><input value={headerText} onChange={(e) => setHeaderText(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Body Text</label><textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">CTA Button Text</label><input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                        <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">CTA Color</label><input type="color" value={ctaColor} onChange={(e) => setCtaColor(e.target.value)} className="h-9 w-full cursor-pointer rounded border-0" /></div>
                    </div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">CTA URL</label><input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Footer Text</label><input value={footerText} onChange={(e) => setFooterText(e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div>
                    <div className="flex gap-2 mt-2">
                        <button onClick={handleCopy} className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700">{copied ? "Copied!" : "Copy HTML"}</button>
                        <button onClick={handleDownload} className="rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">Download .html</button>
                    </div>
                </div>

                <div>
                    <h3 className="mb-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Preview</h3>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ maxHeight: 500 }}>
                        <iframe srcDoc={html} title="Email Preview" className="w-full border-0" style={{ height: 480 }} />
                    </div>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">About This Tool</h2>
                <p>Build professional HTML email templates with a visual editor. The generated HTML uses table-based layout for maximum email client compatibility (Gmail, Outlook, Yahoo, Apple Mail, etc.).</p>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group"><summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Will this work in all email clients?</summary><p className="mt-2 pl-4">The template uses table-based layout and inline styles, which are compatible with most email clients including Gmail, Outlook, Yahoo Mail, and Apple Mail.</p></details>
                </div>
            </div>
        </ToolLayout>
    );
}
