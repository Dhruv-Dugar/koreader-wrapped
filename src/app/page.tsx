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

          <h1 className="serif-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-ink-dark leading-tight">
            Your Year in{" "}
            <span className="gold-foil-text italic px-2">Books</span>
          </h1>
          <p className="text-xl md:text-2xl text-ink-medium mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Discover the story of your reading journey. Beautiful insights from your
            KOReader statistics, crafted like the pages of a premium novel.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10"
        >
          <Link
            href="/upload"
            className="inline-flex items-center gap-4 bookmark-btn py-5 px-10 rounded-xl text-xl shadow-xl hover:shadow-2xl transition-all group"
          >
            <BookIcon size={24} />
            <span className="tracking-wide">Open Your Story</span>
            <ArrowRightIcon size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Chapter divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="chapter-divider mt-24 max-w-lg mx-auto"
        >
          <span>EST. MMXXIV</span>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BookIcon size={32} />}
            title="Deep Insights"
            description="Discover your reading patterns, longest streaks, and favorite books through elegant, book-style visualizations."
          />
          <FeatureCard
            icon={<TrophyIcon size={32} />}
            title="Literary Achievements"
            description="Unlock badges for your reading milestones. From 'Night Owl' to 'Binge Reader', celebrate your journey."
          />
          <FeatureCard
            icon={<ShareIcon size={32} />}
            title="Shareable Cards"
            description="Generate beautifully crafted cards to share your reading year with the literary community."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-paper-sepia/50 py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="chapter-divider mb-16 max-w-md mx-auto">
            <span className="uppercase tracking-[0.3em]">The Process</span>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <StepCard
              number="I"
              title="Locate Ledger"
              description="Find your statistics.sqlite3 file on your device. It holds the map of your journeys."
            />
            <StepCard
              number="II"
              title="Silent Analysis"
              description="Upload your data. We process it locally in your browser—private as a diary."
            />
            <StepCard
              number="III"
              title="Revel in Discovery"
              description="Turn the pages of your reading year and share your unique story with others."
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 border border-leather rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border border-gold rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Fun Stats Preview */}
      <section className="container mx-auto px-4 py-24">
        <div className="book-card rounded-2xl p-10 md:p-20 max-w-5xl mx-auto relative">
          <div className="corner-ornament corner-top-left"></div>
          <div className="corner-ornament corner-top-right"></div>
          <div className="corner-ornament corner-bottom-left"></div>
          <div className="corner-ornament corner-bottom-right"></div>
          
          <div className="text-center mb-12">
            <span className="quote-mark select-none">&ldquo;</span>
            <h2 className="serif-heading text-3xl md:text-5xl font-bold -mt-10 mb-4">
              Curiosities from the Archives
            </h2>
            <p className="text-ink-medium italic">Unveiling the hidden metrics of your literary life.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <QuoteCard
              text="Your cumulative words would reach 1.8x the height of Mount Everest."
              icon={<MountainIcon size={28} className="text-leather" />}
            />
            <QuoteCard
              text="You read for 120 hours - enough time to witness 60 cinematic epics."
              icon={<FilmIcon size={28} className="text-leather" />}
            />
            <QuoteCard
              text="The moon was your primary witness; most pages were turned after midnight."
              icon={<MoonIcon size={28} className="text-leather" />}
            />
            <QuoteCard
              text="A streak of 45 days: a consistent devotion to the written word."
              icon={<FlameIcon size={28} className="text-leather" />}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-20 text-center border-t border-parchment/30">
        <div className="mb-8 flex justify-center gap-6 text-ink-light">
          <Link href="/upload" className="hover:text-leather transition-colors">Begin</Link>
          <Link href="/leaderboard" className="hover:text-leather transition-colors">Leaderboard</Link>
          <Link href="/profile" className="hover:text-leather transition-colors">Profile</Link>
        </div>
        <p className="text-ink-medium font-[family-name:var(--font-playfair)] italic text-lg mb-2">
          Finis coronat opus.
        </p>
        <p className="text-sm text-ink-light max-w-md mx-auto leading-relaxed">
          KoReader Wrapped is a privacy-focused visualization tool. Your reading data is stored securely and never shared with third parties.
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
    <div className="book-card rounded-2xl p-8 text-center group">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-paper-cream border border-parchment text-leather mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="serif-heading text-2xl font-bold mb-4">{title}</h3>
      <p className="text-ink-medium text-sm leading-relaxed font-light">{description}</p>
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
    <div className="text-center group">
      <div className="w-16 h-16 rounded-full bg-leather text-paper-cream flex items-center justify-center serif-heading text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <h3 className="serif-heading text-xl font-bold mb-3">{title}</h3>
      <p className="text-ink-medium text-sm font-light leading-relaxed px-4">{description}</p>
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
    <div className="bg-paper-cream/80 backdrop-blur-sm rounded-xl p-6 border border-parchment hover:border-leather/30 transition-colors group">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">{icon}</div>
        <p className="text-ink-medium text-lg italic leading-relaxed font-light">&ldquo;{text}&rdquo;</p>
      </div>
    </div>
  );
}
