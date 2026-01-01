"use client";

import { motion } from "framer-motion";
import { Upload, BarChart3, Trophy, Share2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            KoReader Wrapped
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover your reading journey. Beautiful insights from your KoReader
            statistics, Spotify Wrapped style.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <Upload className="w-5 h-5" />
            Upload Your Stats
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Deep Insights"
            description="Discover your reading patterns, streaks, favorite genres, and more with beautiful visualizations."
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Leaderboards"
            description="See how you rank among other readers. Are you in the top 1% of page-turners?"
          />
          <FeatureCard
            icon={<Share2 className="w-8 h-8" />}
            title="Shareable Cards"
            description="Generate beautiful share cards to show off your reading achievements on social media."
          />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <StepCard
            number={1}
            title="Find Your File"
            description="Locate your statistics.sqlite3 file from your KoReader device or sync folder."
          />
          <StepCard
            number={2}
            title="Upload Securely"
            description="Upload your file - we process it in your browser for maximum privacy."
          />
          <StepCard
            number={3}
            title="Explore & Share"
            description="Discover amazing insights and share your reading wrapped with friends!"
          />
        </div>
      </section>

      {/* Fun Stats Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Discover Fun Comparisons
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <p className="text-4xl mb-2">🏔️</p>
              <p className="text-lg text-gray-300">
                &quot;Your characters would stack to 3x the height of Mount Everest!&quot;
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <p className="text-4xl mb-2">🎬</p>
              <p className="text-lg text-gray-300">
                &quot;You read for 120 hours - that&apos;s 60 movies worth!&quot;
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <p className="text-4xl mb-2">🦉</p>
              <p className="text-lg text-gray-300">
                &quot;You&apos;re a Night Owl - most of your reading happens after midnight!&quot;
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <p className="text-4xl mb-2">🔥</p>
              <p className="text-lg text-gray-300">
                &quot;Your longest streak: 45 days of consecutive reading!&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>
          Made with love for the KoReader community.
        </p>
        <p className="mt-2 text-sm">
          Your data stays private - we process everything in your browser.
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
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/10 transition-colors">
      <div className="text-purple-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
