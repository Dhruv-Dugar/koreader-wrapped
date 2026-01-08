import mongoose, { Document, Schema } from "mongoose";
import { ProcessedStats } from "@/types";

export interface IReadingStats extends ProcessedStats, Document {}

// Sub-schemas for objects with 'type' field to prevent Mongoose ambiguity
const ComparisonSchema = new Schema({
  type: { type: String },
  value: String,
  description: String,
  icon: String,
}, { _id: false });

const PersonaSchema = new Schema({
  type: { type: String },
  description: String,
  icon: String,
}, { _id: false });

const ReadingStatsSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    core: {
      totalBooksStarted: Number,
      totalBooksCompleted: Number,
      totalPagesRead: Number,
      totalReadingTimeSeconds: Number,
      avgPagesPerDay: Number,
      avgSessionLengthMinutes: Number,
      avgTimePerPage: Number,
      longestStreak: Number,
      currentStreak: Number,
      mostProductiveMonth: String,
      mostProductiveHour: Number,
      totalHighlights: Number,
      totalNotes: Number,
    },
    fun: {
      totalCharactersRead: Number,
      charactersComparison: ComparisonSchema,
      timeComparison: ComparisonSchema,
      readerPersona: PersonaSchema,
      achievements: [
        {
          id: String,
          name: String,
          description: String,
          icon: String,
          unlockedAt: Date,
        },
      ],
    },
    topBooks: [
      {
        book: {
          id: Number,
          title: String,
          authors: String,
          notes: Number,
          last_open: Number,
          highlights: Number,
          pages: Number,
          series: String,
          language: String,
          md5: String,
          total_read_time: Number,
          total_read_pages: Number,
        },
        hoursRead: Number,
        completionRate: Number,
      },
    ],
    topAuthors: [
      {
        author: String,
        books: Number,
        hours: Number,
      },
    ],
    monthlyBreakdown: [
      {
        month: String,
        pagesRead: Number,
        hoursRead: Number,
        booksCompleted: Number,
      },
    ],
    hourlyBreakdown: [
      {
        hour: Number,
        totalMinutes: Number,
        sessionCount: Number,
      },
    ],
    dailyReading: [
      {
        date: String,
        minutes: Number,
        pages: Number,
        sessions: Number,
      },
    ],
    rawBooks: [],
    pageStats: [],
  },
  { timestamps: true }
);

export default mongoose.models.ReadingStats ||
  mongoose.model<IReadingStats>("ReadingStats", ReadingStatsSchema);
