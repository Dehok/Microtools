import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <span className="font-bold text-gray-900">
              <span className="text-blue-600">Micro</span>Tools
            </span>
            <span className="ml-2 text-sm text-gray-500">
              Free online tools for developers
            </span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-gray-900">
              About
            </Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} MicroTools. All tools run in your
          browser — no data is sent to any server.
        </p>
      </div>
    </footer>
  );
}
