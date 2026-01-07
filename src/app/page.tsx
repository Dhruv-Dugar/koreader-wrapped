"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookIcon,
  TrophyIcon,
  ShareIcon,
  ArrowRightIcon,
  MountainIcon,
  FilmIcon,
  MoonIcon,
  FlameIcon,
} from "@/components/ui/Icons";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "KoReader Wrapped",
    "url": "https://kowrapped.netlify.com",
    "description": "Visualize your reading statistics from KOReader locally in your browser.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Dhruv Dugar"
    }
  };

  return (
    <main className="min-h-screen text-ink-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          {/* Decorative book icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-paper-sepia border border-parchment">
              <BookIcon size={40} className="text-leather" />
            </div>
          </motion.div>

          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-ink-dark leading-tight">
            Your Year in{" "}
            <span className="text-leather italic">Books</span>
          </h1>
          <p className="text-lg md:text-xl text-ink-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover the story of your reading journey. Beautiful insights from your
            KOReader statistics, crafted like the pages of your favorite novel.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/upload"
            className="inline-flex items-center gap-3 bookmark-btn py-4 px-8 rounded-lg text-lg shadow-md"
          >
            <BookIcon size={20} />
            Begin Your Story
            <ArrowRightIcon size={20} />
          </Link>
        </motion.div>

        {/* Chapter divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="chapter-divider mt-16 max-w-md mx-auto"
        >
          <span className="text-sm tracking-widest uppercase">Chapter I</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          <FeatureCard
            icon={<BookIcon size={28} />}
            title="Deep Insights"
            description="Discover your reading patterns, longest streaks, and favorite books through elegant visualizations."
          />
          <FeatureCard
            icon={<TrophyIcon size={28} />}
            title="Achievements"
            description="Unlock badges for your reading milestones. Are you a Night Owl or an Early Bird reader?"
          />
          <FeatureCard
            icon={<ShareIcon size={28} />}
            title="Share Your Story"
            description="Generate beautiful cards to share your reading journey with fellow book lovers."
          />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="chapter-divider mb-12 max-w-md mx-auto">
          <span className="text-sm tracking-widest uppercase">How It Works</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <StepCard
            number="I"
            title="Find Your File"
            description="Locate your statistics.sqlite3 file from your KOReader device or sync folder."
          />
          <StepCard
            number="II"
            title="Upload Securely"
            description="Your file is processed entirely in your browser. Your reading data stays private."
          />
          <StepCard
            number="III"
            title="Explore & Share"
            description="Discover beautiful insights and share your reading story with the world."
          />
        </div>
      </section>

      {/* Fun Stats Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="book-card rounded-xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="quote-mark">&ldquo;</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-semibold -mt-8">
              Discover Fun Comparisons
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <QuoteCard
              text="Your characters would stack to 3x the height of Mount Everest!"
              icon={<MountainIcon size={24} className="text-leather" />}
            />
            <QuoteCard
              text="You read for 120 hours - that's 60 movies worth of adventure!"
              icon={<FilmIcon size={24} className="text-leather" />}
            />
            <QuoteCard
              text="You're a Night Owl - most of your reading happens after midnight!"
              icon={<MoonIcon size={24} className="text-leather" />}
            />
            <QuoteCard
              text="Your longest streak: 45 days of consecutive reading!"
              icon={<FlameIcon size={24} className="text-leather" />}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center">
        <div className="chapter-divider mb-8 max-w-xs mx-auto">
          <span className="text-xs">~</span>
        </div>
        <p className="text-ink-medium font-[family-name:var(--font-playfair)] italic">
          Made with love for readers everywhere.
        </p>
        <p className="mt-3 text-sm text-ink-light">
          Your reading data stays private - we process everything in your browser.
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="book-card rounded-xl p-6 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-paper-cream border border-parchment text-leather mb-4">
        {icon}
      </div>
      <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-3">{title}</h3>
      <p className="text-ink-medium text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-full bg-leather text-paper-cream flex items-center justify-center font-[family-name:var(--font-playfair)] text-xl font-bold mx-auto mb-4 shadow-sm">
        {number}
      </div>
      <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold mb-2">{title}</h3>
      <p className="text-ink-medium text-sm">{description}</p>
    </div>
  );
}

function QuoteCard({
  text,
  icon,
}: {
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-paper-cream rounded-lg p-5 border border-parchment">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <p className="text-ink-medium text-sm italic leading-relaxed">&ldquo;{text}&rdquo;</p>
      </div>
    </div>
  );
}
