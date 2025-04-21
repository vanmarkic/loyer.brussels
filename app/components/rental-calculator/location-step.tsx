"use client"

import { useForm, type Neighborhood } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

export function LocationStep() {
  const { state, dispatch } = useForm()

  const handleContinue = () => {
    if (state.neighborhood) {
      dispatch({ type: "NEXT_STEP" })
    }
  }

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" })
  }

  const neighborhoods: { value: Neighborhood; label: string }[] = [
    { value: "center", label: "Centre-ville" },
    { value: "north", label: "Nord" },
    { value: "south", label: "Sud" },
    { value: "east", label: "Est" },
    { value: "west", label: "Ouest" },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Localisation</h2>
        <p className="text-muted-foreground mt-2">Dans quelle zone de Bruxelles se situe le bien?</p>
      </div>

      <RadioGroup
        value={state.neighborhood}
        onValueChange={(value) => dispatch({ type: "UPDATE_FIELD", field: "neighborhood", value })}
        className="space-y-3"
      >
        {neighborhoods.map((neighborhood) => (
          <div key={neighborhood.value} className="flex items-center">
            <RadioGroupItem value={neighborhood.value} id={neighborhood.value} className="peer sr-only" />
            <Label
              htmlFor={neighborhood.value}
              className="flex w-full cursor-pointer items-center rounded-md border border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#f18240] peer-data-[state=checked]:bg-orange-50 [&:has([data-state=checked])]:border-[#f18240] [&:has([data-state=checked])]:bg-orange-50"
            >
              <MapPin className="mr-3 h-5 w-5 text-[#f18240]" />
              <span>{neighborhood.label}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex gap-3">
        <Button onClick={handleBack} variant="outline" className="flex-1">
          Retour
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!state.neighborhood}
          className="flex-1 bg-[#e05c6d] hover:bg-[#d04c5d]"
        >
          Continuer
        </Button>
      </div>
    </div>
  )
}
