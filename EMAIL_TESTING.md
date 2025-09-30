# Email Testing Guide

This guide explains how to test email functionality in the Loyer.Brussels application.

## Overview

The application uses [Resend](https://resend.com/) for sending emails. There are three types of emails:

1. **Contact Form Notification** - Sent to admin when someone submits the contact form
2. **Contact Form Confirmation** - Sent to user confirming their message was received
3. **Questionnaire Confirmation** - Sent to user after completing the detailed questionnaire

## Testing Approaches

### 1. Integration Tests (Default - Mocked)

**Location:** `app/actions/__tests__/*.integration.test.ts`

These tests verify database operations and application logic **without** actually sending emails. The email module is mocked to:

- Avoid hitting Resend API rate limits (2 requests/second)
- Run tests without verified domains
- Speed up test execution
- Avoid costs during development

```bash
# Run integration tests (emails are mocked)
yarn test:integration
```

**What's tested:**

- ✅ Database writes and reads
- ✅ Data integrity
- ✅ Email functions are called with correct parameters
- ❌ Actual email delivery (mocked)

### 2. Email E2E Tests (Manual - Real API)

**Location:** `app/lib/__tests__/email.e2e.test.ts`

These tests **actually send emails** via the Resend API. They are skipped by default to avoid:

- Rate limiting errors
- Domain verification issues during development
- Unnecessary API usage

```bash
# Run E2E email tests (actually sends emails)
yarn test:email:e2e
```

**Prerequisites:**

1. Valid `RESEND_API_KEY` in `.env.local`
2. Verified domain on Resend OR use `onboarding@resend.dev` for testing
3. Update test email address to your own

**What's tested:**

- ✅ Actual email delivery
- ✅ Email template rendering
- ✅ Resend API integration
- ✅ Error handling

### 3. Manual Email Test Script (Recommended for Development)

**Location:** `scripts/test-email.ts`

A standalone script to manually test all email templates. This is the **recommended approach** for verifying email functionality during development.

```bash
# Install dependencies first (if needed)
yarn install

# Run the email test script
yarn test:email
```

The script will:

1. Check environment variables are configured
2. Send test emails for all templates
3. Display email IDs and delivery status
4. Provide clear error messages if something fails

**Output example:**

```
═══════════════════════════════════════════════════
  Loyer.Brussels - Email Integration Test
═══════════════════════════════════════════════════

🔍 Checking Environment Configuration...

✅ RESEND_API_KEY: ***xyz123
✅ EMAIL_FROM: contact@wuune.be
✅ EMAIL_TO: contact@wuune.be

──────────────────────────────────────────────────

🧪 Testing Contact Form Emails...

📧 Sending admin notification...
✅ Admin notification sent successfully!
   Email ID: abc123-def456

📧 Sending user confirmation...
✅ User confirmation sent successfully!
   Email ID: xyz789-uvw012

🧪 Testing Questionnaire Confirmation Email...

📧 Sending questionnaire confirmation...
✅ Questionnaire confirmation sent successfully!
   Email ID: pqr345-stu678

═══════════════════════════════════════════════════
✅ Email test script completed!
📬 Check your inbox at drag.markovic@gmail.com
═══════════════════════════════════════════════════
```

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the project root:

```env
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Email FROM address (must be verified domain or use onboarding@resend.dev for testing)
EMAIL_FROM=contact@wuune.be

# Admin email address (receives contact form notifications)
EMAIL_TO=contact@wuune.be
```

### Domain Verification

For production use, you need to verify your domain on Resend:

1. Go to https://resend.com/domains
2. Add your domain (e.g., `loyer.brussels` or `wuune.be`)
3. Add DNS records as instructed
4. Wait for verification (usually < 24 hours)
5. Update `EMAIL_FROM` to use verified domain (e.g., `contact@loyer.brussels`)

### Testing Without Domain Verification

For development/testing, you can use Resend's test email:

```env
EMAIL_FROM=onboarding@resend.dev
```

**Note:** Test emails can only be sent to the email associated with your Resend account.

## Common Issues

### Issue: Domain Not Verified (403 Error)

```
Error: The loyer.brussels domain is not verified
```

**Solutions:**

1. Use `EMAIL_FROM=onboarding@resend.dev` for testing
2. Verify your domain on Resend
3. Check DNS records are correctly configured

### Issue: Rate Limit Exceeded (429 Error)

```
Error: Too many requests. You can only make 2 requests per second
```

**Solutions:**

1. Add delays between test emails (script already includes this)
2. Use mocked integration tests for frequent testing
3. Upgrade Resend plan for higher limits

### Issue: Invalid API Key (401 Error)

```
Error: Invalid API key
```

**Solutions:**

1. Check `RESEND_API_KEY` is correctly set in `.env.local`
2. Verify the API key is active on https://resend.com/api-keys
3. Ensure `.env.local` is not committed to git (.gitignore)

## Best Practices

### For Development

1. Use **integration tests** (mocked) for regular testing
2. Use **test script** (`yarn test:email`) when changing email templates
3. Keep E2E tests skipped unless specifically testing Resend integration

### For CI/CD

1. Run integration tests (mocked) on every commit
2. Skip E2E email tests in CI to avoid rate limits
3. Test email delivery manually in staging environment

### For Production

1. Verify domain before deploying
2. Use proper `EMAIL_FROM` address (e.g., `contact@loyer.brussels`)
3. Monitor Resend dashboard for delivery issues
4. Set up error logging/alerts for email failures

## Testing Checklist

Before deploying to production:

- [ ] Domain verified on Resend
- [ ] Environment variables configured in production
- [ ] Test script sends emails successfully: `yarn test:email`
- [ ] All email templates render correctly
- [ ] Email addresses are correct (FROM and TO)
- [ ] Error handling works (app doesn't crash if email fails)
- [ ] Integration tests pass: `yarn test:integration`

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Dashboard](https://resend.com/overview)
- [Email Templates](./app/lib/email.ts)
- [Integration Tests](./app/actions/__tests/)
