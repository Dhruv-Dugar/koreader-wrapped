import {
  Book,
  PageStatData,
  CoreStats,
  FunStats,
  ProcessedStats,
  MonthlyBreakdown,
  HourlyBreakdown,
  TopBook,
  Achievement,
} from "@/types";
import { COMPARISONS, ACHIEVEMENTS } from "./comparisons";

export function computeStatistics(
  books: Book[],
  pageStats: PageStatData[]
): ProcessedStats {
  const core = computeCoreStats(books, pageStats);
  const fun = computeFunStats(books, pageStats, core);
  const topBooks = computeTopBooks(books);
  const topAuthors = computeTopAuthors(books);
  const monthlyBreakdown = computeMonthlyBreakdown(pageStats);
  const hourlyBreakdown = computeHourlyBreakdown(pageStats);

  return {
    core,
    fun,
    topBooks,
    topAuthors,
    monthlyBreakdown,
    hourlyBreakdown,
    rawBooks: books,
  };
}

function computeCoreStats(books: Book[], pageStats: PageStatData[]): CoreStats {
  const totalBooksStarted = books.length;
  const totalBooksCompleted = books.filter((b) => {
    if (b.pages === 0) return false;
    return b.total_read_pages / b.pages >= 0.9;
  }).length;

  const totalPagesRead = books.reduce((sum, b) => sum + b.total_read_pages, 0);
  const totalReadingTimeSeconds = books.reduce(
    (sum, b) => sum + b.total_read_time,
    0
  );
  const totalHighlights = books.reduce((sum, b) => sum + b.highlights, 0);
  const totalNotes = books.reduce((sum, b) => sum + b.notes, 0);

  // Calculate streaks
  const { longestStreak, currentStreak } = computeStreaks(pageStats);

  // Calculate most productive month
  const monthlyData = computeMonthlyBreakdown(pageStats);
  const mostProductiveMonth =
    monthlyData.sort((a, b) => b.pagesRead - a.pagesRead)[0]?.month || "N/A";

  // Calculate most productive hour
  const hourlyData = computeHourlyBreakdown(pageStats);
  const mostProductiveHour =
    hourlyData.sort((a, b) => b.totalMinutes - a.totalMinutes)[0]?.hour || 0;

  // Calculate averages
  const uniqueDays = new Set(
    pageStats.map((p) => new Date(p.start_time * 1000).toDateString())
  ).size;
  const avgPagesPerDay = uniqueDays > 0 ? totalPagesRead / uniqueDays : 0;

  const sessions = groupIntoSessions(pageStats);
  const avgSessionLengthMinutes =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length / 60
      : 0;

  const avgTimePerPage =
    totalPagesRead > 0 ? totalReadingTimeSeconds / totalPagesRead : 0;

  return {
    totalBooksStarted,
    totalBooksCompleted,
    totalPagesRead,
    totalReadingTimeSeconds,
    avgPagesPerDay,
    avgSessionLengthMinutes,
    avgTimePerPage,
    longestStreak,
    currentStreak,
    mostProductiveMonth,
    mostProductiveHour,
    totalHighlights,
    totalNotes,
  };
}

