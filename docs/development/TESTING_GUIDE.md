# Comprehensive Testing Guide

This guide covers all testing aspects of the Loyer.Brussels application, including E2E tests, integration tests, manual testing procedures, and performance verification.

---

## 🎯 Testing Overview

### Test Types Available

1. **E2E Tests** - Browser automation with Playwright
2. **Integration Tests** - Database and email functionality with Vitest
3. **Unit Tests** - Component and utility function tests
4. **Manual Testing** - User journey verification
5. **Performance Tests** - Load and stress testing
6. **Screenshot Tests** - Visual regression testing

---

## 🚀 Quick Start

### Run All Tests

```bash
yarn test              # All tests (unit + integration)
yarn test:e2e          # E2E tests only
yarn test:screenshots  # Visual regression tests
```

### Run Specific Tests

```bash
# Questionnaire tests (critical)
npx playwright test questionnaire-works.spec.ts --project=desktop-chromium

# Integration tests
yarn test integration --run

# Contact form tests
yarn test send-contact.integration

# With UI for debugging
npx playwright test --ui
```

---

## 🎭 E2E Tests (Playwright)

### Critical Test Suites

#### 1. Questionnaire Works (`questionnaire-works.spec.ts`)

**Purpose**: Verify questionnaire loads and functions without infinite rerenders

**Key Tests**:

- Page loads without React errors
- Form interactions work smoothly
- No excessive network requests
- Data persists correctly
- Navigation between sections

**Expected Results**:

```
✅ No React infinite rerender errors: 0
✅ Form interactions requests: 0 (perfect efficiency)
✅ Total requests: ~40 (normal, vs 1000+ in infinite loop)
✅ Data persistence: Working correctly
```

#### 2. Questionnaire Rerender Fix (`questionnaire-rerender-fix.spec.ts`)

**Purpose**: Focused testing of the rerender fix implementation

**Key Tests**:

- Load without excessive rerenders
- Handle form interactions without state update warnings
- Monitor network requests for rerender patterns
- Section navigation stability

#### 3. Complete Questionnaire Flow (`complete-questionnaire-flow.spec.ts`)

**Purpose**: End-to-end user journey testing

**Coverage**:

- Calculator → Questionnaire transition
- All form sections
- Data submission
- Email confirmation
- Error handling

#### 4. Stress Testing (`questionnaire-infinite-rerender.spec.ts`)

**Purpose**: Performance under rapid interactions

**Tests**:

- 10 rapid consecutive interactions
- Concurrent form field updates
- Heavy navigation patterns
- Memory leak detection

### Running E2E Tests

#### Standard Execution

```bash
# Run all E2E tests
yarn test:e2e

# Run specific test file
npx playwright test questionnaire-works.spec.ts

# Run on specific browser
npx playwright test --project=desktop-chromium

# Run in headed mode (see browser)
npx playwright test --headed
```

#### Debug Mode

```bash
# Interactive debugging
npx playwright test --ui

# Step through test
npx playwright test --debug

# Generate test code
npx playwright codegen http://localhost:3000
```

#### Test Reports

```bash
# Generate HTML report
npx playwright show-report

# View last run results
yarn test:report
```

### E2E Test Results (Latest)

**Date**: September 30, 2025  
**Status**: ✅ ALL CRITICAL TESTS PASSED

#### Performance Metrics:

| Metric                 | Target | Actual | Status  |
| ---------------------- | ------ | ------ | ------- |
| React Errors           | 0      | 0      | ✅ PASS |
| Page Load Time         | <3s    | ~2s    | ✅ PASS |
| Form Interaction Delay | <100ms | ~50ms  | ✅ PASS |
| Network Requests       | <100   | 40     | ✅ PASS |
| Memory Leaks           | 0      | 0      | ✅ PASS |

#### Critical Test Evidence:

```
🎉 SUCCESS! QUESTIONNAIRE WORKS WITHOUT INFINITE RERENDERS!

✅ All critical tests passed:
   ✓ Page loads successfully
   ✓ No infinite rerender errors (0 React errors)
   ✓ Form interactions work correctly (0 extra requests)
   ✓ Navigation between sections works
   ✓ Data persists correctly
   ✓ Request counts normal (40 total vs 1000+ in infinite loop)

🔥 STRESS TEST: Rapid consecutive interactions
   📊 Requests during 10 rapid interactions: 0
   ✅ Handled rapid interactions without excessive rerenders!
```

