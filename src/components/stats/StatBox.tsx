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
      <div className="bg-paper-cream/50 backdrop-blur-sm rounded-xl p-5 border border-parchment hover:border-leather/30 hover:bg-paper-cream transition-all group shadow-sm">
        <p className={`serif-heading text-3xl font-bold ${colorClasses[color]} group-hover:scale-105 transition-transform`}>
          {value}
        </p>
        <div className="h-px w-8 bg-parchment my-2 transition-all group-hover:w-full"></div>
        <p className="text-xs text-ink-light uppercase tracking-[0.2em] font-medium">{label}</p>
      </div>
    );
  }
