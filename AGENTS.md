# Agent Guidelines

## Commands
- **Dev**: `npm run dev` (with turbo: `npm run dev:turbo`)
- **Build**: `npm run build` | `npm run typecheck`
- **Lint**: `npm run lint`
- **Tests**: `npm run test` (watch: `npm run test:watch`, single file: `npm run test <path>`)
- **Integration**: `npm run test:integration`
- **E2E**: `npm run test:e2e` (UI mode: `npm run test:e2e:ui`, report: `npm run test:report`)

## Architecture
- **Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind, Vitest, Playwright
- **Database**: Supabase (admin client in `app/server/supabase-admin.ts`, public in `app/lib/supabase.ts`)
- **Internationalization**: next-intl with routing in `i18n/routing.ts`
- **Structure**: `/app` contains features, components, actions (server actions), hooks, lib utilities
- **Features**: Feature-based architecture in `app/features/` (e.g., `calculator/`)
- **Repositories**: Repository pattern in `app/data/repositories/` with interfaces and Supabase implementations

## Code Style
- **Imports**: Use `@/` for root imports, `@/app/*`, `@/features/*`, `@/components/*`, `@/hooks/*` path aliases
- **UI Components**: Import from `@/app/components/ui/` (shadcn/ui with Radix)
- **Hooks**: Place in `@/app/hooks/`, never import from `@/components/ui/use-*` (ESLint rule enforced)
- **Client Components**: Always mark with `"use client"` directive at top
- **Types**: Use TypeScript strictly, define interfaces/types explicitly
- **Utils**: Use `cn()` from `@/app/lib/utils` or `@/features/calculator/lib/utils` for className merging
- **Icons**: Use lucide-react
- **Styling**: Tailwind utility classes, responsive design with mobile-first approach

## Testing
- **Unit/Integration**: Vitest with `@testing-library/react`, globals enabled, jsdom environment
- **E2E**: Playwright in `tests/e2e/`, run headless by default, UI mode for debugging
- **Run Single Test**: `npm run test <file-path>` or `vitest <file-path>`

## Development Principles
- **TDD**: Write tests BEFORE implementing features (red-green-refactor)
- **Root Causes**: Solve underlying issues, not symptoms; detect code smells
- **Clean Code**: Boy scout rule - leave code cleaner than you found it
- **Documentation**: Place generated .md files in `docs/` folder, organized by topic
- **No Comments**: Avoid code comments unless complex or explicitly requested
- **Self-Terminating Commands**: Use non-watch modes by default (e.g., `npx playwright test`, not `--watch`)

## Additional Rules
- Use Vitest (not Jest)
- Removing code is encouraged
- Run Playwright headless locally
- Use MCP servers (especially context7)
