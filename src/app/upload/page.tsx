"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileCheck, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import DropZone from "@/components/upload/DropZone";
import { parseKoReaderDb } from "@/lib/sqlite-parser";
import { computeStatistics } from "@/lib/stats-engine";
import { ProcessedStats } from "@/types";

type UploadState = "idle" | "uploading" | "processing" | "success" | "error";

export default function UploadPage() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProcessedStats | null>(null);
  const router = useRouter();

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

      // Store in sessionStorage for the wrapped page
      sessionStorage.setItem("koreaderStats", JSON.stringify(processedStats));

      setUploadState("success");

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
    <main className="min-h-screen text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Upload Your Stats</h1>
          <p className="text-gray-400">
            Drop your <code className="bg-white/10 px-2 py-1 rounded">statistics.sqlite3</code> file below
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
            </motion.div>
          )}

          {uploadState === "uploading" && (
            <StatusCard
              key="uploading"
              icon={<Loader2 className="w-12 h-12 animate-spin text-purple-400" />}
              title="Uploading..."
              description="Reading your file"
            />
          )}

          {uploadState === "processing" && (
            <StatusCard
              key="processing"
              icon={<Loader2 className="w-12 h-12 animate-spin text-purple-400" />}
              title="Processing..."
              description="Crunching your reading data"
            />
          )}

          {uploadState === "success" && stats && (
            <StatusCard
              key="success"
              icon={<FileCheck className="w-12 h-12 text-green-400" />}
              title="Success!"
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
                icon={<AlertCircle className="w-12 h-12 text-red-400" />}
                title="Error"
                description={error || "Something went wrong"}
              />
              <button
                onClick={() => {
                  setUploadState("idle");
                  setError(null);
                }}
                className="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
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
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>
            Your file is processed entirely in your browser.
            <br />
            We never upload your raw data to our servers.
          </p>
        </motion.div>
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
      className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 text-center"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
