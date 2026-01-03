⏺ Read(.env.example)
  ⎿  Read 48 lines

⏺ Here's what you need to do:

  Required Steps

  1. Copy the example file:
  cp .env.example .env.local
  2. Generate NextAuth secret:
  openssl rand -base64 32
  2. Copy the output to NEXTAUTH_SECRET
  3. Set up Google OAuth (since the app uses Google auth):
    - Go to https://console.cloud.google.com/apis/credentials
    - Create a new OAuth2.0 Client ID
    - Set authorized redirect URI to: http://localhost:3000/api/auth/callback/google
    - Copy the Client ID and Secret to GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

  Optional

  - GitHub OAuth - If you want GitHub login, set up at https://github.com/settings/developers
  - Database/Storage/Redis - Only needed for user persistence, file storage, and leaderboards

  Minimum .env.local for local dev:

  NEXTAUTH_SECRET=<your-generated-secret>
  NEXTAUTH_URL=http://localhost:3000
  GOOGLE_CLIENT_ID=<from-google-console>
  GOOGLE_CLIENT_SECRET=<from-google-console>

  Want me to generate the secret for you?