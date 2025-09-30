# Fix Summary: Infinite Rerender on Questionnaire Page

## Issue
Users experienced infinite rerenders when clicking on "questionnaire détaillé" button from the results page.

## Root Cause Analysis
The infinite rerender was caused by a circular dependency in a `useEffect` hook:

```typescript
// BEFORE (problematic code)
useEffect(() => {
  globalForm.updateRentalInfo({...});
  globalForm.updateHouseholdInfo({...});
  globalForm.updatePropertyIssues({...});
}, [data, globalForm]); // ❌ globalForm reference changes on every context update
```

**The Problem:**
1. User changes form data → `data` state updates
2. `useEffect` runs → calls `globalForm.update*()` methods
3. Global context updates → component re-renders with new `globalForm` reference
4. `useEffect` detects `globalForm` change → runs again
5. **Infinite loop!** 🔄

## Solution Implemented

### Step 1: Remove problematic useEffect
Removed the `useEffect` hook entirely to prevent the circular dependency.

### Step 2: Create stable update callback
```typescript
// Extract stable functions from context
const { updateRentalInfo, updateHouseholdInfo, updatePropertyIssues } = globalForm;

// Create memoized update function with stable dependencies
const updateData = useCallback((updates: Partial<QuestionnaireData>) => {
  setData((prev: QuestionnaireData) => {
    const newData = { ...prev, ...updates };
    
    // Schedule global context updates for AFTER render (prevents "Cannot update while rendering" warning)
    Promise.resolve().then(() => {
      updateRentalInfo({...});
      updateHouseholdInfo({...});
      updatePropertyIssues({...});
    });
    
    return newData;
  });
}, [updateRentalInfo, updateHouseholdInfo, updatePropertyIssues]); // ✅ Stable deps
```

### Step 3: Update all state setters
Replaced all `setData((prev) => ({ ...prev, field: value }))` calls with:
- `updateData({ field: value })`

This ensures both local and global state are updated together without triggering rerenders.

## Key Changes

### File: `/workspace/app/[locale]/calculateur/bruxelles/questionnaire/page.tsx`

1. **Import change** (Line 3):
   - Removed: `useEffect`
   - Added: `useCallback`

2. **Extract stable functions** (Lines 68-69):
   ```typescript
   const { updateRentalInfo, updateHouseholdInfo, updatePropertyIssues } = globalForm;
   ```

3. **New updateData function** (Lines 88-119):
   - Combines local and global state updates
   - Uses stable dependencies only
   - Properly typed with `QuestionnaireData`

4. **Updated all form handlers**:
   - Radio groups → `updateData({ leaseType: value })`
   - Input fields → `updateData({ leaseStartDate: e.target.value })`
   - Checkboxes → `updateData({ boilerMaintenance: checked as boolean })`
   - Textarea → `updateData({ additionalComments: e.target.value })`

5. **Fixed handleCheckboxChange** (Lines 178-189):
   ```typescript
   const handleCheckboxChange = useCallback((field, value, checked) => {
     const currentArray = data[field] as string[];
     const newArray = checked ? [...currentArray, value] : currentArray.filter(item => item !== value);
     updateData({ [field]: newArray });
   }, [data, updateData]);
   ```

## Testing Performed

✅ TypeScript compilation - No errors
✅ Code review - Proper dependency management
✅ Logic verification - State updates correctly synchronized

## Expected Behavior After Fix

1. ✅ User clicks "questionnaire détaillé" → Page loads instantly
2. ✅ User fills form fields → Updates work smoothly
3. ✅ Data syncs to global context → No rerenders
4. ✅ Navigation works → Session persists correctly

## Technical Benefits

1. **Performance**: Single state update operation instead of multiple
2. **Stability**: Dependencies are truly stable (useCallback from context)
3. **Maintainability**: Clearer update pattern
4. **Type Safety**: Explicit typing prevents runtime errors

## Related Files

- **Fixed**: `/workspace/app/[locale]/calculateur/bruxelles/questionnaire/page.tsx`
- **Context**: `/workspace/app/context/global-form-context.tsx` (uses useCallback for stable functions)
- **Parent**: `/workspace/app/components/rental-calculator/wuune-result-step.tsx` (link to questionnaire)

## Prevention Guidelines

To avoid similar issues in the future:

1. ✅ Always extract context functions when using them in useCallback/useEffect dependencies
2. ✅ Avoid putting entire context objects in dependency arrays
3. ✅ Prefer updating state in event handlers over useEffect when possible
4. ✅ Use React DevTools Profiler to detect rerender loops early
5. ✅ Ensure context providers memoize their update functions with useCallback

## Verification Steps

To verify the fix works:

1. Start the app: `npm run dev`
2. Navigate to calculator
3. Complete the calculation
4. Click "Questionnaire détaillé" button
5. Observe: Page loads without infinite rerenders
6. Fill out form fields
7. Verify: Data updates smoothly without lag

## E2E Test Results

**Test Suite**: `questionnaire-rerender-fix.spec.ts`  
**Date**: 2025-09-30

### ✅ All Critical Tests Passed

1. **Load without rerenders**: PASSED (5.2s)
   - Zero React error messages
   - Page loads successfully

2. **Form interactions**: PASSED (2.7s)
   - Zero "Cannot update while rendering" warnings
   - Form fields work correctly

3. **Network monitoring**: PASSED (4.1s)
   - Only 7 initial requests
   - Zero additional requests over 3 seconds
   - No infinite request loops

**Evidence**: 
- 0 React warnings detected ✅
- 0 additional network requests after load ✅
- Smooth navigation and form interactions ✅

See `/workspace/E2E_TEST_RESULTS.md` for detailed test report.

---

**Status**: ✅ FIXED & TESTED
**Date**: 2025-09-30
**Impact**: High (prevents infinite rerenders, improves UX)
**Test Coverage**: E2E tests verify fix works in real browser environment