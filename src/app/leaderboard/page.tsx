"use client";

import { useEffect, useState } from "react";
import { BookIcon, TrophyIcon, LoaderIcon, MedalIcon, CrownIcon } from "@/components/ui/Icons"; // Assuming Medal/Crown exist or I'll use placeholders
import Link from "next/link";
import { motion } from "framer-motion";

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
    <main className="min-h-screen text-ink-dark flex flex-col pt-20 paper-texture">
      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="chapter-divider mb-8 max-w-xs mx-auto">
              <span>HALL OF FAME</span>
            </div>
            
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-paper-sepia border border-parchment mb-6 shadow-md relative">
              <div className="absolute inset-0 rounded-full bg-gold-foil blur-xl opacity-20" />
              <TrophyIcon size={40} className="text-gold-foil relative z-10" />
            </div>

            <h1 className="serif-heading text-4xl md:text-5xl font-bold mb-4">
              The Reading Elite
            </h1>
            <p className="text-ink-medium text-lg font-light">
              Celebrating the most devoted readers of our community.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <LoaderIcon size={40} className="text-leather mb-4" />
              <p className="text-ink-light font-serif italic">Retrieving the records...</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="book-card rounded-2xl p-8 md:p-12 relative bg-paper-cream"
            >
              {/* Ornaments */}
              <div className="corner-ornament corner-top-left" />
              <div className="corner-ornament corner-top-right" />
              <div className="corner-ornament corner-bottom-left" />
              <div className="corner-ornament corner-bottom-right" />

              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm font-mono uppercase tracking-widest text-ink-light border-b border-parchment">
                      <th className="pb-4 pl-4">Rank</th>
                      <th className="pb-4">Reader</th>
                      <th className="pb-4 text-right pr-4">Pages Turned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-parchment/50">
                    {leaderboard.map((entry, index) => (
                      <motion.tr 
                        key={entry.userId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="group hover:bg-paper-sepia/30 transition-colors"
                      >
                        <td className="py-4 pl-4 font-bold text-lg text-ink-light group-hover:text-leather font-serif">
                          {index === 0 ? (
                            <span className="text-gold-foil text-2xl">I</span>
                          ) : index === 1 ? (
                            <span className="text-ink-medium text-xl">II</span>
                          ) : index === 2 ? (
                            <span className="text-leather text-xl">III</span>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </td>
                        <td className="py-4 font-semibold text-ink-dark group-hover:text-leather transition-colors">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-parchment/50 flex items-center justify-center text-xs font-mono">
                                {entry.name.charAt(0)}
                             </div>
                             {entry.name}
                             {index === 0 && <span className="text-gold-foil text-xs border border-gold-foil px-1.5 rounded-full ml-2">CHAMPION</span>}
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-right font-mono text-leather font-bold">
                          {entry.totalPagesRead.toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                    {leaderboard.length === 0 && (
                       <tr>
                         <td colSpan={3} className="py-12 text-center text-ink-light italic">
                           The records are silent. Be the first to inscribe your name.
                         </td>
                       </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
