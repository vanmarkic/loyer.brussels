# Testing Guide - Integration Tests

## Overview

This guide covers the integration tests for the email and database features of Loyer.Brussels.

## Test Files

### Contact Form Tests

**Location**: `app/actions/__tests__/send-contact.integration.test.ts`

Tests the complete contact form submission flow:

- Form validation
- Database storage in `contact_submissions` table
- Email sending (admin notification + user confirmation)
- Error handling

### Questionnaire Tests

**Location**: `app/actions/__tests__/save-questionnaire.integration.test.ts`

Tests the complete questionnaire submission flow:

- Complete questionnaire data submission
- Database storage in `questionnaire_responses` table
- Email confirmation sending
- Data integrity verification

## Prerequisites

### 1. Environment Variables

Ensure your `.env.local` file has all required variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SERVICE_KEY=your_service_role_key

# Resend
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=contact@wuune.be
EMAIL_TO=contact@wuune.be
```

### 2. Database Setup

Ensure both database tables exist (see `DATABASE_SCHEMA.md`):

- `contact_submissions`
- `questionnaire_responses`

### 3. Email Service

- Resend account configured and API key valid
- Domain verified (or using test domain)

## Running Tests

### Run All Tests

```bash
yarn test
```

### Run Integration Tests Only

```bash
# Run all integration tests
yarn test integration

# Run contact form tests only
yarn test send-contact.integration

# Run questionnaire tests only
yarn test save-questionnaire.integration
```

### Run in Watch Mode

```bash
yarn test --watch
```

### Run with Coverage

```bash
yarn test --coverage
```

## Test Structure

### Contact Form Integration Tests

```typescript
describe("Contact Form Integration Tests", () => {
  // ✅ Successful submission with all fields
  // ✅ Minimal required fields
  // ✅ Invalid email rejection
  // ✅ Missing required fields rejection
  // ✅ Special characters handling
  // ✅ Long messages handling
  // ✅ Newsletter/Assembly preferences storage
  // ✅ Timestamp verification
  // ✅ Email sending (graceful degradation)
});
```

### Questionnaire Integration Tests

```typescript
describe("Questionnaire Integration Tests", () => {
  // ✅ Complete questionnaire submission
  // ✅ Minimal required data
  // ✅ Missing email rejection
  // ✅ High rent overpayment case
  // ✅ Complex property issues
  // ✅ Different household compositions
  // ✅ Session ID tracking
  // ✅ Special characters
  // ✅ Email confirmation
  // ✅ Data integrity across all fields
});
```

## What Gets Tested

### 1. Contact Form (`send-contact`)

#### Validation

- ✅ Required fields (name, email, subject, message)
- ✅ Email format validation
- ✅ Rejection of invalid data

#### Database

- ✅ Successful insertion into `contact_submissions`
- ✅ Correct storage of all fields
- ✅ Newsletter/Assembly preferences
- ✅ Timestamp generation

#### Email

- ✅ Admin notification sent
- ✅ User confirmation sent
- ✅ Graceful degradation (submission succeeds even if email fails)

#### Edge Cases

- ✅ Special characters in messages
- ✅ Long messages (5000+ chars)
- ✅ XSS attempt handling

### 2. Questionnaire (`save-questionnaire`)

#### Validation

- ✅ Required email field
- ✅ Rejection when email missing

#### Database

- ✅ Complete data storage with all fields
- ✅ Proper type conversion (strings to numbers)
- ✅ JSONB array storage (health_issues, major_defects, positive_aspects)
- ✅ Null/boolean handling

#### Data Integrity

- ✅ User profile data
- ✅ Property information (all fields)
- ✅ Rental information
- ✅ Household information
- ✅ Property issues (arrays)
- ✅ Calculation results
- ✅ Session tracking

#### Email

- ✅ Confirmation email sent
- ✅ Includes submission ID and timestamp

#### Edge Cases

- ✅ Minimal data (only email)
- ✅ Complex property issues (multiple items)
- ✅ Special characters in text fields
- ✅ Different household types
- ✅ High rent overpayment scenarios

## Real Test Data

### Test Email

All tests use: `drag.markovic@gmail.com`

### Test Data Examples

**Contact Form:**

```typescript
{
  name: "Dragan Markovic (Test User)",
  email: "drag.markovic@gmail.com",
  subject: "Test - Integration Test Submission",
  message: "This is an automated integration test message...",
  newsletter: true,
  assembly: true
}
```

**Questionnaire:**

```typescript
{
  userProfile: {
    email: "drag.markovic@gmail.com",
    phone: "+32 123 456 789",
    joinNewsletter: true,
    joinAssembly: true
  },
  propertyInfo: {
    postalCode: 1000,
    streetName: "Rue de la Loi",
    streetNumber: "16",
    propertyType: "apartment",
    size: 85,
    // ... complete property data
  },
  // ... complete questionnaire data
}
```

## Test Cleanup

### Automatic Cleanup

Tests automatically clean up after themselves using `afterAll` hooks:

```typescript
afterAll(async () => {
  // Delete test records from database
  if (testSubmissionId) {
    await supabaseAdmin.from("contact_submissions").delete().eq("id", testSubmissionId);
  }
});
```

### Manual Cleanup (if needed)

If tests fail and don't clean up:

```sql
-- Contact submissions
DELETE FROM contact_submissions
WHERE name LIKE '%Test%' OR subject LIKE '%Test%';

