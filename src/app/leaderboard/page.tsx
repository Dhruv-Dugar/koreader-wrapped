"use client";

import { useEffect, useState } from "react";
import { BookIcon, TrophyIcon } from "@/components/ui/Icons";
import Link from "next/link";

interface LeaderboardEntry {
  userId: string;
  name: string;
  totalPagesRead: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data);
        setLoading(false);
      });
  }, []);

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
            <TrophyIcon size={40} className="text-gold mx-auto mb-4" />
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4">
              Leaderboard
            </h1>
            <p className="text-ink-medium">
              Top 10 readers by total pages read.
            </p>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="book-card rounded-xl p-8">
              <ol className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <li key={entry.userId} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg w-6 text-center">{index + 1}</span>
                      <span className="font-semibold">{entry.name}</span>
                    </div>
                    <span className="font-bold text-lg text-leather">
                      {entry.totalPagesRead.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
