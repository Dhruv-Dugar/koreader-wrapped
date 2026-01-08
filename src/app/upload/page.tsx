"use client";

import { useState, useCallback, useEffect } from "react";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DropZone from "@/components/upload/DropZone";
import { parseKoReaderDb } from "@/lib/sqlite-parser";
import { computeStatistics } from "@/lib/stats-engine";
import { ProcessedStats } from "@/types";
import {
  BookIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
} from "@/components/ui/Icons";

type UploadState = "idle" | "uploading" | "processing" | "success" | "error";

export default function UploadPage() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProcessedStats | null>(null);
  const [hasPreviousData, setHasPreviousData] = useState(false);
  const router = useRouter();

  // Check for existing data on mount
  useEffect(() => {
    const stored = localStorage.getItem("koreaderStats");
    setHasPreviousData(!!stored);
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadState("uploading");
    setError(null);

    try {
      // Validate file
      if (!file.name.endsWith(".sqlite3") && !file.name.endsWith(".sqlite")) {
        throw new Error("Please upload a valid SQLite file (.sqlite3)");
      }

      if (file.size > 50 * 1024 * 1024) {
        throw new Error("File size must be less than 50MB");
      }

      setUploadState("processing");

      // Read file
      const buffer = await file.arrayBuffer();

      // Parse database
      const { books, pageStats } = await parseKoReaderDb(buffer);

      if (books.length === 0) {
        throw new Error("No reading data found in this file");
      }

      // Compute statistics
      const processedStats = computeStatistics(books, pageStats);
      setStats(processedStats);

      // Store in localStorage for persistence across sessions
      localStorage.setItem("koreaderStats", JSON.stringify(processedStats));
      localStorage.setItem("koreaderStatsTimestamp", new Date().toISOString());

      setUploadState("success");
      track("file_processed");

      // Navigate to wrapped after a brief delay
      setTimeout(() => {
        router.push("/wrapped");
      }, 1500);
    } catch (err) {
      setUploadState("error");
      setError(err instanceof Error ? err.message : "Failed to process file");
    }
  }, [router]);

  return (
    <main className="min-h-screen text-ink-dark flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-ink-medium hover:text-ink-dark transition-colors">
          <BookIcon size={20} />
          <span className="font-[family-name:var(--font-playfair)] font-semibold">KoReader Wrapped</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="chapter-divider mb-6 max-w-xs mx-auto">
              <span className="text-sm tracking-widest uppercase">Chapter II</span>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4">
              Upload Your Reading Data
            </h1>
            <p className="text-ink-medium">
              Drop your <code className="bg-parchment px-2 py-1 rounded text-leather text-sm">statistics.sqlite3</code> file below
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {uploadState === "idle" && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <DropZone onFileAccepted={handleFileUpload} />
                {hasPreviousData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-center"
                  >
                    <p className="text-ink-light text-sm mb-2">
                      You have previous reading data saved
                    </p>
                    <Link
                      href="/wrapped"
                      className="inline-flex items-center gap-2 text-leather hover:text-leather-dark transition-colors font-medium"
                    >
                      <BookIcon size={16} />
                      View Your Wrapped
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}

            {uploadState === "uploading" && (
              <StatusCard
                key="uploading"
                icon={<LoaderIcon size={40} className="text-leather" />}
                title="Opening the book..."
                description="Reading your file"
              />
            )}

            {uploadState === "processing" && (
              <StatusCard
                key="processing"
                icon={<LoaderIcon size={40} className="text-leather" />}
                title="Turning the pages..."
                description="Discovering your reading story"
              />
            )}

            {uploadState === "success" && stats && (
              <StatusCard
                key="success"
                icon={<CheckCircleIcon size={40} className="text-forest" />}
                title="Story discovered!"
                description={`Found ${stats.core.totalBooksStarted} books and ${stats.core.totalPagesRead.toLocaleString()} pages read`}
              />
            )}

            {uploadState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <StatusCard
                  icon={<AlertCircleIcon size={40} className="text-bookmarker" />}
                  title="Something went wrong"
                  description={error || "Failed to read your file"}
                />
                <button
                  onClick={() => {
                    setUploadState("idle");
                    setError(null);
                  }}
                  className="mt-4 w-full py-3 bg-paper-sepia hover:bg-parchment border border-parchment rounded-lg transition-colors text-ink-dark"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 text-center"
          >
            <p className="text-sm text-ink-light italic">
              Your file is processed entirely in your browser.
              <br />
              Your reading data never leaves your device.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function StatusCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="book-card rounded-xl p-12 text-center"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-ink-medium">{description}</p>
    </motion.div>
  );
}
