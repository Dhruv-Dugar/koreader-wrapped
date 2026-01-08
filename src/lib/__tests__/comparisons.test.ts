import { COMPARISONS, getPageComparison, formatReadingTime, getReadingTimeDescription } from '../comparisons';

describe('Comparisons', () => {
  describe('getPageComparison', () => {
    it('should return Harry Potter comparison', () => {
        const pages = COMPARISONS.HARRY_POTTER_SERIES_PAGES * 5;
        expect(getPageComparison(pages)).toContain('Harry Potter series 5 times');
    });

    it('should return LOTR comparison', () => {
        const pages = COMPARISONS.LORD_OF_RINGS_PAGES * 3;
        expect(getPageComparison(pages)).toContain('Lord of the Rings trilogy 3 times');
    });

    it('should return War and Peace comparison', () => {
        const pages = COMPARISONS.WAR_AND_PEACE_PAGES * 1.5;
        expect(getPageComparison(pages)).toContain('1.5x War and Peace');
    });

    it('should return generic message for small amounts', () => {
        expect(getPageComparison(100)).toContain('100 pages of adventure');
    });
  });

  describe('formatReadingTime', () => {
    it('should format days and hours', () => {
        const seconds = 3600 * 25; // 25 hours
        expect(formatReadingTime(seconds)).toBe('1d 1h');
    });

    it('should format hours and minutes', () => {
        const seconds = 3600 * 2 + 60 * 30; // 2h 30m
        expect(formatReadingTime(seconds)).toBe('2h 30m');
    });

    it('should format minutes', () => {
        const seconds = 60 * 45; // 45m
        expect(formatReadingTime(seconds)).toBe('45m');
    });
  });

  describe('getReadingTimeDescription', () => {
      it('should describe a week of reading', () => {
          expect(getReadingTimeDescription(3600 * 168)).toContain('full week');
      });

      it('should describe full days', () => {
          expect(getReadingTimeDescription(3600 * 48)).toContain('2 full days');
      });

      it('should describe marathon', () => {
          expect(getReadingTimeDescription(3600 * 12)).toContain('marathon');
      });
  });
});
