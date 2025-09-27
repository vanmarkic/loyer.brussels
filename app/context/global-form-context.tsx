'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type {
  GlobalFormState,
  UserProfile,
  PropertyInformation,
  RentalInformation,
  HouseholdInformation,
  PropertyIssues,
  CalculationResults,
} from '../data/global-form-types';

// Session storage key
const STORAGE_KEY = 'loyer-brussels-form-data';

// Default state values
const defaultUserProfile: UserProfile = {
  email: '',
  phone: '',
  joinNewsletter: false,
  joinAssembly: false,
};

const defaultPropertyInfo: PropertyInformation = {
  postalCode: 0,
  streetName: '',
  streetNumber: '',
  propertyType: '',
  size: 0,
  bedrooms: 1,
  bathrooms: 1,
  numberOfGarages: 0,
  energyClass: '',
  constructedBefore2000: null,
  propertyState: null,
  hasCentralHeating: null,
  hasThermalRegulation: null,
  hasDoubleGlazing: null,
  hasSecondBathroom: null,
  hasRecreationalSpaces: null,
  hasStorageSpaces: null,
};

const defaultRentalInfo: RentalInformation = {
  actualRent: '',
  leaseType: '',
  leaseStartDate: '',
  rentIndexation: '',
  boilerMaintenance: false,
  fireInsurance: false,
};

const defaultHouseholdInfo: HouseholdInformation = {
  monthlyIncome: '',
  householdComposition: '',
  paymentDelays: '',
  evictionThreats: '',
  mediationAttempts: '',
};

const defaultPropertyIssues: PropertyIssues = {
  healthIssues: [],
  majorDefects: [],
  positiveAspects: [],
  additionalComments: '',
};

const defaultCalculationResults: CalculationResults = {
  difficultyIndex: null,
  medianRent: null,
  minRent: null,
  maxRent: null,
  isLoading: false,
  error: null,
  errorCode: null,
};

const generateSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const initialGlobalState: GlobalFormState = {
  currentStep: 1,
  currentPage: 'calculator',
  userProfile: defaultUserProfile,
  propertyInfo: defaultPropertyInfo,
  rentalInfo: defaultRentalInfo,
  householdInfo: defaultHouseholdInfo,
  propertyIssues: defaultPropertyIssues,
  calculationResults: defaultCalculationResults,
  lastUpdated: Date.now(),
  sessionId: generateSessionId(),
};

// Action types
type GlobalFormAction =
  | { type: 'RESTORE_SESSION'; payload: GlobalFormState }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'UPDATE_PROPERTY_INFO'; payload: Partial<PropertyInformation> }
  | { type: 'UPDATE_RENTAL_INFO'; payload: Partial<RentalInformation> }
  | { type: 'UPDATE_HOUSEHOLD_INFO'; payload: Partial<HouseholdInformation> }
  | { type: 'UPDATE_PROPERTY_ISSUES'; payload: Partial<PropertyIssues> }
  | { type: 'UPDATE_CALCULATION_RESULTS'; payload: Partial<CalculationResults> }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_CURRENT_PAGE'; payload: 'calculator' | 'results' | 'questionnaire' }
  | { type: 'RESET_FORM' }
  | { type: 'AUTO_SAVE' };

// Reducer
const globalFormReducer = (
  state: GlobalFormState,
  action: GlobalFormAction
): GlobalFormState => {
  const newState = (() => {
    switch (action.type) {
      case 'RESTORE_SESSION':
        return { ...action.payload, lastUpdated: Date.now() };

      case 'UPDATE_USER_PROFILE':
        return {
          ...state,
          userProfile: { ...state.userProfile, ...action.payload },
          lastUpdated: Date.now(),
        };

      case 'UPDATE_PROPERTY_INFO':
        return {
          ...state,
          propertyInfo: { ...state.propertyInfo, ...action.payload },
          lastUpdated: Date.now(),
        };

      case 'UPDATE_RENTAL_INFO':
        return {
          ...state,
          rentalInfo: { ...state.rentalInfo, ...action.payload },
          lastUpdated: Date.now(),
        };

      case 'UPDATE_HOUSEHOLD_INFO':
        return {
          ...state,
          householdInfo: { ...state.householdInfo, ...action.payload },
          lastUpdated: Date.now(),
        };

      case 'UPDATE_PROPERTY_ISSUES':
        return {
          ...state,
          propertyIssues: { ...state.propertyIssues, ...action.payload },
          lastUpdated: Date.now(),
        };

      case 'UPDATE_CALCULATION_RESULTS':
        return {
          ...state,
          calculationResults: { ...state.calculationResults, ...action.payload },
          lastUpdated: Date.now(),
        };

      case 'SET_CURRENT_STEP':
        return {
          ...state,
          currentStep: action.payload,
          lastUpdated: Date.now(),
        };

      case 'SET_CURRENT_PAGE':
        return {
          ...state,
          currentPage: action.payload,
          lastUpdated: Date.now(),
        };

      case 'RESET_FORM':
        return { ...initialGlobalState, sessionId: generateSessionId() };

      case 'AUTO_SAVE':
        return { ...state, lastUpdated: Date.now() };

      default:
        return state;
    }
  })();

  return newState;
};

