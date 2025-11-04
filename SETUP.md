# Setup Guide

This guide will walk you through setting up the Loyer Brussels application from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Resend Setup](#resend-setup)
4. [Vercel Setup](#vercel-setup)
5. [Local Development](#local-development)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- Node.js 18.x or higher installed
- npm or yarn package manager
- Git
- A GitHub account
- A text editor or IDE

## Supabase Setup

Supabase is our backend-as-a-service platform providing database, authentication, and storage.

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Fill in the details:
   - **Project Name**: loyer-brussels (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to Brussels (EU West)
   - **Pricing Plan**: Start with Free tier

### Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

### Step 3: Configure Database (Coming Soon)

Database schemas and migrations will be provided in future updates.

### Step 4: Enable Row Level Security (RLS)

1. Go to **Authentication** → **Policies**
2. Enable RLS on all tables
3. Create appropriate policies for your use case

## Resend Setup

Resend is our email delivery service for transactional emails.

### Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address

### Step 2: Get Your API Key

1. In the Resend dashboard, go to **API Keys**
2. Click "Create API Key"
3. Give it a name (e.g., "Loyer Brussels Development")
4. Copy the API key - this is your `RESEND_API_KEY`
   - ⚠️ **Important**: You can only see this once! Save it immediately.

### Step 3: Verify Your Domain (Production Only)

For production, you'll need to verify your sending domain:

1. Go to **Domains** in the Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `loyer.brussels`)
4. Add the DNS records to your domain provider
5. Wait for verification (can take up to 48 hours)

For development, you can use Resend's test mode with your personal email.

### Step 4: Update Email Configuration

In `lib/email.ts`, update the `from` address to match your verified domain:

```typescript
from: 'Loyer Brussels <noreply@your-domain.com>'
```

## Vercel Setup

Vercel is our hosting platform for the Next.js application.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Connect Your Project

```bash
# In your project directory
vercel login
vercel link
```

Follow the prompts to connect your project to Vercel.

### Step 3: Configure Environment Variables

Add your environment variables to Vercel:

```bash
# Add each variable
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
```

Or add them through the Vercel dashboard:
1. Go to your project on vercel.com
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for Production, Preview, and Development

### Step 4: Deploy

```bash
vercel --prod
```

Or set up automatic deployments from GitHub:
1. In Vercel dashboard, click "Import Project"
2. Select your GitHub repository
3. Configure build settings (auto-detected for Next.js)
4. Add environment variables
5. Deploy

## Local Development

### Step 1: Clone the Repository

```bash
git clone https://github.com/vanmarkic/loyer.brussels.git
cd loyer.brussels
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials from the previous steps:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Resend Configuration
RESEND_API_KEY=re_xxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### Supabase Connection Issues

**Problem**: "Invalid API key" or connection errors

**Solution**:
- Verify your API keys are correct in `.env.local`
- Ensure there are no extra spaces or quotes
- Check that your Supabase project is active
- Verify your IP is not blocked in Supabase settings

### Resend Email Not Sending

**Problem**: Emails are not being delivered

**Solution**:
- Verify your API key is correct
- Check if you're in sandbox mode (only sends to verified emails)
- Verify your domain if in production
- Check Resend dashboard for error logs
- Ensure the `from` email matches your verified domain

### Vercel Build Fails

**Problem**: Build fails during deployment

**Solution**:
- Check build logs for specific errors
- Ensure all environment variables are set in Vercel
- Verify your `package.json` scripts are correct
- Try building locally first: `npm run build`
- Check Node.js version compatibility

### Type Errors

**Problem**: TypeScript compilation errors

**Solution**:
- Run `npm install` to ensure all types are installed
- Check `tsconfig.json` configuration
- Ensure all imports are correct
- Run `npm run lint` to check for issues

### Port Already in Use

**Problem**: "Port 3000 is already in use"

**Solution**:
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## Need Help?

- Check the [README.md](./README.md) for general information
- Review [AGENCY_BRIEF.md](./AGENCY_BRIEF.md) for business context
- Consult [.claude/README.md](./.claude/README.md) for Claude Code tools
- Contact the development team

---

**Last Updated**: November 2025
