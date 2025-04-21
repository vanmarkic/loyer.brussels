"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function EnergyStep() {
  const { state, dispatch, fetchDifficultyIndexAndCalculate } = useForm()

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" })
  }

  const handleCalculate = async () => {
    await fetchDifficultyIndexAndCalculate()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Énergie et chauffage</h2>
        <p className="text-muted-foreground mt-2">Informations sur la performance énergétique</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="energyClass">Classe énergétique (PEB)</Label>
          <Select
            value={state.energyClass}
            onValueChange={(value) => dispatch({ type: "UPDATE_FIELD", field: "energyClass", value })}
          >
            <SelectTrigger id="energyClass">
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

        <div>
          <Label className="mb-2 block">Type de chauffage</Label>
          <RadioGroup
            value={state.heatingType}
            onValueChange={(value) => dispatch({ type: "UPDATE_FIELD", field: "heatingType", value })}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="central" id="central" />
              <Label htmlFor="central">Chauffage central</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Chauffage individuel</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">Pas de chauffage</Label>
            </div>
          </RadioGroup>
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
          disabled={!state.energyClass || state.isLoading}
          className="flex-1 bg-[#e05c6d] hover:bg-[#d04c5d]"
        >
          {state.isLoading ? "Calcul en cours..." : "Calculer le loyer"}
        </Button>
      </div>
    </div>
  )
}
