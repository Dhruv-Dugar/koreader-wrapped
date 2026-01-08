"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ProcessedStats, Book, PageStatData } from "@/types";
import { computeStatistics } from "@/lib/stats-engine";
import { formatReadingTime } from "@/lib/comparisons";
import ReadingHeatmap from "@/components/wrapped/ReadingHeatmap";
import ShareCard from "@/components/wrapped/ShareCard";
import { useShareCard } from "@/hooks/useShareCard";
import {
  BookIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon,
  DownloadIcon,
  LoaderIcon,
  CheckCircleIcon,
} from "@/components/ui/Icons";
import { StatBox } from "@/components/stats/StatBox";
import { LargeStatCard } from "@/components/stats/LargeStatCard";
import { IconRenderer } from "@/components/ui/IconRenderer";

const TOTAL_SLIDES = 9;

function WrappedPageContent() {
    const [stats, setStats] = useState<(ProcessedStats & {rawBooks: Book[], pageStats: PageStatData[]}) | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
  
    useEffect(() => {
      if (id) {
        fetch(`/api/stats/${id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              router.push("/upload");
            } else {
              setStats(data);
            }
          });
      } else {
        const stored = localStorage.getItem("koreaderRawData");
        if (stored) {
          const rawData = JSON.parse(stored);
          const processedStats = computeStatistics(rawData.books, rawData.pageStats);
          setStats({...processedStats, rawBooks: rawData.books, pageStats: rawData.pageStats});
        } else {
          router.push("/upload");
        }
      }
    }, [id, router]);
  
    if (!stats) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-paper-cream">
          <div className="text-ink-medium font-[family-name:var(--font-playfair)] italic">
            Opening your story...
          </div>
        </div>
      );
    }
  
    return <Slideshow initialStats={stats} />;
  }

export default function WrappedPage() {
    return <Suspense fallback={<div>Loading...</div>}><WrappedPageContent /></Suspense>
}


function Slideshow({ initialStats }: { initialStats: ProcessedStats & { rawBooks: Book[], pageStats: PageStatData[] } }) {
  const [stats, setStats] = useState<ProcessedStats>(initialStats);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | 'all-time'>('all-time');

  const availableYears = useMemo(() => {
    const years = new Set(initialStats.pageStats.map(p => new Date(p.start_time * 1000).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [initialStats.pageStats]);

  useEffect(() => {
    const newStats = computeStatistics(initialStats.rawBooks, initialStats.pageStats, selectedYear);
    setStats(newStats);
  }, [initialStats, selectedYear]);

  // Arrow key navigation - must be before any conditional returns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setCurrentSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const slides = [
    <IntroSlide key="intro" />,
    <LargeStatCard key="books" label="You explored" value={stats.core.totalBooksStarted} unit="books" color="leather" />,
    <LargeStatCard key="time" label="You spent" value={formatReadingTime(stats.core.totalReadingTimeSeconds)} unit="reading" color="forest" comparison={stats.fun.timeComparison} />,
    <LargeStatCard key="streak" label="Your longest streak" value={stats.core.longestStreak} unit="consecutive days" color="gold" icon="flame" />,
    <ReadingCalendarSlide key="calendar" stats={stats} />,
    <PersonaSlide key="persona" stats={stats} />,
    <TopBooksSlide key="topbooks" stats={stats} />,
    <FunFactsSlide key="funfacts" stats={stats} />,
    <SummarySlide key="summary" stats={stats} onShare={() => setShowShareModal(true)} />,
  ];

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  return (
    <main className="min-h-screen text-ink-dark flex flex-col overflow-hidden">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-ink-medium hover:text-ink-dark transition-colors">
          <BookIcon size={20} />
          <span className="font-[family-name:var(--font-playfair)] font-semibold">KoReader Wrapped</span>
        </Link>
        <div className="flex items-center gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === 'all-time' ? 'all-time' : Number(e.target.value))}
            className="bg-paper-sepia border border-parchment rounded-md px-2 py-1 text-sm text-ink-dark"
          >
            <option value="all-time">All Time</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <span className="page-number">
            Page {currentSlide + 1} of {slides.length}
          </span>
        </div>
      </header>

      {/* Progress bar styled as bookmark ribbon */}
      <div className="relative h-1 bg-parchment overflow-visible">
        <motion.div
          className="absolute top-0 left-0 h-full bg-leather"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(((currentSlide + 1) / slides.length) * 100, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute top-0 h-6 w-4 bg-bookmarker -mt-1"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
          }}
          initial={{ left: 0 }}
          animate={{ left: `calc(${Math.min(((currentSlide + 1) / slides.length) * 100, 100)}% - 8px)` }}
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
            <div className="book-card rounded-xl p-8 md:p-10">
              {slides[currentSlide]}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-3 rounded-full bg-paper-sepia hover:bg-parchment border border-parchment disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeftIcon size={20} className="text-ink-dark" />
          </button>

          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlide
                    ? "bg-leather w-4"
                    : "bg-parchment hover:bg-ink-light"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-3 rounded-full bg-paper-sepia hover:bg-parchment border border-parchment disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRightIcon size={20} className="text-ink-dark" />
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          stats={stats}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </main>
  );
}


// Slide Components
function IntroSlide() {
  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-paper-cream border border-parchment flex items-center justify-center">
          <BookIcon size={40} className="text-leather" />
        </div>
        <div className="chapter-divider mb-6 max-w-xs mx-auto">
          <span className="text-sm tracking-widest uppercase">Chapter I</span>
        </div>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4 text-ink-dark">
          Your Year in Books
        </h1>
        <p className="text-lg text-ink-medium italic">
          Let&apos;s discover your reading story...
        </p>
      </motion.div>
    </div>
  );
}

function ReadingCalendarSlide({ stats }: { stats: ProcessedStats }) {
  const totalDays = stats.dailyReading.length;
  const totalMinutes = stats.dailyReading.reduce((sum, d) => sum + d.minutes, 0);
  const avgMinutesPerDay = totalDays > 0 ? Math.round(totalMinutes / totalDays) : 0;

  // Detect the year from the data
  const detectedYear = useMemo(() => {
    if (stats.dailyReading.length === 0) return new Date().getFullYear();
    const yearCounts = new Map<number, number>();
    stats.dailyReading.forEach((d) => {
      const y = parseInt(d.date.split("-")[0]);
      yearCounts.set(y, (yearCounts.get(y) || 0) + 1);
    });
    let maxYear = new Date().getFullYear();
    let maxCount = 0;
    yearCounts.forEach((count, y) => {
      if (count > maxCount) {
        maxCount = count;
        maxYear = y;
      }
    });
    return maxYear;
  }, [stats.dailyReading]);

  return (
    <div className="py-2">
      <div className="chapter-divider mb-4 max-w-xs mx-auto">
        <span className="text-sm tracking-widest uppercase">Your {detectedYear} Library</span>
      </div>
      <p className="text-center text-ink-medium text-sm mb-4 italic">
        Each book spine represents a day of reading
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto -mx-4 px-4"
      >
        <ReadingHeatmap dailyReading={stats.dailyReading} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 grid grid-cols-2 gap-2"
      >
        <div className="bg-paper-cream rounded-lg p-3 border border-parchment text-center">
          <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-leather">
            {totalDays}
          </p>
          <p className="text-xs text-ink-light">days reading</p>
        </div>
        <div className="bg-paper-cream rounded-lg p-3 border border-parchment text-center">
          <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-forest">
            {avgMinutesPerDay} min
          </p>
          <p className="text-xs text-ink-light">avg per day</p>
        </div>
      </motion.div>
    </div>
  );
}

function PersonaSlide({ stats }: { stats: ProcessedStats }) {
  const persona = stats.fun.readerPersona;

  return (
    <div className="text-center py-6">
      <p className="text-ink-light mb-4 uppercase tracking-widest text-sm">You&apos;re a</p>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mb-4"
      >
        <IconRenderer icon={persona.icon} size={64} className="text-leather mx-auto" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-leather"
      >
        {persona.type}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-lg text-ink-medium mt-4 italic"
      >
        {persona.description}
      </motion.p>
    </div>
  );
}

function TopBooksSlide({ stats }: { stats: ProcessedStats }) {
  const topBooks = stats.topBooks.slice(0, 3);

  return (
    <div className="py-4">
      <div className="chapter-divider mb-6 max-w-xs mx-auto">
        <span className="text-sm tracking-widest uppercase">Your Top Books</span>
      </div>
      <div className="space-y-3">
        {topBooks.map((item, idx) => (
          <motion.div
            key={item.book.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="bg-paper-cream rounded-lg p-4 flex items-center gap-4 border border-parchment"
          >
            <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-leather w-8">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-[family-name:var(--font-playfair)] font-semibold truncate text-ink-dark">
                {item.book.title}
              </p>
              <p className="text-sm text-ink-light">
                {item.hoursRead.toFixed(1)} hours read
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
    <div className="text-center py-6">
      <div className="chapter-divider mb-6 max-w-xs mx-auto">
        <span className="text-sm tracking-widest uppercase">Fun Fact</span>
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <IconRenderer icon={comparison.icon} size={56} className="text-leather mx-auto" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-ink-medium italic leading-relaxed"
      >
        &ldquo;{comparison.description}&rdquo;
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-ink-light mt-6"
      >
        {stats.fun.totalCharactersRead.toLocaleString()} characters read
      </motion.p>
    </div>
  );
}

function SummarySlide({ stats, onShare }: { stats: ProcessedStats; onShare: () => void }) {
  return (
    <div className="text-center py-4">
      <div className="chapter-divider mb-6 max-w-xs mx-auto">
        <span className="text-sm tracking-widest uppercase">Your Story</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatBox value={stats.core.totalBooksStarted} label="Books" color="leather" />
        <StatBox value={stats.core.totalPagesRead.toLocaleString()} label="Pages" color="forest" />
        <StatBox value={formatReadingTime(stats.core.totalReadingTimeSeconds)} label="Reading Time" color="gold" />
        <StatBox value={stats.core.longestStreak} label="Day Streak" color="bookmarker" />
      </div>

      <motion.button
        onClick={onShare}
        className="bookmark-btn w-full py-4 rounded-lg flex items-center justify-center gap-3 text-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ShareIcon size={20} />
        Share Your Wrapped
      </motion.button>
    </div>
  );
}

// Share Modal Component
function ShareModal({ stats, onClose }: { stats: ProcessedStats; onClose: () => void }) {
  const { cardRef, status, error, downloadImage, shareImage, copyToClipboard, canShare } =
    useShareCard();

  const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-dark/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-paper-cream rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-parchment">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-ink-dark">
              Share Your Wrapped
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-parchment transition-colors text-ink-medium"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-ink-medium mt-2">
            Download or share your reading journey with friends!
          </p>
        </div>

        {/* Card Preview (scaled down) */}
        <div className="p-6 bg-parchment/30 flex justify-center">
          <div className="relative overflow-hidden rounded-lg shadow-lg" style={{ aspectRatio: "1/1", width: "324px", height: "324px" }}>
            <div
              style={{
                transform: "scale(0.3)",
                transformOrigin: "top left",
                width: "1080px",
                height: "1080px",
              }}
            >
              <ShareCard ref={cardRef} stats={stats} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 space-y-3">
          {/* Status message */}
          {status === "generating" && (
            <div className="flex items-center justify-center gap-2 text-ink-medium py-2">
              <LoaderIcon size={20} />
              <span>Generating image...</span>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center justify-center gap-2 text-forest py-2">
              <CheckCircleIcon size={20} />
              <span>Done!</span>
            </div>
          )}

          {error && (
            <div className="text-bookmarker text-center py-2">
              {error}
            </div>
          )}

          {/* Share button (if supported) */}
          {canShare && (
            <button
              onClick={shareImage}
              disabled={status === "generating"}
              className="bookmark-btn w-full py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShareIcon size={20} />
              Share
            </button>
          )}

          {/* Download button */}
          <button
            onClick={downloadImage}
            disabled={status === "generating"}
            className="w-full py-3 rounded-lg flex items-center justify-center gap-2 bg-paper-sepia hover:bg-parchment border border-parchment text-ink-dark transition-colors disabled:opacity-50"
          >
            <DownloadIcon size={20} />
            Download Image
          </button>

          {/* Copy to clipboard */}
          <button
            onClick={copyToClipboard}
            disabled={status === "generating"}
            className="w-full py-3 rounded-lg flex items-center justify-center gap-2 bg-transparent hover:bg-parchment border border-parchment text-ink-medium transition-colors disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy to Clipboard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
