"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AddressStep() {
  const { state, dispatch } = useForm()

  const handleContinue = () => {
    if (state.postalCode && state.streetName && state.streetNumber) {
      dispatch({ type: "NEXT_STEP" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Adresse du bien</h2>
        <p className="text-muted-foreground mt-2">Indiquez l'adresse complète du bien à Bruxelles</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="postalCode">Code postal</Label>
          <Input
            id="postalCode"
            value={state.postalCode}
            onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "postalCode", value: e.target.value })}
            placeholder="1000"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="streetName">Nom de rue</Label>
          <Input
            id="streetName"
            value={state.streetName}
            onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "streetName", value: e.target.value })}
            placeholder="Rue de la Loi"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="streetNumber">Numéro</Label>
          <Input
            id="streetNumber"
            value={state.streetNumber}
            onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "streetNumber", value: e.target.value })}
            placeholder="16"
            className="mt-1"
          />
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
