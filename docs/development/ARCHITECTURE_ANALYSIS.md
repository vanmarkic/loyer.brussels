# Architecture Analysis & Re-architecture Plan

## Current State Analysis

### Critical Issues Identified

#### 1. **Duplicate Files & Folders**
- **CSS Duplication**: Both `app/globals.css` and `styles/globals.css` exist
  - `app/globals.css`: 355 lines with Wuune branding, Tailwind config, mobile optimizations
  - `styles/globals.css`: 98 lines with basic Tailwind setup
  - **Action**: Delete `styles/` folder entirely, consolidate into `app/globals.css`

- **Utils Duplication**: Both `/lib/utils.ts` and `/app/lib/utils.ts` are IDENTICAL (100% duplicate)
  - Both contain: `cn()` utility, PDF generation, formula logic
  - **Action**: Delete `/lib/utils.ts`, update all imports to use `@/app/lib/utils`

- **UI Components Split**: UI components exist in both `/components/ui/` and `/app/components/ui/`
  - `/components/ui/`: shadcn/ui primitives (alert, button, card, input, etc.)
  - `/app/components/ui/`: Custom components (enhanced-progress)
  - **Action**: Consolidate all UI into `/components/ui/`, move app-specific to `/app/components/`

#### 2. **i18n Configuration Scattered**
- `src/i18n/` contains active next-intl configuration (navigation.ts, request.ts)
- Located outside standard Next.js 15 App Router conventions
- Only 4 files import from this location
- **Action**: Move to `app/i18n/` for consistency with App Router patterns

#### 3. **Mixed Concerns in `app/` Directory**
Current structure mixes infrastructure, business logic, and presentation:
```
app/
├── actions/          # Server actions
├── components/       # Presentation layer
├── context/          # State management
├── data/            # Data layer + types
├── hooks/           # React hooks
├── lib/             # Utilities + business logic
└── server/          # Server-side utilities
```

#### 4. **Inconsistent Test Placement**
- Unit tests co-located with source files (`.test.ts`)
- E2E tests in separate `/tests/e2e/` folder
- Some tests in `__tests__/` subdirectories
- **Current approach is actually GOOD** - keep co-located unit tests

#### 5. **Unused/Orphaned Assets**
- Debug images at root: `debug-property-details.png`, `debug-property-type.png`
- `test-output.log` at root
- Multiple tsconfig files: `tsconfig.json`, `tsconfig.tsbuildinfo`
- **Action**: Move debug assets to `/docs/analysis/`, delete logs, keep tsbuildinfo in .gitignore

#### 6. **Root-Level Clutter**
Too many config files at root (21 files before cleaning):
- Config files: 8 (package.json, tsconfig, etc.)
- Documentation: 2 (README, AGENTS)
- Debug/temp files: 3
- Necessary infrastructure: 8

---

## Proposed Re-architecture

### Phase 1: Immediate Cleanup (Delete/Consolidate)

#### 1.1 Delete Duplicate Files
```bash
# Remove duplicate utilities
rm lib/utils.ts

# Remove duplicate CSS folder
rm -rf styles/

# Remove debug artifacts
mv debug-*.png docs/analysis/
rm test-output.log
```

#### 1.2 Consolidate i18n Configuration
```bash
# Move i18n to App Router location
mv src/i18n app/i18n
rm -rf src/

# Update 4 import statements:
# - middleware.ts
# - app/components/language-switcher.tsx
# - app/[locale]/layout.tsx
```

#### 1.3 Merge UI Components
```bash
# Move app-specific UI to components
mv app/components/ui/enhanced-progress.tsx components/ui/

# Update imports in app/components/rental-calculator/
```

---

### Phase 2: Structural Reorganization

#### 2.1 Feature-Based Architecture for Calculator

**Problem**: Calculator logic is scattered across multiple folders
- Steps in `app/components/rental-calculator/`
- State in `app/context/`
- Actions in `app/actions/`
- Types in `app/data/`

