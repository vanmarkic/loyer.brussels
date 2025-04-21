"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function FeaturesStep() {
  const { state, dispatch } = useForm()

  const handleCalculate = () => {
    dispatch({ type: "CALCULATE_RENT" })
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
            id="balcony"
            checked={state.hasBalcony}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_FIELD", field: "hasBalcony", value: checked === true })
            }
          />
          <Label htmlFor="balcony">Balcon</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="garden"
            checked={state.hasGarden}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_FIELD", field: "hasGarden", value: checked === true })
            }
          />
          <Label htmlFor="garden">Jardin</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="renovated"
            checked={state.isRenovated}
            onCheckedChange={(checked) =>
              dispatch({ type: "UPDATE_FIELD", field: "isRenovated", value: checked === true })
            }
          />
          <Label htmlFor="renovated">Rénové récemment</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="energy-class">Classe énergétique</Label>
          <Select
            value={state.energyClass}
            onValueChange={(value) => dispatch({ type: "UPDATE_FIELD", field: "energyClass", value })}
          >
            <SelectTrigger id="energy-class">
              <SelectValue placeholder="Sélectionnez une classe énergétique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="E">E</SelectItem>
              <SelectItem value="F">F</SelectItem>
              <SelectItem value="G">G</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleBack} variant="outline" className="flex-1">
          Retour
        </Button>
        <Button onClick={handleCalculate} className="flex-1 bg-[#e05c6d] hover:bg-[#d04c5d]">
          Calculer le loyer
        </Button>
      </div>
    </div>
  )
}
