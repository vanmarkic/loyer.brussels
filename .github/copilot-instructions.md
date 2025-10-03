# AI Coding Agent Instructions - Loyer.Brussels

## Project Overview
**Loyer.Brussels** is a Next.js 15 rental price calculator for Brussels properties, built with React 19, TypeScript, next-intl (i18n), Supabase, and deployed on Vercel. The app guides users through a multi-step form to estimate fair rent prices based on property characteristics and location.

## Architecture Patterns

### Global State Management
- **Primary Context**: `app/context/global-form-context.tsx` manages the entire calculator flow with a reducer pattern
- **Session Persistence**: Form state auto-saves to sessionStorage (key: `loyer-brussels-form-data`)
- **State Structure**: 7 main sections - `userProfile`, `propertyInfo`, `rentalInfo`, `householdInfo`, `propertyIssues`, `calculationResults`, `currentStep`
- Session IDs generated via `crypto.randomUUID()` for tracking submissions

### Step-Based Navigation
- URL pattern: `/[locale]/calculateur/bruxelles/step/[step]` where step = `property-type | property-details | features | energy | address | results`
- Step numbers map 1:6 in `useStepNavigation` hook
- Each step component uses `useStepNavigationContext()` for consistent forward/back navigation
- Step sync: URL param drives `currentStep` state on mount via `useEffect`

### Server Actions & Data Flow
- **Server Actions**: Located in `app/actions/` (e.g., `save-questionnaire.ts`, `search-addresses.ts`)
- **Repository Pattern**: `app/data/repositories/` abstracts Supabase operations
- **Email**: Uses Resend API via `app/lib/email.ts` for contact/questionnaire confirmations
- **Address Search**: BestAddress API integration with debounce (500ms) via `use-debounce` hook

### Component Conventions
- **Hold-to-Increment**: `useHoldRepeat` hook (3-phase acceleration: 150ms → 100ms → 50ms) for property size controls
- **Internationalization**: All user-facing strings via `useTranslations('ComponentName')` from next-intl
- **UI Components**: Radix-based primitives in `components/ui/` (shadcn/ui pattern)
- **Layouts**: Shared `UnifiedCalculatorLayout` wraps all calculator steps

## Testing Strategy

### Unit Tests (Vitest)
```bash
npm run test              # Run all unit tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```
- **Setup**: `vitest.setup.ts` loads `.env.local` and configures jest-dom matchers
- **Mocking Pattern**: Mock Next.js navigation (`useRouter`, `useParams`) in every test file
- **Component Tests**: Use `@testing-library/react` with extensive mocking of contexts/hooks
- Example mock pattern (see `result-step.test.tsx`):
  ```tsx
  vi.mock('@/app/context/global-form-context', () => ({
    useGlobalForm: () => ({ state: mockState, ...mockMethods }),
  }));
  ```

### E2E Tests (Playwright)
```bash
npm run test:e2e          # Headless run (projects: desktop-chromium, mobile-safari, tablet)
npm run test:e2e:ui       # Interactive UI mode
npm run test:report       # View HTML report
```
- **Config**: `playwright.config.ts` runs on port 3002 (to avoid conflicts)
- **Navigation Pattern**: Always use `page.goto('/[locale]/calculateur/bruxelles/step/[step]')` then wait for `#size` input visibility
- **Screenshots**: Auto-captured on failure (`test-results/`)
- **Critical Test**: `mouse-acceleration.spec.ts` verifies 3-phase hold-to-increment UX

## Development Workflows

### Commands
```bash
npm run dev               # Start dev server (port 3000)
npm run build             # Production build (Next.js 15)
npm run lint              # ESLint
npm run typecheck         # TypeScript check (no emit)
```

### Environment Setup
Required `.env.local` variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SERVICE_KEY=your-service-role-key
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=contact@wuune.be
EMAIL_TO=contact@wuune.be
```
See `docs/QUICK_START.md` for full setup including Supabase table schemas.

## Database Schema (Supabase)
- **Tables**: `contact_submissions`, `questionnaire_responses`, `rent_records`
- **RLS**: Enabled with service-role-only policies
- **Schema Docs**: `docs/DATABASE_SCHEMA.md`

## Key Principles (from AGENTS.md)

1. **Root Cause Over Symptoms**: Detect code smells, apply TDD, solve underlying issues
2. **Documentation**: Store generated `.md` files in `./docs` with proper categorization (`development/`, `analysis/`, `history/`)
3. **Testing**: Always use Vitest (not Jest), run Playwright headless locally
4. **Code Quality**: Boy Scout Rule - leave codebase cleaner, remove unnecessary code
5. **Tools**: Use context7 MCP server for library docs

## Common Patterns

### Adding a New Calculator Step
1. Create component in `app/components/rental-calculator/[step-name]-step.tsx`
2. Update `app/components/rental-calculator/calculator.tsx` step rendering
3. Add step mapping in `useStepNavigation` hook
4. Add translations to `messages/[locale].json`
5. Write unit tests with full context mocking
6. Add E2E navigation test in `tests/e2e/`

### Fixing "Element Detached" E2E Errors
- **Cause**: Component rerenders during Playwright interaction (often from `useEffect` syncing state)
- **Fix**: Ensure input elements don't remount; use refs for auto-increment, avoid state changes that trigger full rerenders

### Mocking in Tests
- **Context Mocking**: Mock `useGlobalForm`, `useRouter`, `useParams` at top of test file
- **Component Mocking**: Mock child components when testing parent logic (e.g., `UnifiedCalculatorLayout`)
- **Async Actions**: Mock server actions like `saveQuestionnaireResponse` with `vi.fn()`

## Quick Reference

- **Docs Hub**: `docs/README.md` links to all guides
- **Step Components**: `app/components/rental-calculator/*-step.tsx`
- **Hooks**: `app/hooks/` (especially `use-step-navigation.tsx`, `use-hold-repeat.ts`)
- **Types**: `app/data/global-form-types.ts`, `app/data/types.ts`
- **Actions**: `app/actions/*.ts` for server-side operations

## Debugging Tips

- **Test Failures**: Check `test-results/` for screenshots/videos
- **State Issues**: Console log `sessionStorage.getItem('loyer-brussels-form-data')`
- **Navigation Bugs**: Verify step number matches URL param in `useEffect` sync
- **Mouse Acceleration**: Ensure buttons have both `onPointerDown/Up` AND `onMouseDown/Up` handlers for cross-device compatibility
