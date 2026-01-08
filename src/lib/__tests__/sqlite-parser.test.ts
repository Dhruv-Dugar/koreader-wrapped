import { parseKoReaderDb } from '../sqlite-parser';
import fs from 'fs';
import path from 'path';

// Shared mock implementation
const mockSqlExec = jest.fn((query) => {
    if (query.includes('FROM book')) {
        return [{
            columns: ['id', 'title', 'authors', 'notes', 'last_open', 'highlights', 'pages', 'series', 'language', 'md5', 'total_read_time', 'total_read_pages'],
            values: [
                [1, 'Test Book', 'Test Author', 0, 1234567890, 0, 100, 'Test Series', 'en', 'hash', 3600, 100]
            ]
        }];
    }
    if (query.includes('FROM page_stat_data') || query.includes('FROM page_stat')) {
            return [{
            columns: ['id_book', 'page', 'start_time', 'duration', 'total_pages'],
            values: [
                [1, 1, 1234567890, 60, 100]
            ]
        }];
    }
    if (query.includes("sqlite_master WHERE type='table'")) {
        return [{
            values: [['book'], ['page_stat_data']]
        }];
    }
    if (query.includes("PRAGMA table_info")) {
        return [{
            values: [['0', 'id_book'], ['1', 'page'], ['2', 'start_time'], ['3', 'duration'], ['4', 'total_pages']]
        }];
    }
    return [];
});

const mockSqlDatabase = jest.fn().mockImplementation(() => ({
    exec: mockSqlExec,
    close: jest.fn(),
}));

// Mock sql.js
jest.mock('sql.js', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => {
            return Promise.resolve({
                Database: mockSqlDatabase
            });
        }),
    };
});

// Mock fs/promises
jest.mock('fs/promises', () => ({
    readFile: jest.fn().mockResolvedValue({
        buffer: new ArrayBuffer(0),
        byteOffset: 0,
        byteLength: 0
    })
}));

jest.mock('path', () => ({
    join: jest.fn().mockReturnValue('mock/path'),
    resolve: jest.fn().mockReturnValue('mock/path')
}));

// Mock module for createRequire
jest.mock('module', () => ({
    createRequire: jest.fn().mockReturnValue((id: string) => {
        if (id === 'sql.js') {
             // Return the same mock structure that returns data
             return jest.fn().mockImplementation(() => Promise.resolve({
                Database: mockSqlDatabase
             }));
        }
        return {};
    })
}));


describe('SQLite Parser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should parse books and page stats', async () => {
        const buffer = new ArrayBuffer(10);
        const result = await parseKoReaderDb(buffer);

        expect(result.books).toHaveLength(1);
        expect(result.books[0].title).toBe('Test Book');

        expect(result.pageStats).toHaveLength(1);
        expect(result.pageStats[0].id_book).toBe(1);
    });
});
