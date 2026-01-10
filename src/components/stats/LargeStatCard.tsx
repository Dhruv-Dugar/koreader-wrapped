"use client";

import { motion } from "framer-motion";
import { IconRenderer } from "../ui/IconRenderer";

export function LargeStatCard({
  label,
  value,
  unit,
  comparison,
  icon,
  color = "leather",
}: {
  label: string;
  value: string | number;
  unit?: string;
  comparison?: {
    icon: string;
    description: string;
  };
  icon?: string;
  color?: "leather" | "forest" | "gold" | "bookmarker";
}) {
  const colorClasses = {
    leather: "text-leather",
    forest: "text-forest",
    gold: "text-gold",
    bookmarker: "text-bookmarker",
  };

  return (
    <div className="text-center py-8">
      <p className="text-ink-light mb-6 uppercase tracking-[0.3em] text-xs">{label}</p>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2, damping: 12 }}
      >
        <p className={`serif-heading text-7xl md:text-8xl font-bold ${colorClasses[color]} mb-4`}>
          {value}
        </p>
        {unit && <p className="serif-heading text-2xl text-ink-dark italic font-light">{unit}</p>}
      </motion.div>
      {icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mt-8"
        >
          <div className="w-16 h-16 mx-auto rounded-xl bg-paper-cream border border-parchment flex items-center justify-center shadow-sm">
            <IconRenderer icon={icon} size={32} className={`${colorClasses[color]}`} />
          </div>
        </motion.div>
      )}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 bg-paper-cream/50 backdrop-blur-sm rounded-xl p-6 border border-parchment relative group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-leather/20 transition-all group-hover:w-full group-hover:bg-leather/5 z-0"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-3">
              <IconRenderer icon={comparison.icon} size={36} className="text-leather" />
            </div>
            <p className="text-ink-medium text-lg italic font-light leading-relaxed px-4">
              &ldquo;{comparison.description}&rdquo;
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
