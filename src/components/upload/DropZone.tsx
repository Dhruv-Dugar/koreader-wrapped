"use client";

import { useCallback, useState } from "react";
import { BookIcon, FileIcon } from "@/components/ui/Icons";

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
}

export default function DropZone({ onFileAccepted }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative rounded-xl p-12
        transition-all duration-300 cursor-pointer
        border-2
        ${
          isDragOver
            ? "border-leather bg-paper-sepia shadow-lg"
            : "border-dashed border-parchment hover:border-leather bg-paper-sepia/50 hover:bg-paper-sepia"
        }
      `}
    >
      <input
        type="file"
        accept=".sqlite3,.sqlite"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      {/* Open book illustration */}
      <div className="text-center">
        <div
          className={`
            relative w-24 h-20 mx-auto mb-6 transition-transform duration-300
            ${isDragOver ? "scale-110" : ""}
          `}
        >
          {/* Book base */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isDragOver ? (
              <div className="relative">
                <FileIcon size={48} className="text-leather" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-forest rounded-full flex items-center justify-center">
                  <span className="text-paper-cream text-xs">+</span>
                </div>
              </div>
            ) : (
              <BookIcon size={48} className="text-ink-light" />
            )}
          </div>
        </div>

        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-ink-dark mb-2">
          {isDragOver ? "Place your book here" : "Open your reading story"}
        </h3>
        <p className="text-ink-medium mb-4">
          {isDragOver ? "Release to upload" : "Drag & drop your file, or click to browse"}
        </p>
        <p className="text-sm text-ink-light">
          Accepts <code className="bg-parchment px-2 py-0.5 rounded text-leather">statistics.sqlite3</code> files up to 50MB
        </p>
      </div>
    </div>
  );
}