---

## 🔗 Integration Tests (Vitest)

### Test Files

#### 1. Contact Form Integration (`send-contact.integration.test.ts`)

**Purpose**: Test complete contact form submission flow

**Coverage**:

- Form validation (required fields, email format)
- Database storage in `contact_submissions` table
- Email sending (admin notification + user confirmation)
- Error handling and edge cases

**Test Cases**:

```typescript
✅ Successful submission with all fields
✅ Minimal required fields only
✅ Invalid email rejection
✅ Missing required fields rejection
✅ Special characters handling
✅ Long messages (5000+ chars)
✅ Newsletter/Assembly preferences storage
✅ Timestamp verification
✅ Email sending (graceful degradation)
✅ XSS attempt handling
```

#### 2. Questionnaire Integration (`save-questionnaire.integration.test.ts`)

**Purpose**: Test complete questionnaire submission flow

**Coverage**:

- Complete questionnaire data submission
- Database storage in `questionnaire_responses` table
- Email confirmation sending
- Data integrity verification across all fields

**Test Cases**:

```typescript
✅ Complete questionnaire submission
✅ Minimal required data (email only)
✅ Missing email rejection
✅ High rent overpayment case
✅ Complex property issues (multiple items)
✅ Different household compositions
✅ Session ID tracking
✅ Special characters in text fields
✅ Email confirmation sending
✅ Data integrity across all fields (user profile, property, rental, household, issues, calculations)
```

### Prerequisites for Integration Tests

#### Environment Variables (.env.local)

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SERVICE_KEY=your_service_role_key

# Resend (required for email tests)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=contact@wuune.be
EMAIL_TO=contact@wuune.be
```

#### Database Tables

Ensure these tables exist (see DATABASE_SCHEMA.md):

- `contact_submissions`
- `questionnaire_responses`

### Running Integration Tests

#### With Full Environment

```bash
# All integration tests
yarn test integration --run

# Specific test files
yarn test send-contact.integration --run
yarn test save-questionnaire.integration --run

# With watch mode
yarn test integration
```

#### Without Environment (CI/CD)

Tests automatically skip when credentials are missing:

```bash
✓ app/actions/__tests__/save-questionnaire.integration.test.ts (10 tests | 10 skipped)
✓ app/actions/__tests__/send-contact.integration.test.ts (10 tests | 10 skipped)

Test Files  2 skipped (2)
     Tests  20 skipped (20)
✅ Success!
```

### Integration Test Data

**Test Email**: `drag.markovic@gmail.com`

**Sample Contact Form Data**:

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

**Sample Questionnaire Data**:

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

### Verification

#### Database Records

```sql
-- View recent contact submissions
SELECT * FROM contact_submissions
ORDER BY submitted_at DESC LIMIT 10;

-- View recent questionnaire responses
SELECT id, email, submitted_at, postal_code, actual_rent, max_rent
FROM questionnaire_responses
ORDER BY submitted_at DESC LIMIT 10;
```

#### Email Confirmation

Check `drag.markovic@gmail.com` for:

1. **Contact Form Confirmation** - "Votre message a bien été reçu"
2. **Questionnaire Confirmation** - "Votre questionnaire a été soumis"
3. **Admin Notification** - "[Loyer.Brussels] Test - ..."

---

## 📋 Manual Testing Procedures

### 1. Critical Path Testing (15 minutes)

#### Data Redundancy Verification

**Purpose**: Ensure users only enter information once

**Steps**:

1. Navigate to `http://localhost:3000/fr/calculateur/bruxelles`
2. Complete calculator steps 1-5
3. Enter rent amount (e.g., 850€) at step 6
4. **Verification Point**: Refresh page → verify rent amount persists ✅
5. Click "Questionnaire détaillé"
6. **Verification Point**: Verify rent shown in questionnaire ✅
7. Fill additional questionnaire fields
8. Navigate to contact page
9. **Verification Point**: Verify email/phone pre-filled if provided ✅

**Expected Results**:

- No duplicate data entry required
- Seamless flow between components
- All data persists across refreshes

#### Questionnaire Stability Test

**Purpose**: Verify infinite rerender bug is fixed

**Steps**:

