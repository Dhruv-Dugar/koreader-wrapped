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
    <main className="min-h-screen text-ink-dark flex flex-col overflow-hidden paper-texture">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 text-ink-medium hover:text-leather transition-all group">
          <div className="w-8 h-8 rounded bg-paper-sepia border border-parchment flex items-center justify-center group-hover:rotate-3 transition-transform">
            <BookIcon size={18} className="text-leather" />
          </div>
          <span className="serif-heading font-bold text-xl tracking-tight">KoReader Wrapped</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === 'all-time' ? 'all-time' : Number(e.target.value))}
              className="appearance-none bg-paper-sepia border border-parchment rounded-lg px-4 py-1.5 text-sm font-semibold text-ink-medium cursor-pointer hover:border-leather/30 transition-colors pr-8"
            >
              <option value="all-time">All Time</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-light">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          <span className="page-number font-mono text-xs text-ink-light uppercase tracking-widest bg-paper-sepia/50 px-3 py-1.5 rounded-full border border-parchment/30">
            Page {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </header>

      {/* Progress bar styled as bookmark ribbon */}
      <div className="relative h-1 bg-parchment/30 overflow-visible">
        <motion.div
          className="absolute top-0 left-0 h-full bg-leather shadow-[0_0_10px_rgba(139,90,43,0.3)]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(((currentSlide + 1) / slides.length) * 100, 100)}%` }}
          transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
        />
        <motion.div
          className="absolute top-0 h-8 w-5 bg-bookmarker -mt-1 shadow-md z-20"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
          }}
          initial={{ left: 0 }}
          animate={{ left: `calc(${Math.min(((currentSlide + 1) / slides.length) * 100, 100)}% - 10px)` }}
          transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
        />
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border border-leather rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] border border-gold rounded-full blur-[120px]"></div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ duration: 0.4, ease: [0.165, 0.84, 0.44, 1] }}
            className="w-full max-w-xl z-10"
          >
            <div className="book-card rounded-2xl p-10 md:p-14 relative group">
              <div className="corner-ornament corner-top-left opacity-30 group-hover:opacity-100 transition-opacity"></div>
              <div className="corner-ornament corner-top-right opacity-30 group-hover:opacity-100 transition-opacity"></div>
              <div className="corner-ornament corner-bottom-left opacity-30 group-hover:opacity-100 transition-opacity"></div>
              <div className="corner-ornament corner-bottom-right opacity-30 group-hover:opacity-100 transition-opacity"></div>
              
              {slides[currentSlide]}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-6 py-10 relative z-10">
        <div className="flex justify-between items-center max-w-xl mx-auto">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="w-12 h-12 rounded-full bg-paper-sepia hover:bg-parchment border border-parchment flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95 shadow-sm"
          >
            <ChevronLeftIcon size={24} className="text-ink-dark" />
          </button>

          <div className="flex gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSlide
                    ? "bg-leather w-8 shadow-[0_0_8px_rgba(139,90,43,0.3)]"
                    : "bg-parchment hover:bg-ink-light w-1.5"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="w-12 h-12 rounded-full bg-leather hover:bg-leather-dark text-paper-cream border border-leather-dark/20 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 active:scale-95 shadow-lg shadow-leather/20"
          >
            <ChevronRightIcon size={24} />
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
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
      >
        <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-paper-cream border border-parchment flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
          <BookIcon size={48} className="text-leather" />
        </div>
        <div className="chapter-divider mb-8 max-w-xs mx-auto">
          <span>CHAPTER I</span>
        </div>
        <h1 className="serif-heading text-4xl md:text-5xl font-bold mb-6 text-ink-dark">
          Your Year in Books
        </h1>
        <p className="text-xl text-ink-medium italic font-light">
          Let&apos;s unveil your reading story...
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
      <div className="chapter-divider mb-8 max-w-xs mx-auto">
        <span>THE {detectedYear} ARCHIVE</span>
      </div>
      <p className="text-center text-ink-medium text-sm mb-6 italic font-light">
        The rhythmic pattern of your daily devotion
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="overflow-x-auto -mx-6 px-6 no-scrollbar"
      >
        <ReadingHeatmap dailyReading={stats.dailyReading} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid grid-cols-2 gap-4"
      >
        <div className="bg-paper-cream/50 backdrop-blur-sm rounded-xl p-4 border border-parchment text-center hover:border-leather/30 transition-colors">
          <p className="serif-heading text-3xl font-bold text-leather">
            {totalDays}
          </p>
          <p className="text-xs text-ink-light uppercase tracking-widest mt-1">days reading</p>
        </div>
        <div className="bg-paper-cream/50 backdrop-blur-sm rounded-xl p-4 border border-parchment text-center hover:border-leather/30 transition-colors">
          <p className="serif-heading text-3xl font-bold text-forest">
            {avgMinutesPerDay}
          </p>
          <p className="text-xs text-ink-light uppercase tracking-widest mt-1">avg min / day</p>
        </div>
      </motion.div>
    </div>
  );
}

