import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  GlobalFormProvider,
  useGlobalForm,
  globalFormReducer,
  initialGlobalState
} from '../global-form-context';
import type { GlobalFormState } from '@/features/calculator/types/global-form-types';

describe('GlobalFormContext - Reducer', () => {
  describe('UPDATE_USER_PROFILE', () => {
    it('should update user profile fields', () => {
      const state = initialGlobalState;
      const action = {
        type: 'UPDATE_USER_PROFILE' as const,
        payload: { email: 'test@example.com', phone: '+32123456789' }
      };

      const newState = globalFormReducer(state, action);

      expect(newState.userProfile.email).toBe('test@example.com');
      expect(newState.userProfile.phone).toBe('+32123456789');
    });

    it('should preserve other user profile fields', () => {
      const state = {
        ...initialGlobalState,
        userProfile: {
          email: 'old@example.com',
          phone: '+32111111111',
          joinNewsletter: true,
          joinAssembly: true,
        }
      };

      const action = {
        type: 'UPDATE_USER_PROFILE' as const,
        payload: { email: 'new@example.com' }
      };

      const newState = globalFormReducer(state, action);

      expect(newState.userProfile.email).toBe('new@example.com');
      expect(newState.userProfile.phone).toBe('+32111111111');
      expect(newState.userProfile.joinNewsletter).toBe(true);
      expect(newState.userProfile.joinAssembly).toBe(true);
    });
  });

  describe('UPDATE_PROPERTY_INFO', () => {
    it('should update property info fields', () => {
      const state = initialGlobalState;
      const action = {
        type: 'UPDATE_PROPERTY_INFO' as const,
        payload: { propertyType: 'apartment' as const, size: 100, bedrooms: 2 }
      };

      const newState = globalFormReducer(state, action);

      expect(newState.propertyInfo.propertyType).toBe('apartment');
      expect(newState.propertyInfo.size).toBe(100);
      expect(newState.propertyInfo.bedrooms).toBe(2);
    });

    it('should preserve other property info fields', () => {
      const state = {
        ...initialGlobalState,
        propertyInfo: {
          ...initialGlobalState.propertyInfo,
          postalCode: 1000,
          streetName: 'Main St',
          streetNumber: '42',
        }
      };

      const action = {
        type: 'UPDATE_PROPERTY_INFO' as const,
        payload: { size: 120 }
      };

      const newState = globalFormReducer(state, action);

      expect(newState.propertyInfo.size).toBe(120);
      expect(newState.propertyInfo.postalCode).toBe(1000);
      expect(newState.propertyInfo.streetName).toBe('Main St');
      expect(newState.propertyInfo.streetNumber).toBe('42');
    });
  });

  describe('UPDATE_RENTAL_INFO', () => {
    it('should update rental info fields', () => {
      const state = initialGlobalState;
      const action = {
        type: 'UPDATE_RENTAL_INFO' as const,
        payload: { actualRent: '1500', leaseType: 'long-term' }
      };

      const newState = globalFormReducer(state, action);

      expect(newState.rentalInfo.actualRent).toBe('1500');
      expect(newState.rentalInfo.leaseType).toBe('long-term');
    });
  });

  describe('UPDATE_CALCULATION_RESULTS', () => {
    it('should update calculation results', () => {
      const state = initialGlobalState;
      const action = {
        type: 'UPDATE_CALCULATION_RESULTS' as const,
        payload: {
          medianRent: 1200,
          minRent: 1000,
          maxRent: 1400,
          difficultyIndex: 1.5
        }
      };

      const newState = globalFormReducer(state, action);

      expect(newState.calculationResults.medianRent).toBe(1200);
      expect(newState.calculationResults.minRent).toBe(1000);
      expect(newState.calculationResults.maxRent).toBe(1400);
      expect(newState.calculationResults.difficultyIndex).toBe(1.5);
    });

    it('should update loading state', () => {
      const state = initialGlobalState;
      const action = {
        type: 'UPDATE_CALCULATION_RESULTS' as const,
        payload: { isLoading: true }
      };

      const newState = globalFormReducer(state, action);

      expect(newState.calculationResults.isLoading).toBe(true);
    });

    it('should update error state', () => {
      const state = initialGlobalState;
      const action = {
        type: 'UPDATE_CALCULATION_RESULTS' as const,
        payload: { error: 'API Error', errorCode: 'API_500' }
      };

      const newState = globalFormReducer(state, action);

      expect(newState.calculationResults.error).toBe('API Error');
      expect(newState.calculationResults.errorCode).toBe('API_500');
    });
  });

  describe('SET_CURRENT_STEP', () => {
    it('should update current step', () => {
      const state = initialGlobalState;
      const action = {
        type: 'SET_CURRENT_STEP' as const,
        payload: 3
      };

      const newState = globalFormReducer(state, action);

      expect(newState.currentStep).toBe(3);
    });

    it('should allow setting step to 1', () => {
      const state = { ...initialGlobalState, currentStep: 5 };
      const action = {
        type: 'SET_CURRENT_STEP' as const,
        payload: 1
      };

      const newState = globalFormReducer(state, action);

      expect(newState.currentStep).toBe(1);
    });
  });

  describe('SET_CURRENT_PAGE', () => {
    it('should update current page', () => {
      const state = initialGlobalState;
      const action = {
        type: 'SET_CURRENT_PAGE' as const,
        payload: 'results' as const
      };

      const newState = globalFormReducer(state, action);

      expect(newState.currentPage).toBe('results');
    });

    it('should handle questionnaire page', () => {
      const state = initialGlobalState;
      const action = {
        type: 'SET_CURRENT_PAGE' as const,
        payload: 'questionnaire' as const
      };

      const newState = globalFormReducer(state, action);

      expect(newState.currentPage).toBe('questionnaire');
    });
  });

  describe('RESET_FORM', () => {
    it('should reset to initial state', () => {
      const state: GlobalFormState = {
        ...initialGlobalState,
        currentStep: 5,
        userProfile: {
          email: 'test@example.com',
          phone: '+32123456789',
          joinNewsletter: true,
          joinAssembly: false,
        },
        propertyInfo: {
          ...initialGlobalState.propertyInfo,
          size: 120,
          propertyType: 'apartment',
        }
      };

      const action = {
        type: 'RESET_FORM' as const
      };

      const newState = globalFormReducer(state, action);

      expect(newState.currentStep).toBe(1);
      expect(newState.userProfile.email).toBe('');
      expect(newState.propertyInfo.size).toBe(0);
    });
  });
});

