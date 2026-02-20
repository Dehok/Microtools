import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              <span className="text-blue-600 dark:text-blue-400">Code</span>Utilo
            </span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              Free online tools for developers
            </span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
              Home
            </Link>
            <Link href="/category" className="hover:text-gray-900 dark:hover:text-gray-100">
              Categories
            </Link>
            <Link href="/topics" className="hover:text-gray-900 dark:hover:text-gray-100">
              Topics
            </Link>
            <Link href="/compare" className="hover:text-gray-900 dark:hover:text-gray-100">
              Compare
            </Link>
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-100">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-100">
              About
            </Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} CodeUtilo. All tools run in your
          browser — no data is sent to any server.
        </p>
      </div>
    </footer>
  );
}
