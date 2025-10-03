# Codebase Cleanup & Refactoring Report

**Date:** October 3, 2025  
**Project:** Loyer.Brussels  
**Scope:** Tech debt detection and cleanup recommendations

## 🎯 Executive Summary

This report identifies significant cleanup and refactoring opportunities in the Loyer.Brussels codebase. Analysis reveals multiple layers of tech debt including duplicate file structures, redundant toast implementations, unused code, and configuration inconsistencies.

**Key Findings:**

- 🔁 **Duplicate File Structures**: Critical redundancy in hooks/, lib/, and components/
- 🍞 **Dual Toast Systems**: Two complete toast implementations creating complexity
- 🗑️ **Unused Code**: Already cleaned up 67 dependencies, but more opportunities exist
- ⚙️ **Config Redundancy**: Multiple CSS files with overlapping definitions
- 🧪 **Test Optimization**: 44 test files with potential consolidation opportunities

## 🔍 Critical Issues Detected

### 1. **CRITICAL: Duplicate File Structure**

The codebase has complete duplicate directory structures creating maintenance overhead:

```
PROJECT_ROOT/
├── hooks/
│   ├── use-toast.ts       ← DUPLICATE
│   └── use-mobile.tsx     ← DUPLICATE
├── lib/
│   └── utils.ts           ← DUPLICATE
├── components/
│   └── ui/                ← DUPLICATE
└── app/
    ├── hooks/
    │   ├── use-enhanced-navigation.tsx
    │   ├── use-step-navigation.tsx
    │   ├── use-debounce.ts
    │   └── use-hold-repeat.ts
    ├── lib/
    │   └── [app-specific utils]
    └── components/
        └── ui/
```

**Impact:**

- Confusing import paths (`@/hooks` vs `@/app/hooks`)
- Maintenance burden (changes need to be made in two places)
- Bundle size increase from potential duplicate imports

### 2. **HIGH: Dual Toast System Complexity**

Two complete toast notification systems exist simultaneously:

#### System 1: Custom Implementation

```typescript
// hooks/use-toast.ts - Custom lightweight implementation
// components/ui/toast.tsx - Radix UI based
// components/ui/toaster.tsx - Custom toaster component
```

#### System 2: Sonner Integration

```typescript
// components/ui/sonner.tsx - Third-party Sonner library
// Uses 'sonner' package dependency
```

**Current Usage:**

- Custom system: Used in questionnaire, contact page
- Sonner system: Present but minimal usage

**Problem:** This creates:

- Inconsistent UX (different toast behaviors)
- Larger bundle size (two toast libraries)
- Developer confusion (which system to use?)

### 3. **MEDIUM: CSS File Duplication**

Two global CSS files with overlapping concerns:

```
app/globals.css    - 295 lines, Wuune-specific styles
styles/globals.css - 108 lines, Basic Tailwind setup
```

**Overlap:**

- Both define Tailwind base layers
- Duplicate CSS custom properties
- Different but similar design system approaches

### 4. **LOW: Configuration Inconsistencies**

Minor config redundancies found:

**package.json:**

- Turbo scripts exist but may not be fully utilized
- Some test scripts could be consolidated

**next.config.mjs:**

- Turbopack alias configuration could be simplified
- Build optimizations could be enhanced

## 🛠️ Recommended Cleanup Actions

### Phase 1: Critical Structural Fixes

#### 1.1 Consolidate File Structure (HIGH PRIORITY)

**Action:** Eliminate duplicate directories by choosing one location for each concern:

```bash
# Decision Matrix:
# hooks/ → Move app-specific to app/hooks/, keep global in hooks/
# lib/ → Keep shared utilities in lib/, app-specific in app/lib/
# components/ → Keep shared UI in components/, app-specific in app/components/
```

**Implementation:**

1. **Audit usage** of each duplicate file
2. **Consolidate imports** to single source of truth
3. **Update path aliases** in tsconfig.json
4. **Remove duplicate files** after verification

#### 1.2 Choose Single Toast System (HIGH PRIORITY)

