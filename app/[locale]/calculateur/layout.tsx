"use client";

import { GlobalFormProvider } from "@/features/calculator/context/global-form-context";

export default function CalculateurLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GlobalFormProvider>
      {children}
    </GlobalFormProvider>
  );
}
