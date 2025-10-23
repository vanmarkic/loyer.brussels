import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { GlobalFormProvider, useGlobalForm } from '../global-form-context';

describe('Session Persistence - Completely Removed', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    vi.clearAllTimers();
  });

  it('should NOT automatically save to sessionStorage when state changes', async () => {
    const { result } = renderHook(() => useGlobalForm(), {
      wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
    });

    // Update property info
    act(() => {
      result.current.updatePropertyInfo({ propertyType: 'apartment' });
    });

    // Wait for potential debounced save (1 second)
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1500)), {
      timeout: 2000,
    });

    // Verify sessionStorage is empty (no autosave occurred)
    const savedData = sessionStorage.getItem('loyer-brussels-form-data');
    expect(savedData).toBeNull();
  });

  it('should NOT load session data on mount', () => {
    // Manually set session data
    const mockSessionData = {
      currentStep: 3,
      propertyInfo: { propertyType: 'house', size: 150 },
      lastUpdated: Date.now(),
    };
    sessionStorage.setItem('loyer-brussels-form-data', JSON.stringify(mockSessionData));

    // Render hook
    const { result } = renderHook(() => useGlobalForm(), {
      wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
    });

    // Verify that session was NOT restored
    expect(result.current.state.currentStep).toBe(1); // Should be initial step
    expect(result.current.state.propertyInfo.propertyType).toBe(''); // Should be empty
    expect(result.current.state.propertyInfo.size).toBe(0); // Should be 0
  });

  it('should NOT have saveSession method available', () => {
    const { result } = renderHook(() => useGlobalForm(), {
      wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
    });

    // Verify saveSession method doesn't exist
    expect(result.current).not.toHaveProperty('saveSession');
  });

  it('should NOT have loadSession method available', () => {
    const { result } = renderHook(() => useGlobalForm(), {
      wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
    });

    // Verify loadSession method doesn't exist
    expect(result.current).not.toHaveProperty('loadSession');
  });

  it('should NOT have clearSession method available', () => {
    const { result } = renderHook(() => useGlobalForm(), {
      wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
    });

    // Verify clearSession method doesn't exist
    expect(result.current).not.toHaveProperty('clearSession');
  });

  it('should NOT write to sessionStorage when state changes', async () => {
    const { result } = renderHook(() => useGlobalForm(), {
      wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
    });

    // Update multiple fields
    act(() => {
      result.current.updatePropertyInfo({ propertyType: 'apartment', size: 100 });
      result.current.updateUserProfile({ email: 'test@example.com' });
    });

    // Wait for any potential saves
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 2000)), {
      timeout: 3000,
    });

    // Verify sessionStorage is still empty
    expect(sessionStorage.getItem('loyer-brussels-form-data')).toBeNull();
  });
});
