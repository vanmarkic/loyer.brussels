# UX Critical Issues Analysis - Loyer.brussels Calculator

_Analysis Date: September 28, 2025_

## Executive Summary

This analysis identifies critical usability violations in the rental calculator interface using systematic UX methodologies including Nielsen's heuristics, WCAG accessibility guidelines, cognitive load theory, and Norman's design principles.

## Critical Issues Identified

### 1. **SEVERE: Broken Progress Indicator**

**Heuristic Violation**: Visibility of System Status

- **Issue**: Progress shows "1kB • 7% complete"
- **Impact**: Technical jargon confuses users, "1kB" has no meaning in rent calculation context
- **Cognitive Load**: Creates mental model conflict (7% vs "Step 2 of 6")
- **Fix Priority**: CRITICAL - Immediate fix required

### 2. **CRITICAL: Information Architecture Breakdown**

**Principle Violation**: Progressive Disclosure, Single Primary Action

- **Issue**: Surface area section presents 3 competing interaction patterns simultaneously:
  1. Direct numeric input field
  2. "Don't know exact surface?" helper prompt
  3. Hidden estimation tool
- **Impact**: Decision paralysis, unclear primary task flow
- **Cognitive Load**: Excessive - violates 7±2 rule for cognitive processing
- **Fix Priority**: CRITICAL - Requires redesign

### 3. **MAJOR: Accessibility Violations (WCAG)**

**Standards Violated**: AA Level Compliance

- **Contrast Issues**: Light blue text on light background (helper section)
- **Touch Targets**: Plus/minus buttons < 44px minimum requirement
- **Focus States**: No visible keyboard navigation indicators
- **Screen Reader**: "1 chambres" grammatical error confuses assistive technology
- **Fix Priority**: HIGH - Legal compliance risk

### 4. **SEVERE: Mental Model Inconsistency**

**Principle Violation**: Conceptual Models (Norman)

- **Issue**: Step naming mismatch
  - Progress: "Détails du bien"
  - Current view: "Caractéristiques du bien"
- **Impact**: Users cannot build accurate mental model of process
- **Navigation**: Unpredictable system behavior
- **Fix Priority**: HIGH

### 5. **MAJOR: Fitts's Law Violations**

**Motor Performance Issues**:

- Small counter buttons with inadequate spacing
- High-value "Estimer" action buried with low visual priority
- Precision clicking required for critical actions
- **Fix Priority**: MEDIUM-HIGH

### 6. **CRITICAL: Error Prevention Failure**

**Missing Safeguards**:

- No input validation feedback
- No acceptable range indicators
- No edge case handling (0, negative, extremely large values)
- No prevention of impossible scenarios
- **Fix Priority**: HIGH

---

## Deep Dive: Surface Area Input Handling Analysis

### Critical Implementation Flaws

#### 1. **Input Validation - Completely Broken**

```tsx
// CRITICAL: Only has HTML min="1" - easily bypassed
<Input
  type="number"
  min="1" // ❌ Client-side only, no server validation
  value={state.size || ''}
  onChange={(e) =>
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'size',
      value: Number.parseInt(e.target.value) || 0, // ❌ Falls back to 0!
    })
  }
/>
```

**Fatal Issues:**

- `Number.parseInt()` allows invalid inputs (e.g., "75.5" becomes 75)
- Falls back to `0` on invalid input - should show error instead
- No maximum validation (users can enter 999999)
- No real-time feedback on invalid values

#### 2. **State Management Logic Errors**

```tsx
// CRITICAL: Inconsistent initialization
const initialState: FormState = {
  size: 0,        // ❌ Invalid default (violates min="1")
  bedrooms: 1,    // ✅ Valid default
}

// CRITICAL: Navigation allows invalid states
nextDisabled={state.size <= 0 || !state.propertyType}
// ❌ Should be `state.size < 1` for consistency
```

#### 3. **Data Flow Critical Failures**

**Input → State → Validation Chain:**

1. User inputs "0" → `parseInt("0") = 0` → State becomes `{size: 0}`
2. UI shows "0" as valid input ❌
3. Navigation correctly blocks (size <= 0) ✅
4. **BUT**: No user feedback about why blocked ❌

**Auto-estimation Logic Conflicts:**

```tsx
// CRITICAL: Estimation can set invalid values
const estimatedArea = Math.round(baseArea * roomMultiplier * 1.2);
// ❌ No bounds checking - could generate unrealistic values
```

#### 4. **Information Architecture Disaster**

The component tries to handle 4 different user scenarios simultaneously:

1. **Direct Input** (primary path)
2. **"Don't know" Helper** (secondary path)
3. **Visual Estimates** (4 preset buttons)
4. **Smart Room-Based** (dynamic calculation)

