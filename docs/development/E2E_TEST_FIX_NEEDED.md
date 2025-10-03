# E2E Mouse Acceleration Tests - Fix Required

## Status
❌ **Tests are failing** - All mouse acceleration tests in `tests/e2e/mouse-acceleration.spec.ts` fail with 0 increments

## Root Cause
Tests run against the **development server** (`yarn dev`) which has **Fast Refresh/HMR enabled**. This causes:
- Component remounts during test execution
- `setTimeout` callbacks in `useHoldRepeat` hook never fire
- State resets mid-test

## Evidence
Browser console shows: `[Fast Refresh] rebuilding` during test runs

## Solution Required
Choose ONE of these approaches:

### Option 1: Run tests against production build ✅ RECOMMENDED
```typescript
// playwright.config.ts
webServer: {
  command: "npm run build && npm run start",
  url: "http://localhost:3000",
  reuseExistingServer: false,
  timeout: 120 * 1000,
}
```

### Option 2: Disable Fast Refresh for tests
Create a test-specific dev script:
```json
// package.json
"scripts": {
  "dev:test": "NEXT_DEV_TEST=true next dev -p 3002"
}
```

Then in `next.config.mjs`:
```javascript
export default {
  // ... existing config
  reactStrictMode: process.env.NEXT_DEV_TEST !== 'true',
}
```

Update `playwright.config.ts`:
```typescript
webServer: {
  command: "npm run dev:test",
  // ...
}
```

### Option 3: Use static export for tests
Build a static version for testing (fastest option):
```typescript
webServer: {
  command: "npm run build && npx serve out -l 3002",
  // ...
}
```

## What's Already Fixed
✅ Test helpers exposed on `window.__testHelpers`  
✅ Component `useEffect` dependency fixed (no render loop)  
✅ Playwright HTML report auto-open disabled  
✅ `data-testid` attributes added to buttons

## Test File
`tests/e2e/mouse-acceleration.spec.ts` - Ready to work once environment is stable

## Component
`app/components/rental-calculator/property-details-step.tsx` - Has test helpers

## Next Steps
1. Implement one of the solution options above
2. Run tests: `npx playwright test tests/e2e/mouse-acceleration.spec.ts`
3. All tests should pass ✅

## Reference
See `docs/development/E2E_MOUSE_ACCELERATION_INVESTIGATION.md` for full investigation details
