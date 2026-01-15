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
    <main className="min-h-screen text-ink-dark flex flex-col paper-texture pt-20">
      <div className="flex-1 flex flex-col items-center p-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <div className="chapter-divider mb-8 max-w-xs mx-auto">
              <span>THE ARCHIVES</span>
            </div>
            <h1 className="serif-heading text-4xl md:text-5xl font-bold mb-4">
              Upload History
            </h1>
            <p className="text-ink-medium italic font-light">Your past reading chronicles, preserved in ink.</p>
          </div>
          <div className="space-y-6">
            {history.length > 0 ? (
              history.map((entry) => (
                <Link key={entry._id} href={`/wrapped?id=${entry._id}`} className="block group">
                  <div className="book-card rounded-2xl p-8 flex items-center justify-between group-hover:border-leather/40 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-paper-cream border border-parchment flex items-center justify-center group-hover:rotate-3 transition-transform">
                        <BookIcon size={24} className="text-leather" />
                      </div>
                      <div>
                        <p className="serif-heading font-bold text-xl text-ink-dark group-hover:text-leather transition-colors">
                          {new Date(entry.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-ink-light uppercase tracking-widest mt-1">
                          {entry.core.totalBooksStarted} books • {entry.core.totalPagesRead.toLocaleString()} pages
                        </p>
                      </div>
                    </div>
                    <div className="text-parchment group-hover:text-leather transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="book-card rounded-2xl p-12 text-center text-ink-medium italic border-dashed">
                The archives are empty. Your story is waiting to be written.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