function computeStreaks(pageStats: PageStatData[]): {
  longestStreak: number;
  currentStreak: number;
} {
  if (pageStats.length === 0) {
    return { longestStreak: 0, currentStreak: 0 };
  }

  // Get unique reading dates
  const dates = [
    ...new Set(
      pageStats.map((p) => {
        const d = new Date(p.start_time * 1000);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    ),
  ].sort();

  if (dates.length === 0) {
    return { longestStreak: 0, currentStreak: 0 };
  }

  let longestStreak = 1;
  let currentStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const [y1, m1, d1] = dates[i - 1].split("-").map(Number);
    const [y2, m2, d2] = dates[i].split("-").map(Number);

    const date1 = new Date(y1, m1, d1);
    const date2 = new Date(y2, m2, d2);
    const diffDays = Math.floor(
      (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  // Check if current streak is active (last reading was today or yesterday)
  const lastDate = dates[dates.length - 1];
  const [y, m, d] = lastDate.split("-").map(Number);
  const lastReadDate = new Date(y, m, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysSinceLastRead = Math.floor(
    (today.getTime() - lastReadDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  currentStreak = daysSinceLastRead <= 1 ? tempStreak : 0;

  return { longestStreak, currentStreak };
}

function computeFunStats(
  books: Book[],
  pageStats: PageStatData[],
  core: CoreStats
): FunStats {
  // Estimate characters (avg 1500 chars per page)
  const totalCharactersRead = core.totalPagesRead * 1500;

  // Determine character comparison
  const charactersComparison = getCharacterComparison(totalCharactersRead);

  // Time comparison
  const timeComparison = getTimeComparison(core.totalReadingTimeSeconds);

  // Reader persona based on reading patterns
  const readerPersona = determineReaderPersona(pageStats, core);

  // Calculate achievements
  const achievements = calculateAchievements(books, pageStats, core);

  return {
    totalCharactersRead,
    charactersComparison,
    timeComparison,
    readerPersona,
    achievements,
  };
}

function getCharacterComparison(chars: number) {
  if (chars >= COMPARISONS.MOON_DISTANCE_CHARS) {
    return {
      type: "moon_distance",
      value: (chars / COMPARISONS.MOON_DISTANCE_CHARS).toFixed(2),
      description: "Your characters could reach the Moon!",
      icon: "🌙",
    };
  } else if (chars >= COMPARISONS.GREAT_WALL_CHARS) {
    return {
      type: "great_wall",
      value: (chars / COMPARISONS.GREAT_WALL_CHARS).toFixed(1),
      description: "You could spell out the Great Wall of China!",
      icon: "🏯",
    };
  } else if (chars >= COMPARISONS.EVEREST_HEIGHT_CHARS) {
    const times = (chars / COMPARISONS.EVEREST_HEIGHT_CHARS).toFixed(1);
    return {
      type: "everest_height",
      value: times,
      description: `Stacked, your letters would reach ${times}x the height of Mount Everest!`,
      icon: "🏔️",
    };
  }
  return {
    type: "eiffel_tower",
    value: (chars / 1_650_000).toFixed(1),
    description: "Your characters could climb the Eiffel Tower!",
    icon: "🗼",
  };
}

function getTimeComparison(seconds: number) {
  const hours = seconds / 3600;
  const movies = hours / 2;

  if (hours >= 500) {
    return {
      type: "around_world",
      value: Math.floor(hours / 40).toString(),
      description: `You could have flown around the world ${Math.floor(hours / 40)} times!`,
      icon: "✈️",
    };
  } else if (hours >= 100) {
    return {
      type: "movies",
      value: Math.floor(movies).toString(),
      description: `That's ${Math.floor(movies)} movies worth of reading!`,
      icon: "🎬",
    };
  }
  return {
    type: "marathons",
    value: (hours / 4).toFixed(1),
    description: `You could have run ${(hours / 4).toFixed(1)} marathons!`,
    icon: "🏃",
  };
}

function determineReaderPersona(
  pageStats: PageStatData[],
  core: CoreStats
): FunStats["readerPersona"] {
  const hourlyData = computeHourlyBreakdown(pageStats);

  // Calculate night vs day reading
  const nightHours = hourlyData
    .filter((h) => h.hour >= 22 || h.hour < 6)
    .reduce((sum, h) => sum + h.totalMinutes, 0);
  const morningHours = hourlyData
    .filter((h) => h.hour >= 5 && h.hour < 10)
    .reduce((sum, h) => sum + h.totalMinutes, 0);

  // Calculate weekend vs weekday
  const weekendSessions = pageStats.filter((p) => {
    const day = new Date(p.start_time * 1000).getDay();
    return day === 0 || day === 6;
  }).length;
  const weekendRatio = weekendSessions / (pageStats.length || 1);

  if (nightHours > morningHours * 2) {
    return {
      type: "Night Owl",
      description: "You prefer reading under the stars",
      icon: "🦉",
    };
  } else if (morningHours > nightHours * 2) {
    return {
      type: "Early Bird",
      description: "You catch words with the worm",
      icon: "🐦",
    };
  } else if (weekendRatio > 0.6) {
    return {
      type: "Weekend Warrior",
      description: "Weekends are for reading marathons",
      icon: "⚔️",
    };
  } else if (core.longestStreak >= 14) {
    return {
      type: "Consistent Reader",
      description: "Steady and reliable, page after page",
      icon: "📚",
    };
  }
  return {
    type: "Binge Reader",
    description: "When you read, you REALLY read",
    icon: "🔥",
  };
}

function calculateAchievements(
  books: Book[],
  pageStats: PageStatData[],
  core: CoreStats
): Achievement[] {
  const unlocked: Achievement[] = [];

  // Check each achievement
  if (core.totalBooksCompleted >= 1) {
    unlocked.push({ ...ACHIEVEMENTS.first_book, unlockedAt: new Date() });
  }
  if (core.totalBooksCompleted >= 10) {
    unlocked.push({ ...ACHIEVEMENTS.bookworm, unlockedAt: new Date() });
  }
  if (core.totalBooksCompleted >= 50) {
    unlocked.push({ ...ACHIEVEMENTS.bibliophile, unlockedAt: new Date() });
  }
  if (core.longestStreak >= 7) {
    unlocked.push({ ...ACHIEVEMENTS.week_streak, unlockedAt: new Date() });
  }
  if (core.longestStreak >= 30) {
    unlocked.push({ ...ACHIEVEMENTS.month_streak, unlockedAt: new Date() });
  }
  if (core.totalHighlights >= 100) {
    unlocked.push({ ...ACHIEVEMENTS.highlighter, unlockedAt: new Date() });
  }
  if (core.totalNotes >= 50) {
    unlocked.push({ ...ACHIEVEMENTS.note_taker, unlockedAt: new Date() });
  }

  // Polyglot check
  const languages = new Set(books.map((b) => b.language).filter(Boolean));
  if (languages.size >= 3) {
    unlocked.push({ ...ACHIEVEMENTS.polyglot, unlockedAt: new Date() });
  }

  return unlocked;
}

function computeTopBooks(books: Book[]): TopBook[] {
  return books
    .filter((b) => b.total_read_time > 0)
    .sort((a, b) => b.total_read_time - a.total_read_time)
    .slice(0, 10)
    .map((book) => ({
      book,
      hoursRead: book.total_read_time / 3600,
      completionRate: book.pages > 0 ? (book.total_read_pages / book.pages) * 100 : 0,
    }));
}

function computeTopAuthors(
  books: Book[]
): { author: string; books: number; hours: number }[] {
  const authorMap = new Map<string, { books: number; seconds: number }>();

  for (const book of books) {
    if (!book.authors || book.authors === "N/A") continue;

    const existing = authorMap.get(book.authors) || { books: 0, seconds: 0 };
    authorMap.set(book.authors, {
      books: existing.books + 1,
      seconds: existing.seconds + book.total_read_time,
    });
  }

  return Array.from(authorMap.entries())
    .map(([author, data]) => ({
      author,
      books: data.books,
      hours: data.seconds / 3600,
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 10);
}

function computeMonthlyBreakdown(pageStats: PageStatData[]): MonthlyBreakdown[] {
  const monthMap = new Map<
    string,
    { pages: Set<string>; seconds: number; books: Set<number> }
  >();

  for (const stat of pageStats) {
    const date = new Date(stat.start_time * 1000);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    const existing = monthMap.get(month) || {
      pages: new Set(),
      seconds: 0,
      books: new Set(),
    };
    existing.pages.add(`${stat.id_book}-${stat.page}`);
    existing.seconds += stat.duration;
    existing.books.add(stat.id_book);
    monthMap.set(month, existing);
  }

  return Array.from(monthMap.entries())
    .map(([month, data]) => ({
      month,
      pagesRead: data.pages.size,
      hoursRead: data.seconds / 3600,
      booksCompleted: 0, // Would need completion tracking
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function computeHourlyBreakdown(pageStats: PageStatData[]): HourlyBreakdown[] {
  const hourMap = new Map<number, { minutes: number; count: number }>();

  for (const stat of pageStats) {
    const hour = new Date(stat.start_time * 1000).getHours();
    const existing = hourMap.get(hour) || { minutes: 0, count: 0 };
    hourMap.set(hour, {
      minutes: existing.minutes + stat.duration / 60,
      count: existing.count + 1,
    });
  }

  return Array.from(hourMap.entries())
    .map(([hour, data]) => ({
      hour,
      totalMinutes: data.minutes,
      sessionCount: data.count,
    }))
    .sort((a, b) => a.hour - b.hour);
}

function groupIntoSessions(
  pageStats: PageStatData[]
): { start: number; duration: number }[] {
  if (pageStats.length === 0) return [];

  const sorted = [...pageStats].sort((a, b) => a.start_time - b.start_time);
  const sessions: { start: number; duration: number }[] = [];

  let sessionStart = sorted[0].start_time;
  let sessionDuration = sorted[0].duration;

  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].start_time - (sorted[i - 1].start_time + sorted[i - 1].duration);

    // If gap > 30 minutes, start new session
    if (gap > 1800) {
      sessions.push({ start: sessionStart, duration: sessionDuration });
      sessionStart = sorted[i].start_time;
      sessionDuration = sorted[i].duration;
    } else {
      sessionDuration += sorted[i].duration + gap;
    }
  }

  sessions.push({ start: sessionStart, duration: sessionDuration });
  return sessions;
}
