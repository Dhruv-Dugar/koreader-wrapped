"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import {romanize} from 'romans';
export default function Home() {
  const [bookOpen, setBookOpen] = useState(false);
  const [pagesFlipping, setPagesFlipping] = useState(false);
  const router = useRouter();

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

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const handleBookClick = () => {
    setBookOpen(true);
    setTimeout(() => {
      setPagesFlipping(true);
      setTimeout(() => {
        router.push("/upload");
      }, 2000); // Navigate after pages flip animation
    }, 800); // Start pages after cover opens
  };

  return (
    <main className="min-h-screen text-ink-dark overflow-hidden selection:bg-leather selection:text-paper-cream pt-16 md:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-foil/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-leather/5 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        <motion.div 
          style={{ y, opacity }} 
          className="absolute inset-0 pointer-events-none"
        >
          {/* Parallax Background Content if needed */}
        </motion.div>

        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-paper-sepia/50 border border-parchment backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-forest-green animate-pulse" />
                <span className="text-xs font-mono tracking-widest uppercase text-ink-medium">
                The {new Date().getFullYear()} Edition
                </span>
            </motion.div>

            <h1 className="serif-heading text-6xl md:text-8xl font-bold mb-8 text-ink-dark leading-[0.9]">
              Your Year <br />
              <span className="text-5xl md:text-7xl font-normal italic text-ink-medium">in</span>{" "}
              <span className="gold-foil-text font-serif italic pr-4">Books</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-ink-medium/90 mb-10 max-w-xl leading-relaxed font-light">
              Every page turned is a journey taken. Unveil the hidden patterns of your reading life with <span className="font-semibold text-leather">privacy-first</span> analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href="/upload"
                className="group relative bookmark-btn py-4 px-8 rounded-lg text-lg shadow-xl hover:shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <BookIcon size={22} />
                  Reveal Your Story
                  <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="/leaderboard"
                className="py-4 px-8 rounded-lg text-lg border border-parchment hover:border-leather text-ink-medium hover:text-leather transition-all bg-paper-cream/50 hover:bg-paper-cream"
              >
                View Leaderboard
              </Link>
            </div>
          </motion.div>

          {/* 3D Book Illustration */}
          <motion.div
            initial={{ opacity: 0, rotateY: 30, x: 50 }}
            animate={{ opacity: 1, rotateY: 0, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex justify-center perspective-[2000px]"
          >
            <div
              className="relative w-[380px] h-[540px] transform-style-3d group"
              style={{ perspective: '2000px' }}
            >
              {/* Book Spine */}
              <motion.div
                className="absolute left-[20px] top-[10px] w-[360px] h-[520px] bg-paper-sepia rounded-r-xl shadow-2xl z-0 transform translate-z-[-10px]"
                animate={bookOpen ? { rotateY: 0 } : {}}
              />

              {/* Book Cover */}
              <motion.div
                className="absolute inset-0 bg-paper-cream rounded-r-xl border border-parchment shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden z-10 flex flex-col items-center justify-center p-8 text-center relative border-l-[12px] border-l-leather-dark cursor-pointer"
                animate={bookOpen ? {
                  rotateY: -90,
                  transformOrigin: 'left center'
                } : {
                  rotateY: 0,
                  transformOrigin: 'left center'
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                onClick={handleBookClick}
                whileHover={!bookOpen ? { rotateY: -5 } : {}}
              >
                {/* Decorative Corner Ornaments */}
                <div className="corner-ornament corner-top-left" />
                <div className="corner-ornament corner-top-right" />
                <div className="corner-ornament corner-bottom-left" />
                <div className="corner-ornament corner-bottom-right" />

                <div className="w-24 h-24 mb-8 rounded-full border-2 border-parchment flex items-center justify-center bg-paper-sepia/30">
                  <BookIcon size={48} className="text-leather" strokeWidth={1} />
                </div>

                <h2 className="serif-heading text-4xl font-bold mb-2 text-ink-dark">
                  KOReader
                </h2>
                <div className="w-16 h-px bg-leather/30 my-4" />
                <h3 className="font-serif italic text-2xl text-ink-medium mb-12">
                  Wrapped
                </h3>

                <div className="mt-auto font-mono text-xs tracking-[0.3em] text-ink-light opacity-60">
                  VOL. {romanize(new Date().getFullYear())}
                </div>

                {/* Cover Texture */}
                <div className="absolute inset-0 paper-texture opacity-50 mix-blend-overlay pointer-events-none" />
              </motion.div>

              {/* Pages */}
              {bookOpen && (
                <motion.div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Multiple pages flipping */}
                  {[1, 2, 3, 4, 5].map((page, index) => (
                    <motion.div
                      key={page}
                      className="absolute w-[340px] h-[500px] bg-paper-cream border-r border-parchment shadow-lg"
                      style={{
                        top: `${10 + index * 2}px`,
                        left: `${20 + index * 2}px`,
                      }}
                      initial={{ rotateY: 0 }}
                      animate={pagesFlipping ? {
                        rotateY: index * 15,
                        x: index * 20,
                      } : {}}
                      transition={{
                        delay: 0.1 * index,
                        duration: 0.8,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Page content placeholder */}
                      <div className="p-6 h-full flex flex-col justify-center text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-paper-sepia/30 flex items-center justify-center">
                          <BookIcon size={32} className="text-leather" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-parchment/50 rounded w-3/4 mx-auto" />
                          <div className="h-2 bg-parchment/30 rounded w-1/2 mx-auto" />
                          <div className="h-2 bg-parchment/40 rounded w-2/3 mx-auto" />
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Final page with text */}
                  <motion.div
                    className="absolute w-[340px] h-[500px] bg-paper-cream border-r border-parchment shadow-lg flex flex-col items-center justify-center p-8 text-center z-30"
                    style={{ top: '60px', left: '40px' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={pagesFlipping ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    <BookIcon size={48} className="text-leather mb-6" />
                    <h3 className="serif-heading text-2xl font-bold mb-4 text-ink-dark">
                      Your Story Awaits
                    </h3>
                    <p className="text-ink-medium text-sm italic">
                      Turn the page to begin...
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="chapter-divider mb-8 justify-center">
            <span className="uppercase tracking-[0.2em] text-xs font-semibold">Chapter I: The Discovery</span>
          </div>
          <h2 className="serif-heading text-4xl md:text-5xl font-bold mb-6">
            More Than Just <span className="italic text-leather">Numbers</span>
          </h2>
          <p className="text-xl text-ink-medium font-light">
            Your reading habits tell a story. We help you read between the lines.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BookIcon size={32} />}
            title="Literary DNA"
            description="Visualize your reading patterns, genre preferences, and pacing through elegant, book-style charts."
            delay={0.1}
          />
          <FeatureCard
            icon={<TrophyIcon size={32} />}
            title="Hall of Fame"
            description="Unlock unique badges for your milestones. From 'Night Owl' to 'Marathoner', celebrate every chapter."
            delay={0.2}
          />
          <FeatureCard
            icon={<ShareIcon size={32} />}
            title="Share Your Tale"
            description="Generate beautiful, shareable cards that showcase your literary year to the world."
            delay={0.3}
          />
        </div>
      </section>

      {/* Process Section with Parallax */}
      <section className="py-32 relative overflow-hidden bg-paper-sepia/30">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-parchment to-transparent opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="chapter-divider mb-20 max-w-md mx-auto justify-center"
          >
            <span className="uppercase tracking-[0.3em] text-xs font-semibold">Chapter II: The Method</span>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            <StepCard
              number="I"
              title="Locate Ledger"
              description="Find the statistics.sqlite3 file on your device. It holds the map of your journeys."
              delay={0.1}
            />
            <StepCard
              number="II"
              title="Silent Analysis"
              description="Upload your data. We process it locally in your browser—private as a diary."
              delay={0.2}
            />
            <StepCard
              number="III"
              title="Revel in Discovery"
              description="Turn the pages of your reading year and share your unique story with others."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Stats Preview / Curiosity Section */}
      <section className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="book-card rounded-2xl p-10 md:p-24 max-w-5xl mx-auto relative bg-paper-cream border-parchment"
        >
          {/* Ornaments */}
          <div className="corner-ornament corner-top-left border-leather/30" />
          <div className="corner-ornament corner-top-right border-leather/30" />
          <div className="corner-ornament corner-bottom-left border-leather/30" />
          <div className="corner-ornament corner-bottom-right border-leather/30" />
          
          <div className="text-center mb-16">
            <span className="quote-mark select-none block text-6xl mb-4 text-leather/20">&ldquo;</span>
            <h2 className="serif-heading text-4xl md:text-5xl font-bold mb-6">
              Curiosities from the Archives
            </h2>
            <div className="w-20 h-1 bg-leather/20 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <QuoteCard
              text="Your cumulative words would reach 1.8x the height of Mount Everest."
              icon={<MountainIcon size={24} className="text-leather" />}
              delay={0.1}
            />
            <QuoteCard
              text="You read for 120 hours - enough time to witness 60 cinematic epics."
              icon={<FilmIcon size={24} className="text-leather" />}
              delay={0.2}
            />
            <QuoteCard
              text="The moon was your primary witness; most pages were turned after midnight."
              icon={<MoonIcon size={24} className="text-leather" />}
              delay={0.3}
            />
            <QuoteCard
              text="A streak of 45 days: a consistent devotion to the written word."
              icon={<FlameIcon size={24} className="text-leather" />}
              delay={0.4}
            />
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative bg-paper-sepia pt-24 pb-12 border-t border-parchment">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-12 flex justify-center gap-8 text-ink-light font-medium tracking-wide">
            <Link href="/upload" className="hover:text-leather hover:-translate-y-1 transition-all">Begin</Link>
            <Link href="/leaderboard" className="hover:text-leather hover:-translate-y-1 transition-all">Leaderboard</Link>
            <Link href="/profile" className="hover:text-leather hover:-translate-y-1 transition-all">Profile</Link>
          </div>
          
          <BookIcon size={32} className="mx-auto text-parchment mb-6" />
          
          <p className="serif-heading text-2xl text-ink-medium italic mb-4">
            Finis coronat opus.
          </p>
          <p className="text-sm text-ink-light max-w-md mx-auto leading-relaxed opacity-70">
            KoReader Wrapped is a privacy-focused visualization tool. <br/>
            Your reading data is stored securely and never shared. <br/>
            Please contact the developer for deletion of your accounts!
          </p>
          
          <div className="mt-12 text-xs font-mono text-ink-light/40 uppercase tracking-widest">
            © {new Date().getFullYear()} KoReader Wrapped <br/>
            Made with ❤️ by Dhruv Dugar
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="book-card rounded-xl p-8 text-center group bg-paper-cream border border-parchment/50 hover:border-leather/30"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-paper-sepia/50 border border-parchment text-leather mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="serif-heading text-2xl font-bold mb-3 group-hover:text-leather transition-colors">{title}</h3>
      <p className="text-ink-medium text-sm leading-relaxed font-light">{description}</p>
    </motion.div>
  );
}

function StepCard({
  number,
  title,
  description,
  delay
}: {
  number: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-center group relative"
    >
      <div className="w-20 h-20 rounded-full bg-leather text-paper-cream flex items-center justify-center serif-heading text-3xl font-bold mx-auto mb-8 shadow-xl shadow-leather/20 group-hover:scale-110 transition-transform duration-300 relative z-10 border-4 border-paper-cream">
        {number}
      </div>
      {/* Connector Line (Virtual) */}
      <div className="absolute top-10 left-1/2 w-full h-px bg-parchment -z-0 hidden md:block" />
      
      <h3 className="serif-heading text-xl font-bold mb-3">{title}</h3>
      <p className="text-ink-medium text-sm font-light leading-relaxed px-2">{description}</p>
    </motion.div>
  );
}

function QuoteCard({
  text,
  icon,
  delay
}: {
  text: string;
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-start gap-5 p-4 rounded-xl hover:bg-paper-sepia/30 transition-colors duration-300"
    >
      <div className="flex-shrink-0 mt-1 p-2 bg-paper-sepia rounded-lg border border-parchment text-leather">
        {icon}
      </div>
      <p className="text-ink-medium text-lg italic leading-relaxed font-light border-l-2 border-parchment pl-4">
        {text}
      </p>
    </motion.div>
  );
}
