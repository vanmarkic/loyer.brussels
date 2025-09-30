# Email and Database Implementation

## Overview

This document describes the email sending and database storage features implemented for the Loyer.Brussels application.

## Features Implemented

### 1. Email Sending Functionality

#### Contact Form Emails

- **Admin Notification**: Sent to the configured admin email when a user submits the contact form
- **User Confirmation**: Sent to the user confirming their message was received
- **Pre-filled Forms**: Contact forms can be pre-filled with data from the calculator flow

#### Questionnaire Confirmation Emails

- Sent when a user completes the detailed questionnaire
- Includes submission ID and timestamp
- Provides next steps information

### 2. Database Storage

#### Contact Submissions Table

Stores all contact form submissions with:

- User information (name, email)
- Message details (subject, message)
- Preferences (newsletter, assembly invites)
- Submission timestamp

#### Questionnaire Responses Table

Comprehensive storage of questionnaire data including:

- User profile information
- Property details
- Rental information
- Household information
- Property issues and positive aspects
- Calculation results

## Technical Implementation

### File Structure

```
app/
├── lib/
│   └── email.ts                    # Email templates and sending logic
├── actions/
│   ├── send-contact.ts            # Server action for contact form
│   └── save-questionnaire.ts      # Server action for questionnaire
└── [locale]/
    ├── contact/
    │   └── page.tsx               # Contact form (updated)
    └── calculateur/bruxelles/questionnaire/
        └── page.tsx               # Questionnaire (updated)
```

### Server Actions

#### `submitContactForm()`

Located in: `app/actions/send-contact.ts`

**Purpose**: Handles contact form submission, validation, database storage, and email sending.

**Features**:

- Form validation (required fields, email format)
- Database insertion into `contact_submissions` table
- Sends notification email to admin
- Sends confirmation email to user
- Returns success/error status

**Usage**:

```typescript
import { submitContactForm } from "@/app/actions/send-contact";

const result = await submitContactForm({
  name: "John Doe",
  email: "john@example.com",
  subject: "Question about rent",
  message: "I have a question...",
  newsletter: true,
  assembly: false,
});

if (result.success) {
  // Handle success
} else {
  // Handle error: result.error
}
```

#### `saveQuestionnaireResponse()`

Located in: `app/actions/save-questionnaire.ts`

**Purpose**: Saves complete questionnaire response to database and sends confirmation email.

**Features**:

- Accepts full GlobalFormState
- Comprehensive data validation
- Database insertion into `questionnaire_responses` table
- Sends confirmation email to user
- Returns submission ID on success

**Usage**:

```typescript
import { saveQuestionnaireResponse } from "@/app/actions/save-questionnaire";

const result = await saveQuestionnaireResponse(globalForm.state);

if (result.success) {
  console.log("Submission ID:", result.submissionId);
}
```

### Email Templates

Located in: `app/lib/email.ts`

#### Email Functions:

1. **`sendContactNotification()`** - Admin notification email
2. **`sendContactConfirmation()`** - User confirmation email
3. **`sendQuestionnaireConfirmation()`** - Questionnaire confirmation email

All emails are HTML formatted with:

- Responsive design
- Brand colors (red theme)
- Clear structure and formatting
- Professional styling

### UI Updates

#### Contact Form

- Added loading state during submission
- Toast notifications for success/error
- Form reset on successful submission
- Disabled state while submitting
- Error handling with user-friendly messages

#### Questionnaire

- Save to database on final step
- Loading indicator during submission
- Toast notification on success
- Automatic redirect to contact page after submission
- Error handling

## Configuration

### Environment Variables

Required in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SERVICE_KEY=your_service_role_key

# Resend
RESEND_API_KEY=your_resend_api_key

