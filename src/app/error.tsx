"use client";

import { useEffect } from "react";
import { AlertCircleIcon, BookIcon } from "@/components/ui/Icons";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen text-ink-dark flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-ink-medium hover:text-ink-dark transition-colors">
          <BookIcon size={20} />
          <span className="font-[family-name:var(--font-playfair)] font-semibold">KoReader Wrapped</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg text-center">
            <div className="book-card rounded-xl p-12 text-center">
                <div className="flex justify-center mb-4">
                    <AlertCircleIcon size={40} className="text-bookmarker" />
                </div>
                <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-2">
                    Something went wrong!
                </h1>
                <p className="text-ink-medium mb-6">
                    {error.message || "An unexpected error occurred."}
                </p>
                <button
                    onClick={() => reset()}
                    className="bookmark-btn py-3 px-6 rounded-lg text-lg"
                >
                    Try again
                </button>
            </div>
        </div>
      </div>
    </main>
  );
}
