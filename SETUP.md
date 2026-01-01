# KoReader Wrapped - Setup Guide

This document explains how to set up and run the KoReader Wrapped project locally.

## Prerequisites

- **Node.js** 18.17 or later
- **npm** 9.x or later (comes with Node.js)
- A KoReader `statistics.sqlite3` file for testing

## Quick Start

```bash
# Navigate to the app directory
cd app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page
│   │   ├── upload/page.tsx     # Upload interface
│   │   ├── wrapped/page.tsx    # Wrapped experience
│   │   └── api/                # API routes
│   │       └── auth/           # NextAuth.js routes
│   ├── components/             # React components
│   │   ├── upload/             # Upload-related components
│   │   ├── stats/              # Statistics display components
│   │   ├── wrapped/            # Wrapped experience components
│   │   └── leaderboard/        # Leaderboard components
│   ├── lib/                    # Utility libraries
│   │   ├── sqlite-parser.ts    # SQLite file parser
│   │   ├── stats-engine.ts     # Statistics computation
│   │   └── comparisons.ts      # Fun comparison constants
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript type definitions
├── .env.example                # Environment variables template
├── package.json
└── tailwind.config.ts
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

### Required for Authentication

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_SECRET` | Random secret for session encryption. Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL (e.g., `http://localhost:3000`) |

### OAuth Providers (Optional)

**GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env.local`

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env.local`

### Database & Storage (Future - Not Required for MVP)

These are placeholders for future features:
- `DATABASE_URL` - PostgreSQL for user persistence
- `S3_*` variables - Object storage for file persistence
- `REDIS_URL` - Caching and leaderboards

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## How It Works

1. **File Upload**: Users upload their `statistics.sqlite3` file
2. **Client-Side Processing**: The file is parsed using sql.js directly in the browser
3. **Statistics Computation**: Reading data is analyzed to generate insights
4. **Wrapped Experience**: Users navigate through slides showing their reading stats
5. **Share**: Users can share their wrapped on social media (coming soon)

## Finding Your statistics.sqlite3 File

On your KoReader device or sync folder, look for:
```
.koreader/statistics.sqlite3
```

Common locations:
- **Kindle**: `/mnt/us/.koreader/statistics.sqlite3`
- **Kobo**: `/.koreader/statistics.sqlite3`
- **Android**: `/sdcard/koreader/settings/statistics.sqlite3`
- **Desktop**: `~/.config/koreader/statistics.sqlite3`

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14+ | React framework with App Router |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| sql.js | SQLite parsing in browser |
| NextAuth.js | Authentication |
| Lucide React | Icons |

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## Troubleshooting

### "No reading data found"
- Ensure you're uploading the correct `statistics.sqlite3` file
- Check if the file has data by opening it with a SQLite viewer

### Build errors with sql.js
- sql.js loads WebAssembly from a CDN
- Ensure your network allows CDN connections

### Authentication not working
- Verify `NEXTAUTH_SECRET` is set
- Check OAuth callback URLs match your configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
