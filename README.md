# KoReader Wrapped - Architecture Document

## 1. Project Overview

**KoReader Wrapped** is a web application that provides Spotify Wrapped-style annual/periodic reading insights for KoReader users. Users upload their `statistics.sqlite3` file from KoReader, and the application generates engaging, shareable statistics about their reading habits.

### Core Value Proposition
- Transform raw reading data into engaging, shareable insights
- Provide fun comparisons (e.g., "You read 2 million characters - that's the height of Mount Everest stacked in letters!")
- Enable community features like leaderboards and percentile rankings
- Year-over-year reading progress tracking

---

## 2. Data Source Analysis

### KoReader SQLite Schema

```sql
-- Books metadata
CREATE TABLE book (
    id integer PRIMARY KEY autoincrement,
    title text,
    authors text,
    notes integer,
    last_open integer,          -- Unix timestamp
    highlights integer,
    pages integer,              -- Total pages in book
    series text,
    language text,
    md5 text,                   -- File hash for deduplication
    total_read_time integer,    -- Seconds spent reading
    total_read_pages integer    -- Pages actually read
);

-- Granular reading session data
CREATE TABLE page_stat_data (
    id_book integer,
    page integer,
    start_time integer,         -- Unix timestamp
    duration integer,           -- Seconds spent on this page
    total_pages integer,
    FOREIGN KEY(id_book) REFERENCES book(id)
);
```

### Available Data Points
| Field | Use Case |
|-------|----------|
| `start_time` | Reading time patterns (hour/day/month), streaks |
| `duration` | Reading speed, total time, session lengths |
| `pages` | Pages read, completion rates |
| `authors` | Favorite authors analysis |
| `series` | Series completion tracking |
| `language` | Multilingual reading stats |
| `highlights/notes` | Engagement metrics |

---