**Solution**: Feature-based organization

```
app/
├── features/
│   └── calculator/
│       ├── components/          # Step components
│       │   ├── property-type-step.tsx
│       │   ├── property-details-step.tsx
│       │   ├── features-step.tsx
│       │   ├── energy-step.tsx
│       │   ├── address-step.tsx
│       │   └── result-step.tsx
│       ├── context/             # Calculator-specific state
│       │   └── global-form-context.tsx
│       ├── hooks/               # Calculator-specific hooks
│       │   ├── use-step-navigation.tsx
│       │   └── use-hold-repeat.ts
│       ├── actions/             # Calculator server actions
│       │   ├── fetch-difficulty-index.ts
│       │   └── search-addresses.ts
│       ├── lib/                 # Calculator business logic
│       │   ├── rent-calculator.ts
│       │   ├── utils.ts (PDF, formula)
│       │   └── address/
│       └── types.ts             # Calculator types
```

#### 2.2 Shared Infrastructure Layer

```
app/
├── lib/                    # Shared utilities
│   ├── email.ts
│   ├── supabase.ts
│   └── utils.ts (cn only)
├── components/             # Shared components
│   ├── language-switcher.tsx
│   └── layouts/
├── hooks/                  # Shared hooks
│   └── use-debounce.ts
├── i18n/                   # Internationalization
│   ├── navigation.ts
│   └── request.ts
└── server/                 # Server utilities
    └── supabase-admin.ts
```

#### 2.3 Data Layer Consolidation

**Problem**: `app/data/` mixes types, interfaces, and repositories

**Solution**: Separate by concern
```
app/
├── data/
│   ├── repositories/       # Keep as-is (DB access layer)
│   └── models/             # Rename from interfaces/
└── types/                  # Move types to root of app/
    ├── global-form-types.ts
    └── index.ts (consolidate types.ts)
```

---

### Phase 3: File/Folder Naming Conventions

#### 3.1 Component Naming
- **Shared UI**: `components/ui/button.tsx` (kebab-case)
- **Feature Components**: `features/calculator/components/property-type-step.tsx`
- **Page Components**: `app/[locale]/calculateur/bruxelles/step/[step]/page.tsx`

#### 3.2 Test Naming
- **Unit Tests**: Co-located `*.test.ts` or `*.test.tsx`
- **Integration Tests**: `*.integration.test.ts`
- **E2E Tests**: `tests/e2e/*.spec.ts`

---

### Phase 4: Import Path Optimization

