"use client";

import { useCallback, useState } from "react";
import { Upload, FileText } from "lucide-react";

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
        relative border-2 border-dashed rounded-2xl p-12
        transition-all duration-200 cursor-pointer
        ${
          isDragOver
            ? "border-purple-400 bg-purple-500/10"
            : "border-white/20 hover:border-white/40 bg-white/5"
        }
      `}
    >
      <input
        type="file"
        accept=".sqlite3,.sqlite"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="text-center">
        <div
          className={`
            w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
            transition-colors duration-200
            ${isDragOver ? "bg-purple-500/20" : "bg-white/10"}
          `}
        >
          {isDragOver ? (
            <FileText className="w-8 h-8 text-purple-400" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2">
          {isDragOver ? "Drop it here!" : "Drag & drop your file"}
        </h3>
        <p className="text-gray-400 mb-4">
          or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Accepts .sqlite3 files up to 50MB
        </p>
      </div>
    </div>
  );
}
