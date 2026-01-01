"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2, Download } from "lucide-react";
import { ProcessedStats } from "@/types";
import { formatReadingTime } from "@/lib/comparisons";

export default function WrappedPage() {
  const [stats, setStats] = useState<ProcessedStats | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("koreaderStats");
    if (stored) {
      setStats(JSON.parse(stored));
    } else {
      router.push("/upload");
    }
  }, [router]);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white">Loading your wrapped...</div>
      </div>
    );
  }

  const slides = [
    <IntroSlide key="intro" />,
    <BooksReadSlide key="books" stats={stats} />,
    <TimeSpentSlide key="time" stats={stats} />,
    <StreakSlide key="streak" stats={stats} />,
    <PersonaSlide key="persona" stats={stats} />,
    <TopBooksSlide key="topbooks" stats={stats} />,
    <FunFactsSlide key="funfacts" stats={stats} />,
    <SummarySlide key="summary" stats={stats} />,
  ];

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  return (
    <main className="min-h-screen text-white flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? "bg-white w-4" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </main>
  );
}

// Slide Components
function IntroSlide() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-6xl mb-6">📚</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
          Your Year in Books
        </h1>
        <p className="text-xl text-gray-300">
          Let&apos;s see what you&apos;ve been reading...
        </p>
      </motion.div>
    </div>
  );
}

function BooksReadSlide({ stats }: { stats: ProcessedStats }) {
  return (
    <div className="text-center">
      <p className="text-gray-400 mb-4">You started reading</p>
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
      >
        {stats.core.totalBooksStarted}
      </motion.p>
      <p className="text-2xl mt-4">books</p>
      {stats.core.totalBooksCompleted > 0 && (
        <p className="text-gray-400 mt-2">
          and finished {stats.core.totalBooksCompleted} of them!
        </p>
      )}
    </div>
  );
}

function TimeSpentSlide({ stats }: { stats: ProcessedStats }) {
  const hours = Math.floor(stats.core.totalReadingTimeSeconds / 3600);
  const comparison = stats.fun.timeComparison;

  return (
    <div className="text-center">
      <p className="text-gray-400 mb-4">You spent</p>
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="text-7xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent"
      >
        {formatReadingTime(stats.core.totalReadingTimeSeconds)}
      </motion.p>
      <p className="text-2xl mt-4">reading</p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-white/5 rounded-xl p-4"
      >
        <p className="text-4xl mb-2">{comparison.icon}</p>
        <p className="text-gray-300">{comparison.description}</p>
      </motion.div>
    </div>
  );
}

function StreakSlide({ stats }: { stats: ProcessedStats }) {
  return (
    <div className="text-center">
      <p className="text-gray-400 mb-4">Your longest streak was</p>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <p className="text-8xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          {stats.core.longestStreak}
        </p>
        <p className="text-2xl mt-4">consecutive days</p>
      </motion.div>
      {stats.core.longestStreak >= 7 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-5xl mt-6"
        >
          🔥
        </motion.p>
      )}
    </div>
  );
}

function PersonaSlide({ stats }: { stats: ProcessedStats }) {
  const persona = stats.fun.readerPersona;

  return (
    <div className="text-center">
      <p className="text-gray-400 mb-4">You&apos;re a</p>
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="text-6xl mb-4"
      >
        {persona.icon}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
      >
        {persona.type}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xl text-gray-300 mt-4"
      >
        {persona.description}
      </motion.p>
    </div>
  );
}

function TopBooksSlide({ stats }: { stats: ProcessedStats }) {
  const topBooks = stats.topBooks.slice(0, 3);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Your Top Books</h2>
      <div className="space-y-4">
        {topBooks.map((item, idx) => (
          <motion.div
            key={item.book.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white/5 rounded-xl p-4 flex items-center gap-4"
          >
            <span className="text-3xl font-bold text-purple-400">
              #{idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.book.title}</p>
              <p className="text-sm text-gray-400">
                {item.hoursRead.toFixed(1)}h read
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FunFactsSlide({ stats }: { stats: ProcessedStats }) {
  const comparison = stats.fun.charactersComparison;

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Fun Fact</h2>
      <motion.p
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-6xl mb-4"
      >
        {comparison.icon}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-300"
      >
        {comparison.description}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-gray-500 mt-4"
      >
        ({stats.fun.totalCharactersRead.toLocaleString()} characters read)
      </motion.p>
    </div>
  );
}

function SummarySlide({ stats }: { stats: ProcessedStats }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
        Your 2025 Wrapped
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-3xl font-bold text-purple-400">{stats.core.totalBooksStarted}</p>
          <p className="text-sm text-gray-400">Books</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-3xl font-bold text-pink-400">{stats.core.totalPagesRead.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Pages</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-3xl font-bold text-orange-400">{formatReadingTime(stats.core.totalReadingTimeSeconds)}</p>
          <p className="text-sm text-gray-400">Reading Time</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-3xl font-bold text-cyan-400">{stats.core.longestStreak}</p>
          <p className="text-sm text-gray-400">Day Streak</p>
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-colors">
          <Share2 className="w-5 h-5" />
          Share
        </button>
        <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-full transition-colors">
          <Download className="w-5 h-5" />
          Save Image
        </button>
      </div>
    </div>
  );
}
