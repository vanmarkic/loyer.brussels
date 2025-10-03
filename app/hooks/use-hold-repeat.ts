import { useRef, useCallback } from "react";

interface UseHoldRepeatOptions {
  /** Function to call on each repeat */
  onRepeat: () => void;
  /** Repeat interval in milliseconds (default: 150) */
  interval?: number;
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
 * Supports optional acceleration for faster repeats when held longer.
 */
export function useHoldRepeat({
  onRepeat,
  interval = 150,
  immediate = true,
  acceleration = false,
}: UseHoldRepeatOptions): UseHoldRepeatReturn {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);

  const getInterval = useCallback(() => {
    if (!acceleration) return interval;

    const elapsed = Date.now() - startTimeRef.current;
    // 3-phase acceleration: 150ms → 100ms → 50ms
    if (elapsed < 500) return 150; // Phase 1: 0-500ms
    if (elapsed < 1500) return 100; // Phase 2: 500-1500ms
    return 50; // Phase 3: 1500ms+
  }, [interval, acceleration]);

  const scheduleNext = useCallback(() => {
    if (!isActiveRef.current) return;

    const currentInterval = getInterval();

    timeoutRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        onRepeat();
        scheduleNext();
      }
    }, currentInterval);
  }, [onRepeat, getInterval]);

  const start = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isActiveRef.current = true;
    startTimeRef.current = Date.now();

    if (immediate) {
      onRepeat();
    }

    scheduleNext();
  }, [onRepeat, immediate, scheduleNext]);

  const stop = useCallback(() => {
    isActiveRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const isActive = useCallback(() => {
    return isActiveRef.current;
  }, []);

  return { start, stop, isActive };
}
