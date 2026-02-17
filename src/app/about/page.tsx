import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CodeUtilo",
  description: "CodeUtilo is a collection of free online developer tools. All tools run in your browser — fast, free, and private.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">About CodeUtilo</h1>

      <div className="space-y-4 text-gray-600">
        <p>
          <strong>CodeUtilo</strong> is a growing collection of free online tools
          built for developers, designers, and content creators. Every tool runs
          entirely in your browser — no data is ever sent to any server.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Our Mission</h2>
        <p>
          We believe developer tools should be fast, free, and private. No sign-ups,
          no paywalls, no tracking. Just open a tool and use it.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Privacy First</h2>
        <p>
          All processing happens locally in your browser using JavaScript. We do not
          collect, store, or transmit any data you enter into our tools. Your data
          stays on your device.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Tools We Offer</h2>
        <p>
          Our collection includes JSON formatters, Base64 encoders, UUID generators,
          hash generators, password generators, color pickers, Markdown editors,
          diff checkers, and many more. We add new tools regularly.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Contact</h2>
        <p>
          Have a suggestion for a new tool? Found a bug? We&apos;d love to hear from you.
          Reach out at <strong>hello@codeutilo.com</strong>.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/"
          className="text-blue-600 hover:underline"
        >
          &larr; Back to all tools
        </Link>
      </div>
    </div>
  );
}
