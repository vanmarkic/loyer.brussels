"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MinusCircle, PlusCircle } from "lucide-react"

export function PropertyDetailsStep() {
  const { state, dispatch } = useForm()

  const handleContinue = () => {
    if (state.size > 0 && state.propertyType) {
      dispatch({ type: "NEXT_STEP" })
    }
  }

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" })
  }

  // Update the incrementBedrooms function to limit to 4
  const incrementBedrooms = () => {
    if (state.bedrooms < 4) {
      dispatch({ type: "UPDATE_FIELD", field: "bedrooms", value: state.bedrooms + 1 })
    }
  }

  const decrementBedrooms = () => {
    if (state.bedrooms > 0) {
      dispatch({ type: "UPDATE_FIELD", field: "bedrooms", value: state.bedrooms - 1 })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Caractéristiques du bien</h2>
        <p className="text-muted-foreground mt-2">Indiquez les détails de votre propriété</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="size">Surface habitable totale (m²)</Label>
          <Input
            id="size"
            type="number"
            min="1"
            value={state.size || ""}
            onChange={(e) =>
              dispatch({ type: "UPDATE_FIELD", field: "size", value: Number.parseInt(e.target.value) || 0 })
            }
            className="mt-1"
          />
        </div>

        <div>
          <Label>Nombre de chambres</Label>
          <div className="flex items-center justify-between mt-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementBedrooms}
              disabled={state.bedrooms === 0}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="text-xl font-medium">{state.bedrooms === 4 ? "4 et plus" : state.bedrooms}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={incrementBedrooms}
              disabled={state.bedrooms >= 4}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleBack} variant="outline" className="flex-1">
          Retour
        </Button>
        <Button
          onClick={handleContinue}
          disabled={state.size <= 0 || !state.propertyType}
          className="flex-1 bg-[#e05c6d] hover:bg-[#d04c5d]"
        >
          Continuer
        </Button>
      </div>
    </div>
  )
}
