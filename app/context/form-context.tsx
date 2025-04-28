"use client";

import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";
import { fetchDifficultyIndexAction } from "../actions/fetch-difficulty-index";

export type PropertyType = "apartment" | "house" | "studio";
export type EnergyClass = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type PropertyState = 1 | 2 | 3; // 1: Mauvais état, 2: Bon état, 3: Excellent état

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
      const { medianRent, minRent, maxRent } = calculateRent(state);
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

// Rental price calculation based on loyers.brussels methodology
export const calculateRent = (
  inputData: FormState
): {
  medianRent: number;
  minRent: number;
  maxRent: number;
} => {
  // Constants from the official formulas
  const BASE_CONSTANT = 0.1758082;
  const MULTIPLIER = 1.0207648;
  const STATE_2_ADJUSTMENT = 0.2490667; // état=2
  const STATE_3_ADJUSTMENT = 1.042853; // état=3
  const DIFFICULTY_MULTIPLIER = -0.6455585;

  // Default to 0 if no difficulty index is available
  const difficultyIndex = inputData.difficultyIndex;
  const surface = inputData.size;
  const propertyState = inputData.propertyState ?? 2; // Default to Bon état (2) if not set

  if (surface <= 0) {
    // Avoid division by zero and nonsensical calculations
    return { medianRent: 0, minRent: 0, maxRent: 0 };
  }

  // Get the appropriate formula constants based on property type and number of bedrooms
  let formulaConstant = 0;
  let inverseSurfaceMultiplier = 0;

  if (
    inputData.propertyType === "studio" ||
    (inputData.propertyType === "apartment" && inputData.bedrooms === 0)
  ) {
    // Studio-Appartement 0 chambre
    formulaConstant = 3.4017754;
    inverseSurfaceMultiplier = 410.93786;
  } else if (inputData.propertyType === "apartment") {
    switch (inputData.bedrooms) {
      case 1:
        // Appartement 1 chambre
        formulaConstant = 2.8301143;
        inverseSurfaceMultiplier = 482.6853574;
        break;
      case 2:
        // Appartement 2 chambres
        formulaConstant = 2.9097312;
        inverseSurfaceMultiplier = 548.1594066;
        break;
      case 3:
        // Appartement 3 chambres
        formulaConstant = 4.3996618;
        inverseSurfaceMultiplier = 505.9611096;
        break;
      default: // 4 chambres et plus
        formulaConstant = 7.5;
        inverseSurfaceMultiplier = 250;
        break;
    }
  } else if (inputData.propertyType === "house") {
    if (inputData.bedrooms <= 2) {
      // Maison 1 ou 2 chambres
      formulaConstant = 3.1738354;
      inverseSurfaceMultiplier = 487.9031965;
    } else if (inputData.bedrooms === 3) {
      // Maison 3 chambres
      formulaConstant = 3.4543796;
      inverseSurfaceMultiplier = 562.1917377;
    } else {
      // 4 chambres ou plus
      formulaConstant = 5.300474;
      inverseSurfaceMultiplier = 393.8815801;
    }
  } else {
    // Fallback or handle other types if necessary
    // Using Studio/0 bed apartment as a default fallback for now
    formulaConstant = 3.4017754;
    inverseSurfaceMultiplier = 410.93786;
  }

  // Calculate the inverse surface term
  const inverseSurfaceTerm = inverseSurfaceMultiplier / surface;

  // Determine state adjustment based on propertyState
  let stateAdjustment = 0;
  if (propertyState === 2) {
    stateAdjustment = STATE_2_ADJUSTMENT;
  } else if (propertyState === 3) {
    stateAdjustment = STATE_3_ADJUSTMENT;
  }
  // No adjustment if propertyState is 1 (Mauvais état)

  // Calculate the base price per square meter using the core formula
  const basePricePerSqm =
    BASE_CONSTANT +
    MULTIPLIER * (formulaConstant + inverseSurfaceTerm) +
    stateAdjustment + // Use the determined state adjustment
    DIFFICULTY_MULTIPLIER * (difficultyIndex ?? 0); // Note: DIFFICULTY_MULTIPLIER is negative

  // Calculate the initial base rent
  let calculatedRent = basePricePerSqm * surface;

  // Apply additional value adjustments
  if (inputData.hasCentralHeating === false) calculatedRent -= 18.679544;
  if (inputData.hasThermalRegulation === false) calculatedRent -= 16.867348;
  if (inputData.hasSecondBathroom === true) calculatedRent += 88.547325;
  if (inputData.hasRecreationalSpaces === false) calculatedRent -= 15.763757;
  if (inputData.hasStorageSpaces === true) calculatedRent += 0.707585; // This seems very small, double-check if intended
  if (inputData.numberOfGarages > 0)
    calculatedRent += inputData.numberOfGarages * 40.109301;

  // Apply PEB (Energy Class) adjustments
  const energyClassAdjustment: Partial<Record<EnergyClass, number>> = {
    A: 164.16,
    B: 109.44,
    C: 54.72,
    D: 21.89,
    E: 0,
    F: -10.94,
    G: -21.89,
  };

  if (inputData.energyClass && inputData.energyClass in energyClassAdjustment) {
    calculatedRent += energyClassAdjustment[inputData.energyClass as EnergyClass] ?? 0;
  }

  const indexationRatio = 133.73000000000047 / 112.74000000000039;

  // Ensure rent is not negative
  const finalMedianRent = Math.max(0, calculatedRent) * indexationRatio;

  // Calculate min and max rent (±10% of the final median rent)

  // Return rounded values
  return {
    // Using finalMedianRent as base for simplicity, adjust if needed
    medianRent: parseFloat(finalMedianRent.toFixed(2)),
    minRent: parseFloat((finalMedianRent * 0.9).toFixed(2)),
    maxRent: parseFloat((finalMedianRent * 1.1).toFixed(2)),
  };
};

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

      console.log(result);

      dispatch({
        type: "FETCH_DIFFICULTY_INDEX_SUCCESS",
        payload: parseFloat(result.data),
      });

      // Calculate rent after fetching the difficulty index
      dispatch({ type: "CALCULATE_RENT" });
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
