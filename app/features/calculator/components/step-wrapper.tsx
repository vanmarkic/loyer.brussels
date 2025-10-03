"use client";

import React, { createContext, useContext } from "react";
import { useStepNavigation } from "@/features/calculator/hooks/use-step-navigation";

// Context for step navigation
interface StepNavigationContextType {
  navigateToStep: (stepNumber: number) => void;
  getStepUrl: (stepNumber: number) => string | null;
}

const StepNavigationContext = createContext<
  StepNavigationContextType | undefined
>(undefined);

export function StepNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navigateToStep, getStepUrl } = useStepNavigation();

  return (
    <StepNavigationContext.Provider value={{ navigateToStep, getStepUrl }}>
      {children}
    </StepNavigationContext.Provider>
  );
}

export function useStepNavigationContext() {
  const context = useContext(StepNavigationContext);
  if (!context) {
    throw new Error(
      "useStepNavigationContext must be used within a StepNavigationProvider",
    );
  }
  return context;
}