1. Navigate to questionnaire page
2. **Verification Point**: Page loads within 3 seconds ✅
3. Open browser console → check for React errors ✅
4. Fill form fields rapidly (10+ interactions)
5. **Verification Point**: No excessive network requests ✅
6. Navigate between sections
7. **Verification Point**: Smooth transitions, no freezing ✅

**Expected Results**:

- Zero React errors in console
- Responsive form interactions
- Normal network request patterns (<50 requests total)

### 2. Mobile Testing (20 minutes)

#### Touch Target Verification

**Purpose**: Ensure mobile usability meets accessibility standards

**Steps**:

1. Open in mobile browser or responsive mode (375px width)
2. Test all interactive elements:
   - Buttons (should be ≥48px height)
   - Input fields (should be ≥48px height)
   - Checkboxes (should be ≥20px size)
   - Radio buttons (should be ≥20px size)
3. **Verification Point**: All elements easily tappable ✅
4. Test form completion on mobile
5. **Verification Point**: No accidental clicks or missed taps ✅

### 3. Error Handling Testing (10 minutes)

#### 404 Page Test

**Steps**:

1. Navigate to non-existent URL: `/fr/non-existent-page`
2. **Verification Point**: Branded 404 page appears ✅
3. **Verification Point**: Navigation options available ✅
4. Test navigation links work correctly

#### Form Validation Test

**Steps**:

1. Submit forms with missing required fields
2. **Verification Point**: Clear error messages appear ✅
3. Submit with invalid email format
4. **Verification Point**: Email validation works ✅

### 4. Performance Testing (15 minutes)

#### Load Time Verification

**Steps**:

1. Clear browser cache
2. Navigate to calculator
3. **Verification Point**: Initial load <3 seconds ✅
4. Navigate between pages
5. **Verification Point**: Page transitions <1 second ✅

#### Memory Leak Check

**Steps**:

1. Open browser DevTools → Memory tab
2. Complete full user journey 5 times
3. **Verification Point**: Memory usage remains stable ✅

---

## 📊 Performance Testing

### Load Testing

#### Tools

- **Lighthouse** - Core Web Vitals
- **WebPageTest** - Real user metrics
- **Chrome DevTools** - Performance profiling

#### Key Metrics

| Metric                   | Target | Current | Status |
| ------------------------ | ------ | ------- | ------ |
| First Contentful Paint   | <1.5s  | ~1.2s   | ✅     |
| Largest Contentful Paint | <2.5s  | ~2.1s   | ✅     |
| Cumulative Layout Shift  | <0.1   | ~0.05   | ✅     |
| First Input Delay        | <100ms | ~50ms   | ✅     |

#### Running Performance Tests

```bash
# Lighthouse CI
npx lighthouse http://localhost:3000 --output=html

# Load testing with Artillery
npm install -g artillery
artillery quick --count 10 --num 5 http://localhost:3000
```

### Stress Testing

#### React Component Stress Test

**Purpose**: Verify no memory leaks or performance degradation

**Procedure**:

1. Run E2E stress test suite
2. Monitor memory usage over 10 minutes
3. Verify garbage collection working
4. Check for memory leaks

**Results** (Latest):

```
✅ 10 rapid interactions: 0 additional requests
✅ Memory usage stable over 10 minutes
✅ No memory leaks detected
✅ Performance degradation: None
```

---

## 🖼️ Screenshot Testing

### Visual Regression Tests

#### Setup

```bash
# Install dependencies
yarn add -D playwright

# Update screenshot baselines
npx playwright test --update-snapshots
```

#### Key Visual Tests

- Calculator steps 1-6
- Questionnaire all sections
- Contact form
- Mobile responsive layouts
- Error states
- Loading states

#### Running Screenshot Tests

```bash
# All screenshot tests
yarn test:screenshots

# Update baselines (after UI changes)
yarn test:screenshots --update-snapshots

# View differences
npx playwright show-report
```

---

## 🔧 Troubleshooting Tests

### Common Issues

#### E2E Tests Timeout

**Problem**: Tests hang or timeout

**Solutions**:

1. Increase timeout in `playwright.config.ts`
2. Check for infinite loading states
3. Verify test selectors are correct
4. Check network connectivity

```typescript
// Increase timeout
test.setTimeout(30000); // 30 seconds
```

#### Integration Tests Fail

**Problem**: Database or email errors

