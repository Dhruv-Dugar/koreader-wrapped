// Book data from KoReader SQLite
export interface Book {
  id: number;
  title: string;
  authors: string;
  notes: number;
  last_open: number;
  highlights: number;
  pages: number;
  series: string;
  language: string;
  md5: string;
  total_read_time: number;
  total_read_pages: number;
}

// Page statistics from KoReader
export interface PageStatData {
  id_book: number;
  page: number;
  start_time: number;
  duration: number;
  total_pages: number;
}

// Core statistics
export interface CoreStats {
  totalBooksStarted: number;
  totalBooksCompleted: number;
  totalPagesRead: number;
  totalReadingTimeSeconds: number;
  avgPagesPerDay: number;
  avgSessionLengthMinutes: number;
  avgTimePerPage: number;
  longestStreak: number;
  currentStreak: number;
  mostProductiveMonth: string;
  mostProductiveHour: number;
  totalHighlights: number;
  totalNotes: number;
}

// Fun comparisons
export interface FunComparison {
  type: string;
  value: string;
  description: string;
  icon: string;
}

// Fun statistics
export interface FunStats {
  totalCharactersRead: number;
  charactersComparison: FunComparison;
  timeComparison: FunComparison;
  readerPersona: {
    type: 'Night Owl' | 'Early Bird' | 'Weekend Warrior' | 'Consistent Reader' | 'Binge Reader';
    description: string;
    icon: string;
  };
  readingSpeedPercentile?: number;
  achievements: Achievement[];
}

// Achievement
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

// Monthly breakdown
export interface MonthlyBreakdown {
  month: string;
  pagesRead: number;
  hoursRead: number;
  booksCompleted: number;
}

// Hourly breakdown
export interface HourlyBreakdown {
  hour: number;
  totalMinutes: number;
  sessionCount: number;
}

// Top book entry
export interface TopBook {
  book: Book;
  hoursRead: number;
  completionRate: number;
}

// Daily reading data for heatmap
export interface DailyReading {
  date: string; // YYYY-MM-DD
  minutes: number;
  pages: number;
  sessions: number;
}

// Complete processed statistics
export interface ProcessedStats {
  core: CoreStats;
  fun: FunStats;
  topBooks: TopBook[];
  topAuthors: { author: string; books: number; hours: number }[];
  monthlyBreakdown: MonthlyBreakdown[];
  hourlyBreakdown: HourlyBreakdown[];
  dailyReading: DailyReading[];
  rawBooks: Book[];
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  metric: number;
  percentile: number;
}

// User profile
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  lastUploadAt?: Date;
  privacyMode: 'public' | 'anonymous' | 'private';
}
