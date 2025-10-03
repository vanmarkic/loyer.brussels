import { useRef, useCallback, useEffect } from "react";

interface UseHoldRepeatOptions {
  /** Function to call on each repeat */
  onRepeat: () => void;
  /** Whether to call onRepeat immediately on start (default: true) */
  immediate?: boolean;
  /** Enable acceleration for faster repeats over time (default: false) */
  acceleration?: boolean;
}

interface UseHoldRepeatReturn {
  /** Start repeating the function */
  start: () => void;
  /** Stop repeating the function */
  stop: () => void;
  /** Check if currently repeating */
  isActive: () => boolean;
}

/**
 * Hook for implementing press-and-hold behavior with automatic repetition.
 * Supports optional 3-phase acceleration (150ms → 100ms → 50ms intervals).
 *
 * Uses setInterval with dynamic interval adjustments for reliable timing.
 */
export function useHoldRepeat({
  onRepeat,
  immediate = true,
  acceleration = false,
}: UseHoldRepeatOptions): UseHoldRepeatReturn {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);
  const currentPhaseRef = useRef<number>(1);
  const onRepeatRef = useRef(onRepeat);

  // Always keep the latest onRepeat
  onRepeatRef.current = onRepeat;

  // Cleanup on unmount to prevent orphaned intervals
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isActiveRef.current = false;
    };
  }, []);

  const getIntervalForPhase = (phase: number): number => {
    if (!acceleration) return 150;

    switch (phase) {
      case 1: return 150; // Phase 1: 0-500ms
      case 2: return 100; // Phase 2: 500-1500ms
      case 3: return 50;  // Phase 3: 1500ms+
      default: return 150;
    }
  };

  const updatePhase = () => {
    if (!acceleration) return;

    const elapsed = Date.now() - startTimeRef.current;
    const newPhase = elapsed < 500 ? 1 : elapsed < 1500 ? 2 : 3;

    // If phase changed, restart interval with new timing
    if (newPhase !== currentPhaseRef.current) {
      currentPhaseRef.current = newPhase;

      // Clear and restart with new interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const newInterval = getIntervalForPhase(newPhase);
      intervalRef.current = setInterval(() => {
        if (isActiveRef.current) {
          onRepeatRef.current();
          updatePhase();
        }
      }, newInterval);
    }
  };

  const start = useCallback(() => {
    // Don't start if already active
    if (isActiveRef.current) {
      return;
    }

    isActiveRef.current = true;
    startTimeRef.current = Date.now();
    currentPhaseRef.current = 1;

    // Immediate call if requested
    if (immediate) {
      onRepeatRef.current();
    }

    // Start the interval
    const initialInterval = getIntervalForPhase(1);
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        onRepeatRef.current();
        updatePhase();
      }
    }, initialInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, acceleration]);

  const stop = useCallback(() => {
    isActiveRef.current = false;
    currentPhaseRef.current = 1;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const isActive = useCallback(() => {
    return isActiveRef.current;
  }, []);

  return { start, stop, isActive };
}
