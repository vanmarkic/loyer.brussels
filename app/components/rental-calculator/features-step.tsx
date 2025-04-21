"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FeaturesStep() {
  const { state, dispatch } = useForm()

  const handleContinue = () => {
    dispatch({ type: "NEXT_STEP" })
  }

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Caractéristiques supplémentaires</h2>
        <p className="text-muted-foreground mt-2">Sélectionnez les équipements disponibles</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="floor">Étage</Label>
            <Input
              id="floor"
              type="number"
              min="0"
              value={state.floor}
              onChange={(e) =>
                dispatch({ type: "UPDATE_FIELD", field: "floor", value: Number.parseInt(e.target.value) || 0 })
              }
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="totalFloors">Nombre total d'étages</Label>
            <Input
              id="totalFloors"
              type="number"
              min="0"
              value={state.totalFloors}
              onChange={(e) =>
                dispatch({ type: "UPDATE_FIELD", field: "totalFloors", value: Number.parseInt(e.target.value) || 0 })
              }
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="elevator"
            checked={state.hasElevator}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_FIELD", field: "hasElevator", value: checked === true })
            }
          />
          <Label htmlFor="elevator">Ascenseur</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="parking"
            checked={state.hasParking}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_FIELD", field: "hasParking", value: checked === true })
            }
          />
          <Label htmlFor="parking">Parking</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="garage"
            checked={state.hasGarage}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_FIELD", field: "hasGarage", value: checked === true })
            }
          />
          <Label htmlFor="garage">Garage</Label>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="balcony"
              checked={state.hasBalcony}
              onCheckedChange={(checked) => {
                dispatch({ type: "UPDATE_FIELD", field: "hasBalcony", value: checked === true })
                if (checked === false) {
                  dispatch({ type: "UPDATE_FIELD", field: "balconySize", value: null })
                }
              }}
            />
            <Label htmlFor="balcony">Balcon</Label>
          </div>

          {state.hasBalcony && (
            <div className="mt-2 ml-6">
              <Label htmlFor="balconySize">Surface du balcon (m²)</Label>
              <Input
                id="balconySize"
                type="number"
                min="0"
                value={state.balconySize || ""}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "balconySize",
                    value: e.target.value ? Number.parseInt(e.target.value) : null,
                  })
                }
                className="mt-1"
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terrace"
              checked={state.hasTerrace}
              onCheckedChange={(checked) => {
                dispatch({ type: "UPDATE_FIELD", field: "hasTerrace", value: checked === true })
                if (checked === false) {
                  dispatch({ type: "UPDATE_FIELD", field: "terraceSize", value: null })
                }
              }}
            />
            <Label htmlFor="terrace">Terrasse</Label>
          </div>

          {state.hasTerrace && (
            <div className="mt-2 ml-6">
              <Label htmlFor="terraceSize">Surface de la terrasse (m²)</Label>
              <Input
                id="terraceSize"
                type="number"
                min="0"
                value={state.terraceSize || ""}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "terraceSize",
                    value: e.target.value ? Number.parseInt(e.target.value) : null,
                  })
                }
                className="mt-1"
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="garden"
              checked={state.hasGarden}
              onCheckedChange={(checked) => {
                dispatch({ type: "UPDATE_FIELD", field: "hasGarden", value: checked === true })
                if (checked === false) {
                  dispatch({ type: "UPDATE_FIELD", field: "gardenSize", value: null })
                }
              }}
            />
            <Label htmlFor="garden">Jardin</Label>
          </div>

          {state.hasGarden && (
            <div className="mt-2 ml-6">
              <Label htmlFor="gardenSize">Surface du jardin (m²)</Label>
              <Input
                id="gardenSize"
                type="number"
                min="0"
                value={state.gardenSize || ""}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "gardenSize",
                    value: e.target.value ? Number.parseInt(e.target.value) : null,
                  })
                }
                className="mt-1"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="basement"
            checked={state.hasBasement}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_FIELD", field: "hasBasement", value: checked === true })
            }
          />
          <Label htmlFor="basement">Cave</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="attic"
            checked={state.hasAttic}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_FIELD", field: "hasAttic", value: checked === true })
            }
          />
          <Label htmlFor="attic">Grenier</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleBack} variant="outline" className="flex-1">
          Retour
        </Button>
        <Button onClick={handleContinue} className="flex-1 bg-[#e05c6d] hover:bg-[#d04c5d]">
          Continuer
        </Button>
      </div>
    </div>
  )
}
