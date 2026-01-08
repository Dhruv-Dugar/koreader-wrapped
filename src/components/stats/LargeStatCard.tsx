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
    <div className="text-center py-6">
      <p className="text-ink-light mb-4 uppercase tracking-widest text-sm">{label}</p>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <p className={`font-[family-name:var(--font-playfair)] text-7xl md:text-8xl font-bold ${colorClasses[color]}`}>
          {value}
        </p>
        {unit && <p className="font-[family-name:var(--font-playfair)] text-2xl mt-4 text-ink-dark">{unit}</p>}
      </motion.div>
      {icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mt-6"
        >
          <IconRenderer icon={icon} size={40} className={`${colorClasses[color]} mx-auto`} />
        </motion.div>
      )}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-paper-cream rounded-lg p-4 border border-parchment"
        >
          <div className="flex justify-center mb-2">
            <IconRenderer icon={comparison.icon} size={32} className="text-leather" />
          </div>
          <p className="text-ink-medium text-sm italic">{comparison.description}</p>
        </motion.div>
      )}
    </div>
  );
}
