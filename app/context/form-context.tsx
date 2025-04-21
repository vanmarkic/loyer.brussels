"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import { fetchDifficultyIndex } from "../lib/supabase"

export type PropertyType = "apartment" | "house" | "studio" | "other"
export type EnergyClass = "A" | "B" | "C" | "D" | "E" | "F" | "G"
export type Neighborhood = "center" | "north" | "south" | "east" | "west"

export interface FormState {
  step: number
  // Address information
  postalCode: string
  streetName: string
  streetNumber: string
  // Property details
  propertyType: PropertyType | ""
  constructionYear: number | null
  renovationYear: number | null
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
}

type FormAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "UPDATE_FIELD"; field: keyof FormState; value: any }
  | { type: "FETCH_DIFFICULTY_INDEX_START" }
  | { type: "FETCH_DIFFICULTY_INDEX_SUCCESS"; payload: number }
  | { type: "FETCH_DIFFICULTY_INDEX_ERROR"; payload: string }
  | { type: "CALCULATE_RENT" }
  | { type: "RESET_FORM" }

const initialState: FormState = {
  step: 1,
  // Address information
  postalCode: "",
  streetName: "",
  streetNumber: "",
  // Property details
  propertyType: "",
  constructionYear: null,
  renovationYear: null,
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
}

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, step: state.step + 1 }
    case "PREV_STEP":
      return { ...state, step: Math.max(1, state.step - 1) }
    case "GO_TO_STEP":
      return { ...state, step: action.payload }
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value }
    case "FETCH_DIFFICULTY_INDEX_START":
      return { ...state, isLoading: true, error: null }
    case "FETCH_DIFFICULTY_INDEX_SUCCESS":
      return {
        ...state,
        difficultyIndex: action.payload,
        isLoading: false,
        error: null,
      }
    case "FETCH_DIFFICULTY_INDEX_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
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
      }
    case "RESET_FORM":
      return initialState
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
  // Base price calculation
  // Using a simplified version of the Brussels reference rent formula
  let basePrice = 0

  // Base price per square meter (simplified)
  const basePricePerSqm = 12 // Average base price per sqm in Brussels

  // Calculate base rent from size
  basePrice = state.size * basePricePerSqm

  // Apply property type adjustments
  const propertyTypeMultiplier: Record<PropertyType, number> = {
    apartment: 1.0,
    house: 1.2,
    studio: 0.9,
    other: 1.0,
  }

  basePrice *= propertyTypeMultiplier[state.propertyType as PropertyType] || 1.0

  // Apply bedroom adjustments
  basePrice += state.bedrooms * 50

  // Apply bathroom adjustments
  basePrice += state.bathrooms * 40

  // Apply difficulty index if available
  let adjustedPrice = basePrice
  if (state.difficultyIndex !== null) {
    // The difficulty index is a multiplier that adjusts the base price
    // based on the location's desirability
    adjustedPrice = basePrice * (1 + state.difficultyIndex / 100)
  }

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

  if (state.energyClass) {
    adjustedPrice *= energyClassAdjustment[state.energyClass as EnergyClass] || 1.0
  }

  // Apply additional features adjustments
  if (state.hasParking) adjustedPrice += 80
  if (state.hasGarage) adjustedPrice += 100
  if (state.hasBalcony && state.balconySize) adjustedPrice += Math.min(state.balconySize * 5, 50)
  if (state.hasTerrace && state.terraceSize) adjustedPrice += Math.min(state.terraceSize * 7, 100)
  if (state.hasGarden && state.gardenSize) adjustedPrice += Math.min(state.gardenSize * 3, 150)

  // Floor adjustments
  if (state.floor > 0) {
    // Higher floors typically command higher rents
    adjustedPrice += state.floor * 10

    // But if there's no elevator and it's above the 2nd floor, reduce the price
    if (!state.hasElevator && state.floor > 2) {
      adjustedPrice -= (state.floor - 2) * 15
    }
  }

  // Calculate min and max rent (±20% as per Brussels regulations)
  const minRent = Math.round(adjustedPrice * 0.8)
  const maxRent = Math.round(adjustedPrice * 1.2)

  // Round to nearest 10
  return {
    baseRent: Math.round(basePrice / 10) * 10,
    adjustedRent: Math.round(adjustedPrice / 10) * 10,
    minRent,
    maxRent,
  }
}

interface FormContextType {
  state: FormState
  dispatch: React.Dispatch<FormAction>
  fetchDifficultyIndexAndCalculate: () => Promise<void>
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const fetchDifficultyIndexAndCalculate = async () => {
    if (!state.postalCode || !state.streetName || !state.streetNumber) {
      dispatch({
        type: "FETCH_DIFFICULTY_INDEX_ERROR",
        payload: "Veuillez remplir tous les champs d'adresse",
      })
      return
    }

    dispatch({ type: "FETCH_DIFFICULTY_INDEX_START" })

    try {
      const difficultyIndex = await fetchDifficultyIndex(state.postalCode, state.streetName, state.streetNumber)

      if (difficultyIndex === null) {
        dispatch({
          type: "FETCH_DIFFICULTY_INDEX_ERROR",
          payload: "Impossible de trouver l'indice de difficulté pour cette adresse",
        })
        return
      }

      dispatch({
        type: "FETCH_DIFFICULTY_INDEX_SUCCESS",
        payload: difficultyIndex,
      })

      // Calculate rent after fetching the difficulty index
      dispatch({ type: "CALCULATE_RENT" })
    } catch (error) {
      dispatch({
        type: "FETCH_DIFFICULTY_INDEX_ERROR",
        payload: "Une erreur s'est produite lors de la récupération de l'indice de difficulté",
      })
    }
  }

  return (
    <FormContext.Provider value={{ state, dispatch, fetchDifficultyIndexAndCalculate }}>
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
