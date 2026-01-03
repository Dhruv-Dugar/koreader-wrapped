"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { DailyReading } from "@/types";

interface ReadingHeatmapProps {
  dailyReading: DailyReading[];
  year?: number;
}

interface QuarterData {
  name: string;
  weeks: (DailyReading | null)[][];
  months: string[];
}

export default function ReadingHeatmap({ dailyReading, year }: ReadingHeatmapProps) {
  // Auto-detect year from data if not provided
  const targetYear = useMemo(() => {
    if (year) return year;
    if (dailyReading.length === 0) return new Date().getFullYear();

    const yearCounts = new Map<number, number>();
    dailyReading.forEach((d) => {
      const y = parseInt(d.date.split("-")[0]);
      yearCounts.set(y, (yearCounts.get(y) || 0) + 1);
    });

    let maxYear = new Date().getFullYear();
    let maxCount = 0;
    yearCounts.forEach((count, y) => {
      if (count > maxCount) {
        maxCount = count;
        maxYear = y;
      }
    });

    return maxYear;
  }, [dailyReading, year]);

  const { quarters, maxMinutes, totalDays, maxDay } = useMemo(() => {
    const readingMap = new Map<string, DailyReading>();
    dailyReading.forEach((d) => readingMap.set(d.date, d));

    const quarterMonths = [
      { name: "Q1", startMonth: 0, endMonth: 2, months: ["Jan", "Feb", "Mar"] },
      { name: "Q2", startMonth: 3, endMonth: 5, months: ["Apr", "May", "Jun"] },
      { name: "Q3", startMonth: 6, endMonth: 8, months: ["Jul", "Aug", "Sep"] },
      { name: "Q4", startMonth: 9, endMonth: 11, months: ["Oct", "Nov", "Dec"] },
    ];

    const quarters: QuarterData[] = [];
    let maxMinutes = 0;
    let totalDays = 0;
    let maxDay: DailyReading | null = null;

    for (const q of quarterMonths) {
      const startDate = new Date(targetYear, q.startMonth, 1);
      const endDate = new Date(targetYear, q.endMonth + 1, 0);

      // Adjust to start from Sunday
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const weeks: (DailyReading | null)[][] = [];
      const currentDate = new Date(weekStart);

      while (currentDate <= endDate) {
        const week: (DailyReading | null)[] = [];

        for (let day = 0; day < 7; day++) {
          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

          if (
            currentDate >= startDate &&
            currentDate <= endDate &&
            currentDate.getFullYear() === targetYear
          ) {
            const reading = readingMap.get(dateStr) || null;
            if (reading) {
              if (reading.minutes > maxMinutes) {
                maxMinutes = reading.minutes;
                maxDay = reading;
              }
              totalDays++;
            }
            week.push(reading);
          } else {
            week.push(null);
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        weeks.push(week);
      }

      quarters.push({
        name: q.name,
        weeks,
        months: q.months,
      });
    }

    return { quarters, maxMinutes, totalDays, maxDay };
  }, [dailyReading, targetYear]);

  const getIntensity = (minutes: number): number => {
    if (minutes === 0) return 0;
    if (maxMinutes === 0) return 1;
    const ratio = minutes / maxMinutes;
    if (ratio < 0.25) return 1;
    if (ratio < 0.5) return 2;
    if (ratio < 0.75) return 3;
    return 4;
  };

  return (
    <div className="w-full space-y-3">
      {/* Quarters grid - 2x2 layout */}
      <div className="grid grid-cols-2 gap-2">
        {quarters.map((quarter, qIdx) => (
          <QuarterGrid
            key={quarter.name}
            quarter={quarter}
            getIntensity={getIntensity}
            delay={qIdx * 0.1}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] text-ink-light font-[family-name:var(--font-jetbrains)]">
          {totalDays} days reading
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-ink-light">Less</span>
          <div className="flex gap-[2px]">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-2 h-2 rounded-[2px] ${getSpineColorClass(level)}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-ink-light">More</span>
        </div>
      </div>

      {/* Max day highlight */}
      {maxDay && (
        <MaxDayCard maxDay={maxDay} />
      )}
    </div>
  );
}

function QuarterGrid({
  quarter,
  getIntensity,
  delay,
}: {
  quarter: QuarterData;
  getIntensity: (minutes: number) => number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className="bg-paper-cream rounded-lg p-2 border border-parchment"
    >
      {/* Quarter label and months */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-semibold text-ink-medium font-[family-name:var(--font-jetbrains)]">
          {quarter.months.join(" / ")}
        </span>
      </div>

      {/* Weeks grid */}
      <div className="flex gap-[2px]">
        {quarter.weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-[2px]">
            {week.map((day, dayIdx) => {
              const intensity = day ? getIntensity(day.minutes) : 0;
              return (
                <div
                  key={dayIdx}
                  className={`w-[6px] h-[6px] rounded-[1px] ${
                    day === null ? "bg-transparent" : getSpineColorClass(intensity)
                  }`}
                  style={
                    day && day.minutes > 0
                      ? { boxShadow: "inset -0.5px 0 0 rgba(0,0,0,0.1)" }
                      : {}
                  }
                  title={
                    day
                      ? `${formatDate(day.date)}: ${day.minutes} min`
                      : undefined
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MaxDayCard({ maxDay }: { maxDay: DailyReading }) {
  // Fun comparisons for reading time
  const reelsAvoided = Math.round(maxDay.minutes * 2); // ~30 sec per reel
  const pagesEstimate = Math.round(maxDay.minutes / 2); // ~2 min per page

  const formattedDate = new Date(maxDay.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="bg-paper-cream rounded-lg p-3 border border-parchment"
    >
      <p className="text-xs text-ink-light mb-1 font-[family-name:var(--font-jetbrains)]">
        Peak reading day
      </p>
      <p className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-leather">
        {maxDay.minutes} minutes
      </p>
      <p className="text-xs text-ink-medium mt-1">
        on {formattedDate}
      </p>
      <p className="text-[11px] text-ink-light mt-2 italic">
        That&apos;s {pagesEstimate} pages read, or {reelsAvoided} short-form videos worth of focus saved.
      </p>
    </motion.div>
  );
}

function getSpineColorClass(intensity: number): string {
  switch (intensity) {
    case 0:
      return "bg-parchment/60";
    case 1:
      return "bg-[#e6d5b8]";
    case 2:
      return "bg-[#c9a87c]";
    case 3:
      return "bg-[#a67c52]";
    case 4:
      return "bg-[#8b5a2b]";
    default:
      return "bg-parchment/60";
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
