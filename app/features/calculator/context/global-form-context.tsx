"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import type {
  GlobalFormState,
  UserProfile,
  PropertyInformation,
  RentalInformation,
  CalculationResults,
} from "@/features/calculator/types/global-form-types";

// Session storage completely removed - no persistence

// Default state values
const defaultUserProfile: UserProfile = {
  email: "",
  phone: "",
  joinNewsletter: false,
  joinAssembly: false,
};

const defaultPropertyInfo: PropertyInformation = {
  postalCode: 0,
  streetName: "",
  streetNumber: "",
  propertyType: "",
  size: 0,
  bedrooms: 1,
  bathrooms: 1,
  numberOfGarages: 0,
  energyClass: "",
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
  actualRent: "",
  leaseType: "",
  leaseStartDate: "",
  rentIndexation: "",
  boilerMaintenance: false,
  fireInsurance: false,
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

export const initialGlobalState: GlobalFormState = {
  currentStep: 1,
  currentPage: "calculator",
  userProfile: defaultUserProfile,
  propertyInfo: defaultPropertyInfo,
  rentalInfo: defaultRentalInfo,
  calculationResults: defaultCalculationResults,
};

// Action types
type GlobalFormAction =
  | { type: "UPDATE_USER_PROFILE"; payload: Partial<UserProfile> }
  | { type: "UPDATE_PROPERTY_INFO"; payload: Partial<PropertyInformation> }
  | { type: "UPDATE_RENTAL_INFO"; payload: Partial<RentalInformation> }
  | { type: "UPDATE_CALCULATION_RESULTS"; payload: Partial<CalculationResults> }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | {
      type: "SET_CURRENT_PAGE";
      payload: "calculator" | "results" | "questionnaire";
    }
  | { type: "RESET_FORM" };

// Reducer
export const globalFormReducer = (
  state: GlobalFormState,
  action: GlobalFormAction,
): GlobalFormState => {
  switch (action.type) {
    case "UPDATE_USER_PROFILE":
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };

    case "UPDATE_PROPERTY_INFO":
      return {
        ...state,
        propertyInfo: { ...state.propertyInfo, ...action.payload },
      };

    case "UPDATE_RENTAL_INFO":
      return {
        ...state,
        rentalInfo: { ...state.rentalInfo, ...action.payload },
      };

    case "UPDATE_CALCULATION_RESULTS":
      return {
        ...state,
        calculationResults: {
          ...state.calculationResults,
          ...action.payload,
        },
      };

    case "SET_CURRENT_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };

    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };

    case "RESET_FORM":
      return { ...initialGlobalState };

    default:
      return state;
  }
};

// Context type
interface GlobalFormContextType {
  state: GlobalFormState;
  dispatch: React.Dispatch<GlobalFormAction>;

  // Convenience methods
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updatePropertyInfo: (updates: Partial<PropertyInformation>) => void;
  updateRentalInfo: (updates: Partial<RentalInformation>) => void;
  updateCalculationResults: (updates: Partial<CalculationResults>) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;

  // Data getters to replace duplicate requests
  getActualRent: () => string;
  getContactInfo: () => { email: string; phone: string };
}

// Context
export const GlobalFormContext = createContext<
  GlobalFormContextType | undefined
>(undefined);

// Provider
export const GlobalFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(globalFormReducer, initialGlobalState);

  // Convenience methods with useCallback to prevent unnecessary re-renders
  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    dispatch({ type: "UPDATE_USER_PROFILE", payload: updates });
  }, []);

  const updatePropertyInfo = useCallback(
    (updates: Partial<PropertyInformation>) => {
      dispatch({ type: "UPDATE_PROPERTY_INFO", payload: updates });
    },
    [],
  );

  const updateRentalInfo = useCallback(
    (updates: Partial<RentalInformation>) => {
      dispatch({ type: "UPDATE_RENTAL_INFO", payload: updates });
    },
    [],
  );

  const updateCalculationResults = useCallback(
    (updates: Partial<CalculationResults>) => {
      dispatch({ type: "UPDATE_CALCULATION_RESULTS", payload: updates });
    },
    [],
  );

  const setCurrentStep = useCallback((step: number) => {
    dispatch({ type: "SET_CURRENT_STEP", payload: step });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, []);

  // Data getters - stabilized with useCallback to prevent unnecessary re-renders
  const getActualRent = useCallback((): string => {
    return state.rentalInfo.actualRent;
  }, [state.rentalInfo.actualRent]);

  const getContactInfo = useCallback((): { email: string; phone: string } => {
    return {
      email: state.userProfile.email,
      phone: state.userProfile.phone,
    };
  }, [state.userProfile.email, state.userProfile.phone]);

  const contextValue: GlobalFormContextType = useMemo(
    () => ({
      state,
      dispatch,
      updateUserProfile,
      updatePropertyInfo,
      updateRentalInfo,
      updateCalculationResults,
      setCurrentStep,
      resetForm,
      getActualRent,
      getContactInfo,
    }),
    [
      state,
      updateUserProfile,
      updatePropertyInfo,
      updateRentalInfo,
      updateCalculationResults,
      setCurrentStep,
      resetForm,
      getActualRent,
      getContactInfo,
    ],
  );

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
    throw new Error("useGlobalForm must be used within a GlobalFormProvider");
  }
  return context;
};
