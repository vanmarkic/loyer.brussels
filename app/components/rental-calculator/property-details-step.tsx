"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 124 }, (_, i) => currentYear - i)

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
          <Label htmlFor="constructionYear">Année de construction</Label>
          <Select
            value={state.constructionYear?.toString() || ""}
            onValueChange={(value) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "constructionYear",
                value: value ? Number.parseInt(value) : null,
              })
            }
          >
            <SelectTrigger id="constructionYear">
              <SelectValue placeholder="Sélectionnez une année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_specified">Non spécifié</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="renovationYear">Année de rénovation (si applicable)</Label>
          <Select
            value={state.renovationYear?.toString() || ""}
            onValueChange={(value) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "renovationYear",
                value: value ? Number.parseInt(value) : null,
              })
            }
          >
            <SelectTrigger id="renovationYear">
              <SelectValue placeholder="Sélectionnez une année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_renovated">Non rénové / Non spécifié</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Label htmlFor="livingRoomSize">Surface du salon (m²)</Label>
          <Input
            id="livingRoomSize"
            type="number"
            min="0"
            value={state.livingRoomSize || ""}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: "livingRoomSize",
                value: e.target.value ? Number.parseInt(e.target.value) : null,
              })
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
          disabled={state.size <= 0 || !state.propertyType}
          className="flex-1 bg-[#e05c6d] hover:bg-[#d04c5d]"
        >
          Continuer
        </Button>
      </div>
    </div>
  )
}
