"use client";

import { useCallback, useRef, useState } from "react";
import { toPng, toBlob } from "html-to-image";

export type ShareStatus = "idle" | "generating" | "success" | "error";

interface UseShareCardReturn {
  cardRef: React.RefObject<HTMLDivElement | null>;
  status: ShareStatus;
  error: string | null;
  downloadImage: () => Promise<void>;
  shareImage: () => Promise<void>;
  copyToClipboard: () => Promise<void>;
  canShare: boolean;
}

/**
 * Hook for generating and sharing card images
 * Handles download, native share, and clipboard copy
 */
export function useShareCard(): UseShareCardReturn {
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ShareStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Check if Web Share API is available
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  const generateImage = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) {
      setError("Card element not found");
      return null;
    }

    setStatus("generating");
    setError(null);

    try {
      // Generate PNG with high quality settings
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2, // 2x for retina displays
        cacheBust: true,
        skipFonts: true, // Skip font processing to avoid font.trim() errors
      });

      setStatus("success");
      return dataUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate image";
      setError(message);
      setStatus("error");
      return null;
    }
  }, []);

  const downloadImage = useCallback(async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    // Create download link
    const link = document.createElement("a");
    link.download = `koreader-wrapped-${new Date().getFullYear()}.png`;
    link.href = dataUrl;
    link.click();
  }, [generateImage]);

  const shareImage = useCallback(async () => {
    if (!cardRef.current) {
      setError("Card element not found");
      return;
    }

    setStatus("generating");
    setError(null);

    try {
      // Generate blob for sharing
      const blob = await toBlob(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true, // Skip font processing to avoid font.trim() errors
      });

      if (!blob) {
        throw new Error("Failed to generate image blob");
      }

      // Create file for sharing
      const file = new File(
        [blob],
        `koreader-wrapped-${new Date().getFullYear()}.png`,
        { type: "image/png" }
      );

      // Use Web Share API
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My KoReader Wrapped",
          text: "Check out my reading stats!",
          files: [file],
        });
        setStatus("success");
      } else {
        // Fallback to download
        await downloadImage();
      }
    } catch (err) {
      // User cancelled share - not an error
      if (err instanceof Error && err.name === "AbortError") {
        setStatus("idle");
        return;
      }

      const message = err instanceof Error ? err.message : "Failed to share image";
      setError(message);
      setStatus("error");
    }
  }, [downloadImage]);

  const copyToClipboard = useCallback(async () => {
    if (!cardRef.current) {
      setError("Card element not found");
      return;
    }

    setStatus("generating");
    setError(null);

    try {
      const blob = await toBlob(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true, // Skip font processing to avoid font.trim() errors
      });

      if (!blob) {
        throw new Error("Failed to generate image blob");
      }

      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      setStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to copy to clipboard";
      setError(message);
      setStatus("error");
    }
  }, []);

  return {
    cardRef,
    status,
    error,
    downloadImage,
    shareImage,
    copyToClipboard,
    canShare,
  };
}
