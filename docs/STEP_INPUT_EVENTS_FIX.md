# Step Input Events Fix

## Problem

The property size increment/decrement buttons in `PropertyDetailsStep` were not updating the displayed value when clicked. The buttons only responded to pointer events (onPointerDown/onPointerUp) but not to click events, causing issues on some browsers and devices.

## Root Cause

The component was using only pointer event handlers (`onPointerDown`, `onPointerUp`) for the increment/decrement functionality. While pointer events work well for press-and-hold behavior, they don't always fire for simple clicks, especially on certain browsers or when using accessibility tools.

## Solution

Added click event handlers as fallbacks while maintaining the existing pointer event behavior:

1. **Click Fallbacks**: Added `onClick` handlers that call single increment/decrement when no pointer sequence is active
2. **Double-Fire Protection**: Used `incrementControls.isActive()` and `decrementControls.isActive()` to prevent double increments when both pointer and click events fire
3. **Touch Support**: Added `onTouchStart`/`onTouchEnd` to mirror pointer behavior on legacy browsers
4. **UX Improvement**: Bootstrap size to 1 when it's 0 on component mount

## Implementation

### Component Changes (`property-details-step.tsx`)

```typescript
// Click handlers that guard against double-fire when pointer events are active
const handlePlusClick = () => {
  if (!incrementControls.isActive()) {
    incrementSize();
  }
};

const handleMinusClick = () => {
  if (!decrementControls.isActive()) {
    decrementSize();
  }
};

// Bootstrap size to 1 if it's 0 (UX improvement)
useEffect(() => {
  if (state.propertyInfo.size === 0) {
    dispatch({ type: "UPDATE_PROPERTY_INFO", payload: { size: 1 } });
  }
}, [dispatch]);
```

### Button Updates

```typescript
<Button
  onClick={handlePlusClick}
  onPointerDown={incrementControls.start}
  onPointerUp={incrementControls.stop}
  onPointerLeave={incrementControls.stop}
  onPointerCancel={incrementControls.stop}
  onTouchStart={incrementControls.start}
  onTouchEnd={incrementControls.stop}
  // ... other props
>
```

## Testing

Added comprehensive tests covering:

- Click-only increment/decrement behavior
- Double-fire protection when pointer events are active
- Touch event mirroring
- Bootstrap effect for size initialization

## Files Modified

- `app/components/rental-calculator/property-details-step.tsx`
- `app/components/rental-calculator/__tests__/property-details-step.hold-repeat.spec.tsx`
- `app/[locale]/calculateur/bruxelles/step/[step]/__tests__/integration.test.tsx`

## Result

The size increment/decrement buttons now work reliably across all browsers and input methods:

- Simple clicks increment/decrement by 1
- Press-and-hold continues to work with automatic repetition
- No double-firing when both pointer and click events occur
- Better UX with automatic size initialization
