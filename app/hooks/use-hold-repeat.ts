import { useRef, useCallback } from "react";

interface UseHoldRepeatOptions {
  /** Function to call on each repeat */
  onRepeat: () => void;
  /** Repeat interval in milliseconds (default: 150) */
  interval?: number;
  /** Whether to call onRepeat immediately on start (default: true) */
  immediate?: boolean;
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
 * Handles mouse, touch, and pointer events consistently.
 */
export function useHoldRepeat({
  onRepeat,
  interval = 150,
  immediate = true,
}: UseHoldRepeatOptions): UseHoldRepeatReturn {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Call immediately if requested
    if (immediate) {
      onRepeat();
    }

    // Start the repeat interval
    intervalRef.current = setInterval(onRepeat, interval);
  }, [onRepeat, interval, immediate]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const isActive = useCallback(() => {
    return intervalRef.current !== null;
  }, []);

  return { start, stop, isActive };
}