**Cognitive Load Analysis:**

- **Working Memory Overload**: 4 interaction patterns compete for attention
- **Decision Paralysis**: No clear primary action
- **Mental Model Confusion**: Users can't predict system behavior

#### 5. **Error Handling Completely Missing**

**No Error States For:**

- Invalid ranges (< 1m² or > 500m²)
- Decimal inputs (75.5 becomes 75 silently)
- Non-numeric inputs ("abc" becomes 0)
- Unrealistic values (1m² studio, 500m² studio)

**No User Feedback For:**

- Why navigation is blocked
- What constitutes "valid" input
- When auto-correction occurs

#### 6. **Accessibility Violations in Input Handling**

```tsx
// ❌ WCAG Violation: No error announcements
// ❌ No aria-invalid attributes
// ❌ No aria-describedby for error messages
// ❌ Unit "m²" not programmatically associated
```

### Data Persistence Issues

**Session State Problems:**

- Invalid states (size: 0) get saved to session storage
- Users can return to broken states
- No data sanitization on restore

### Performance Anti-Patterns

**Unnecessary Re-renders:**

- Estimation panel mounts/unmounts instead of showing/hiding
- Each keystroke triggers full form re-evaluation
- No debouncing on input validation

---

## Critical Edge Cases & System Failures

### Input Validation Edge Cases

1. **Decimal Handling**: "75.5" → silently becomes 75 (data loss)
2. **Zero Input**: "0" → accepted in UI, blocks navigation with no feedback
3. **Negative Values**: "-50" → HTML min="1" should prevent, but can be bypassed
4. **Large Numbers**: "99999" → accepted, will break rent calculation
5. **Non-numeric**: "abc" → becomes 0, creates invalid state
6. **Empty String**: "" → becomes 0, creates invalid state

### State Consistency Failures

1. **Initial State Violation**: Default `size: 0` violates own `min="1"` rule
2. **Auto-estimation Bounds**: Can generate unrealistic values (200m² studio)
3. **Session Restoration**: Invalid states get persisted and restored
4. **Form Submission**: Invalid data reaches calculation engine

### Cross-Component Data Issues

1. **Property Type Mismatch**: Surface area doesn't validate against property type
2. **Bedroom Consistency**: No validation that bedrooms make sense for size
3. **Calculation Dependencies**: Invalid size propagates through entire calculation

---

## Recommendations Priority Matrix

| Issue                        | Impact   | Effort | Priority | Risk Level              |
| ---------------------------- | -------- | ------ | -------- | ----------------------- |
| Fix input validation logic   | CRITICAL | MEDIUM | P0       | **System Breaking**     |
| Fix "1kB" progress indicator | HIGH     | LOW    | P0       | **Credibility Killer**  |
| Implement error feedback     | CRITICAL | MEDIUM | P0       | **User Abandonment**    |
| Fix state initialization     | HIGH     | LOW    | P0       | **Logic Inconsistency** |
| Simplify input flow          | HIGH     | HIGH   | P1       | **Cognitive Overload**  |
| Add bounds validation        | HIGH     | MEDIUM | P1       | **Data Integrity**      |
| Fix accessibility violations | MEDIUM   | MEDIUM | P1       | **Legal Compliance**    |
| Implement data sanitization  | MEDIUM   | MEDIUM | P2       | **Security**            |

---

## Immediate Action Plan

### **P0 - System Breaking (Fix Today)**

1. **Input Validation**: Replace `parseInt()` with proper number validation
2. **Error States**: Add user feedback for invalid inputs
3. **State Consistency**: Fix default `size: 0` to `size: null`
4. **Progress Indicator**: Remove nonsensical "1kB" display

### **P1 - User Experience Critical (Fix This Week)**

1. **Information Architecture**: Implement progressive disclosure for input methods
2. **Bounds Checking**: Add realistic min/max validation (10-500m²)
3. **Cross-validation**: Ensure size makes sense for property type
4. **Accessibility**: Add proper error announcements and focus management

### **P2 - Quality & Polish (Fix Next Sprint)**

1. **Performance**: Add input debouncing
2. **Data Integrity**: Implement server-side validation
3. **Edge Cases**: Handle all numeric input scenarios gracefully

---

## Code Quality Assessment

**Technical Debt Level**: 🔴 **CRITICAL**

- Input handling violates basic web standards
- State management has fundamental logical flaws
- No error boundary handling
- Missing accessibility implementation

**Maintenance Risk**: 🔴 **HIGH**

- Logic scattered across multiple functions
- No centralized validation
- Inconsistent error handling patterns

---

_This analysis follows Jakob Nielsen's usability heuristics, WCAG 2.1 AA guidelines, and established UX research methodologies._
