"use client";

import { useCallback, useState } from "react";
import { BookIcon, FileIcon, UploadIcon } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative rounded-xl p-12 md:p-16
        transition-all duration-300 cursor-pointer
        group overflow-hidden
        ${
          isDragOver
            ? "bg-paper-sepia shadow-xl border-leather"
            : "bg-paper-cream hover:bg-paper-sepia/30 border-parchment hover:border-leather/50"
        }
        border-2 border-dashed
      `}
    >
      <input
        type="file"
        accept=".sqlite3,.sqlite"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
      />

      {/* Decorative Ornaments that light up on hover/drag */}
      <div className={`corner-ornament corner-top-left transition-colors duration-300 ${isDragOver ? "border-leather" : "border-parchment"}`} />
      <div className={`corner-ornament corner-top-right transition-colors duration-300 ${isDragOver ? "border-leather" : "border-parchment"}`} />
      <div className={`corner-ornament corner-bottom-left transition-colors duration-300 ${isDragOver ? "border-leather" : "border-parchment"}`} />
      <div className={`corner-ornament corner-bottom-right transition-colors duration-300 ${isDragOver ? "border-leather" : "border-parchment"}`} />

      <div className="text-center relative z-10">
        <motion.div
          animate={{
            scale: isDragOver ? 1.1 : 1,
            y: isDragOver ? -10 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-24 h-24 mx-auto mb-8"
        >
          <div className={`
            absolute inset-0 rounded-full flex items-center justify-center
            transition-all duration-300
            ${isDragOver ? "bg-leather text-paper-cream shadow-lg" : "bg-paper-sepia text-leather border border-parchment"}
          `}>
             <AnimatePresence mode="wait">
              {isDragOver ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <UploadIcon size={40} />
                </motion.div>
              ) : (
                <motion.div
                  key="book"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <BookIcon size={40} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Pulse effect when dragging */}
          {isDragOver && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full bg-leather z-[-1]"
            />
          )}
        </motion.div>

        <h3 className="serif-heading text-2xl font-bold text-ink-dark mb-3 group-hover:text-leather transition-colors">
          {isDragOver ? "Release to Begin" : "Open Your Reading Story"}
        </h3>
        
        <p className="text-ink-medium mb-6 font-light text-lg">
          {isDragOver ? "We are ready to read..." : "Drag & drop your file, or click to browse"}
        </p>
        
        <div className={`
          inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono transition-colors duration-300
          ${isDragOver ? "bg-paper-cream text-leather" : "bg-paper-sepia text-ink-light"}
        `}>
          <FileIcon size={12} />
          statistics.sqlite3
        </div>
      </div>
    </motion.div>
  );
}