function PersonaSlide({ stats }: { stats: ProcessedStats }) {
  const persona = stats.fun.readerPersona;

  return (
    <div className="text-center py-8">
      <p className="text-ink-light mb-6 uppercase tracking-[0.3em] text-xs">A Portrait of the Reader</p>
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.2, damping: 15 }}
        className="mb-8"
      >
        <div className="w-24 h-24 mx-auto rounded-full bg-paper-cream border-2 border-parchment flex items-center justify-center shadow-inner">
          <IconRenderer icon={persona.icon} size={48} className="text-leather" />
        </div>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="serif-heading text-4xl font-bold text-leather mb-6"
      >
        {persona.type}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative px-4"
      >
        <span className="quote-mark absolute -top-8 -left-2 opacity-10">&ldquo;</span>
        <p className="text-xl text-ink-medium italic font-light leading-relaxed">
          {persona.description}
        </p>
        <span className="quote-mark absolute -bottom-12 -right-2 opacity-10 rotate-180">&ldquo;</span>
      </motion.div>
    </div>
  );
}

function TopBooksSlide({ stats }: { stats: ProcessedStats }) {
  const topBooks = stats.topBooks.slice(0, 3);

  return (
    <div className="py-4">
      <div className="chapter-divider mb-8 max-w-xs mx-auto">
        <span>CURATED SELECTIONS</span>
      </div>
      <div className="space-y-4">
        {topBooks.map((item, idx) => (
          <motion.div
            key={item.book.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.15, ease: [0.165, 0.84, 0.44, 1] }}
            className="bg-paper-cream/50 backdrop-blur-sm rounded-xl p-5 flex items-center gap-6 border border-parchment hover:border-leather/30 hover:bg-paper-cream transition-all group"
          >
            <div className="serif-heading text-3xl font-bold text-leather/20 group-hover:text-leather/50 transition-colors w-10 italic">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="serif-heading font-bold text-lg truncate text-ink-dark group-hover:text-leather transition-colors">
                {item.book.title}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-ink-light uppercase tracking-widest">
                  {item.hoursRead.toFixed(1)} hours
                </span>
                <div className="w-1 h-1 rounded-full bg-parchment"></div>
                <span className="text-xs text-ink-light uppercase tracking-widest">
                  {Math.round(item.completionRate * 100)}% Complete
                </span>
              </div>
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
    <div className="text-center py-10">
      <div className="chapter-divider mb-10 max-w-xs mx-auto">
        <span>LITERARY MARVELS</span>
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-10"
      >
        <div className="w-20 h-20 mx-auto rounded-2xl bg-paper-cream border border-parchment flex items-center justify-center shadow-sm">
          <IconRenderer icon={comparison.icon} size={40} className="text-leather" />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6"
      >
        <p className="text-2xl text-ink-dark italic leading-relaxed serif-heading font-light">
          &ldquo;{comparison.description}&rdquo;
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-10 flex flex-col items-center"
      >
        <div className="h-px w-12 bg-parchment mb-4"></div>
        <p className="text-xs text-ink-light uppercase tracking-[0.2em]">
          {stats.fun.totalCharactersRead.toLocaleString()} characters transcribed
        </p>
      </motion.div>
    </div>
  );
}

function SummarySlide({ stats, onShare }: { stats: ProcessedStats; onShare: () => void }) {
  return (
    <div className="text-center py-4">
      <div className="chapter-divider mb-10 max-w-xs mx-auto">
        <span>THE FINAL PAGE</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <StatBox value={stats.core.totalBooksStarted} label="Volumes" color="leather" />
        <StatBox value={stats.core.totalPagesRead.toLocaleString()} label="Pages" color="forest" />
        <StatBox value={formatReadingTime(stats.core.totalReadingTimeSeconds)} label="Duration" color="gold" />
        <StatBox value={stats.core.longestStreak} label="Streak" color="bookmarker" />
      </div>

      <motion.button
        onClick={onShare}
        className="bookmark-btn w-full py-5 rounded-xl flex items-center justify-center gap-4 text-xl shadow-lg shadow-leather/20"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <ShareIcon size={24} />
        Share Your Journey
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
