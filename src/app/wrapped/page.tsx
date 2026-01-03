"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ProcessedStats } from "@/types";
import { formatReadingTime } from "@/lib/comparisons";
import ReadingHeatmap from "@/components/wrapped/ReadingHeatmap";
import {
  BookIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon,
  DownloadIcon,
  FlameIcon,
  MoonIcon,
  MountainIcon,
  TowerIcon,
  WallIcon,
  FilmIcon,
  PlaneIcon,
  RunnerIcon,
  OwlIcon,
  BirdIcon,
  SwordIcon,
  StackIcon,
  SparkleIcon,
} from "@/components/ui/Icons";

// Helper to render icon based on string type
function IconRenderer({ icon, size = 48, className = "" }: { icon: string; size?: number; className?: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    moon: <MoonIcon size={size} className={className} />,
    mountain: <MountainIcon size={size} className={className} />,
    tower: <TowerIcon size={size} className={className} />,
    wall: <WallIcon size={size} className={className} />,
    film: <FilmIcon size={size} className={className} />,
    plane: <PlaneIcon size={size} className={className} />,
    runner: <RunnerIcon size={size} className={className} />,
    flame: <FlameIcon size={size} className={className} />,
    owl: <OwlIcon size={size} className={className} />,
    bird: <BirdIcon size={size} className={className} />,
    sword: <SwordIcon size={size} className={className} />,
    stack: <StackIcon size={size} className={className} />,
    sparkle: <SparkleIcon size={size} className={className} />,
    book: <BookIcon size={size} className={className} />,
  };

  return iconMap[icon] || <BookIcon size={size} className={className} />;
}

const TOTAL_SLIDES = 9;

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

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-cream">
        <div className="text-ink-medium font-[family-name:var(--font-playfair)] italic">
          Opening your story...
        </div>
      </div>
    );
  }

  const slides = [
    <IntroSlide key="intro" />,
    <BooksReadSlide key="books" stats={stats} />,
    <TimeSpentSlide key="time" stats={stats} />,
    <StreakSlide key="streak" stats={stats} />,
    <ReadingCalendarSlide key="calendar" stats={stats} />,
    <PersonaSlide key="persona" stats={stats} />,
    <TopBooksSlide key="topbooks" stats={stats} />,
    <FunFactsSlide key="funfacts" stats={stats} />,
    <SummarySlide key="summary" stats={stats} />,
  ];

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));

  return (
    <main className="min-h-screen text-ink-dark flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-ink-medium hover:text-ink-dark transition-colors">
          <BookIcon size={20} />
          <span className="font-[family-name:var(--font-playfair)] font-semibold">KoReader Wrapped</span>
        </Link>
        <span className="page-number">
          Page {currentSlide + 1} of {slides.length}
        </span>
      </header>

      {/* Progress bar styled as bookmark ribbon */}
      <div className="relative h-1 bg-parchment">
        <motion.div
          className="absolute top-0 left-0 h-full bg-leather"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute top-0 h-6 w-4 bg-bookmarker -mt-1"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
          }}
          initial={{ left: 0 }}
          animate={{ left: `calc(${((currentSlide + 1) / slides.length) * 100}% - 8px)` }}
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

function BooksReadSlide({ stats }: { stats: ProcessedStats }) {
  return (
    <div className="text-center py-6">
      <p className="text-ink-light mb-4 uppercase tracking-widest text-sm">You explored</p>
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="font-[family-name:var(--font-playfair)] text-7xl md:text-8xl font-bold text-leather"
      >
        {stats.core.totalBooksStarted}
      </motion.p>
      <p className="font-[family-name:var(--font-playfair)] text-2xl mt-4 text-ink-dark">books</p>
      {stats.core.totalBooksCompleted > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-ink-medium mt-4 italic"
        >
          and completed {stats.core.totalBooksCompleted} of them
        </motion.p>
      )}
    </div>
  );
}

function TimeSpentSlide({ stats }: { stats: ProcessedStats }) {
  const comparison = stats.fun.timeComparison;

  return (
    <div className="text-center py-6">
      <p className="text-ink-light mb-4 uppercase tracking-widest text-sm">You spent</p>
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-bold text-forest"
      >
        {formatReadingTime(stats.core.totalReadingTimeSeconds)}
      </motion.p>
      <p className="font-[family-name:var(--font-playfair)] text-2xl mt-4 text-ink-dark">reading</p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-paper-cream rounded-lg p-4 border border-parchment"
      >
        <div className="flex justify-center mb-2">
          <IconRenderer icon={comparison.icon} size={32} className="text-leather" />
        </div>
        <p className="text-ink-medium text-sm italic">{comparison.description}</p>
      </motion.div>
    </div>
  );
}

function StreakSlide({ stats }: { stats: ProcessedStats }) {
  return (
    <div className="text-center py-6">
      <p className="text-ink-light mb-4 uppercase tracking-widest text-sm">Your longest streak</p>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <p className="font-[family-name:var(--font-playfair)] text-7xl md:text-8xl font-bold text-gold">
          {stats.core.longestStreak}
        </p>
        <p className="font-[family-name:var(--font-playfair)] text-2xl mt-4 text-ink-dark">consecutive days</p>
      </motion.div>
      {stats.core.longestStreak >= 7 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mt-6"
        >
          <FlameIcon size={40} className="text-gold mx-auto" />
        </motion.div>
      )}
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

function SummarySlide({ stats }: { stats: ProcessedStats }) {
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

      <div className="flex gap-3 justify-center">
        <button className="flex items-center gap-2 bg-paper-cream hover:bg-parchment border border-parchment px-5 py-2.5 rounded-lg transition-colors text-ink-dark text-sm">
          <ShareIcon size={16} />
          Share
        </button>
        <button className="flex items-center gap-2 bookmark-btn px-5 py-2.5 rounded-lg text-sm">
          <DownloadIcon size={16} />
          Save Image
        </button>
      </div>
    </div>
  );
}

function StatBox({
  value,
  label,
  color
}: {
  value: string | number;
  label: string;
  color: "leather" | "forest" | "gold" | "bookmarker";
}) {
  const colorClasses = {
    leather: "text-leather",
    forest: "text-forest",
    gold: "text-gold",
    bookmarker: "text-bookmarker",
  };

  return (
    <div className="bg-paper-cream rounded-lg p-4 border border-parchment">
      <p className={`font-[family-name:var(--font-playfair)] text-2xl font-bold ${colorClasses[color]}`}>
        {value}
      </p>
      <p className="text-xs text-ink-light uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
