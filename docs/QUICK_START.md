# Quick Start Guide - Email & Database Features

## ⚡ 5-Minute Setup

### 1. Install Dependencies ✅

Already done! The `resend` package has been installed.

### 2. Set Up Resend (Email Service)

```bash
# 1. Sign up at https://resend.com (Free tier available)
# 2. Add and verify your domain OR use test domain: onboarding@resend.dev
# 3. Get your API key from dashboard
```

### 3. Set Up Environment Variables

Create `.env.local` in project root:

```bash
# Already configured (hopefully):
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SERVICE_KEY=your-service-role-key

# NEW - Add these:
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=contact@wuune.be    # Or onboarding@resend.dev for testing
EMAIL_TO=contact@wuune.be            # Where to receive contact form emails
```

### 4. Create Database Tables

Open Supabase SQL Editor and run this:

```sql
-- Create contact_submissions table
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

CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_submitted_at ON contact_submissions(submitted_at DESC);

-- Create questionnaire_responses table
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT NOT NULL,
  phone TEXT,
  join_newsletter BOOLEAN DEFAULT FALSE,
  join_assembly BOOLEAN DEFAULT FALSE,
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
  actual_rent NUMERIC,
  lease_type TEXT,
  lease_start_date TEXT,
  rent_indexation TEXT,
  boiler_maintenance BOOLEAN,
  fire_insurance BOOLEAN,
  monthly_income NUMERIC,
  household_composition TEXT,
  payment_delays TEXT,
  eviction_threats TEXT,
  mediation_attempts TEXT,
  health_issues JSONB DEFAULT '[]'::JSONB,
  major_defects JSONB DEFAULT '[]'::JSONB,
  positive_aspects JSONB DEFAULT '[]'::JSONB,
  additional_comments TEXT,
  difficulty_index NUMERIC,
  median_rent NUMERIC,
  min_rent NUMERIC,
  max_rent NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questionnaire_responses_email ON questionnaire_responses(email);
CREATE INDEX idx_questionnaire_responses_submitted_at ON questionnaire_responses(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Create policies (service role only)
CREATE POLICY "Service role can insert contact submissions"
  ON contact_submissions FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can read contact submissions"
  ON contact_submissions FOR SELECT TO service_role USING (true);

CREATE POLICY "Service role can insert questionnaire responses"
  ON questionnaire_responses FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can read questionnaire responses"
  ON questionnaire_responses FOR SELECT TO service_role USING (true);
```

### 5. Test It! 🎉

```bash
# Start dev server
yarn dev

# Navigate to:
http://localhost:3000/en/contact

# Fill out the form and submit
# You should:
# 1. See a success toast notification
# 2. Receive 2 emails (admin + user confirmation)
# 3. See the record in Supabase Table Editor
```

## 📧 Test Email Flow

1. **Open Contact Form**: http://localhost:3000/en/contact
2. **Fill in details**:
   - Name: Test User
   - Email: your-email@example.com
   - Subject: Test Message
   - Message: This is a test
3. **Submit**
4. **Check**:
   - ✅ Success toast appears
   - ✅ Form resets
   - ✅ Admin email received at EMAIL_TO address
   - ✅ User confirmation email received
   - ✅ Record in Supabase `contact_submissions` table

## 🧪 Test Questionnaire Flow

1. **Complete Calculator**: Fill out the rent calculator
2. **Go to Questionnaire**: Navigate to questionnaire page
3. **Fill all sections**
4. **Submit on final step**
5. **Check**:
   - ✅ Success toast appears
   - ✅ Confirmation email received
   - ✅ Record in Supabase `questionnaire_responses` table
   - ✅ Redirected to contact page

## 🚨 Troubleshooting

### Emails Not Sending?

```bash
# Check environment variables
echo $RESEND_API_KEY

# Check Resend dashboard logs
# https://resend.com/emails

# Check server console for errors
```

### Database Errors?

```bash
# Verify tables exist in Supabase
# Go to: Table Editor > Check for tables

# Verify RLS is enabled
# Go to: Authentication > Policies

# Check Supabase logs
# Go to: Logs > Select service
```

## 📚 Full Documentation

- **Setup Guide**: `SETUP_EMAIL_DATABASE.md`
- **Database Schema**: `DATABASE_SCHEMA.md`
- **Implementation**: `EMAIL_DATABASE_IMPLEMENTATION.md`
- **Summary**: `IMPLEMENTATION_SUMMARY.md`

## 🎯 What's Included

✅ Email sending via Resend  
✅ Contact form with database storage  
✅ Questionnaire response storage  
✅ Email confirmations (admin + user)  
✅ Loading states & error handling  
✅ Toast notifications  
✅ Security (RLS, server actions)  
✅ Type-safe implementation

## 💡 Production Checklist

Before deploying:

- [ ] Resend domain verified
- [ ] All ENV variables set in production
- [ ] Supabase tables created
- [ ] RLS policies enabled
- [ ] Test email delivery
- [ ] Test database inserts
- [ ] Monitor Resend dashboard
- [ ] Monitor Supabase logs

---

**Need help?** Check the detailed docs or contact the development team.
