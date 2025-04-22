"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, RefreshCw, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function EnergyStep() {
  const { state, dispatch, fetchDifficultyIndexAndCalculate, clearError } = useForm()

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" })
  }

  const handleCalculate = async () => {
    // If we already have the difficulty index from the address autocomplete,
    // we can skip fetching it again and just calculate the rent
    if (state.difficultyIndex !== null) {
      dispatch({ type: "CALCULATE_RENT" })
    } else {
      await fetchDifficultyIndexAndCalculate()
    }
  }

  // Function to render appropriate error message with action buttons
  const renderErrorMessage = () => {
    if (!state.error) return null

    // Different error types might need different actions
    switch (state.errorCode) {
      case "NOT_FOUND":
        return (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Adresse non trouvée</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{state.error}</p>
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearError()
                    dispatch({ type: "GO_TO_STEP", payload: 1 })
                  }}
                  className="text-xs"
                >
                  Modifier l'adresse
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )

      case "DATABASE_ERROR":
        return (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de base de données</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{state.error}</p>
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearError()
                  }}
                  className="text-xs flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> Réessayer
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )

      default:
        return (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )
    }
  }

  // Check if Supabase environment variables are available
  const hasSupabaseCredentials =
    typeof window !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Énergie et chauffage</h2>
        <p className="text-muted-foreground mt-2">Informations sur la performance énergétique</p>
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

      {renderErrorMessage()}

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

      <div className="flex gap-3">
        <Button onClick={handleBack} variant="outline" className="flex-1">
          Retour
        </Button>
        <Button
          onClick={handleCalculate}
          disabled={!state.energyClass || state.isLoading}
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
