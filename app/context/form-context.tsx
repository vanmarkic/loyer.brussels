"use client";

import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { PropertyType, EnergyClass, PropertyState } from "../data/types"; // Import types
import { fetchDifficultyIndexAction } from "../actions/fetch-difficulty-index";
import { calculateRent, type CalculateRentInput } from "../lib/rent-calculator"; // Import function and input type

export interface FormState {
  step: number;
  // Address information
  postalCode: number;
  streetName: string;
  streetNumber: string;
  // Property details
  propertyType: PropertyType | "";
  size: number;
  bedrooms: number;
  bathrooms: number;
  // Additional features
  numberOfGarages: number;
  // Energy and heating
  energyClass: EnergyClass | "";
  // Location
  // Calculation results
  difficultyIndex: number | null;
  medianRent: number | null;
  minRent: number | null;
  maxRent: number | null;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  hasCentralHeating: boolean | null;
  hasThermalRegulation: boolean | null;
  hasDoubleGlazing: boolean | null;
  hasSecondBathroom: boolean | null;
  hasRecreationalSpaces: boolean | null;
  hasStorageSpaces: boolean | null;
  constructedBefore2000: boolean | null; // Added construction year period
  propertyState: PropertyState | null; // Added property state
}

type FormAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "UPDATE_FIELD"; field: keyof FormState; value: any }
  | { type: "FETCH_DIFFICULTY_INDEX_START" }
  | { type: "FETCH_DIFFICULTY_INDEX_SUCCESS"; payload: number }
  | { type: "FETCH_DIFFICULTY_INDEX_ERROR"; payload: { message: string; code: string } }
  | { type: "CALCULATE_RENT" }
  | { type: "RESET_FORM" }
  | { type: "CLEAR_ERROR" };

const initialState: FormState = {
  step: 1,
  // Address information
  postalCode: 0,
  streetName: "",
  streetNumber: "",
  // Property details
  propertyType: "",
  size: 0,
  bedrooms: 1,
  bathrooms: 1,
  numberOfGarages: 0,
  // Energy and heating
  energyClass: "",
  // Location
  // Calculation results
  difficultyIndex: null,
  medianRent: null,
  minRent: null,
  maxRent: null,
  isLoading: false,
  error: null,
  errorCode: null,
  hasCentralHeating: null,
  hasThermalRegulation: null,
  hasDoubleGlazing: null,
  hasSecondBathroom: null,
  hasRecreationalSpaces: null,
  hasStorageSpaces: null,
  constructedBefore2000: null, // Added initial value for construction year period
  propertyState: null, // Added initial value for property state
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, step: state.step + 1, error: null, errorCode: null };
    case "PREV_STEP":
      return {
        ...state,
        step: Math.max(1, state.step - 1),
        error: null,
        errorCode: null,
      };
    case "GO_TO_STEP":
      return { ...state, step: action.payload, error: null, errorCode: null };
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "FETCH_DIFFICULTY_INDEX_START":
      return { ...state, isLoading: true, error: null, errorCode: null };
    case "FETCH_DIFFICULTY_INDEX_SUCCESS":
      return {
        ...state,
        difficultyIndex: action.payload,
        isLoading: false,
        error: null,
        errorCode: null,
      };
    case "FETCH_DIFFICULTY_INDEX_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload.message,
        errorCode: action.payload.code,
      };
    case "CALCULATE_RENT":
      // Create the input object for the calculation function
      const calculationInput: CalculateRentInput = {
        difficultyIndex: state.difficultyIndex,
        size: state.size,
        propertyState: state.propertyState,
        propertyType: state.propertyType,
        bedrooms: state.bedrooms,
        hasCentralHeating: state.hasCentralHeating,
        hasThermalRegulation: state.hasThermalRegulation,
        hasSecondBathroom: state.hasSecondBathroom,
        hasRecreationalSpaces: state.hasRecreationalSpaces,
        hasStorageSpaces: state.hasStorageSpaces,
        numberOfGarages: state.numberOfGarages,
        energyClass: state.energyClass,
      };
      const { medianRent, minRent, maxRent } = calculateRent(calculationInput);
      return {
        ...state,
        medianRent,
        minRent,
        maxRent,
        step: state.step + 1,
        error: null,
        errorCode: null,
      };
    case "RESET_FORM":
      return initialState;
    case "CLEAR_ERROR":
      return { ...state, error: null, errorCode: null };
    default:
      return state;
  }
};

// calculateRent function moved to app/lib/rent-calculator.ts

interface FormContextType {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  fetchDifficultyIndexAndCalculate: () => Promise<void>;
  clearError: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const fetchDifficultyIndexAndCalculate = async () => {
    if (!state.postalCode || !state.streetName || !state.streetNumber) {
      dispatch({
        type: "FETCH_DIFFICULTY_INDEX_ERROR",
        payload: {
          message: "Veuillez remplir tous les champs d'adresse",
          code: "MISSING_FIELDS",
        },
      });
      return;
    }

    dispatch({ type: "FETCH_DIFFICULTY_INDEX_START" });

    try {
      // Use the server action to fetch the difficulty index

      console.log(
        "Fetching difficulty index for:",
        state.postalCode,
        state.streetName,
        state.streetNumber
      );
      const result = await fetchDifficultyIndexAction(
        state.postalCode,
        state.streetName,
        state.streetNumber
      );

      if (!result.success) {
        dispatch({
          type: "FETCH_DIFFICULTY_INDEX_ERROR",
          payload: {
            message:
              result.error || "Erreur lors de la récupération de l'indice de difficulté",
            code: result.code || "UNKNOWN_ERROR",
          },
        });
        return;
      }

      console.log("Difficulty index fetch result:", result);

      // Ensure data is a valid number before dispatching success
      if (typeof result.data === "number") {
        dispatch({
          type: "FETCH_DIFFICULTY_INDEX_SUCCESS",
          payload: result.data, // Pass the number directly
        });

        // Calculate rent only after successfully fetching the difficulty index
        dispatch({ type: "CALCULATE_RENT" });
      } else {
        // Handle unexpected case where success is true but data is not a number
        console.error(
          "Unexpected state: fetchDifficultyIndexAction succeeded but returned invalid data:",
          result.data
        );
        dispatch({
          type: "FETCH_DIFFICULTY_INDEX_ERROR",
          payload: {
            message: "Données d'indice de difficulté invalides reçues.",
            code: "SYSTEM_ERROR",
          },
        });
      }
    } catch (error: any) {
      dispatch({
        type: "FETCH_DIFFICULTY_INDEX_ERROR",
        payload: {
          message:
            error.message ||
            "Une erreur s'est produite lors de la récupération de l'indice de difficulté",
          code: "SYSTEM_ERROR",
        },
      });
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <FormContext.Provider
      value={{ state, dispatch, fetchDifficultyIndexAndCalculate, clearError }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
