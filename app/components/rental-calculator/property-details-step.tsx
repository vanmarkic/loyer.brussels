"use client"

import { useForm, type PropertyState } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MinusCircle, PlusCircle } from "lucide-react"

export function PropertyDetailsStep() {
  const { state, dispatch } = useForm()

  const handleContinue = () => {
    if (state.size > 0 && state.propertyType && state.propertyState) {
      dispatch({ type: "NEXT_STEP" })
    }
  }

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" })
  }

  const incrementBedrooms = () => {
    dispatch({ type: "UPDATE_FIELD", field: "bedrooms", value: state.bedrooms + 1 })
  }

  const decrementBedrooms = () => {
    if (state.bedrooms > 0) {
      dispatch({ type: "UPDATE_FIELD", field: "bedrooms", value: state.bedrooms - 1 })
    }
  }

  const incrementBathrooms = () => {
    dispatch({ type: "UPDATE_FIELD", field: "bathrooms", value: state.bathrooms + 1 })
  }

  const decrementBathrooms = () => {
    if (state.bathrooms > 0) {
      dispatch({ type: "UPDATE_FIELD", field: "bathrooms", value: state.bathrooms - 1 })
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
          <Label htmlFor="propertyType">Type de bien</Label>
          <Select
            value={state.propertyType}
            onValueChange={(value) => dispatch({ type: "UPDATE_FIELD", field: "propertyType", value })}
          >
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Appartement</SelectItem>
              <SelectItem value="house">Maison</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">État du bien</Label>
          <RadioGroup
            value={state.propertyState?.toString() || ""}
            onValueChange={(value) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "propertyState",
                value: value ? (Number.parseInt(value) as PropertyState) : null,
              })
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="state-1" />
              <Label htmlFor="state-1">Mauvais état</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="state-2" />
              <Label htmlFor="state-2">Bon état</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="state-3" />
              <Label htmlFor="state-3">Excellent état</Label>
            </div>
          </RadioGroup>
        </div>

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
            <span className="text-xl font-medium">{state.bedrooms}</span>
            <Button type="button" variant="outline" size="icon" onClick={incrementBedrooms}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label>Nombre de salles de bain</Label>
          <div className="flex items-center justify-between mt-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementBathrooms}
              disabled={state.bathrooms === 0}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="text-xl font-medium">{state.bathrooms}</span>
            <Button type="button" variant="outline" size="icon" onClick={incrementBathrooms}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="separateToilet"
            checked={state.separateToilet}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_FIELD", field: "separateToilet", value: checked === true })
            }
          />
          <Label htmlFor="separateToilet">WC séparé</Label>
        </div>

        <div>
          <Label htmlFor="kitchenType">Type de cuisine</Label>
          <Select
            value={state.kitchenType}
            onValueChange={(value) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "kitchenType",
                value,
              })
            }
          >
            <SelectTrigger id="kitchenType">
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Cuisine ouverte</SelectItem>
              <SelectItem value="closed">Cuisine fermée</SelectItem>
              <SelectItem value="american">Cuisine américaine</SelectItem>
              <SelectItem value="none">Pas de cuisine</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="kitchenEquipped"
            checked={state.kitchenEquipped}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_FIELD", field: "kitchenEquipped", value: checked === true })
            }
          />
          <Label htmlFor="kitchenEquipped">Cuisine équipée</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleBack} variant="outline" className="flex-1">
          Retour
        </Button>
        <Button
          onClick={handleContinue}
          disabled={state.size <= 0 || !state.propertyType || !state.propertyState}
          className="flex-1 bg-[#e05c6d] hover:bg-[#d04c5d]"
        >
          Continuer
        </Button>
      </div>
    </div>
  )
}
