# Environment Setup Instructions

## The Issue

The `tsx` script doesn't automatically load `.env.local` like Next.js does. I've updated the script to use `dotenv`, but you need to create the `.env.local` file first.

## Quick Setup

### 1. Create `.env.local` File

Copy this into a new file called `.env.local` in the project root:

```env
# Supabase Configuration
# Get these from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Email Configuration (Resend)
# Uncomment and add your API key to enable email sending
# RESEND_API_KEY=re_your_key_here

# Email FROM address
# For testing: use onboarding@resend.dev
# For production: use verified domain like contact@loyer.brussels
# EMAIL_FROM=onboarding@resend.dev

# Admin email (receives contact form notifications)
# EMAIL_TO=contact@wuune.be
```

### 2. Add Your Credentials

#### For Supabase (if running integration tests):

1. Go to your Supabase project dashboard
2. Go to Settings → API
3. Copy the values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

#### For Email Testing (optional):

1. Sign up at https://resend.com (free tier available)
2. Go to https://resend.com/api-keys
3. Create an API key
4. Uncomment the email lines in `.env.local` and add:
   ```env
   RESEND_API_KEY=re_your_actual_key_here
   EMAIL_FROM=onboarding@resend.dev
   EMAIL_TO=your_email@example.com
   ```

### 3. Test the Configuration

#### Test Supabase Connection:

```bash
yarn test:integration
```

#### Test Email Sending:

```bash
yarn test:email
```

## Why This Happened

- **Next.js apps** automatically load `.env.local` when running `yarn dev` or `yarn build`
- **Standalone scripts** (like our email test) need to manually load environment variables
- I've fixed the script to use `dotenv.config()` to load `.env.local`
- But you still need to create the file with your actual credentials

## Security Note

`.env.local` is already in `.gitignore` and will NOT be committed to Git. This is intentional - never commit API keys or secrets to version control!

## What's Already Working

Even without email configuration, these work:

- ✅ Integration tests (emails are mocked)
- ✅ Database operations (Supabase credentials needed)
- ✅ App functionality (gracefully handles missing email config)

## Quick Commands

```bash
# Create .env.local (Windows PowerShell)
New-Item -Path .env.local -ItemType File

# Create .env.local (macOS/Linux)
touch .env.local

# Edit .env.local
code .env.local  # VS Code
nano .env.local  # Terminal editor
```

Then paste the template above and add your actual credentials.