## 3. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                            │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Upload    │  │  Statistics │  │ Leaderboard │  │   Share     │    │
│  │   Page      │  │  Dashboard  │  │    View     │  │   Cards     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                 │
│                         (Next.js API Routes / FastAPI)                   │
├─────────────────────────────────────────────────────────────────────────┤
│  /api/auth/*     /api/upload    /api/stats    /api/leaderboard         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │    Auth     │ │  SQLite     │ │  Stats      │
            │   Service   │ │  Parser     │ │  Engine     │
            └─────────────┘ └─────────────┘ └─────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                    ┌─────────────────────────────────┐
                    │         PostgreSQL DB           │
                    │  (Users, Stats, Leaderboards)   │
                    └─────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │   Object    │ │    Redis    │ │   Queue     │
            │   Storage   │ │   Cache     │ │  (Optional) │
            │ (SQLite files)│ │(Leaderboard)│ │             │
            └─────────────┘ └─────────────┘ └─────────────┘
```

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 14+ (App Router) | SSR for SEO, React ecosystem, API routes |
| **Styling** | Tailwind CSS + Framer Motion | Rapid development, smooth animations for "wrapped" experience |
| **Backend** | Next.js API Routes or Python FastAPI | SQLite parsing, complex statistics |
| **Database** | PostgreSQL (Supabase/Neon) | User data, processed statistics, leaderboards |
| **Auth** | NextAuth.js or Supabase Auth | OAuth (Google, GitHub), magic links |
| **Storage** | S3/R2/Supabase Storage | Store uploaded SQLite files |
| **Cache** | Redis (Upstash) | Leaderboard caching, rate limiting |
| **Hosting** | Vercel / Railway | Easy deployment, serverless functions |

---

## 4. Core Modules

### 4.1 Authentication Module

```typescript
// User model
interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  lastUploadAt?: Date;
}
```

**Features:**
- OAuth login (Google, GitHub, Apple)
- Email magic link option
- Session management with JWT
- Account deletion with data purge

### 4.2 Upload & Processing Module

```typescript
// Upload flow
interface UploadPipeline {
  1. validateFile(file: File): ValidationResult;
  2. parseDatabase(sqlite: Buffer): RawReadingData;
  3. computeStatistics(data: RawReadingData): ProcessedStats;
  4. storeResults(userId: string, stats: ProcessedStats): void;
  5. updateLeaderboards(userId: string, stats: ProcessedStats): void;
}
```

**Processing Steps:**
1. **Validation**: Check file size (<50MB), verify SQLite format, validate schema
2. **Parsing**: Extract book and page_stat_data tables
3. **Deduplication**: Use MD5 hash to identify same books across uploads
4. **Statistics Computation**: Run all statistical queries
5. **Storage**: Save processed stats to PostgreSQL, raw file to object storage
6. **Leaderboard Update**: Update global rankings asynchronously

### 4.3 Statistics Engine

#### Core Statistics

```typescript
interface CoreStats {
  // Volume metrics
  totalBooksStarted: number;
  totalBooksCompleted: number;      // >90% pages read
  totalPagesRead: number;
  totalReadingTimeSeconds: number;

  // Averages
  avgPagesPerDay: number;
  avgSessionLengthMinutes: number;
  avgTimePerPage: number;

  // Extremes
  longestBook: Book;
  shortestBook: Book;
  fastestRead: Book;                // pages/hour
  mostReread: Book;

  // Temporal
  longestStreak: number;            // consecutive days
  currentStreak: number;
  mostProductiveMonth: string;
  mostProductiveHour: number;       // 0-23

  // Engagement
  totalHighlights: number;
  totalNotes: number;
  mostHighlightedBook: Book;
}
```

#### Fun/Creative Statistics

```typescript
interface FunStats {
  // Character comparisons (avg 1,500 chars/page)
  totalCharactersRead: number;
  charactersComparison: {
    type: 'moon_distance' | 'everest_height' | 'great_wall' | 'dna_strand';
    value: string;
    description: string;
  };

  // Time comparisons
  timeComparison: {
    type: 'movies_watched' | 'flights' | 'marathons';
    value: number;
    description: string;
  };

  // Reading persona
  readerPersona: {
    type: 'Night Owl' | 'Early Bird' | 'Weekend Warrior' | 'Consistent Reader';
    description: string;
    icon: string;
  };

  // Quirky stats
  mostObscureBook: Book;            // least read by others
  genreMoodBoard: GenreBreakdown[];
  readingSpeedPercentile: number;   // vs other users

  // Achievements
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}
```

#### Fun Comparison Constants

```typescript
const COMPARISONS = {
  // Distance (characters laid end-to-end, avg char width 2mm)
  MOON_DISTANCE_CHARS: 192_000_000_000,      // 384,400 km
  EVEREST_HEIGHT_CHARS: 4_400_000,           // 8,849 m
  GREAT_WALL_CHARS: 10_700_000_000,          // 21,196 km

  // Time
  AVG_MOVIE_MINUTES: 120,
  NYC_LONDON_FLIGHT_MINUTES: 420,
  MARATHON_MINUTES: 240,

  // Pages
  HARRY_POTTER_SERIES_PAGES: 4_224,
  LORD_OF_RINGS_PAGES: 1_178,
  WAR_AND_PEACE_PAGES: 1_225,
};
```

### 4.4 Leaderboard System

```typescript
interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  metric: number;
  percentile: number;
}

interface LeaderboardCategories {
  pagesRead: LeaderboardEntry[];
  booksCompleted: LeaderboardEntry[];
  readingTime: LeaderboardEntry[];
  longestStreak: LeaderboardEntry[];
  readingSpeed: LeaderboardEntry[];    // pages/hour
}
```

**Percentile Calculation:**
```sql
SELECT
  user_id,
  total_pages,
  PERCENT_RANK() OVER (ORDER BY total_pages) * 100 as percentile
FROM user_statistics
WHERE year = 2024;
```

**Privacy Controls:**
- Opt-in to public leaderboards
- Anonymous mode (show stats but hide identity)
- Private mode (excluded from all rankings)

---

## 5. Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    privacy_mode VARCHAR(20) DEFAULT 'anonymous', -- 'public', 'anonymous', 'private'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Uploads history
CREATE TABLE uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,              -- S3/R2 path
    file_hash VARCHAR(64),                -- SHA256 of file
    uploaded_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'  -- 'pending', 'processing', 'completed', 'failed'
);

-- Processed statistics (denormalized for fast reads)
CREATE TABLE user_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    upload_id UUID REFERENCES uploads(id),
    year INTEGER NOT NULL,

    -- Core metrics
    total_books_started INTEGER,
    total_books_completed INTEGER,
    total_pages_read INTEGER,
    total_reading_time_seconds BIGINT,
    total_highlights INTEGER,
    total_notes INTEGER,

    -- Streaks
    longest_streak INTEGER,
    current_streak INTEGER,

    -- Computed at processing time
    avg_pages_per_day DECIMAL(10,2),
    avg_session_minutes DECIMAL(10,2),

    -- JSON blobs for complex data
    top_books JSONB,                     -- Array of top 10 books
    top_authors JSONB,                   -- Array of top authors
    monthly_breakdown JSONB,             -- Pages/time per month
    hourly_breakdown JSONB,              -- Reading by hour of day
    fun_stats JSONB,                     -- All fun comparisons
    achievements JSONB,                  -- Unlocked achievements

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, year)
);

-- Books catalog (for cross-user analytics)
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    authors TEXT,
    md5_hash VARCHAR(32),
    pages INTEGER,
    language VARCHAR(10),
    readers_count INTEGER DEFAULT 0,     -- How many users read this
    avg_completion_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(title, authors, md5_hash)
);

-- User-book relationship
CREATE TABLE user_books (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id),
    pages_read INTEGER,
    reading_time_seconds INTEGER,
    completion_rate DECIMAL(5,2),
    first_read_at TIMESTAMP,
    last_read_at TIMESTAMP,

    PRIMARY KEY(user_id, book_id)
);

-- Leaderboard cache (refreshed periodically)
CREATE TABLE leaderboard_cache (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50),               -- 'pages_read', 'books_completed', etc.
    year INTEGER,
    rankings JSONB,                     -- Top 100 + percentile breakpoints
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_stats_year ON user_statistics(year);
CREATE INDEX idx_user_stats_pages ON user_statistics(total_pages_read);
CREATE INDEX idx_books_readers ON books(readers_count DESC);
```

---

## 6. API Endpoints

### Authentication
```
POST   /api/auth/login          - OAuth/Magic link login
POST   /api/auth/logout         - End session
GET    /api/auth/session        - Get current session
DELETE /api/auth/account        - Delete account and all data
```

### Upload & Processing
```
POST   /api/upload              - Upload SQLite file
GET    /api/upload/status/:id   - Check processing status
GET    /api/uploads             - List user's upload history
DELETE /api/uploads/:id         - Delete an upload
```

### Statistics
```
GET    /api/stats               - Get current user's statistics
GET    /api/stats/:year         - Get statistics for specific year
GET    /api/stats/compare       - Compare years (YoY growth)
GET    /api/stats/share/:id     - Get shareable stats (public)
```

### Leaderboards
```
GET    /api/leaderboard/:category         - Get leaderboard (paginated)
GET    /api/leaderboard/me/:category      - Get user's rank & percentile
GET    /api/leaderboard/friends           - Friends leaderboard (future)
```

### Social (Future)
```
POST   /api/share/generate      - Generate share card image
GET    /api/users/:id/public    - View public profile
POST   /api/friends/add         - Add friend
```

---

## 7. Frontend Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Auth page
│   ├── upload/page.tsx             # Upload interface
│   ├── wrapped/
│   │   ├── page.tsx                # Main wrapped experience
│   │   ├── [year]/page.tsx         # Year-specific wrapped
│   │   └── share/[id]/page.tsx     # Public share page
│   ├── leaderboard/page.tsx        # Leaderboards
│   ├── profile/page.tsx            # User settings
│   └── api/                        # API routes
├── components/
│   ├── upload/
│   │   ├── DropZone.tsx
│   │   └── ProcessingStatus.tsx
│   ├── stats/
│   │   ├── StatCard.tsx
│   │   ├── BookList.tsx
│   │   ├── ReadingChart.tsx
│   │   ├── StreakCalendar.tsx
│   │   └── FunComparison.tsx
│   ├── wrapped/
│   │   ├── WrappedSlide.tsx        # Individual slide
│   │   ├── WrappedCarousel.tsx     # Slide navigation
│   │   └── ShareCard.tsx           # Exportable image
│   └── leaderboard/
│       ├── RankingTable.tsx
│       └── PercentileBadge.tsx
├── lib/
│   ├── sqlite-parser.ts            # SQLite processing
│   ├── stats-engine.ts             # Statistics computation
│   ├── comparisons.ts              # Fun comparison generator
│   └── achievements.ts             # Achievement logic
└── hooks/
    ├── useUpload.ts
    ├── useStats.ts
    └── useLeaderboard.ts
```

### Wrapped Experience Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Slide 1   │────▶│   Slide 2   │────▶│   Slide 3   │
│  "Your Year │     │ "You read   │     │ "That's     │
│  in Books"  │     │  47 books"  │     │  more than  │
│  (Intro)    │     │             │     │  95% of..." │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Slide 4   │────▶│   Slide 5   │────▶│   Slide 6   │
│ "Your top   │     │ "You're a   │     │  Share &    │
│  authors"   │     │  Night Owl" │     │  Download   │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 8. Security Considerations

### Data Privacy
- SQLite files are encrypted at rest (S3/R2 server-side encryption)
- Files are deleted after processing if user opts out of storage
- User data is isolated with row-level security in PostgreSQL
- GDPR-compliant data export and deletion

### File Upload Security
- Strict file type validation (SQLite magic bytes)
- File size limits (50MB max)
- Malicious SQL injection prevention (parameterized queries only)
- Rate limiting on uploads (5 per day per user)

### Authentication
- Secure session tokens (HTTP-only cookies)
- CSRF protection
- OAuth state validation

---

## 9. Scalability Considerations

### Current Phase (MVP)
- Serverless functions for processing
- PostgreSQL for all data
- Simple file storage

### Growth Phase
- Background job queue (BullMQ/Inngest) for heavy processing
- Redis caching for leaderboards
- CDN for share card images

### Scale Phase
- Dedicated processing workers
- Read replicas for PostgreSQL
- Materialized views for leaderboard calculations

---

## 10. Recommended Future Features

### Phase 2: Social & Community
| Feature | Description | Priority |
|---------|-------------|----------|
| **Friend System** | Add friends, compare stats | High |
| **Book Clubs** | Create groups, shared reading goals | Medium |
| **Reading Challenges** | Monthly/yearly challenges with badges | High |
| **Book Recommendations** | "Users who read X also read Y" | Medium |

### Phase 3: Enhanced Analytics
| Feature | Description | Priority |
|---------|-------------|----------|
| **Reading Goals** | Set and track annual page/book goals | High |
| **Genre Analysis** | Categorize books, show genre breakdown | Medium |
| **Mood Tracking** | Tag reading sessions with mood | Low |
| **Export to Goodreads** | Sync reading history | Medium |

### Phase 4: Platform Expansion
| Feature | Description | Priority |
|---------|-------------|----------|
| **Multi-device Sync** | Auto-sync from multiple KoReader devices | High |
| **Mobile App** | Native iOS/Android for upload & viewing | Medium |
| **Browser Extension** | Quick stats widget | Low |
| **API for Developers** | Public API for third-party integrations | Low |

### Phase 5: Monetization (Optional)
| Feature | Description | Priority |
|---------|-------------|----------|
| **Premium Tier** | Advanced analytics, unlimited history | Medium |
| **Printable Reports** | Beautiful PDF annual reports | Low |
| **Custom Share Cards** | Premium themes and designs | Low |

---

## 11. Achievements System

```typescript
const ACHIEVEMENTS: Achievement[] = [
  // Reading volume
  { id: 'first_book', name: 'First Steps', description: 'Complete your first book' },
  { id: 'bookworm', name: 'Bookworm', description: 'Read 10 books' },
  { id: 'bibliophile', name: 'Bibliophile', description: 'Read 50 books' },
  { id: 'library', name: 'Walking Library', description: 'Read 100 books' },

  // Streaks
  { id: 'week_streak', name: 'Week Warrior', description: '7-day reading streak' },
  { id: 'month_streak', name: 'Monthly Master', description: '30-day reading streak' },
  { id: 'quarter_streak', name: 'Quarterly Quest', description: '90-day reading streak' },

  // Time-based
  { id: 'night_owl', name: 'Night Owl', description: 'Read 100 hours after midnight' },
  { id: 'early_bird', name: 'Early Bird', description: 'Read 100 hours before 7am' },
  { id: 'marathon', name: 'Marathon Reader', description: '5+ hour reading session' },

  // Engagement
  { id: 'highlighter', name: 'Highlighter Hero', description: '100 highlights' },
  { id: 'note_taker', name: 'Note Taker', description: '50 notes' },

  // Special
  { id: 'polyglot', name: 'Polyglot', description: 'Read books in 3+ languages' },
  { id: 'series_complete', name: 'Series Slayer', description: 'Complete a book series' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Top 10% reading speed' },
  { id: 'consistent', name: 'Consistency King', description: 'Read every month of the year' },
];
```

---

## 12. Development Roadmap

### MVP (4-6 weeks)
- [ ] User authentication (OAuth)
- [ ] File upload and SQLite parsing
- [ ] Core statistics computation
- [ ] Basic wrapped experience (5-6 slides)
- [ ] Simple leaderboard (pages read)
- [ ] Share card generation

### V1.0 (8-10 weeks)
- [ ] Full statistics dashboard
- [ ] Multiple leaderboard categories
- [ ] Percentile rankings
- [ ] Achievement system
- [ ] Year-over-year comparison
- [ ] Privacy controls

### V1.5 (Future)
- [ ] Friend system
- [ ] Reading challenges
- [ ] Enhanced share cards
- [ ] Mobile-responsive wrapped experience

---

## 13. Sample Statistics Queries

```sql
-- Total reading time by month
SELECT
    strftime('%Y-%m', start_time, 'unixepoch') as month,
    SUM(duration) / 3600.0 as hours
FROM page_stat_data
GROUP BY month
ORDER BY month;

-- Reading streaks calculation
WITH daily_reads AS (
    SELECT DISTINCT date(start_time, 'unixepoch') as read_date
    FROM page_stat_data
),
streak_groups AS (
    SELECT
        read_date,
        date(read_date, '-' || ROW_NUMBER() OVER (ORDER BY read_date) || ' days') as streak_group
    FROM daily_reads
)
SELECT
    streak_group,
    COUNT(*) as streak_length,
    MIN(read_date) as start_date,
    MAX(read_date) as end_date
FROM streak_groups
GROUP BY streak_group
ORDER BY streak_length DESC
LIMIT 1;

-- Top authors by reading time
SELECT
    b.authors,
    COUNT(DISTINCT b.id) as books,
    SUM(b.total_read_time) / 3600.0 as hours
FROM book b
WHERE b.authors IS NOT NULL AND b.authors != 'N/A'
GROUP BY b.authors
ORDER BY hours DESC
LIMIT 10;

-- Reading time by hour of day
SELECT
    strftime('%H', start_time, 'unixepoch') as hour,
    SUM(duration) / 3600.0 as hours
FROM page_stat_data
GROUP BY hour
ORDER BY hour;

-- Book completion rate
SELECT
    title,
    authors,
    pages,
    total_read_pages,
    ROUND(total_read_pages * 100.0 / pages, 1) as completion_pct
FROM book
WHERE pages > 0
ORDER BY completion_pct DESC;
```

---

## 14. Appendix: Fun Comparison Examples

| Characters Read | Comparison |
|----------------|------------|
| 1,000,000 | "Stacked, your letters would reach the top of the Eiffel Tower!" |
| 10,000,000 | "That's the height of Mount Everest in characters!" |
| 50,000,000 | "You could spell your way from NYC to LA!" |
| 100,000,000 | "Your reading could circle the Moon!" |

| Reading Time | Comparison |
|--------------|------------|
| 24 hours | "You read for an entire day this year!" |
| 100 hours | "That's 50 movies worth of reading!" |
| 500 hours | "You could have flown around the world... but you chose books!" |

| Pages Read | Comparison |
|------------|------------|
| 1,000 | "That's almost a full Harry Potter book!" |
| 5,000 | "You read the entire Lord of the Rings trilogy... 4 times!" |
| 10,000 | "You conquered the equivalent of War and Peace 8 times!" |

---

## Authors

- **Dhruv Dugar** - Project Owner
- **Claude** (Anthropic) - Co-Author

---

*Last Updated: January 2026*
*Version: 1.0*
