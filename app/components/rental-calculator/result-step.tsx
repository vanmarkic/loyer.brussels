"use client"

import { useForm } from "@/app/context/form-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Download, Share2, Info, Calculator } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ResultStep() {
  const { state, dispatch } = useForm()

  const handleReset = () => {
    dispatch({ type: "RESET_FORM" })
  }

  const propertyTypeLabels: Record<string, string> = {
    apartment: "Appartement",
    house: "Maison",
    studio: "Studio",
    other: "Autre",
  }

  const kitchenTypeLabels: Record<string, string> = {
    open: "Cuisine ouverte",
    closed: "Cuisine fermée",
    american: "Cuisine américaine",
    none: "Pas de cuisine",
  }

  const heatingTypeLabels: Record<string, string> = {
    central: "Chauffage central",
    individual: "Chauffage individuel",
    none: "Pas de chauffage",
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Résultat de l'estimation</h2>
        <p className="text-muted-foreground mt-2">Voici le loyer indicatif pour ce bien</p>
      </div>

      <Card className="bg-gradient-to-r from-[#f18240] to-[#e05c6d] text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-lg font-medium">Loyer mensuel estimé</p>
            <p className="text-5xl font-bold mt-2">{state.estimatedRent} €</p>
            <div className="flex justify-center items-center mt-2">
              <p className="text-sm opacity-80">
                Fourchette de prix: {state.minRent} € - {state.maxRent} €
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-white">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Selon la législation bruxelloise, le loyer de référence peut varier de ±20%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">Récapitulatif du bien</h3>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Adresse</h4>
            <p>
              {state.streetNumber} {state.streetName}, {state.postalCode} Bruxelles
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Type de bien:</div>
            <div className="font-medium">{propertyTypeLabels[state.propertyType] || "-"}</div>

            <div className="text-muted-foreground">Adresse:</div>
            <div className="font-medium">
              {state.streetNumber} {state.streetName}, {state.postalCode} Bruxelles
            </div>

            <div className="text-muted-foreground">Surface:</div>
            <div className="font-medium">{state.size} m²</div>

            <div className="text-muted-foreground">Chambres:</div>
            <div className="font-medium">{state.bedrooms === 4 ? "4 et plus" : state.bedrooms}</div>

            <div className="text-muted-foreground">Salles de bain:</div>
            <div className="font-medium">{state.bathrooms}</div>

            <div className="text-muted-foreground">Cuisine:</div>
            <div className="font-medium">
              {kitchenTypeLabels[state.kitchenType] || "-"}
              {state.kitchenEquipped ? " (équipée)" : ""}
            </div>

            <div className="text-muted-foreground">Étage:</div>
            <div className="font-medium">
              {state.floor} / {state.totalFloors}
            </div>

            <div className="text-muted-foreground">Classe énergétique:</div>
            <div className="font-medium">{state.energyClass}</div>

            <div className="text-muted-foreground">Chauffage:</div>
            <div className="font-medium">{heatingTypeLabels[state.heatingType] || "-"}</div>

            <div className="text-muted-foreground">Extérieurs:</div>
            <div className="font-medium">
              {[
                state.hasBalcony ? `Balcon${state.balconySize ? ` (${state.balconySize} m²)` : ""}` : null,
                state.hasTerrace ? `Terrasse${state.terraceSize ? ` (${state.terraceSize} m²)` : ""}` : null,
                state.hasGarden ? `Jardin${state.gardenSize ? ` (${state.gardenSize} m²)` : ""}` : null,
              ]
                .filter(Boolean)
                .join(", ") || "Aucun"}
            </div>

            <div className="text-muted-foreground">Équipements:</div>
            <div className="font-medium">
              {[
                state.hasCentralHeating ? "Chauffage central" : null,
                state.hasThermalRegulation ? "Régulation thermique" : null,
                state.hasDoubleGlazing ? "Double-vitrages" : null,
                state.hasSecondBathroom ? "2ème salle de bain" : null,
                state.hasRecreationalSpaces ? "Espaces récréatifs" : null,
                state.hasStorageSpaces ? "Espaces de rangement" : null,
                state.hasElevator ? "Ascenseur" : null,
                state.hasParking ? "Parking" : null,
                state.hasGarage ? "Garage" : null,
                state.hasBasement ? "Cave" : null,
                state.hasAttic ? "Grenier" : null,
              ]
                .filter(Boolean)
                .join(", ") || "Aucun"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg text-sm">
        <div className="flex items-start gap-2">
          <Calculator className="h-5 w-5 text-blue-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">Méthode de calcul</p>
            <p className="mt-1 text-blue-700">
              Le loyer de référence est calculé selon la formule officielle de la Région de Bruxelles-Capitale, qui
              prend en compte le type de bien, sa surface, le nombre de chambres, l'état du bien et l'indice de
              difficulté du quartier.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg text-sm">
        <p className="font-medium text-amber-800">Information importante</p>
        <p className="mt-1 text-amber-700">
          Le loyer de référence n'est pas contraignant. En dehors de cadres réglementaires particuliers, le montant du
          loyer est déterminé librement par le bailleur sur le marché privé.
        </p>
        <p className="mt-2 text-amber-700">
          Toutefois, le loyer de référence doit obligatoirement être mentionné en plus du loyer réel dans les baux
          d'habitation en Région de Bruxelles Capitale.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <Download className="h-4 w-4" /> Télécharger PDF
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Share2 className="h-4 w-4" /> Partager
          </Button>
        </div>
        <Button onClick={handleReset} className="bg-[#e05c6d] hover:bg-[#d04c5d] gap-2">
          Nouvelle estimation <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