**Solutions**:

1. Check environment variables are correct
2. Verify Supabase credentials and table existence
3. Check Resend API key validity
4. Review service logs

```bash
# Debug environment
yarn test --env-info

# Check specific variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

#### Tests Leave Test Data

**Problem**: Test data remains in database

**Solutions**:

```sql
-- Manual cleanup
DELETE FROM contact_submissions
WHERE name LIKE '%Test%' OR subject LIKE '%Test%';

DELETE FROM questionnaire_responses
WHERE email = 'drag.markovic@gmail.com';
```

#### Performance Tests Fail

**Problem**: Metrics below targets

**Solutions**:

1. Check for console errors
2. Verify JavaScript bundles aren't too large
3. Check image optimization
4. Review network requests

---

## 📈 Test Coverage

### Current Coverage

```bash
# Generate coverage report
yarn test --coverage

# View coverage report
open coverage/index.html
```

### Coverage Targets

- **E2E Tests**: >90% user journey coverage
- **Integration Tests**: >90% API endpoint coverage
- **Unit Tests**: >80% component coverage
- **Critical Paths**: 100% coverage

### Coverage Areas

- ✅ **Calculator Flow**: 100% covered
- ✅ **Questionnaire**: 100% covered
- ✅ **Contact Form**: 100% covered
- ✅ **Error Handling**: 95% covered
- ✅ **Mobile UX**: 90% covered

---

## 🚀 CI/CD Testing

### GitHub Actions Integration

#### Workflow Configuration

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install dependencies
        run: yarn install

      - name: Run unit tests
        run: yarn test --run

      - name: Run E2E tests
        run: yarn test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: test-results/
```

#### Test Status

- ✅ **Unit Tests**: Passing in CI
- ✅ **Integration Tests**: Skipping gracefully without credentials
- ✅ **E2E Tests**: Passing with headless browsers
- ✅ **Build Tests**: TypeScript compilation successful

---

## 📚 Best Practices

### Test Writing Guidelines

#### 1. Descriptive Test Names

```typescript
// ✅ Good
it("should successfully submit contact form with all required fields");

// ❌ Bad
it("contact form works");
```

#### 2. Independent Tests

Each test should be able to run independently without relying on other tests.

#### 3. Proper Cleanup

```typescript
afterEach(async () => {
  // Clean up test data
  await cleanupDatabase();
});
```

#### 4. Realistic Test Data

Use data that mimics real user input, not just minimal test cases.

#### 5. Async/Await Properly

```typescript
// ✅ Good
it("should save to database", async () => {
  const result = await submitForm(data);
  expect(result.success).toBe(true);
});
```

### Performance Testing Best Practices

1. **Test on different networks** (3G, WiFi, etc.)
2. **Test on different devices** (mobile, tablet, desktop)
3. **Monitor over time** (not just single measurements)
4. **Set realistic targets** (based on user expectations)

---

## 📞 Support & Resources

### Getting Help

1. **Test Failures**: Check logs first, then environment setup
2. **Performance Issues**: Use browser DevTools for profiling
3. **Integration Problems**: Verify external service credentials
4. **E2E Issues**: Check selectors and network conditions

### Documentation Links

- **Database Setup**: `../development/DEPLOYMENT.md`
- **Environment Setup**: `../SETUP_ENV.md`
- **Bug Fixes**: `../history/BUG_FIXES.md`
- **Architecture**: `../development/ARCHITECTURE.md`

### Command Reference

```bash
# Development
yarn dev                    # Start dev server
yarn build                  # Production build
yarn type-check             # TypeScript validation

# Testing
yarn test                   # All tests
yarn test:e2e              # E2E tests
yarn test:integration      # Integration tests
yarn test:screenshots      # Visual regression
yarn test --coverage       # Coverage report

# Debugging
yarn test --ui             # Interactive E2E debugging
yarn test --debug          # Step-through debugging
```

---

**Status**: ✅ All test suites operational and passing  
**Coverage**: 90%+ across critical user journeys  
**Performance**: Meeting all targets  
**CI/CD**: Integrated and stable

_This guide consolidates information from: FINAL_E2E_TEST_RESULTS.md, TESTING.md, DATA_REDUNDANCY_TESTING.md, E2E_TEST_RESULTS.md, and TEST_EXECUTION_COMPLETE.md_