describe('GlobalFormContext - Hook Integration', () => {
  it('should provide state and dispatch', () => {
    const { result } = renderHook(() => useGlobalForm(), {
      wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
    });

    expect(result.current.state).toBeDefined();
    expect(result.current.dispatch).toBeDefined();
    expect(result.current.state.currentStep).toBe(1);
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useGlobalForm());
    }).toThrow('useGlobalForm must be used within a GlobalFormProvider');
  });

  describe('Convenience Methods', () => {
    it('should have updateUserProfile method', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      expect(result.current.updateUserProfile).toBeDefined();
      expect(typeof result.current.updateUserProfile).toBe('function');
    });

    it('should update user profile via convenience method', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      act(() => {
        result.current.updateUserProfile({
          email: 'test@example.com',
          phone: '+32123456789'
        });
      });

      expect(result.current.state.userProfile.email).toBe('test@example.com');
      expect(result.current.state.userProfile.phone).toBe('+32123456789');
    });

    it('should update property info via convenience method', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      act(() => {
        result.current.updatePropertyInfo({
          propertyType: 'house',
          size: 150,
          bedrooms: 3
        });
      });

      expect(result.current.state.propertyInfo.propertyType).toBe('house');
      expect(result.current.state.propertyInfo.size).toBe(150);
      expect(result.current.state.propertyInfo.bedrooms).toBe(3);
    });

    it('should update rental info via convenience method', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      act(() => {
        result.current.updateRentalInfo({ actualRent: '2000' });
      });

      expect(result.current.state.rentalInfo.actualRent).toBe('2000');
    });

    it('should update calculation results via convenience method', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      act(() => {
        result.current.updateCalculationResults({
          medianRent: 1300,
          isLoading: false
        });
      });

      expect(result.current.state.calculationResults.medianRent).toBe(1300);
      expect(result.current.state.calculationResults.isLoading).toBe(false);
    });
  });

  describe('Getter Methods', () => {
    it('should get actual rent', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      act(() => {
        result.current.updateRentalInfo({ actualRent: '1800' });
      });

      expect(result.current.getActualRent()).toBe('1800');
    });

    it('should get contact info', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      act(() => {
        result.current.updateUserProfile({
          email: 'contact@test.com',
          phone: '+32555555555'
        });
      });

      const contactInfo = result.current.getContactInfo();
      expect(contactInfo.email).toBe('contact@test.com');
      expect(contactInfo.phone).toBe('+32555555555');
    });
  });

  describe('Multiple Updates', () => {
    it('should handle multiple sequential updates', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      act(() => {
        result.current.updatePropertyInfo({ size: 50 });
        result.current.updatePropertyInfo({ size: 75 });
        result.current.updatePropertyInfo({ size: 100 });
      });

      expect(result.current.state.propertyInfo.size).toBe(100);
    });

    it('should handle updates across different state sections', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      act(() => {
        result.current.updateUserProfile({ email: 'user@test.com' });
        result.current.updatePropertyInfo({ size: 120 });
        result.current.updateRentalInfo({ actualRent: '1500' });
      });

      expect(result.current.state.userProfile.email).toBe('user@test.com');
      expect(result.current.state.propertyInfo.size).toBe(120);
      expect(result.current.state.rentalInfo.actualRent).toBe('1500');
    });
  });

  describe('Direct dispatch', () => {
    it('should allow direct dispatch for RESET_FORM', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      // Set some state first
      act(() => {
        result.current.updatePropertyInfo({ size: 200 });
        result.current.updateUserProfile({ email: 'test@example.com' });
      });

      // Then reset
      act(() => {
        result.current.dispatch({ type: 'RESET_FORM' });
      });

      expect(result.current.state.propertyInfo.size).toBe(0);
      expect(result.current.state.userProfile.email).toBe('');
      expect(result.current.state.currentStep).toBe(1);
    });

    it('should allow direct dispatch for SET_CURRENT_STEP', () => {
      const { result } = renderHook(() => useGlobalForm(), {
        wrapper: ({ children }) => <GlobalFormProvider>{children}</GlobalFormProvider>,
      });

      act(() => {
        result.current.dispatch({ type: 'SET_CURRENT_STEP', payload: 4 });
      });

      expect(result.current.state.currentStep).toBe(4);
    });
  });
});
