"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { track } from "@vercel/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DropZone from "@/components/upload/DropZone";
import {
  BookIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
} from "@/components/ui/Icons";

type UploadState = "idle" | "uploading" | "processing" | "success" | "error";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadState("uploading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      setUploadState("processing");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed to process file");
      }

      const data = await response.json();

      // Store in localStorage for persistence across sessions
      localStorage.setItem("koreaderRawData", JSON.stringify(data));
      localStorage.setItem("koreaderStatsTimestamp", new Date().toISOString());

      setUploadState("success");
      track("file_processed");

      // Navigate to wrapped after a brief delay
      setTimeout(() => {
        router.push(`/wrapped?id=${data.id}`);
      }, 1500);
    } catch (err) {
      setUploadState("error");
      setError(err instanceof Error ? err.message : "Failed to process file");
    }
  }, [router]);

  if (status === "loading") {
    return (
        <main className="min-h-screen text-ink-dark flex items-center justify-center">
            <LoaderIcon size={40} className="text-leather" />
        </main>
    )
  }

  if (status === "unauthenticated") {
    return (
        <main className="min-h-screen text-ink-dark flex items-center justify-center">
            <p>Redirecting to sign in...</p>
        </main>
    )
  }

  return (
    <main className="min-h-screen text-ink-dark flex flex-col">
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

            {uploadState === "success" && (
              <StatusCard
                key="success"
                icon={<CheckCircleIcon size={40} className="text-forest" />}
                title="Story discovered!"
                description="Redirecting you to your wrapped..."
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