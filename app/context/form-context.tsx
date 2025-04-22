"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import { fetchDifficultyIndexAction } from "../actions/fetch-difficulty-index"

export type PropertyType = "apartment" | "house" | "studio"
export type EnergyClass = "A" | "B" | "C" | "D" | "E" | "F" | "G"
export type PropertyState = 1 | 2 | 3 // 1: Mauvais état, 2: Bon état, 3: Excellent état
export type Neighborhood = "center" | "north" | "south" | "east" | "west"

export interface FormState {
  step: number
  // Address information
  postalCode: string
  streetName: string
  streetNumber: string
  // Property details
  propertyType: PropertyType | ""
  size: number
  bedrooms: number
  bathrooms: number
  separateToilet: boolean
  livingRoomSize: number | null
  kitchenType: "open" | "closed" | "american" | "none"
  kitchenEquipped: boolean
  // Additional features
  floor: number
  totalFloors: number
  hasElevator: boolean
  hasParking: boolean
  hasGarage: boolean
  hasBalcony: boolean
  balconySize: number | null
  hasTerrace: boolean
  terraceSize: number | null
  hasGarden: boolean
  gardenSize: number | null
  hasBasement: boolean
  hasAttic: boolean
  // Energy and heating
  energyClass: EnergyClass | ""
  heatingType: "central" | "individual" | "none"
  // Location
  neighborhood: Neighborhood | ""
  // Calculation results
  difficultyIndex: number | null
  baseRent: number | null
  adjustedRent: number | null
  minRent: number | null
  maxRent: number | null
  estimatedRent: number | null
  isLoading: boolean
  error: string | null
  errorCode: string | null
  hasCentralHeating: boolean | null
  hasThermalRegulation: boolean | null
  hasDoubleGlazing: boolean | null
  hasSecondBathroom: boolean | null
  hasRecreationalSpaces: boolean | null
  hasStorageSpaces: boolean | null
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
  | { type: "CLEAR_ERROR" }

const initialState: FormState = {
  step: 1,
  // Address information
  postalCode: "",
  streetName: "",
  streetNumber: "",
  // Property details
  propertyType: "",
  size: 0,
  bedrooms: 1,
  bathrooms: 1,
  separateToilet: false,
  livingRoomSize: null,
  kitchenType: "none",
  kitchenEquipped: false,
  // Additional features
  floor: 0,
  totalFloors: 0,
  hasElevator: false,
  hasParking: false,
  hasGarage: false,
  hasBalcony: false,
  balconySize: null,
  hasTerrace: false,
  terraceSize: null,
  hasGarden: false,
  gardenSize: null,
  hasBasement: false,
  hasAttic: false,
  // Energy and heating
  energyClass: "",
  heatingType: "none",
  // Location
  neighborhood: "",
  // Calculation results
  difficultyIndex: null,
  baseRent: null,
  adjustedRent: null,
  minRent: null,
  maxRent: null,
  estimatedRent: null,
  isLoading: false,
  error: null,
  errorCode: null,
  hasCentralHeating: null,
  hasThermalRegulation: null,
  hasDoubleGlazing: null,
  hasSecondBathroom: null,
  hasRecreationalSpaces: null,
  hasStorageSpaces: null,
}

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, step: state.step + 1, error: null, errorCode: null }
    case "PREV_STEP":
      return { ...state, step: Math.max(1, state.step - 1), error: null, errorCode: null }
    case "GO_TO_STEP":
      return { ...state, step: action.payload, error: null, errorCode: null }
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value }
    case "FETCH_DIFFICULTY_INDEX_START":
      return { ...state, isLoading: true, error: null, errorCode: null }
    case "FETCH_DIFFICULTY_INDEX_SUCCESS":
      return {
        ...state,
        difficultyIndex: action.payload,
        isLoading: false,
        error: null,
        errorCode: null,
      }
    case "FETCH_DIFFICULTY_INDEX_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload.message,
        errorCode: action.payload.code,
      }
    case "CALCULATE_RENT":
      const { baseRent, adjustedRent, minRent, maxRent } = calculateRent(state)
      return {
        ...state,
        baseRent,
        adjustedRent,
        minRent,
        maxRent,
        estimatedRent: adjustedRent,
        step: state.step + 1,
        error: null,
        errorCode: null,
      }
    case "RESET_FORM":
      return initialState
    case "CLEAR_ERROR":
      return { ...state, error: null, errorCode: null }
    default:
      return state
  }
}