// Context type
interface GlobalFormContextType {
  state: GlobalFormState;
  dispatch: React.Dispatch<GlobalFormAction>;

  // Convenience methods
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updatePropertyInfo: (updates: Partial<PropertyInformation>) => void;
  updateRentalInfo: (updates: Partial<RentalInformation>) => void;
  updateHouseholdInfo: (updates: Partial<HouseholdInformation>) => void;
  updatePropertyIssues: (updates: Partial<PropertyIssues>) => void;
  updateCalculationResults: (updates: Partial<CalculationResults>) => void;

  // Session management
  saveSession: () => void;
  loadSession: () => void;
  clearSession: () => void;

  // Data getters to replace duplicate requests
  getActualRent: () => string;
  getLivingSpace: () => number;
  getContactInfo: () => { email: string; phone: string };
}

// Context
const GlobalFormContext = createContext<GlobalFormContextType | undefined>(undefined);

// Provider
export const GlobalFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(globalFormReducer, initialGlobalState);

  // Load session on mount
  useEffect(() => {
    const loadSessionFromStorage = () => {
      // Check for session ID in URL parameters first
      const urlParams = new URLSearchParams(window.location.search);
      const sessionIdFromUrl = urlParams.get('session');

      if (sessionIdFromUrl) {
        // Try to load specific session by ID
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsedState = JSON.parse(saved);
            if (parsedState.sessionId === sessionIdFromUrl) {
              const sessionAge = Date.now() - parsedState.lastUpdated;
              const maxAge = 24 * 60 * 60 * 1000; // 24 hours

              if (sessionAge < maxAge) {
                dispatch({ type: 'RESTORE_SESSION', payload: parsedState });
                console.log('Session restored from URL:', parsedState.sessionId);

                // Clean up URL after successful restore
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
                return;
              }
            }
          } catch (error) {
            console.warn('Failed to restore session from URL:', error);
          }
        }

        // If URL session fails, show message and clean URL
        console.warn('Session from URL not found or expired');
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }

      // Fallback to regular session loading
      loadSession();
    };

    loadSessionFromStorage();
  }, []);

  // Auto-save on state changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveSession();
    }, 1000); // Save 1 second after last change

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Session management functions
  const saveSession = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        console.log('Session saved:', state.sessionId);
      } catch (error) {
        console.warn('Failed to save session:', error);
      }
    }
  };

  const loadSession = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsedState = JSON.parse(saved);
          // Only restore if session is less than 24 hours old
          const sessionAge = Date.now() - parsedState.lastUpdated;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours

          if (sessionAge < maxAge) {
            dispatch({ type: 'RESTORE_SESSION', payload: parsedState });
            console.log('Session restored:', parsedState.sessionId);
          } else {
            // Session expired, clear it
            sessionStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.warn('Failed to load session:', error);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const clearSession = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    dispatch({ type: 'RESET_FORM' });
  };

  // Convenience methods
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: updates });
  };

  const updatePropertyInfo = (updates: Partial<PropertyInformation>) => {
    dispatch({ type: 'UPDATE_PROPERTY_INFO', payload: updates });
  };

  const updateRentalInfo = (updates: Partial<RentalInformation>) => {
    dispatch({ type: 'UPDATE_RENTAL_INFO', payload: updates });
  };

  const updateHouseholdInfo = (updates: Partial<HouseholdInformation>) => {
    dispatch({ type: 'UPDATE_HOUSEHOLD_INFO', payload: updates });
  };

  const updatePropertyIssues = (updates: Partial<PropertyIssues>) => {
    dispatch({ type: 'UPDATE_PROPERTY_ISSUES', payload: updates });
  };

  const updateCalculationResults = (updates: Partial<CalculationResults>) => {
    dispatch({ type: 'UPDATE_CALCULATION_RESULTS', payload: updates });
  };

  // Data getters - these eliminate the need for duplicate data requests
  const getActualRent = (): string => {
    return state.rentalInfo.actualRent;
  };

  const getLivingSpace = (): number => {
    return state.propertyInfo.size;
  };

  const getContactInfo = (): { email: string; phone: string } => {
    return {
      email: state.userProfile.email,
      phone: state.userProfile.phone,
    };
  };

  const contextValue: GlobalFormContextType = {
    state,
    dispatch,
    updateUserProfile,
    updatePropertyInfo,
    updateRentalInfo,
    updateHouseholdInfo,
    updatePropertyIssues,
    updateCalculationResults,
    saveSession,
    loadSession,
    clearSession,
    getActualRent,
    getLivingSpace,
    getContactInfo,
  };

  return (
    <GlobalFormContext.Provider value={contextValue}>
      {children}
    </GlobalFormContext.Provider>
  );
};

