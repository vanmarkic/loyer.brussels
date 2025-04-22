"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AddressAutocomplete } from "./address-autocomplete"
import type { AddressResult } from "@/app/actions/search-addresses"

export function AddressStep() {
  const { state, dispatch, fetchDifficultyIndexAndCalculate, clearError } = useForm()

  const handleCalculate = async () => {
    if (state.postalCode && state.streetName && state.streetNumber) {
      await fetchDifficultyIndexAndCalculate()
    }
  }

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" })
  }

  const handleAddressSelect = (address: AddressResult) => {
    // Clear any previous errors
    clearError()

    dispatch({ type: "UPDATE_FIELD", field: "postalCode", value: address.postcode })
    dispatch({ type: "UPDATE_FIELD", field: "streetName", value: address.streetname_fr })
    dispatch({ type: "UPDATE_FIELD", field: "streetNumber", value: address.house_number })

    // If we already have the difficulty index from the search, store it
    if (address.indice_synth_difficulte !== undefined) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "difficultyIndex",
        value: address.indice_synth_difficulte,
      })
    }
  }

  // Check if Supabase environment variables are available
  const hasSupabaseCredentials =
    typeof window !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Adresse du bien</h2>
        <p className="text-muted-foreground mt-2">Indiquez l'adresse complète du bien à Bruxelles</p>
      </div>

      {!hasSupabaseCredentials && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Mode démo: Les données d'adresse ne sont pas disponibles. Un indice de difficulté par défaut sera utilisé
            pour le calcul.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <AddressAutocomplete
          onAddressSelect={handleAddressSelect}
          label="Rechercher une adresse"
          placeholder="Ex: 1000 Rue de la Loi 16"
        />

        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-muted-foreground mb-3">Ou saisissez l'adresse manuellement:</p>

          <div>
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              value={state.postalCode}
              onChange={(e) => {
                clearError()
                dispatch({ type: "UPDATE_FIELD", field: "postalCode", value: e.target.value })
              }}
              placeholder="1000"
              className="mt-1"
            />
          </div>

          <div className="mt-3">
            <Label htmlFor="streetName">Nom de rue</Label>
            <Input
              id="streetName"
              value={state.streetName}
              onChange={(e) => {
                clearError()
                dispatch({ type: "UPDATE_FIELD", field: "streetName", value: e.target.value })
              }}
              placeholder="Rue de la Loi"
              className="mt-1"
            />
          </div>

          <div className="mt-3">
            <Label htmlFor="streetNumber">Numéro</Label>
            <Input
              id="streetNumber"
              value={state.streetNumber}
              onChange={(e) => {
                clearError()
                dispatch({ type: "UPDATE_FIELD", field: "streetNumber", value: e.target.value })
              }}
              placeholder="16"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button onClick={handleBack} variant="outline" className="flex-1">
          Retour
        </Button>
        <Button
          onClick={handleCalculate}
          disabled={!state.postalCode || !state.streetName || !state.streetNumber || state.isLoading}
          className="flex-1 bg-[#e05c6d] hover:bg-[#d04c5d]"
        >
          {state.isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Calcul en cours...
            </span>
          ) : (
            "Calculer le loyer"
          )}
        </Button>
      </div>
    </div>
  )
}