#### 4.1 Update `tsconfig.json` paths
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./app/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./app/lib/*"],
      "@/features/*": ["./app/features/*"],
      "@/types/*": ["./app/types/*"]
    }
  }
}
```

#### 4.2 Import Pattern Guidelines
- Shared utilities: `@/lib/utils`
- Calculator features: `@/features/calculator/...`
- UI components: `@/components/ui/...`
- Types: `@/types/...`

---

## Final Structure (Target State)

```
loyer.brussels/
├── app/
│   ├── features/
│   │   ├── calculator/          # Calculator feature module
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── hooks/
│   │   │   ├── actions/
│   │   │   ├── lib/
│   │   │   └── types.ts
│   │   └── contact/             # Future: Contact feature module
│   ├── components/              # Shared components
│   │   ├── language-switcher.tsx
│   │   └── layouts/
│   ├── data/
│   │   ├── repositories/        # DB access layer
│   │   └── models/              # Domain models
│   ├── hooks/                   # Shared hooks
│   ├── i18n/                    # i18n config
│   ├── lib/                     # Shared utilities
│   ├── server/                  # Server utilities
│   ├── types/                   # Shared types
│   └── [locale]/               # Next.js routes
├── components/
│   └── ui/                      # shadcn/ui primitives (consolidated)
├── docs/                        # All documentation
├── messages/                    # i18n messages
├── public/                      # Static assets
├── scripts/                     # Build scripts
├── tests/
│   └── e2e/                     # E2E tests only
└── [config files]               # Root configs
```

---

## Migration Steps (Ordered)

### Step 1: Clean Duplicates (Low Risk)
1. Delete `lib/utils.ts`
2. Update imports: `@/lib/utils` → `@/app/lib/utils`
3. Delete `styles/` folder
4. Update CSS imports in `app/layout.tsx`
5. Move debug files: `docs/analysis/debug-*`
6. Delete `test-output.log`

### Step 2: Consolidate i18n (Medium Risk)
1. Move `src/i18n/` → `app/i18n/`
2. Update 4 import statements
3. Delete `src/` folder
4. Run type check: `npm run typecheck`
5. Run tests: `npm run test`

### Step 3: Merge UI Components (Medium Risk)
1. Move `app/components/ui/enhanced-progress.tsx` → `components/ui/`
2. Update imports in calculator components
3. Run tests: `npm run test`

### Step 4: Feature-Based Refactor (High Risk - Do Last)
1. Create `app/features/calculator/` structure
2. Move calculator components incrementally
3. Update imports per component
4. Test after each move
5. Update context/hooks/actions references

### Step 5: Optimize Imports (Low Risk)
1. Update `tsconfig.json` paths
2. Run codemod for bulk import updates (if needed)
3. Test build: `npm run build`

---

## Risk Assessment

### Low Risk Changes ✅
- Delete duplicate `lib/utils.ts`
- Delete `styles/` folder
- Move debug files
- Update import paths (automated)

### Medium Risk Changes ⚠️
- Move i18n configuration (4 files to update)
- Consolidate UI components (test UI rendering)
- Reorganize data layer

### High Risk Changes 🔴
- Feature-based calculator refactor (30+ files affected)
- Context/state reorganization (affects all calculator steps)
- Type system restructuring

---

## Metrics Improvement

### Before Re-architecture
- Total Folders: ~30
- Root Files: 21
- Duplicate Files: 4 (lib/utils.ts, styles/globals.css, etc.)
- Import Path Depth: 4-5 levels average
- Feature Coupling: High (scattered across 7 folders)

### After Re-architecture (Target)
- Total Folders: ~20 (-33%)
- Root Files: 17 (-19%)
- Duplicate Files: 0 (-100%)
- Import Path Depth: 2-3 levels average (-40%)
- Feature Coupling: Low (encapsulated in features/)

---

## Testing Strategy

### Per-Phase Testing
1. **After duplicates cleanup**: Run `npm run typecheck && npm run test`
2. **After i18n move**: Test language switching, routing
3. **After UI consolidation**: Visual regression tests, E2E calculator flow
4. **After feature refactor**: Full test suite + manual calculator walkthrough

### Rollback Plan
- Git branch per phase: `refactor/phase-1`, `refactor/phase-2`, etc.
- Tag stable states: `v-pre-refactor`, `v-phase-1-stable`
- Keep original structure in `archive/` branch for reference

---

## Success Criteria

- [ ] Zero duplicate code files
- [ ] All tests passing (unit + E2E)
- [ ] Build time < 10% increase
- [ ] Import paths 2-3 levels max
- [ ] Calculator feature fully encapsulated
- [ ] Documentation updated (QUICK_START.md, copilot-instructions.md)
- [ ] No runtime errors in dev/production

---

## Next Steps

1. **Review & Approve**: Stakeholder review of this plan
2. **Create Branch**: `git checkout -b refactor/architecture-cleanup`
3. **Execute Phase 1**: Start with low-risk cleanup
4. **Incremental PRs**: One PR per phase for easier review
5. **Update Docs**: Finalize QUICK_START.md with new structure

---

**Generated**: 2025-10-03  
**Status**: Proposal - Awaiting Approval  
**Estimated Effort**: 6-8 hours for full migration
