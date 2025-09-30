# Database Schema Documentation

This document describes the Supabase database schema required for the Loyer.Brussels application.

## Tables

### 1. contact_submissions

Stores all contact form submissions from the website.

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

### 2. questionnaire_responses

Stores detailed questionnaire responses from users who complete the full questionnaire.

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

## Row Level Security (RLS)

Enable RLS and set up policies for both tables:

```sql
-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Contact submissions policies
-- Only service role can insert (server-side only)
CREATE POLICY "Service role can insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role can read all submissions
CREATE POLICY "Service role can read contact submissions"
  ON contact_submissions
  FOR SELECT
  TO service_role
  USING (true);

-- Questionnaire responses policies
-- Only service role can insert (server-side only)
CREATE POLICY "Service role can insert questionnaire responses"
  ON questionnaire_responses
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role can read all responses
CREATE POLICY "Service role can read questionnaire responses"
  ON questionnaire_responses
  FOR SELECT
  TO service_role
  USING (true);
```

## Setup Instructions

1. **Access Supabase Dashboard**

   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor

2. **Create Tables**

   - Copy and execute the CREATE TABLE statements above
   - Execute the index creation statements

3. **Enable RLS**

   - Execute the RLS policies statements

4. **Verify Setup**
   - Go to Table Editor to verify both tables are created
   - Check that RLS is enabled for both tables

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SERVICE_KEY=your_service_role_key

# Resend (for email sending)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=contact@wuune.be  # or your verified domain
EMAIL_TO=contact@wuune.be          # admin email to receive notifications
```

## Data Privacy & GDPR Compliance

- All personal data is stored securely in Supabase
- RLS policies ensure data can only be accessed by authorized service role
- Users are informed about data collection via privacy disclaimer in forms
- Consider implementing data retention policies (e.g., auto-delete after X years)
- Implement data export/deletion endpoints for GDPR compliance if needed

## Querying Examples

### Get all contact submissions from last 7 days

```sql
SELECT * FROM contact_submissions
WHERE submitted_at >= NOW() - INTERVAL '7 days'
ORDER BY submitted_at DESC;
```

### Get all users who want to join newsletter

```sql
SELECT email, name FROM contact_submissions
WHERE newsletter = TRUE
UNION
SELECT email, NULL as name FROM questionnaire_responses
WHERE join_newsletter = TRUE;
```

### Get questionnaire responses with high rent vs max rent

```sql
SELECT
  email,
  actual_rent,
  max_rent,
  (actual_rent - max_rent) as overpayment
FROM questionnaire_responses
WHERE actual_rent > max_rent
ORDER BY overpayment DESC;
```
