'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CalculatorState, PropertyFeatures, PropertyDetails, Address } from '@/types/calculator';

interface CalculatorContextType {
  state: CalculatorState;
  updateHousingType: (type: CalculatorState['housingType']) => void;
  updatePropertyType: (type: CalculatorState['propertyType']) => void;
  updatePropertyDetails: (details: PropertyDetails) => void;
  updateFeatures: (features: PropertyFeatures) => void;
  updateEnergyRating: (rating: CalculatorState['energyRating']) => void;
  updateAddress: (address: Address) => void;
  updateCurrentRent: (rent: number) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetCalculator: () => void;
  markStepComplete: (step: number) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

const STORAGE_KEY = 'loyer-calculator-state';
const TOTAL_STEPS = 7;

const initialState: CalculatorState = {
  currentStep: 1,
  completedSteps: [],
};

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse stored calculator state:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const updateHousingType = useCallback((type: CalculatorState['housingType']) => {
    setState((prev) => ({ ...prev, housingType: type }));
  }, []);

  const updatePropertyType = useCallback((type: CalculatorState['propertyType']) => {
    setState((prev) => {
      // Auto-set bedroom count based on property type
      let bedrooms = prev.propertyDetails?.bedrooms || 0;
      if (type === 'studio') bedrooms = 0;
      else if (type === 'apartment-1') bedrooms = 1;
      else if (type === 'apartment-2') bedrooms = 2;
      else if (type === 'apartment-3') bedrooms = 3;
      else if (type === 'apartment-4+') bedrooms = 4;

      return {
        ...prev,
        propertyType: type,
        propertyDetails: {
          ...prev.propertyDetails,
          livingSpace: prev.propertyDetails?.livingSpace || 50,
          bedrooms,
          bathrooms: prev.propertyDetails?.bathrooms || 1,
        },
      };
    });
  }, []);

  const updatePropertyDetails = useCallback((details: PropertyDetails) => {
    setState((prev) => ({ ...prev, propertyDetails: details }));
  }, []);

  const updateFeatures = useCallback((features: PropertyFeatures) => {
    setState((prev) => ({ ...prev, features }));
  }, []);

  const updateEnergyRating = useCallback((rating: CalculatorState['energyRating']) => {
    setState((prev) => ({ ...prev, energyRating: rating }));
  }, []);

  const updateAddress = useCallback((address: Address) => {
    setState((prev) => ({ ...prev, address }));
  }, []);

  const updateCurrentRent = useCallback((rent: number) => {
    setState((prev) => ({ ...prev, currentRent: rent }));
  }, []);

  const markStepComplete = useCallback((step: number) => {
    setState((prev) => {
      if (!prev.completedSteps.includes(step)) {
        return {
          ...prev,
          completedSteps: [...prev.completedSteps, step].sort((a, b) => a - b),
        };
      }
      return prev;
    });
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const newStep = Math.min(prev.currentStep + 1, TOTAL_STEPS);
      return { ...prev, currentStep: newStep };
    });
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => {
      const newStep = Math.max(prev.currentStep - 1, 1);
      return { ...prev, currentStep: newStep };
    });
  }, []);

  const resetCalculator = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value: CalculatorContextType = {
    state,
    updateHousingType,
    updatePropertyType,
    updatePropertyDetails,
    updateFeatures,
    updateEnergyRating,
    updateAddress,
    updateCurrentRent,
    goToStep,
    nextStep,
    previousStep,
    resetCalculator,
    markStepComplete,
  };

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within CalculatorProvider');
  }
  return context;
}
