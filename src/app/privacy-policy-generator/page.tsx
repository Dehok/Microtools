"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import CopyButton from "@/components/CopyButton";

export default function PrivacyPolicyGenerator() {
  const today = new Date().toISOString().split("T")[0];

  const [websiteName, setWebsiteName] = useState("My Website");
  const [websiteUrl, setWebsiteUrl] = useState("https://example.com");
  const [contactEmail, setContactEmail] = useState("contact@example.com");
  const [effectiveDate, setEffectiveDate] = useState(today);

  const [collectsPersonalData, setCollectsPersonalData] = useState(true);
  const [usesCookies, setUsesCookies] = useState(true);
  const [usesAnalytics, setUsesAnalytics] = useState(false);
  const [usesAds, setUsesAds] = useState(false);
  const [hasNewsletter, setHasNewsletter] = useState(false);
  const [thirdPartyServices, setThirdPartyServices] = useState(false);
  const [gdprCompliance, setGdprCompliance] = useState(false);
  const [childrenPrivacy, setChildrenPrivacy] = useState(false);

  const formattedDate = useMemo(() => {
    if (!effectiveDate) return "";
    const d = new Date(effectiveDate + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }, [effectiveDate]);

  const policy = useMemo(() => {
    const name = websiteName || "Our Website";
    const url = websiteUrl || "https://example.com";
    const email = contactEmail || "contact@example.com";

    const sections: string[] = [];

    // Introduction
    sections.push(`Privacy Policy for ${name}`);
    sections.push(`Effective Date: ${formattedDate}`);
    sections.push("");
    sections.push(
      `At ${name}, accessible from ${url}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ${name} and how we use it.`
    );
    sections.push("");
    sections.push(
      `If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at ${email}.`
    );

    // Information We Collect
    sections.push("");
    sections.push("Information We Collect");
    sections.push("");
    if (collectsPersonalData) {
      sections.push(
        `When you visit ${name}, we may collect certain personally identifiable information, including but not limited to:`
      );
      sections.push("");
      sections.push("- Name and email address");
      sections.push("- IP address and browser information");
      sections.push("- Usage data and browsing behavior on our site");
      if (hasNewsletter) {
        sections.push("- Email address provided when subscribing to our newsletter");
      }
      sections.push("");
      sections.push(
        "We collect information that you voluntarily provide to us when you register, express interest in obtaining information about us or our products and services, or otherwise contact us."
      );
    } else {
      sections.push(
        `${name} does not intentionally collect personally identifiable information from its visitors. We may collect non-personal information such as browser type, language preference, and the date and time of each visitor request.`
      );
    }

    // How We Use Information
    sections.push("");
    sections.push("How We Use Your Information");
    sections.push("");
    sections.push("We use the information we collect in the following ways:");
    sections.push("");
    sections.push("- To provide, operate, and maintain our website");
    sections.push("- To improve, personalize, and expand our website");
    sections.push("- To understand and analyze how you use our website");
    if (hasNewsletter) {
      sections.push("- To send you emails, including newsletters and promotional content");
    }
    if (usesAds) {
      sections.push("- To display relevant advertisements");
    }
    sections.push("- To find and prevent fraud");
    sections.push("- To comply with legal obligations");

    // Cookies
    sections.push("");
    sections.push("Cookies and Tracking Technologies");
    sections.push("");
    if (usesCookies) {
      sections.push(
        `${name} uses cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.`
      );
      sections.push("");
      sections.push("We use the following types of cookies:");
      sections.push("");
      sections.push("- Essential Cookies: Required for the website to function properly.");
      sections.push("- Preference Cookies: Used to remember your preferences and settings.");
      if (usesAnalytics) {
        sections.push("- Analytics Cookies: Help us understand how visitors interact with our website.");
      }
      if (usesAds) {
        sections.push("- Advertising Cookies: Used to deliver relevant advertisements to you.");
      }
      sections.push("");
      sections.push(
        "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website."
      );
    } else {
      sections.push(
        `${name} does not use cookies or similar tracking technologies on this website.`
      );
    }

    // Analytics
    if (usesAnalytics) {
      sections.push("");
      sections.push("Analytics");
      sections.push("");
      sections.push(
        `We use Google Analytics to monitor and analyze web traffic and to keep track of user behavior on our website. Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our website. This data is shared with other Google services.`
      );
      sections.push("");
      sections.push(
        `For more information on the privacy practices of Google, please visit the Google Privacy & Terms page: https://policies.google.com/privacy`
      );
    }

    // Third-Party Services
    if (thirdPartyServices || usesAds || usesAnalytics) {
      sections.push("");
      sections.push("Third-Party Services");
      sections.push("");
      sections.push(
        `${name} may employ third-party companies and individuals to facilitate our website, provide services on our behalf, perform website-related services, or assist us in analyzing how our website is used.`
      );
      sections.push("");
      sections.push(
        "These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose."
      );
      if (usesAds) {
        sections.push("");
        sections.push(
          "We may use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you."
        );
      }
    }

    // Data Security
    sections.push("");
    sections.push("Data Security");
    sections.push("");
    sections.push(
      "The security of your personal information is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security."
    );

    // GDPR
    if (gdprCompliance) {
      sections.push("");
      sections.push("Your Data Protection Rights (GDPR)");
      sections.push("");
      sections.push(
        "If you are a resident of the European Economic Area (EEA), you have certain data protection rights. We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal information."
      );
      sections.push("");
      sections.push("You have the following data protection rights:");
      sections.push("");
      sections.push("- The right to access: You have the right to request copies of your personal data.");
      sections.push("- The right to rectification: You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.");
      sections.push("- The right to erasure: You have the right to request that we erase your personal data, under certain conditions.");
      sections.push("- The right to restrict processing: You have the right to request that we restrict the processing of your personal data, under certain conditions.");
      sections.push("- The right to object to processing: You have the right to object to our processing of your personal data, under certain conditions.");
      sections.push("- The right to data portability: You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.");
      sections.push("");
      sections.push(
        `If you wish to exercise any of these rights, please contact us at ${email}. We will respond to your request within 30 days.`
      );
    }

    // Children's Privacy
    if (childrenPrivacy) {
      sections.push("");
      sections.push("Children's Privacy (COPPA)");
      sections.push("");
      sections.push(
        `${name} does not knowingly collect any personally identifiable information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately at ${email} and we will do our best efforts to promptly remove such information from our records.`
      );
      sections.push("");
      sections.push(
        "If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers."
      );
    }

    // Changes to Policy
    sections.push("");
    sections.push("Changes to This Privacy Policy");
    sections.push("");
    sections.push(
      `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.`
    );
    sections.push("");
    sections.push(
      "You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
    );

    // Contact Us
    sections.push("");
    sections.push("Contact Us");
    sections.push("");
    sections.push("If you have any questions about this Privacy Policy, please contact us:");
    sections.push("");
    sections.push(`- By email: ${email}`);
    sections.push(`- By visiting this page on our website: ${url}`);

    return sections.join("\n");
  }, [
    websiteName, websiteUrl, contactEmail, formattedDate,
    collectsPersonalData, usesCookies, usesAnalytics, usesAds,
    hasNewsletter, thirdPartyServices, gdprCompliance, childrenPrivacy,
  ]);

  const markdownPolicy = useMemo(() => {
    const name = websiteName || "Our Website";
    const url = websiteUrl || "https://example.com";
    const email = contactEmail || "contact@example.com";

    const md: string[] = [];

    md.push(`# Privacy Policy for ${name}`);
    md.push("");
    md.push(`**Effective Date:** ${formattedDate}`);
    md.push("");
    md.push(
      `At ${name}, accessible from ${url}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ${name} and how we use it.`
    );
    md.push("");
    md.push(
      `If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at ${email}.`
    );

    // Information We Collect
    md.push("");
    md.push("## Information We Collect");
    md.push("");
    if (collectsPersonalData) {
      md.push(
        `When you visit ${name}, we may collect certain personally identifiable information, including but not limited to:`
      );
      md.push("");
      md.push("- Name and email address");
      md.push("- IP address and browser information");
      md.push("- Usage data and browsing behavior on our site");
      if (hasNewsletter) {
        md.push("- Email address provided when subscribing to our newsletter");
      }
      md.push("");
      md.push(
        "We collect information that you voluntarily provide to us when you register, express interest in obtaining information about us or our products and services, or otherwise contact us."
      );
    } else {
      md.push(
        `${name} does not intentionally collect personally identifiable information from its visitors. We may collect non-personal information such as browser type, language preference, and the date and time of each visitor request.`
      );
    }

    // How We Use Information
    md.push("");
    md.push("## How We Use Your Information");
    md.push("");
    md.push("We use the information we collect in the following ways:");
    md.push("");
    md.push("- To provide, operate, and maintain our website");
    md.push("- To improve, personalize, and expand our website");
    md.push("- To understand and analyze how you use our website");
    if (hasNewsletter) {
      md.push("- To send you emails, including newsletters and promotional content");
    }
    if (usesAds) {
      md.push("- To display relevant advertisements");
    }
    md.push("- To find and prevent fraud");
    md.push("- To comply with legal obligations");

    // Cookies
    md.push("");
    md.push("## Cookies and Tracking Technologies");
    md.push("");
    if (usesCookies) {
      md.push(
        `${name} uses cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.`
      );
      md.push("");
      md.push("We use the following types of cookies:");
      md.push("");
      md.push("- **Essential Cookies:** Required for the website to function properly.");
      md.push("- **Preference Cookies:** Used to remember your preferences and settings.");
      if (usesAnalytics) {
        md.push("- **Analytics Cookies:** Help us understand how visitors interact with our website.");
      }
      if (usesAds) {
        md.push("- **Advertising Cookies:** Used to deliver relevant advertisements to you.");
      }
      md.push("");
      md.push(
        "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website."
      );
    } else {
      md.push(
        `${name} does not use cookies or similar tracking technologies on this website.`
      );
    }

    // Analytics
    if (usesAnalytics) {
      md.push("");
      md.push("## Analytics");
      md.push("");
      md.push(
        `We use Google Analytics to monitor and analyze web traffic and to keep track of user behavior on our website. Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our website. This data is shared with other Google services.`
      );
      md.push("");
      md.push(
        `For more information on the privacy practices of Google, please visit the Google Privacy & Terms page: [https://policies.google.com/privacy](https://policies.google.com/privacy)`
      );
    }

    // Third-Party Services
    if (thirdPartyServices || usesAds || usesAnalytics) {
      md.push("");
      md.push("## Third-Party Services");
      md.push("");
      md.push(
        `${name} may employ third-party companies and individuals to facilitate our website, provide services on our behalf, perform website-related services, or assist us in analyzing how our website is used.`
      );
      md.push("");
      md.push(
        "These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose."
      );
      if (usesAds) {
        md.push("");
        md.push(
          "We may use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you."
        );
      }
    }

    // Data Security
    md.push("");
    md.push("## Data Security");
    md.push("");
    md.push(
      "The security of your personal information is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security."
    );

    // GDPR
    if (gdprCompliance) {
      md.push("");
      md.push("## Your Data Protection Rights (GDPR)");
      md.push("");
      md.push(
        "If you are a resident of the European Economic Area (EEA), you have certain data protection rights. We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal information."
      );
      md.push("");
      md.push("You have the following data protection rights:");
      md.push("");
      md.push("- **The right to access:** You have the right to request copies of your personal data.");
      md.push("- **The right to rectification:** You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.");
      md.push("- **The right to erasure:** You have the right to request that we erase your personal data, under certain conditions.");
      md.push("- **The right to restrict processing:** You have the right to request that we restrict the processing of your personal data, under certain conditions.");
      md.push("- **The right to object to processing:** You have the right to object to our processing of your personal data, under certain conditions.");
      md.push("- **The right to data portability:** You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.");
      md.push("");
      md.push(
        `If you wish to exercise any of these rights, please contact us at ${email}. We will respond to your request within 30 days.`
      );
    }

    // Children's Privacy
    if (childrenPrivacy) {
      md.push("");
      md.push("## Children's Privacy (COPPA)");
      md.push("");
      md.push(
        `${name} does not knowingly collect any personally identifiable information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately at ${email} and we will do our best efforts to promptly remove such information from our records.`
      );
      md.push("");
      md.push(
        "If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers."
      );
    }

    // Changes to Policy
    md.push("");
    md.push("## Changes to This Privacy Policy");
    md.push("");
    md.push(
      `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.`
    );
    md.push("");
    md.push(
      "You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
    );

    // Contact Us
    md.push("");
    md.push("## Contact Us");
    md.push("");
    md.push("If you have any questions about this Privacy Policy, please contact us:");
    md.push("");
    md.push(`- By email: ${email}`);
    md.push(`- By visiting this page on our website: ${url}`);

    return md.join("\n");
  }, [
    websiteName, websiteUrl, contactEmail, formattedDate,
    collectsPersonalData, usesCookies, usesAnalytics, usesAds,
    hasNewsletter, thirdPartyServices, gdprCompliance, childrenPrivacy,
  ]);

  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(markdownPolicy);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <ToolLayout
      title="Privacy Policy Generator — Free Custom Privacy Policy"
      description="Generate a professional privacy policy for your website or app. Customize for GDPR, cookies, analytics, and more. Copy as plain text or Markdown."
      relatedTools={["robots-txt-generator", "meta-tag-generator", "og-meta-generator"]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Website Details</h3>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Website Name</label>
            <input
              type="text"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              placeholder="My Website"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Website URL</label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm font-mono focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="contact@example.com"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm font-mono focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Effective Date</label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-3 py-2 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
            />
          </div>

          <h3 className="pt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">What applies to your site?</h3>
          <div className="space-y-2">
            {[
              { label: "Collects Personal Data", checked: collectsPersonalData, onChange: setCollectsPersonalData },
              { label: "Uses Cookies", checked: usesCookies, onChange: setUsesCookies },
              { label: "Uses Analytics (Google Analytics)", checked: usesAnalytics, onChange: setUsesAnalytics },
              { label: "Uses Ads", checked: usesAds, onChange: setUsesAds },
              { label: "Has Newsletter", checked: hasNewsletter, onChange: setHasNewsletter },
              { label: "Third-party Services", checked: thirdPartyServices, onChange: setThirdPartyServices },
              { label: "GDPR Compliance", checked: gdprCompliance, onChange: setGdprCompliance },
              { label: "Children's Privacy (COPPA)", checked: childrenPrivacy, onChange: setChildrenPrivacy },
            ].map((item) => (
              <label key={item.label} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>

        {/* Preview & Output */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Generated Privacy Policy</h3>
            <div className="flex gap-2">
              <CopyButton text={policy} />
              <button
                onClick={handleCopyMarkdown}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
              >
                {copiedMarkdown ? "Copied!" : "Copy Markdown"}
              </button>
            </div>
          </div>
          <div className="max-h-[600px] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
            {policy.split("\n").map((line, i) => {
              // Section headers (lines that are all text, not starting with -, not empty, and followed/preceded by empty lines)
              const isTitle = i === 0;
              const isHeading =
                !isTitle &&
                line.length > 0 &&
                !line.startsWith("-") &&
                !line.startsWith("*") &&
                !line.includes(":") &&
                !line.includes(".") &&
                !line.includes(",") &&
                line === line.trim() &&
                line.length < 60;

              if (isTitle) {
                return (
                  <h2 key={i} className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                    {line}
                  </h2>
                );
              }
              if (isHeading) {
                return (
                  <h3 key={i} className="mb-1 mt-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                    {line}
                  </h3>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <p key={i} className="ml-4 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {line}
                  </p>
                );
              }
              if (line.startsWith("Effective Date:")) {
                return (
                  <p key={i} className="mb-3 text-xs text-gray-500 dark:text-gray-400 italic">
                    {line}
                  </p>
                );
              }
              if (line === "") {
                return <div key={i} className="h-2" />;
              }
              return (
                <p key={i} className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-sm text-gray-600 dark:text-gray-400">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">What is a Privacy Policy?</h2>
        <p className="mb-3">
          A privacy policy is a legal document that discloses how a website or application collects, uses,
          stores, and protects user data. It is required by law in most jurisdictions, including under the
          GDPR (General Data Protection Regulation) in Europe, CCPA (California Consumer Privacy Act) in
          the United States, and many other data protection regulations worldwide.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Why Do You Need a Privacy Policy?</h2>
        <p className="mb-3">
          If your website collects any form of personal data — including email addresses, names, cookies,
          or analytics data — you are legally required to have a privacy policy. Third-party services like
          Google Analytics, Google AdSense, and most advertising networks also require websites to display
          a privacy policy. Without one, you risk fines, legal action, and removal from advertising programs.
        </p>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">How to Use This Generator</h2>
        <p>
          Fill in your website details and select the checkboxes that apply to your site. The generator
          will create a comprehensive privacy policy tailored to your needs. You can copy the result as
          plain text to paste into your CMS, or as Markdown for static site generators and README files.
          Remember to review and customize the generated policy to ensure it accurately reflects your
          data practices.
        </p>
      </div>
    </ToolLayout>
  );
}