// Rental price calculation based on loyers.brussels methodology
const calculateRent = (
  state: FormState,
): {
  baseRent: number
  adjustedRent: number
  minRent: number
  maxRent: number
} => {
  // Constants from the official formulas
  const BASE_CONSTANT = 0.1758082
  const MULTIPLIER = 1.0207648
  const STATE_2_ADJUSTMENT = 0.2490667
  const DIFFICULTY_MULTIPLIER = -0.6455585

  // Default to 0 if no difficulty index is available
  const difficultyIndex = parseFloat(state.difficultyIndex)

  // Get the appropriate formula based on property type and number of bedrooms
  let formulaConstant = 0
  let inverseSurfaceMultiplier = 0

  if (state.propertyType === "studio" || (state.propertyType === "apartment" && state.bedrooms === 0)) {
    // Studio-Apartment 0 chambre
    formulaConstant = 3.4017754
    inverseSurfaceMultiplier = 410.93786
  } else if (state.propertyType === "apartment") {
    switch (state.bedrooms) {
      case 1:
        // Appartement 1 chambre
        formulaConstant = 2.8301143
        inverseSurfaceMultiplier = 482.6853574
        break
      case 2:
        // Appartement 2 chambres
        formulaConstant = 2.9097312
        inverseSurfaceMultiplier = 548.1594066
        break
      case 3:
        // Appartement 3 chambres
        formulaConstant = 4.3996618
        inverseSurfaceMultiplier = 505.9611096
        break
      default:
        // Appartement 4 chambres et plus
        formulaConstant = 7.5
        inverseSurfaceMultiplier = 250
        break
    }
  } else if (state.propertyType === "house") {
    if (state.bedrooms <= 2) {
      // Maison 1 ou 2 chambres (approximation as the formula is partially visible)
      formulaConstant = 3.5
      inverseSurfaceMultiplier = 500
    } else if (state.bedrooms <= 4) {
      // Maison 3 ou 4 chambres (approximation)
      formulaConstant = 5.0
      inverseSurfaceMultiplier = 550
    } else {
      // Maison 5 chambres et plus (approximation)
      formulaConstant = 8.0
      inverseSurfaceMultiplier = 600
    }
  } else {
    // Default for other property types
    formulaConstant = 3.0
    inverseSurfaceMultiplier = 400
  }

  // Calculate the inverse surface term
  const inverseSurfaceTerm = state.size > 0 ? inverseSurfaceMultiplier / state.size : 0

  // Always use the good condition adjustment (STATE_2_ADJUSTMENT)
  const stateAdjustment = STATE_2_ADJUSTMENT

  // Apply the formula: loyer = (BASE_CONSTANT + MULTIPLIER * (formulaConstant + inverseSurfaceTerm) + stateAdjustment - DIFFICULTY_MULTIPLIER * difficultyIndex) * surface
  const pricePerSqm =
    BASE_CONSTANT +
    MULTIPLIER * (formulaConstant + inverseSurfaceTerm) +
    stateAdjustment -
    DIFFICULTY_MULTIPLIER * difficultyIndex

  // Calculate the base rent
  const baseRent = pricePerSqm * state.size

  // Apply energy class adjustments
  const energyClassAdjustment: Record<EnergyClass, number> = {
    A: 1.1,
    B: 1.05,
    C: 1.0,
    D: 0.95,
    E: 0.9,
    F: 0.85,
    G: 0.8,
  }

  let adjustedRent = baseRent
  if (state.energyClass) {
    adjustedRent *= energyClassAdjustment[state.energyClass as EnergyClass] || 1.0
  }

  // Apply additional features adjustments (these are not in the official formula but add value)
  if (state.hasParking) adjustedRent += 80
  if (state.hasGarage) adjustedRent += 100
  if (state.hasBalcony && state.balconySize) adjustedRent += Math.min(state.balconySize * 5, 50)
  if (state.hasTerrace && state.terraceSize) adjustedRent += Math.min(state.terraceSize * 7, 100)
  if (state.hasGarden && state.gardenSize) adjustedRent += Math.min(state.gardenSize * 3, 150)

  // Apply adjustments for heating and insulation
  if (state.hasCentralHeating) adjustedRent += 50
  if (state.hasThermalRegulation) adjustedRent += 30
  if (state.hasDoubleGlazing) adjustedRent += 40

  // Apply adjustments for additional rooms and spaces
  if (state.hasSecondBathroom) adjustedRent += 70
  if (state.hasRecreationalSpaces) adjustedRent += 60
  if (state.hasStorageSpaces) adjustedRent += 30

  // Calculate min and max rent (±20% as per Brussels regulations)
  const minRent = Math.round(adjustedRent * 0.8)
  const maxRent = Math.round(adjustedRent * 1.2)

  // Round to nearest 10
  return {
    baseRent: Math.round(baseRent / 10) * 10,
    adjustedRent: Math.round(adjustedRent / 10) * 10,
    minRent,
    maxRent,
  }
}

interface FormContextType {
  state: FormState
  dispatch: React.Dispatch<FormAction>
  fetchDifficultyIndexAndCalculate: () => Promise<void>
  clearError: () => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const fetchDifficultyIndexAndCalculate = async () => {
    if (!state.postalCode || !state.streetName || !state.streetNumber) {
      dispatch({
        type: "FETCH_DIFFICULTY_INDEX_ERROR",
        payload: {
          message: "Veuillez remplir tous les champs d'adresse",
          code: "MISSING_FIELDS",
        },
      })
      return
    }

    dispatch({ type: "FETCH_DIFFICULTY_INDEX_START" })

    try {
      // Use the server action to fetch the difficulty index
      const result = await fetchDifficultyIndexAction(1080, "Avenue de la Liberté", "120")

      if (!result.success) {
        dispatch({
          type: "FETCH_DIFFICULTY_INDEX_ERROR",
          payload: {
            message: result.error || "Erreur lors de la récupération de l'indice de difficulté",
            code: result.code || "UNKNOWN_ERROR",
          },
        })
        return
      }

      console.log(result.data)

      dispatch({
        type: "FETCH_DIFFICULTY_INDEX_SUCCESS",
        payload: result.data,
      })

      // Calculate rent after fetching the difficulty index
      dispatch({ type: "CALCULATE_RENT" })
    } catch (error: any) {
      dispatch({
        type: "FETCH_DIFFICULTY_INDEX_ERROR",
        payload: {
          message: error.message || "Une erreur s'est produite lors de la récupération de l'indice de difficulté",
          code: "SYSTEM_ERROR",
        },
      })
    }
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  return (
    <FormContext.Provider value={{ state, dispatch, fetchDifficultyIndexAndCalculate, clearError }}>
      {children}
    </FormContext.Provider>
  )
}

export const useForm = (): FormContextType => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useForm must be used within a FormProvider")
  }
  return context
}
