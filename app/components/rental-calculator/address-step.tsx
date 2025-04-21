"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AddressAutocomplete } from "./address-autocomplete"
import type { AddressResult } from "@/app/actions/search-addresses"

export function AddressStep() {
  const { state, dispatch, clearError } = useForm()

  const handleContinue = () => {
    if (state.postalCode && state.streetName && state.streetNumber) {
      dispatch({ type: "NEXT_STEP" })
    }
  }

  const handleAddressSelect = (address: AddressResult) => {
    // Clear any previous errors
    clearError()

    dispatch({ type: "UPDATE_FIELD", field: "postalCode", value: address.postcode })
    dispatch({ type: "UPDATE_FIELD", field: "streetName", value: address.streetname_fr })
    dispatch({ type: "UPDATE_FIELD", field: "streetNumber", value: address.house_number })

    // If we already have the difficulty index from the search, store it
    if (address.difficulty_index !== undefined) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "difficultyIndex",
        value: address.indice_synth_difficulte,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Adresse du bien</h2>
        <p className="text-muted-foreground mt-2">Indiquez l'adresse complète du bien à Bruxelles</p>
      </div>

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

      <Button
        onClick={handleContinue}
        disabled={!state.postalCode || !state.streetName || !state.streetNumber}
        className="w-full bg-[#e05c6d] hover:bg-[#d04c5d]"
      >
        Continuer
      </Button>
    </div>
  )
}
