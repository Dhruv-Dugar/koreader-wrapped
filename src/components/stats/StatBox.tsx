"use client";

export function StatBox({
    value,
    label,
    color
  }: {
    value: string | number;
    label:string;
    color: "leather" | "forest" | "gold" | "bookmarker";
  }) {
    const colorClasses = {
      leather: "text-leather",
      forest: "text-forest",
      gold: "text-gold",
      bookmarker: "text-bookmarker",
    };
  
    return (
      <div className="bg-paper-cream rounded-lg p-4 border border-parchment">
        <p className={`font-[family-name:var(--font-playfair)] text-2xl font-bold ${colorClasses[color]}`}>
          {value}
        </p>
        <p className="text-xs text-ink-light uppercase tracking-wider mt-1">{label}</p>
      </div>
    );
  }