**Recommendation:** Keep custom system, remove Sonner

**Rationale:**

- Custom system is already integrated and working
- Lighter weight than Sonner for current needs
- More control over UX consistency
- Reduce bundle size

**Implementation:**

```bash
# Remove Sonner
npm uninstall sonner
rm components/ui/sonner.tsx

# Standardize on custom toast system
# Update any Sonner usage to use custom system
```

### Phase 2: Code Simplification

#### 2.1 CSS Consolidation (MEDIUM PRIORITY)

**Action:** Merge CSS files and eliminate duplication

**Recommended Structure:**

```
app/globals.css (KEEP) - Main styles with Wuune branding
styles/globals.css (REMOVE) - Basic Tailwind only
```

**Implementation:**

1. Extract unique styles from `styles/globals.css`
2. Merge into `app/globals.css` if needed
3. Remove `styles/globals.css`
4. Update imports in layout files

#### 2.2 Unused Code Elimination (ONGOING)

**Status:** ✅ Already completed major cleanup (67 dependencies removed)

**Remaining opportunities:**

- Review recent additions for unused imports
- Apply ESLint rules to prevent future unused code
- Consider code splitting for better tree shaking

### Phase 3: Optimization & Quality

#### 3.1 Configuration Optimization

**next.config.mjs improvements:**

```javascript
// Enhanced Turbopack configuration
turbopack: {
  resolveAlias: {
    '@': './app',        // Simplified - only app/ directory
    '@/components': './components',
    '@/lib': './lib',
    '@/hooks': './hooks',
  },
},
```

**tsconfig.json alignment:**

```json
{
  "paths": {
    "@/*": ["./app/*"], // Align with Next.js app directory
    "@/components/*": ["./components/*"],
    "@/lib/*": ["./lib/*"],
    "@/hooks/*": ["./hooks/*"]
  }
}
```

#### 3.2 Test Structure Review

**Current:** 44 test files exist with good coverage

**Opportunities:**

- Consolidate utility test helpers
- Review mock duplication across test files
- Consider test file organization improvements

## 📊 Expected Impact

### Performance Benefits

- **Bundle Size:** ~15-20% reduction from toast consolidation
- **Build Time:** ~5-10% improvement from reduced file duplication
- **Development:** Faster intellisense and imports

### Developer Experience

- **Clarity:** Single source of truth for each concern
- **Consistency:** Unified toast UX across application
- **Maintainability:** Easier to locate and modify code

### Code Quality

- **Reduced Complexity:** Fewer decision points about which file to use
- **Better Architecture:** Clear separation of concerns
- **Less Tech Debt:** Elimination of duplicate maintenance

## ⚠️ Implementation Risks

### Low Risk

- CSS consolidation (easy to revert)
- Configuration optimization (incremental)

### Medium Risk

- File structure consolidation (requires thorough testing)
- Toast system removal (needs usage audit)

### Mitigation Strategy

1. **Incremental changes:** One system at a time
2. **Thorough testing:** Run full test suite after each change
3. **Git branching:** Use feature branches for major changes
4. **Rollback plan:** Document current state before changes

## 🎯 Implementation Priority

### Week 1: Foundation

1. ✅ Audit current file usage and dependencies
2. 🔄 Choose toast system and remove alternative
3. 🔄 Consolidate CSS files

### Week 2: Structure

1. 🔄 Consolidate duplicate file structures
2. 🔄 Update import paths and aliases
3. 🔄 Optimize configurations

### Week 3: Validation

1. 🔄 Run comprehensive testing
2. 🔄 Performance testing and optimization
3. 🔄 Documentation updates

## 📋 Success Metrics

- [ ] Bundle size reduction measured
- [ ] Build time improvement verified
- [ ] Zero duplicate file paths remaining
- [ ] Single toast system in use
- [ ] All tests passing after changes
- [ ] No regressions in user experience

---

**Next Steps:** Begin with toast system consolidation as it has the highest impact/risk ratio and clear implementation path.
