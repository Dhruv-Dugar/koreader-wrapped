"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { BookIcon, LoaderIcon } from "@/components/ui/Icons";
import Link from "next/link";

interface HistoryEntry {
  _id: string;
  createdAt: string;
  core: {
    totalBooksStarted: number;
    totalPagesRead: number;
  };
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/history")
        .then((res) => res.json())
        .then((data) => {
          setHistory(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen text-ink-dark flex items-center justify-center">
        <LoaderIcon size={40} className="text-leather" />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen text-ink-dark flex items-center justify-center">
        <p>Redirecting to sign in...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-ink-dark flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-ink-medium hover:text-ink-dark transition-colors">
          <BookIcon size={20} />
          <span className="font-[family-name:var(--font-playfair)] font-semibold">KoReader Wrapped</span>
        </Link>
      </header>
      <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4">
              Upload History
            </h1>
          </div>
          <div className="space-y-4">
            {history.length > 0 ? (
              history.map((entry) => (
                <Link key={entry._id} href={`/wrapped?id=${entry._id}`}>
                  <div className="book-card rounded-xl p-6 flex items-center justify-between hover:bg-parchment transition-colors">
                    <div>
                      <p className="font-semibold">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-ink-light">
                        {entry.core.totalBooksStarted} books, {entry.core.totalPagesRead.toLocaleString()} pages
                      </p>
                    </div>
                    <BookIcon size={24} className="text-leather" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-ink-medium">
                You have no upload history.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
