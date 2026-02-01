import { computeStatistics } from '../stats-engine';
import { Book, PageStatData } from '@/types';
import { COMPARISONS } from '../comparisons';

// Fixtures
const mockBooks: Book[] = [
  {
    id: 1,
    title: "Book 1",
    authors: "Author A",
    notes: 0,
    last_open: 1600000000,
    highlights: 10,
    pages: 300,
    series: "Series 1",
    language: "en",
    md5: "hash1",
    total_read_time: 3600 * 5, // 5 hours
    total_read_pages: 300,
  },
  {
    id: 2,
    title: "Book 2",
    authors: "Author B",
    notes: 5,
    last_open: 1600100000,
    highlights: 20,
    pages: 500,
    series: "",
    language: "en",
    md5: "hash2",
    total_read_time: 3600 * 10, // 10 hours
    total_read_pages: 250, // 50%
  },
  {
    id: 3,
    title: "Book 3",
    authors: "Author A",
    notes: 2,
    last_open: 1600200000,
    highlights: 5,
    pages: 200,
    series: "Series 1",
    language: "fr",
    md5: "hash3",
    total_read_time: 3600 * 2, // 2 hours
    total_read_pages: 10, // 5%
  },
];

const mockPageStats: PageStatData[] = [
  // Book 1 reading sessions (Consecutive days)
  {
    id_book: 1,
    page: 1,
    start_time: 1600000000, // Day 1
    duration: 3600,
    total_pages: 300,
  },
  {
    id_book: 1,
    page: 50,
    start_time: 1600000000 + 86400, // Day 2
    duration: 3600,
    total_pages: 300,
  },
  // Book 2 reading sessions (Gap)
  {
    id_book: 2,
    page: 1,
    start_time: 1600000000 + 86400 * 5, // Day 6
    duration: 3600,
    total_pages: 500,
  },
];

describe('Stats Engine', () => {
  describe('computeStatistics', () => {
    it('should correctly calculate core stats', () => {
      const stats = computeStatistics(mockBooks, mockPageStats);

      // Only books present in pageStats are included
      expect(stats.core.totalBooksStarted).toBe(2);
      expect(stats.core.totalBooksCompleted).toBe(1); // Only Book 1 is > 90%

      // Total pages read calculation considers only filtered books
      // Book 1: 300 pages, Book 2: 250 pages. Book 3 is excluded.
      expect(stats.core.totalPagesRead).toBe(300 + 250);

      // Total reading time
      // Book 1: 5h, Book 2: 10h
      expect(stats.core.totalReadingTimeSeconds).toBe(3600 * 15);

      expect(stats.core.totalHighlights).toBe(30); // 10 + 20
      expect(stats.core.totalNotes).toBe(5); // 0 + 5

      // Averages
      // Unique days: Day 1, Day 2, Day 6 = 3 days
      expect(stats.core.avgPagesPerDay).toBeCloseTo((300 + 250) / 3);

      // Avg time per page
      expect(stats.core.avgTimePerPage).toBeCloseTo((3600 * 15) / (300 + 250));
    });

    it('should calculate streaks correctly', () => {
      const stats = computeStatistics(mockBooks, mockPageStats);

      // Day 1, Day 2 -> Streak 2
      // Day 6 -> Streak 1
      expect(stats.core.longestStreak).toBe(2);

      // Since the dates are in 2020 (based on timestamp), current streak should be 0 unless we mock Date
      expect(stats.core.currentStreak).toBe(0);
    });

    it('should calculate top books', () => {
      const stats = computeStatistics(mockBooks, mockPageStats);

      expect(stats.topBooks).toHaveLength(2);
      expect(stats.topBooks[0].book.id).toBe(2); // 10 hours
      expect(stats.topBooks[1].book.id).toBe(1); // 5 hours
    });

    it('should calculate top authors', () => {
      const stats = computeStatistics(mockBooks, mockPageStats);

      expect(stats.topAuthors).toHaveLength(2);
      expect(stats.topAuthors[0].author).toBe("Author B"); // 10 hours
      expect(stats.topAuthors[1].author).toBe("Author A"); // 5 hours (Book 3 excluded)
    });

    it('should filter by year if provided', () => {
        // All mock data is in 2020 (1600000000 is approx Sept 2020)
        const stats2020 = computeStatistics(mockBooks, mockPageStats, 2020);
        expect(stats2020.core.totalBooksStarted).toBe(2);

        const stats2021 = computeStatistics(mockBooks, mockPageStats, 2021);
        expect(stats2021.core.totalBooksStarted).toBe(0);
    });

    it('should calculate fun stats', () => {
        const stats = computeStatistics(mockBooks, mockPageStats);
        expect(stats.fun).toBeDefined();
        expect(stats.fun.totalCharactersRead).toBeGreaterThan(0);
        expect(stats.fun.achievements).toBeInstanceOf(Array);
    });
  });
});