// Hook
export const useGlobalForm = (): GlobalFormContextType => {
  const context = useContext(GlobalFormContext);
  if (!context) {
    throw new Error('useGlobalForm must be used within a GlobalFormProvider');
  }
  return context;
};

// Legacy compatibility - maps old form context to new global form context
export const useForm = () => {
  const globalForm = useGlobalForm();

  // Create a compatibility layer for the old FormState interface
  const legacyState = {
    step: globalForm.state.currentStep,
    postalCode: globalForm.state.propertyInfo.postalCode,
    streetName: globalForm.state.propertyInfo.streetName,
    streetNumber: globalForm.state.propertyInfo.streetNumber,
    propertyType: globalForm.state.propertyInfo.propertyType,
    size: globalForm.state.propertyInfo.size,
    bedrooms: globalForm.state.propertyInfo.bedrooms,
    bathrooms: globalForm.state.propertyInfo.bathrooms,
    numberOfGarages: globalForm.state.propertyInfo.numberOfGarages,
    energyClass: globalForm.state.propertyInfo.energyClass,
    constructedBefore2000: globalForm.state.propertyInfo.constructedBefore2000,
    propertyState: globalForm.state.propertyInfo.propertyState,
    hasCentralHeating: globalForm.state.propertyInfo.hasCentralHeating,
    hasThermalRegulation: globalForm.state.propertyInfo.hasThermalRegulation,
    hasDoubleGlazing: globalForm.state.propertyInfo.hasDoubleGlazing,
    hasSecondBathroom: globalForm.state.propertyInfo.hasSecondBathroom,
    hasRecreationalSpaces: globalForm.state.propertyInfo.hasRecreationalSpaces,
    hasStorageSpaces: globalForm.state.propertyInfo.hasStorageSpaces,
    difficultyIndex: globalForm.state.calculationResults.difficultyIndex,
    medianRent: globalForm.state.calculationResults.medianRent,
    minRent: globalForm.state.calculationResults.minRent,
    maxRent: globalForm.state.calculationResults.maxRent,
    isLoading: globalForm.state.calculationResults.isLoading,
    error: globalForm.state.calculationResults.error,
    errorCode: globalForm.state.calculationResults.errorCode,
  };

  const legacyDispatch = (action: any) => {
    // Map legacy actions to new actions
    switch (action.type) {
      case 'NEXT_STEP':
        globalForm.dispatch({
          type: 'SET_CURRENT_STEP',
          payload: globalForm.state.currentStep + 1,
        });
        break;
      case 'PREV_STEP':
        globalForm.dispatch({
          type: 'SET_CURRENT_STEP',
          payload: Math.max(1, globalForm.state.currentStep - 1),
        });
        break;
      case 'GO_TO_STEP':
        globalForm.dispatch({ type: 'SET_CURRENT_STEP', payload: action.payload });
        break;
      case 'UPDATE_FIELD':
        // Map field updates to appropriate sections
        const field = action.field;
        const value = action.value;

        if (
          [
            'postalCode',
            'streetName',
            'streetNumber',
            'propertyType',
            'size',
            'bedrooms',
            'bathrooms',
            'numberOfGarages',
            'energyClass',
            'constructedBefore2000',
            'propertyState',
            'hasCentralHeating',
            'hasThermalRegulation',
            'hasDoubleGlazing',
            'hasSecondBathroom',
            'hasRecreationalSpaces',
            'hasStorageSpaces',
          ].includes(field)
        ) {
          globalForm.updatePropertyInfo({ [field]: value });
        } else if (
          [
            'difficultyIndex',
            'medianRent',
            'minRent',
            'maxRent',
            'isLoading',
            'error',
            'errorCode',
          ].includes(field)
        ) {
          globalForm.updateCalculationResults({ [field]: value });
        }
        break;
      case 'FETCH_DIFFICULTY_INDEX_START':
        globalForm.updateCalculationResults({
          isLoading: true,
          error: null,
          errorCode: null,
        });
        break;
      case 'FETCH_DIFFICULTY_INDEX_SUCCESS':
        globalForm.updateCalculationResults({
          difficultyIndex: action.payload,
          isLoading: false,
          error: null,
          errorCode: null,
        });
        break;
      case 'FETCH_DIFFICULTY_INDEX_ERROR':
        globalForm.updateCalculationResults({
          isLoading: false,
          error: action.payload.message,
          errorCode: action.payload.code,
        });
        break;
      case 'CALCULATE_RENT':
        // This would need to be handled by the parent component
        break;
      case 'RESET_FORM':
        globalForm.clearSession();
        break;
      default:
        console.warn('Unmapped legacy action:', action);
    }
  };

  return {
    state: legacyState,
    dispatch: legacyDispatch,
    fetchDifficultyIndexAndCalculate: async () => {
      // This would need to be implemented in the consuming component
      console.warn(
        'fetchDifficultyIndexAndCalculate needs to be implemented in the consuming component'
      );
    },
    clearError: () => {
      globalForm.updateCalculationResults({ error: null, errorCode: null });
    },
  };
};
