import { Book, PageStatData } from "@/types";
import type { SqlJsStatic } from "sql.js";

// Dynamic import for sql.js - only loads in browser
let sqlPromise: Promise<SqlJsStatic> | null = null;

async function getSql(): Promise<SqlJsStatic> {
  if (typeof window === "undefined") {
    throw new Error("sql.js can only run in the browser");
  }

  if (!sqlPromise) {
    sqlPromise = import("sql.js").then(async (initSqlJs) => {
      const SQL = await initSqlJs.default({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
      });
      return SQL;
    });
  }

  return sqlPromise;
}

export async function parseKoReaderDb(
  fileBuffer: ArrayBuffer
): Promise<{ books: Book[]; pageStats: PageStatData[] }> {
  const SQL = await getSql();
  const db = new SQL.Database(new Uint8Array(fileBuffer));

  try {
    // Extract books
    const booksResult = db.exec(`
      SELECT
        id, title, authors, notes, last_open, highlights,
        pages, series, language, md5, total_read_time, total_read_pages
      FROM book
    `);

    const books: Book[] = [];
    if (booksResult.length > 0) {
      const columns = booksResult[0].columns;
      for (const row of booksResult[0].values) {
        const book: Record<string, unknown> = {};
        columns.forEach((col, idx) => {
          book[col] = row[idx];
        });
        books.push(book as unknown as Book);
      }
    }

    // Extract page statistics
    const pageStatsResult = db.exec(`
      SELECT id_book, page, start_time, duration, total_pages
      FROM page_stat_data
    `);

    const pageStats: PageStatData[] = [];
    if (pageStatsResult.length > 0) {
      const columns = pageStatsResult[0].columns;
      for (const row of pageStatsResult[0].values) {
        const stat: Record<string, unknown> = {};
        columns.forEach((col, idx) => {
          stat[col] = row[idx];
        });
        pageStats.push(stat as unknown as PageStatData);
      }
    }

    return { books, pageStats };
  } finally {
    db.close();
  }
}