# Email Settings
EMAIL_FROM=contact@wuune.be
EMAIL_TO=contact@wuune.be
```

### Database Schema

See `DATABASE_SCHEMA.md` for:

- Complete SQL schema
- Index definitions
- RLS policies
- Example queries

## Security Considerations

### Server-Side Only

- All database operations use server actions
- Email API keys never exposed to client
- Service role key used only server-side

### Row Level Security (RLS)

- Enabled on both tables
- Only service role can insert/read
- Protects against unauthorized access

### Input Validation

- Email format validation
- Required field checks
- SQL injection protection (via Supabase)
- XSS prevention (via React)

## Error Handling

### Client-Side

- Toast notifications for errors
- Form validation feedback
- Loading states prevent duplicate submissions
- User-friendly error messages

### Server-Side

- Try-catch blocks in all server actions
- Detailed error logging
- Graceful degradation (email failure doesn't block submission)
- Return structured error responses

## Testing

### Manual Testing Checklist

#### Contact Form:

- [ ] Form validation works
- [ ] Successful submission saves to database
- [ ] Admin email is received
- [ ] User confirmation email is received
- [ ] Toast notification appears
- [ ] Form resets after submission
- [ ] Loading state works
- [ ] Error handling works

#### Questionnaire:

- [ ] All fields save correctly
- [ ] Submission creates database record
- [ ] Confirmation email is sent
- [ ] Redirect to contact page works
- [ ] Toast notifications work
- [ ] Loading state works
- [ ] Error handling works

### Database Verification

Check Supabase Table Editor after submissions:

```sql
-- View recent contact submissions
SELECT * FROM contact_submissions
ORDER BY submitted_at DESC
LIMIT 10;

-- View recent questionnaire responses
SELECT id, email, submitted_at, postal_code
FROM questionnaire_responses
ORDER BY submitted_at DESC
LIMIT 10;
```

## Monitoring & Analytics

### Email Delivery

- Check Resend dashboard for:
  - Delivery status
  - Bounce rates
  - Open rates (if tracking enabled)
  - Failed deliveries

### Database

- Monitor Supabase dashboard for:
  - Database usage
  - Query performance
  - Error logs
  - API usage

## Future Enhancements

### Potential Improvements:

1. **Admin Dashboard**

   - View all submissions
   - Filter and search
   - Export to CSV
   - Respond to messages

2. **Email Enhancements**

   - Custom email templates in Resend
   - Automated follow-ups
   - Drip campaigns for newsletter subscribers
   - Multi-language email templates

3. **Database Improvements**

   - Data retention policies
   - Automated backups
   - Data export for GDPR compliance
   - Analytics and reporting

4. **Form Enhancements**
   - File upload support
   - Spam protection (reCAPTCHA)
   - Multi-step form validation
   - Save draft functionality

## Troubleshooting

### Common Issues

#### Emails Not Sending

**Symptoms**: No emails received after form submission

**Solutions**:

1. Check RESEND_API_KEY is valid
2. Verify EMAIL_FROM uses verified domain
3. Check Resend dashboard for delivery status
4. Look for errors in server logs
5. Ensure rate limits not exceeded

#### Database Insert Failures

**Symptoms**: "Error lors de l'enregistrement" message

**Solutions**:

1. Verify Supabase credentials are correct
2. Check RLS policies are properly configured
3. Ensure NEXT_PUBLIC_SERVICE_KEY is correct
4. Check Supabase logs for detailed errors
5. Verify table schema matches code

#### Form Validation Errors

**Symptoms**: Form won't submit or shows validation errors

**Solutions**:

1. Check all required fields are filled
2. Verify email format is valid
3. Check browser console for JS errors
4. Ensure form data types match expected types

## Support & Documentation

- **Setup Guide**: `SETUP_EMAIL_DATABASE.md`
- **Database Schema**: `DATABASE_SCHEMA.md`
- **API Documentation**: See inline comments in code
- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs

## Changelog

### Version 1.0 (Current)

- ✅ Implemented contact form email sending
- ✅ Implemented questionnaire database storage
- ✅ Added email templates
- ✅ Created server actions
- ✅ Updated UI with loading states and toasts
- ✅ Added comprehensive error handling
- ✅ Created database schema and RLS policies
- ✅ Added documentation

---

**Last Updated**: September 30, 2025  
**Author**: Development Team  
**Status**: Production Ready
