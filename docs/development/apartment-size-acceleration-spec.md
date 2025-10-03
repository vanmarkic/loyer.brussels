# Apartment Size Adjustment - Acceleration Feature Specification

## Overview

This document specifies the expected behavior for the apartment size adjustment feature with acceleration when the user holds down the +/- buttons.

## Current State

The current implementation uses a **fixed 150ms interval** for incrementing/decrementing the apartment size when the user holds down the +/- buttons. This is implemented in the `useHoldRepeat` hook.

## Required Feature

The apartment size adjustment should **accelerate** (get faster) the longer the user keeps holding down the +/- buttons. This provides better UX by:

1. **Precision at start**: Initial slow increment allows users to make precise adjustments
2. **Speed for large changes**: Acceleration enables quick adjustments when users need to change the value significantly
3. **Natural interaction**: Matches user expectations from native system controls

## Expected Acceleration Behavior

### Phase 1: Initial Speed (0-500ms)
- **Interval**: 150ms
- **Purpose**: Allow precise, controlled adjustments
- **User Experience**: Each increment/decrement is clearly visible

### Phase 2: Moderate Speed (500ms-1500ms)
- **Interval**: 100ms
- **Purpose**: Balance between precision and speed
- **User Experience**: Noticeable acceleration but still trackable

### Phase 3: Fast Speed (1500ms+)
- **Interval**: 50ms
- **Purpose**: Enable rapid large-value changes
- **User Experience**: Fast scrolling through values

## Implementation Details

### Hook Signature Enhancement

The `useHoldRepeat` hook should be enhanced to support acceleration:

```typescript
interface UseHoldRepeatOptions {
  onRepeat: () => void;
  interval?: number;              // Initial interval (default: 150ms)
  immediate?: boolean;            // Call onRepeat immediately (default: true)
  acceleration?: {                // Optional acceleration config
    enabled: boolean;             // Enable acceleration (default: false)
    stages?: AccelerationStage[]; // Custom acceleration stages
  };
}

interface AccelerationStage {
  afterMs: number;    // Start this stage after N milliseconds
  interval: number;   // Interval for this stage
}
```

### Default Acceleration Configuration

```typescript
const DEFAULT_ACCELERATION_STAGES: AccelerationStage[] = [
  { afterMs: 0, interval: 150 },      // Phase 1: 0-500ms at 150ms
  { afterMs: 500, interval: 100 },    // Phase 2: 500-1500ms at 100ms
  { afterMs: 1500, interval: 50 },    // Phase 3: 1500ms+ at 50ms
];
```

## Test Specifications

### Unit Tests

Two failing unit tests have been added to verify acceleration:

1. **`should accelerate increment speed when holding plus button for longer`**
   - Tests the + button acceleration
   - Expects > 15 increments in 1600ms (vs ~11 with fixed interval)
   - **Current Status**: ❌ FAILING (gets 12, expects > 15)

2. **`should accelerate decrement speed when holding minus button for longer`**
   - Tests the - button acceleration
   - Expects > 15 decrements in 1600ms (vs ~11 with fixed interval)
   - **Current Status**: ❌ FAILING (gets 11, expects > 15)

### E2E Tests

Two failing E2E tests have been added:

1. **`should accelerate increment speed when + button is held for longer`**
   - Tests acceleration in a real browser environment
   - Expects > 20 increments in 2000ms
   - **Current Status**: ❌ FAILING

2. **`should accelerate decrement speed when - button is held for longer`**
   - Tests decrement acceleration in a real browser environment
   - Expects > 20 decrements in 2000ms
   - **Current Status**: ❌ FAILING

## Implementation Steps

1. ✅ Add failing tests that specify the expected behavior
2. ⏳ Enhance the `useHoldRepeat` hook to support acceleration
3. ⏳ Update `PropertyDetailsStep` to enable acceleration
4. ⏳ Verify all tests pass
5. ⏳ Update documentation

## Files Involved

- **Hook**: `app/hooks/use-hold-repeat.ts`
- **Component**: `app/components/rental-calculator/property-details-step.tsx`
- **Unit Tests**: `app/components/rental-calculator/__tests__/property-details-step.hold-repeat.spec.tsx`
- **E2E Tests**: `tests/e2e/property-size-hold-repeat.spec.ts`

## Constraints

1. **Minimum Value**: Size should never go below 1 sqm
2. **Smooth Transition**: Acceleration stages should feel natural, not abrupt
3. **Stop on Release**: Must immediately stop when user releases the button
4. **Cross-Platform**: Should work consistently on mouse, touch, and pointer events
5. **Performance**: Should not cause excessive re-renders or state updates

## User Story

**As a user**, when I hold down the + or - button to adjust apartment size:
- I want the first increments to be slow so I can stop at my desired value precisely
- I want the speed to increase the longer I hold the button
- So that I can quickly adjust to much larger or smaller values without clicking many times

## Acceptance Criteria

- ✅ Tests fail with current implementation (verification that acceleration is needed)
- ⏳ Initial increments happen at 150ms intervals
- ⏳ After 500ms, increments accelerate to 100ms intervals
- ⏳ After 1500ms, increments accelerate to 50ms intervals
- ⏳ All unit tests pass
- ⏳ All E2E tests pass
- ⏳ No regression in existing functionality
- ⏳ Works with mouse, touch, and pointer events
- ⏳ Respects minimum value constraint (1 sqm)
