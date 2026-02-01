/**
 * @jest-environment node
 */
import { POST } from '../route';
import { NextRequest } from 'next/server';
import { parseKoReaderDb } from '@/lib/sqlite-parser';
import { computeStatistics } from '@/lib/stats-engine';
import { getServerSession } from 'next-auth';
import ReadingStats from '@/models/readingStats';

// Mock dependencies
jest.mock('@/lib/sqlite-parser');
jest.mock('@/lib/stats-engine');
jest.mock('@/lib/mongoose', () => jest.fn());
jest.mock('@/models/readingStats');
jest.mock('next-auth');
jest.mock('@/lib/auth', () => ({ authOptions: {} }));

describe('Upload API', () => {
  const mockBooks = [{ id: 1, title: 'Book 1' }];
  const mockPageStats = [{ id_book: 1, page: 1 }];
  const mockProcessedStats = {
    core: { totalBooksStarted: 1 },
    fun: {},
    topBooks: [],
    topAuthors: [],
    monthlyBreakdown: [],
    hourlyBreakdown: [],
    dailyReading: [],
    rawBooks: mockBooks
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (parseKoReaderDb as jest.Mock).mockResolvedValue({ books: mockBooks, pageStats: mockPageStats });
    (computeStatistics as jest.Mock).mockReturnValue(mockProcessedStats);
    (ReadingStats as unknown as jest.Mock).mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ _id: '123' }),
      _id: '123'
    }));
  });

  it('should return 401 if not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const formData = new FormData();
    formData.append('file', new Blob(['dummy']), 'test.sqlite3');

    const req = new NextRequest('http://localhost/api/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  it('should return 400 if no file uploaded', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user1' } });

    const formData = new FormData();
    // No file appended

    const req = new NextRequest('http://localhost/api/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("No file uploaded");
  });

  it('should process file and save stats', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user1' } });

    const formData = new FormData();
    formData.append('file', new Blob(['dummy']), 'test.sqlite3');

    const req = new NextRequest('http://localhost/api/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(parseKoReaderDb).toHaveBeenCalled();
    expect(computeStatistics).toHaveBeenCalled();
    expect(ReadingStats).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user1',
      core: expect.any(Object)
    }));

    const json = await res.json();
    expect(json.id).toBe('123');
    expect(json.core).toBeDefined();
  });

  it('should handle empty books result', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user1' } });
    (parseKoReaderDb as jest.Mock).mockResolvedValue({ books: [], pageStats: [] });

    const formData = new FormData();
    formData.append('file', new Blob(['dummy']), 'test.sqlite3');

    const req = new NextRequest('http://localhost/api/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("No reading data found in this file");
  });
});
