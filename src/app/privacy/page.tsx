import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for CodeUtilo. Learn how we handle your data — spoiler: we don't collect any.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Privacy Policy</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Last updated: February 2026</p>

      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">1. Overview</h2>
        <p>
          CodeUtilo (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your
          privacy. This policy explains how we handle information when you use our
          website at codeutilo.com.
        </p>

        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">2. Data We Collect</h2>
        <p>
          <strong>We do not collect any personal data.</strong> All tools on CodeUtilo
          run entirely in your browser. No data you enter into any tool is sent to our
          servers or any third party. Your input stays on your device.
        </p>

        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">3. Cookies</h2>
        <p>
          CodeUtilo itself does not use cookies. However, third-party services we use
          (such as Google AdSense for advertising) may place cookies on your device.
          These cookies are used to serve relevant advertisements and measure ad performance.
        </p>

        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">4. Third-Party Advertising</h2>
        <p>
          We may display advertisements served by Google AdSense. Google uses cookies to
          serve ads based on your prior visits to this and other websites. You can opt out
          of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline dark:text-blue-300"
          >
            Google Ads Settings
          </a>.
        </p>

        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">5. Analytics</h2>
        <p>
          We may use privacy-friendly analytics tools to understand how many people
          visit our website and which tools are most popular. These analytics do not
          collect personal information and do not use cookies.
        </p>

        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">6. External Links</h2>
        <p>
          Our website may contain links to external sites. We are not responsible for
          the privacy practices of other websites.
        </p>

        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">7. Children&apos;s Privacy</h2>
        <p>
          Our website is not directed at children under 13. We do not knowingly collect
          information from children.
        </p>

        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">8. Changes</h2>
        <p>
          We may update this privacy policy from time to time. Any changes will be
          posted on this page with an updated date.
        </p>

        <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">9. Contact</h2>
        <p>
          If you have questions about this privacy policy, please contact us at{" "}
          <strong>codeutilo@proton.me</strong>.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/"
          className="text-blue-700 hover:underline dark:text-blue-300"
        >
          &larr; Back to all tools
        </Link>
      </div>
    </div>
  );
}
