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
    // Get list of tables to handle different KOReader database versions
    const tablesResult = db.exec(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    const tableNames = tablesResult.length > 0
      ? tablesResult[0].values.map((row) => row[0] as string)
      : [];

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

    // Extract page statistics - try different table names
    const pageStats: PageStatData[] = [];
    const pageStatTableNames = ["page_stat_data", "page_stat", "pagestat"];
    const existingPageStatTable = pageStatTableNames.find((name) =>
      tableNames.includes(name)
    );

    if (existingPageStatTable) {
      // Check which columns exist
      const columnsResult = db.exec(
        `PRAGMA table_info(${existingPageStatTable})`
      );
      const columnNames = columnsResult.length > 0
        ? columnsResult[0].values.map((row) => row[1] as string)
        : [];

      // Build query based on available columns
      const hasIdBook = columnNames.includes("id_book");
      const hasBookId = columnNames.includes("book_id");
      const hasTotalPages = columnNames.includes("total_pages");

      const idBookCol = hasIdBook ? "id_book" : hasBookId ? "book_id" : "id_book";
      const selectCols = [
        `${idBookCol} as id_book`,
        "page",
        "start_time",
        "duration",
        hasTotalPages ? "total_pages" : "0 as total_pages",
      ].join(", ");

      const pageStatsResult = db.exec(
        `SELECT ${selectCols} FROM ${existingPageStatTable}`
      );

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
    }

    console.log(`Parsed ${books.length} books and ${pageStats.length} page stats`);

    return { books, pageStats };
  } finally {
    db.close();
  }
}
