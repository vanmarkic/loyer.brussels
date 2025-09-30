# Email and Database Setup Guide

This guide will help you set up email sending functionality and database storage for the Loyer.Brussels application.

## Prerequisites

1. A Supabase account and project
2. A Resend account for email sending
3. Node.js and Yarn installed

## Step 1: Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Supabase Configuration
# Get these from your Supabase project settings: https://app.supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SERVICE_KEY=your-service-role-key-here

# Email Configuration (Resend)
# Sign up for a free account at: https://resend.com
RESEND_API_KEY=re_your_api_key_here

# Email Settings
EMAIL_FROM=contact@wuune.be
EMAIL_TO=contact@wuune.be

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `NEXT_PUBLIC_SERVICE_KEY` ⚠️ Keep this secret!

### Getting Resend API Key

1. Sign up at [Resend](https://resend.com)
2. Verify your domain (or use the free `onboarding@resend.dev` for testing)
3. Go to **API Keys** in the dashboard
4. Create a new API key
5. Copy the key → `RESEND_API_KEY`

**Important:** If using a custom domain for emails:

- Update `EMAIL_FROM` to use your verified domain
- Configure DNS records in Resend dashboard

## Step 2: Database Setup

### Create Database Tables

1. Open your [Supabase SQL Editor](https://app.supabase.com)
2. Run the following SQL to create the tables:

#### Contact Submissions Table

```sql
CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  newsletter BOOLEAN DEFAULT FALSE,
  assembly BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_submitted_at ON contact_submissions(submitted_at DESC);
CREATE INDEX idx_contact_submissions_newsletter ON contact_submissions(newsletter) WHERE newsletter = TRUE;
CREATE INDEX idx_contact_submissions_assembly ON contact_submissions(assembly) WHERE assembly = TRUE;
```

#### Questionnaire Responses Table

```sql
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- User profile
  email TEXT NOT NULL,
  phone TEXT,
  join_newsletter BOOLEAN DEFAULT FALSE,
  join_assembly BOOLEAN DEFAULT FALSE,

  -- Property information
  postal_code INTEGER,
  street_name TEXT,
  street_number TEXT,
  property_type TEXT,
  living_space NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  number_of_garages INTEGER,
  energy_class TEXT,
  constructed_before_2000 BOOLEAN,
  property_state TEXT,
  has_central_heating BOOLEAN,
  has_thermal_regulation BOOLEAN,
  has_double_glazing BOOLEAN,
  has_second_bathroom BOOLEAN,
  has_recreational_spaces BOOLEAN,
  has_storage_spaces BOOLEAN,

  -- Rental information
  actual_rent NUMERIC,
  lease_type TEXT,
  lease_start_date TEXT,
  rent_indexation TEXT,
  boiler_maintenance BOOLEAN,
  fire_insurance BOOLEAN,

  -- Household information
  monthly_income NUMERIC,
  household_composition TEXT,
  payment_delays TEXT,
  eviction_threats TEXT,
  mediation_attempts TEXT,

  -- Property issues (JSON arrays)
  health_issues JSONB DEFAULT '[]'::JSONB,
  major_defects JSONB DEFAULT '[]'::JSONB,
  positive_aspects JSONB DEFAULT '[]'::JSONB,
  additional_comments TEXT,

  -- Calculation results
  difficulty_index NUMERIC,
  median_rent NUMERIC,
  min_rent NUMERIC,
  max_rent NUMERIC,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_questionnaire_responses_email ON questionnaire_responses(email);
CREATE INDEX idx_questionnaire_responses_submitted_at ON questionnaire_responses(submitted_at DESC);
CREATE INDEX idx_questionnaire_responses_session_id ON questionnaire_responses(session_id);
CREATE INDEX idx_questionnaire_responses_postal_code ON questionnaire_responses(postal_code);
CREATE INDEX idx_questionnaire_responses_newsletter ON questionnaire_responses(join_newsletter) WHERE join_newsletter = TRUE;
CREATE INDEX idx_questionnaire_responses_assembly ON questionnaire_responses(join_assembly) WHERE join_assembly = TRUE;

-- Add GIN indexes for JSONB columns for efficient querying
CREATE INDEX idx_questionnaire_health_issues ON questionnaire_responses USING GIN (health_issues);
CREATE INDEX idx_questionnaire_major_defects ON questionnaire_responses USING GIN (major_defects);
CREATE INDEX idx_questionnaire_positive_aspects ON questionnaire_responses USING GIN (positive_aspects);
```

### Enable Row Level Security (RLS)

Run this SQL to enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Contact submissions policies
CREATE POLICY "Service role can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read contact submissions"
  ON contact_submissions
  FOR SELECT
  TO service_role
  USING (true);

-- Questionnaire responses policies
CREATE POLICY "Service role can insert questionnaire responses"
  ON questionnaire_responses
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can read questionnaire responses"
  ON questionnaire_responses
  FOR SELECT
  TO service_role
  USING (true);
```

## Step 3: Verify Installation

### Test Database Connection

Run this SQL query in the Supabase SQL Editor to verify:

```sql
SELECT
  table_name,
  row_security_active
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('contact_submissions', 'questionnaire_responses');
```

You should see both tables with `row_security_active = true`.

### Test Email Configuration

1. Start your development server: `yarn dev`
2. Navigate to the contact page: `http://localhost:3000/en/contact`
3. Fill out and submit the form
4. Check:
   - Supabase Table Editor for the new record
   - Your inbox (both admin and user emails should be sent)

## Step 4: Production Deployment

### For Vercel/Production:

1. Add all environment variables to your hosting platform:

   - Vercel: **Settings** → **Environment Variables**
   - Add all variables from `.env.local`

2. **Important Security Notes:**

   - Never commit `.env.local` to git
   - Keep `NEXT_PUBLIC_SERVICE_KEY` secret (server-side only)
   - Use different API keys for development and production

3. **Domain Verification for Resend:**
   - Add your production domain in Resend
   - Configure DNS records (SPF, DKIM, DMARC)
   - Update `EMAIL_FROM` to use your verified domain

## Troubleshooting

### Emails Not Sending

1. Check Resend Dashboard for delivery status
2. Verify `RESEND_API_KEY` is correct
3. Check if `EMAIL_FROM` uses a verified domain
4. Look for errors in server logs

### Database Insert Failures

1. Verify Supabase credentials are correct
2. Check RLS policies are properly set
3. Ensure you're using `NEXT_PUBLIC_SERVICE_KEY` for server actions
4. Check Supabase logs for detailed error messages

### Form Submission Errors

1. Open browser console for client-side errors
2. Check server logs (Vercel logs or terminal)
3. Verify all required fields are filled
4. Test with a simple submission first

## Features Implemented

✅ Contact form email notifications (admin + user confirmation)  
✅ Questionnaire response storage in database  
✅ Email confirmations for questionnaire submissions  
✅ Pre-filled contact forms from global context  
✅ Loading states and error handling  
✅ Toast notifications for user feedback  
✅ Full database schema with indexes  
✅ RLS security policies

## Next Steps (Optional)

- Set up email templates in Resend dashboard
- Create admin dashboard to view submissions
- Add data export functionality for GDPR compliance
- Implement email scheduling for follow-ups
- Add email analytics and tracking

## Support

For detailed database schema documentation, see `DATABASE_SCHEMA.md`.

For issues or questions, please contact the development team.