-- Questionnaire responses
DELETE FROM questionnaire_responses
WHERE email = 'drag.markovic@gmail.com';
```

## Checking Results

### Database Verification

```sql
-- View recent contact submissions
SELECT * FROM contact_submissions
ORDER BY submitted_at DESC
LIMIT 10;

-- View recent questionnaire responses
SELECT id, email, submitted_at, postal_code, actual_rent, max_rent
FROM questionnaire_responses
ORDER BY submitted_at DESC
LIMIT 10;
```

### Email Verification

After running tests, check `drag.markovic@gmail.com` inbox for:

1. **Contact Form Confirmation** - Subject: "Votre message a bien été reçu - Loyer.Brussels"
2. **Questionnaire Confirmation** - Subject: "Votre questionnaire a été soumis - Loyer.Brussels"
3. **Admin Notification** (to EMAIL_TO) - Subject: "[Loyer.Brussels] Test - ..."

## Troubleshooting

### Tests Fail - Database Errors

**Problem**: "Error lors de l'enregistrement"

**Solutions**:

1. Check Supabase credentials in `.env.local`
2. Verify tables exist
3. Check RLS policies allow service role
4. Review Supabase logs

```bash
# Verify environment variables are loaded
yarn test --env.local
```

### Tests Fail - Email Errors

**Problem**: Email-related errors in logs

**Solutions**:

1. Verify RESEND_API_KEY is valid
2. Check EMAIL_FROM domain is verified
3. Review Resend dashboard logs
4. Email failures should NOT fail tests (graceful degradation)

### Tests Timeout

**Problem**: Tests hang or timeout

**Solutions**:

1. Check network connectivity
2. Verify Supabase is accessible
3. Increase test timeout:

```typescript
it(
  "test name",
  async () => {
    // ...
  },
  { timeout: 10000 }
); // 10 seconds
```

### Cleanup Not Running

**Problem**: Test data remains in database

**Solutions**:

1. Run manual cleanup SQL (see above)
2. Check for test failures that prevented cleanup
3. Verify `afterAll` hooks are executing

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: yarn install

      - name: Run integration tests
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          EMAIL_FROM: ${{ secrets.EMAIL_FROM }}
          EMAIL_TO: ${{ secrets.EMAIL_TO }}
        run: yarn test integration
```

## Best Practices

### 1. Keep Tests Independent

Each test should be able to run independently without relying on other tests.

### 2. Clean Up After Tests

Always clean up test data in `afterAll` or `afterEach` hooks.

### 3. Use Descriptive Test Names

```typescript
it("should successfully submit with minimal required fields", ...)
// Better than:
it("works with minimal data", ...)
```

### 4. Test Real Scenarios

Tests use realistic data that mimics actual user submissions.

### 5. Verify Database State

Don't just check API responses - verify database records were created correctly.

### 6. Handle Async Properly

Always use `async/await` for database and email operations.

## Test Coverage

Run coverage report:

```bash
yarn test --coverage
```

Current coverage targets:

- **Contact Form**: >90% coverage
- **Questionnaire**: >90% coverage
- **Email Functions**: >80% coverage (some errors hard to test)

## Adding New Tests

### 1. Create Test File

```bash
touch app/actions/__tests__/my-feature.integration.test.ts
```

### 2. Follow Structure

```typescript
import { describe, it, expect, afterAll } from "vitest";

describe("My Feature Integration Tests", () => {
  afterAll(async () => {
    // Cleanup
  });

  it("should do something", async () => {
    // Arrange
    const data = createTestData();

    // Act
    const result = await myFunction(data);

    // Assert
    expect(result.success).toBe(true);
  });
});
```

### 3. Run Your Tests

```bash
yarn test my-feature
```

## Support

For issues or questions:

1. Check test logs for detailed error messages
2. Review Supabase logs
3. Check Resend dashboard
4. Consult `EMAIL_DATABASE_IMPLEMENTATION.md`

---

**Last Updated**: September 30, 2025  
**Test Email**: drag.markovic@gmail.com  
**Status**: ✅ All Tests Passing
