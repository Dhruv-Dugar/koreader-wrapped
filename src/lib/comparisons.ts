import { Achievement } from "@/types";

// Fun comparison constants
export const COMPARISONS = {
  // Distance (characters laid end-to-end, avg char width 2mm)
  MOON_DISTANCE_CHARS: 192_000_000_000, // 384,400 km
  EVEREST_HEIGHT_CHARS: 4_400_000, // 8,849 m
  GREAT_WALL_CHARS: 10_700_000_000, // 21,196 km
  EIFFEL_TOWER_CHARS: 1_650_000, // 330 m

  // Time (in seconds)
  AVG_MOVIE_SECONDS: 7200, // 2 hours
  NYC_LONDON_FLIGHT_SECONDS: 25200, // 7 hours
  MARATHON_SECONDS: 14400, // 4 hours

  // Pages
  HARRY_POTTER_SERIES_PAGES: 4_224,
  LORD_OF_RINGS_PAGES: 1_178,
  WAR_AND_PEACE_PAGES: 1_225,
};

// Icon types for achievements and comparisons
export type IconType =
  | "book"
  | "flame"
  | "trophy"
  | "owl"
  | "bird"
  | "runner"
  | "stack"
  | "award"
  | "moon"
  | "sun"
  | "mountain"
  | "film"
  | "plane"
  | "tower"
  | "wall"
  | "sparkle"
  | "sword"
  | "clock";

// Achievement definitions
export const ACHIEVEMENTS: Record<string, Omit<Achievement, "unlockedAt">> = {
  // Reading volume
  first_book: {
    id: "first_book",
    name: "First Steps",
    description: "Complete your first book",
    icon: "book",
  },
  bookworm: {
    id: "bookworm",
    name: "Bookworm",
    description: "Read 10 books",
    icon: "book",
  },
  bibliophile: {
    id: "bibliophile",
    name: "Bibliophile",
    description: "Read 50 books",
    icon: "stack",
  },
  library: {
    id: "library",
    name: "Walking Library",
    description: "Read 100 books",
    icon: "stack",
  },

  // Streaks
  week_streak: {
    id: "week_streak",
    name: "Week Warrior",
    description: "7-day reading streak",
    icon: "flame",
  },
  month_streak: {
    id: "month_streak",
    name: "Monthly Master",
    description: "30-day reading streak",
    icon: "flame",
  },
  consistency_king: {
    id: "consistency_king",
    name: "Consistency King",
    description: "90-day reading streak",
    icon: "trophy",
  },

  // Time-based
  night_owl: {
    id: "night_owl",
    name: "Night Owl",
    description: "Read 100 hours after midnight",
    icon: "owl",
  },
  early_bird: {
    id: "early_bird",
    name: "Early Bird",
    description: "Read 100 hours before 7am",
    icon: "bird",
  },
  marathon: {
    id: "marathon",
    name: "Marathon Reader",
    description: "Read for over 12 hours in a single day",
    icon: "runner",
  },

  // Engagement
  highlighter: {
    id: "highlighter",
    name: "Highlighter Hero",
    description: "100 highlights",
    icon: "sparkle",
  },
  note_taker: {
    id: "note_taker",
    name: "Note Taker",
    description: "50 notes",
    icon: "book",
  },

  // Special
  polyglot: {
    id: "polyglot",
    name: "Polyglot",
    description: "Read books in 3+ languages",
    icon: "stack",
  },
  series_complete: {
    id: "series_complete",
    name: "Series Slayer",
    description: "Complete a book series",
    icon: "sword",
  },
  speed_demon: {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Top 10% reading speed",
    icon: "sparkle",
  },
  quarterly_quest: {
    id: "quarterly_quest",
    name: "Quarterly Quest",
    description: "Read at least one book in each quarter of a year",
    icon: "trophy",
  },
};

// Fun comparison text generators
export function getPageComparison(pages: number): string {
  if (pages >= COMPARISONS.HARRY_POTTER_SERIES_PAGES * 5) {
    const times = Math.floor(pages / COMPARISONS.HARRY_POTTER_SERIES_PAGES);
    return `You read the entire Harry Potter series ${times} times!`;
  } else if (pages >= COMPARISONS.LORD_OF_RINGS_PAGES * 3) {
    const times = Math.floor(pages / COMPARISONS.LORD_OF_RINGS_PAGES);
    return `That's the Lord of the Rings trilogy ${times} times over!`;
  } else if (pages >= COMPARISONS.WAR_AND_PEACE_PAGES) {
    const times = (pages / COMPARISONS.WAR_AND_PEACE_PAGES).toFixed(1);
    return `You conquered ${times}x War and Peace worth of pages!`;
  }
  return `${pages.toLocaleString()} pages of adventure!`;
}

export function formatReadingTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function getReadingTimeDescription(seconds: number): string {
  const hours = seconds / 3600;

  if (hours >= 168) {
    return `That's a full week of non-stop reading!`;
  } else if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `You spent ${days} full days lost in books!`;
  } else if (hours >= 10) {
    return `A solid reading marathon!`;
  }
  return `Every page counts!`;
}
