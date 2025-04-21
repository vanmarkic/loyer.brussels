"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

export type PropertyType = "apartment" | "house" | "studio" | "other"
export type Neighborhood = "center" | "north" | "south" | "east" | "west"

export interface FormState {
  step: number
  propertyType: PropertyType | ""
  bedrooms: number
  bathrooms: number
  size: number
  neighborhood: Neighborhood | ""
  floor: number
  hasElevator: boolean
  hasParking: boolean
  hasBalcony: boolean
  hasGarden: boolean
  isRenovated: boolean
  energyClass: string
  estimatedRent: number | null
}

type FormAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; payload: number }
  | { type: "UPDATE_FIELD"; field: keyof FormState; value: any }
  | { type: "CALCULATE_RENT" }
  | { type: "RESET_FORM" }

const initialState: FormState = {
  step: 1,
  propertyType: "",
  bedrooms: 1,
  bathrooms: 1,
  size: 0,
  neighborhood: "",
  floor: 0,
  hasElevator: false,
  hasParking: false,
  hasBalcony: false,
  hasGarden: false,
  isRenovated: false,
  energyClass: "D",
  estimatedRent: null,
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
    case "CALCULATE_RENT":
      return { ...state, estimatedRent: calculateRent(state), step: state.step + 1 }
    case "RESET_FORM":
      return initialState
    default:
      return state
  }
}

// Simple rental price calculation logic
const calculateRent = (state: FormState): number => {
  // Base price per square meter by neighborhood
  const basePricePerSqm: Record<Neighborhood, number> = {
    center: 15,
    north: 12,
    south: 14,
    east: 13,
    west: 11,
  }

  // Property type multipliers
  const propertyTypeMultiplier: Record<PropertyType, number> = {
    apartment: 1.0,
    house: 1.2,
    studio: 0.9,
    other: 1.0,
  }

  // Calculate base rent
  let baseRent = state.size * (basePricePerSqm[state.neighborhood as Neighborhood] || 13)

  // Apply property type multiplier
  baseRent *= propertyTypeMultiplier[state.propertyType as PropertyType] || 1.0

  // Add for bedrooms and bathrooms
  baseRent += state.bedrooms * 50
  baseRent += state.bathrooms * 40

  // Add for amenities
  if (state.hasParking) baseRent += 80
  if (state.hasBalcony) baseRent += 40
  if (state.hasGarden) baseRent += 100
  if (state.isRenovated) baseRent += state.size * 2

  // Floor adjustments
  if (state.floor > 0) {
    baseRent += state.floor * 10
    if (!state.hasElevator && state.floor > 2) {
      baseRent -= (state.floor - 2) * 15
    }
  }

  // Energy class adjustments
  const energyClassAdjustment: Record<string, number> = {
    A: 1.1,
    B: 1.05,
    C: 1.0,
    D: 0.95,
    E: 0.9,
    F: 0.85,
    G: 0.8,
  }

  baseRent *= energyClassAdjustment[state.energyClass] || 1.0

  // Round to nearest 10
  return Math.round(baseRent / 10) * 10
}

interface FormContextType {
  state: FormState
  dispatch: React.Dispatch<FormAction>
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState)

  return <FormContext.Provider value={{ state, dispatch }}>{children}</FormContext.Provider>
}

export const useForm = (): FormContextType => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useForm must be used within a FormProvider")
  }
  return context
}
